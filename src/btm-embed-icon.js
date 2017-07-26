/* ---------- STYLES + HELPER FUNCTIONS --------- */

import {
	getPopoverHtml,
	popoverBTMStyle
} from './helpers/inline-styles'

import {
	spectrumSites,
	siteTitles,
	getSlug,
	createPopup,
	siteSearches
} from './helpers/site-constants'

import { getLinks } from './helpers/getLinks-helpers.js'

import { toggleSummary } from './helpers/embed-helpers.js'

/* ---------- IIFE --------- */

$(function () {

	const domain = window.location.hostname.split('www.')[1]
		, pathname = window.location.pathname
		, originUrl = originUrl || `http://${domain}${pathname}`
		, originTitle = siteTitles[domain] || domain;

	let startTime = new Date(); //this is initialized at the current time

	function embedIcons() {
		const $links = getLinks()
			, btmImg = chrome.runtime.getURL('icons/btm_logo.png');

		$links.forEach(element => { // this is for nytimes only. not general
			const $element = $(element)
				, href = $element.attr('href')
				, slug = getSlug(href)
				, $btm_button = $(`<a href="javascript:void(0);"><img src=${btmImg} style="height: 20px; width: 20px; vertical-align: middle; margin-left: 0.1em"></a>`)
				, popoverTemplate = getPopoverHtml(slug)
				, loading = `<div id="btm-popover-body-${slug}"><div id="btm-loading-${slug}"><p>Loading...</p></div></div>`;

			$btm_button.popover({
				trigger: "click",
				container: "body",
				html: "true",
				template: popoverTemplate,
				title: `<span style=${popoverBTMStyle}>BRIDGE THE MEDIA<span class='btm-close btm-pull-right'>&times;</span></span>`,
				placement: (popover, parent) => {
					const distFromRight = $(window).width() - $(parent).offset().left
					return (distFromRight < 350) ? "left" : "right"
				},
				content: loading
			})

			if (!$element.next().is('a') && $element.attr('class') !== 'popup-link') {
				$btm_button.insertAfter($element);
			}

			$btm_button.on('shown.bs.popover', initPopover.bind($btm_button, slug, href));

			function initPopover() {
				$('.btm-close').on('click', () => { $btm_button.popover('hide') });
				Promise.all(siteSearches(spectrumSites[domain], slug))
					.then(results => { // this is the promise part of the site
						$(`#btm-loading-${slug}`).hide();
						$(`#btm-popover-body-${slug}`).after(createPopup(results, slug));
						$('.collapse-link').on('click', toggleSummary);
						$('.popup-link').on('click', openArticleLink);
					})
				chrome.runtime.sendMessage({
					source: originTitle,
					type: "BTM Icon Click"
				});
			}
		})
	}

	function openArticleLink(event) {
		event.preventDefault();
		const href = $(event.target).attr('href');
		chrome.runtime.sendMessage({
			targetUrl: href,
			type: "Outbound Link Click",
			source: originTitle,
			originUrl: originUrl,
			elapsedTime: Math.round((new Date() - startTime) / 60000)
		});
		startTime = new Date(); // reset startTime
		window.open(href);
	}

	/* Fires embedIcons as long as the user is not on Facebook. */
	if (domain !== 'facebook.com') {
		setInterval(embedIcons, 3000);
	}

})
