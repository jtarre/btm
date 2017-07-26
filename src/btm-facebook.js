/* ---------- STYLES + HELPER FUNCTIONS --------- */

import _ from 'lodash'

import { getPopoverHtml, popoverTitleStyle, popoverBTMStyle } from './helpers/inline-styles.js'

import { spectrumSites, siteTitles, getSlug, createPopup, siteSearches } from './helpers/site-constants.js'

import { checkIsArticle, checkLinkSection } from './helpers/getLinks-helpers.js'

/* ---------- IIFE --------- */

$(function () {

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
				, btmimg = chrome.runtime.getURL('icons/btm_logo.png')
				, $btm_button = $(`<p><a href="javascript:void(0);"><img src="${btmimg}" height="24" width="26"></a></p>`)
				, popover_html = getPopoverHtml(slug)
				, loading = `<div id="btm-popover-body-${slug}"><div id="btm-loading-${slug}"><p>Loading...</p></div></div>`;

			$btm_button.popover({
				trigger: "click",
				container: "body",
				html: "true",
				template: popover_html,
				title: `<span style=${popoverBTMStyle}>BRIDGE THE MEDIA<span class='btm-close btm-pull-right'>&times;</span></span>`,
				content: loading
			})

			$post_text.first().append($btm_button);
			$btm_button.on('shown.bs.popover', initPopover.bind($btm_button, slug, href));

			function initPopover(slug, href) {
				const sites = spectrumSites['nytimes.com'] //hard-coded for NYT only
					, sitePromises = siteSearches(sites, slug);

				$('.btm-close').on('click', () => { $btm_button.popover('hide') });

				Promise.all(sitePromises)
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

	function toggleSummary(event) {
		event.preventDefault();
		var $link = $(event.target);
		if ($link.hasClass('fa-caret-down') || $link.hasClass('fa-caret-up')) $link = $link.parent();
		var cache = $link.data('cache');
		var $cache = $(`#${cache}`);
		var $caret = $(`#btm-span-${cache}`).attr("style", "font-family: FontAwesome; margin-left: 0.5em")
		$cache.collapse('toggle');
		if ($caret.hasClass('fa-caret-up')) {
			$caret.addClass('fa-caret-down').removeClass('fa-caret-up')
		} else {
			$caret.addClass('fa-caret-up').removeClass('fa-caret-down')
		}
	}

	function openArticleLink(event) {
		event.preventDefault();
		var $link = $(event.target);
		var href = $link.attr('href');
		let originUrl = href;
		chrome.runtime.sendMessage({
			targetUrl: href,
			type: "Outbound Link Click",
			source: "Facebook",
			originUrl: originUrl,
			elapsedTime: 0
		},
			function (response) { });
		window.open(href);
	}

	if (domain === "facebook.com") {
		setInterval(checkFacebookLinks, 1000)
	}

})
