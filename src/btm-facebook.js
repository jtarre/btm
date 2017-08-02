/* ---------- STYLES + HELPER FUNCTIONS --------- */

import _ from 'lodash'

import { getPopoverHtml } from './helpers/inline-styles.js'

import { spectrumSites, siteTitles, getSlug, createPopup, siteSearches } from './helpers/site-constants.js'

import { checkIsArticle, checkLinkSection } from './helpers/getLinks-helpers.js'

import { toggleSummary } from './helpers/embed-helpers.js'

/* ---------- IIFE --------- */

$(() => {
	const domain = window.location.hostname.split('www.')[1]
		, originTitle = siteTitles[domain] !== undefined ? siteTitles[domain] : domain;

	let hrefs = {}

	function checkFacebookLinks() {
		let $links = $('a').toArray().filter(link => {
			return link.href && !hrefs.hasOwnProperty(link.href) && link.href.includes('nytimes.com') && checkIsArticle(link) && checkLinkSection(link);
		})

		$links = _.uniqBy($links, link => link.href) //filters out duplicates

		$links.forEach(element => { // this is for nytimes only. not general

			hrefs[element.href] = true;

			const $element = $(element)
				, href = $element.attr('href')
				, slug = getSlug(href)
				, $newsfeed_post = $element.closest('.fbUserContent').first()
				, $post_text = $newsfeed_post.find('.userContent')
				, btmImg = chrome.runtime.getURL('icons/btm_logo.png')
				, $btm_button = $(`<p><a href="javascript:void(0);"><img src=${btmImg} style="height: 20px; width: 20px; vertical-align: middle; margin-left: 0.1em"></a></p>`)
				, popover_html = getPopoverHtml(slug)
				, loading = `<div class="btm-popover" id="btm-popover-body-${slug}"><div id="btm-loading-${slug}"><p>Loading...</p></div></div>`;

			$btm_button.popover({
				trigger: "click",
				container: "body",
				html: "true",
				template: popover_html,
				placement: (popover, parent) => {
					const distFromRight = $(window).width() - $(parent).offset().left
					return (distFromRight < 350) ? "left" : "right"
				},
				title: `<span class="btm-header">BRIDGE THE MEDIA<span class='btm-close btm-pull-right'>&times;</span></span>`,
				content: loading
			})

			$post_text.first().append($btm_button);
			$btm_button.on('shown.bs.popover', initPopover.bind($btm_button, slug));

			function initPopover() {
				$('.btm-close').on('click', () => { $btm_button.popover('hide') });
				Promise.all(siteSearches(spectrumSites['nytimes.com'], slug)) //hard-coded for NYT only
					.then(results => {
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
			source: "Facebook",
			originUrl: href,
			elapsedTime: 0
		});
		window.open(href);
	}

	if (domain === "facebook.com") {
		setInterval(checkFacebookLinks, 1000)
	}

})
