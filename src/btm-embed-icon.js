/* ---------- STYLES + HELPER FUNCTIONS --------- */

import { getPopoverHtml, popoverBTMStyle } from './helpers/inline-styles'

import { spectrumSites, siteTitles, getSlug, createPopup, siteSearches } from './helpers/site-constants'

import { checkComments, checkLinkSection, checkDescendants } from './helpers/getLinks-helpers'

$(function () {

	const domain = window.location.hostname.split('www.')[1]
		, pathname = window.location.pathname
		, originTitle = siteTitles[domain] !== undefined ? siteTitles[domain] : domain;

	let originUrl //url of current website
		, endTime //this will be set when the user clicks on a recommendation
		, elapsedTime
		, startTime = new Date(); //this is initialized at the current time

	function getLinks() {
		return $('a').not('.button').toArray().filter(link => {
			const descendants = $(link).find('*').toArray();
			return link.href && checkComments(link) && checkLinkSection(link) && checkDescendants(descendants)
		})
	}

	function embedIcons() {
		const $links = getLinks()
			, btmImg = chrome.runtime.getURL('icons/btm_logo.png');

		$links.forEach(element => { // this is for nytimes only. not general
			const $element = $(element)
				, href = $element.attr('href')
				, slug = getSlug(href)
				, placement = "right" //TODO: generate placement dynamically
				, $btm_button = $(`<a href="javascript:void(0);"><img src=${btmImg} style="height: 20px; width: 20px; vertical-align: middle"></a>`)
				, popoverTemplate = getPopoverHtml(slug)
				, loading = `<div id="btm-popover-body-${slug}"><div id="btm-loading-${slug}"><p>Loading...</p></div></div>`;

			$btm_button.popover({
				trigger: "click",
				container: "body",
				html: "true",
				template: popoverTemplate,
				title: `<span style=${popoverBTMStyle}>BRIDGE THE MEDIA<span class='btm-close btm-pull-right'>&times;</span></span>`,
				placement: placement,
				content: loading
			})

			if (!$element.next().is('a') && $element.attr('class') !== 'popup-link') {
				$btm_button.insertAfter($element);
			}

			$btm_button.on('shown.bs.popover', initPopover.bind($btm_button, slug, href));

			function initPopover(slug, href) {
				var sites = spectrumSites[domain];
				var sitePromises = siteSearches(sites, slug);
				$('.btm-close').on('click', function () { $btm_button.popover('hide') });
				Promise.all(sitePromises)
					.then(results => { // this is the promise part of the site
						$(`#btm-loading-${slug}`).hide();
						var popup = createPopup(results, slug);
						// add popup to page
						$(`#btm-popover-body-${slug}`).after(popup);
						$('.collapse-link').on('click', toggleSummary);
						$('.popup-link').on('click', openArticleLink);
					})

				chrome.runtime.sendMessage({ source: originTitle, type: "BTM Icon Click" }, function (response) {
				});
			}

			function openArticleLink(event) {
				event.preventDefault();
				var $link = $(event.target);
				var href = $link.attr('href');
				var originUrl = (originUrl !== undefined ? originUrl : 'http://' + domain + pathname);
				endTime = new Date();
				var elapsedTime = Math.round((endTime - startTime) / 60000); // calculate elapsedTime in minutes
				startTime = new Date(); // reset startTime
				chrome.runtime.sendMessage({
					targetUrl: href,
					type: "Outbound Link Click",
					source: originTitle,
					originUrl: originUrl,
					elapsedTime: elapsedTime
				},
					function (response) { });
				window.open(href);
			}
		})
	}

	function toggleSummary(event) {
		event.preventDefault();
		var $link = $(event.target);
		var cache = $link.data('cache');
		var $cache = $('#' + cache);
		var $caret = $(`#btm-span-${cache}`);
		$cache.collapse('toggle');
	}

	function closeHover(event) {
		this.fadeOut();
	}

	function toggleArticles(slug, event) {
		if ($(`#btm-popover-body-${slug}:hidden`).length > 0)
			toggleVisible($(`#btm-popover-body-${slug}`), $(`#btm-btn-${slug}`));
		else
			toggleInvisible($(`#btm-popover-body-${slug}`), $(`#btm-btn-${slug}`));

		function toggleVisible($container, $button) {
			$button.text('HIDE');
			$container.fadeIn();
		}

		function toggleInvisible($container, $button) {
			$button.text('SHOW ALTERNATIVES');
			$container.fadeOut();
		}
	}

	function hidePopover(event) {
		$link = this;
	}

	/* Fires embedIcons as long as the user is not on Facebook. */
	if (domain !== 'facebook.com') {
		setInterval(embedIcons, 5000);
	}

})