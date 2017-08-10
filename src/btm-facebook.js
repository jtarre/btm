import uniqBy from 'lodash.uniqby'

import { getPopoverHtml, getBTMIcon, getLoading, getPopoverTitle } from './helpers/inline-elements'

import { spectrumSites, siteTitles, getSlug, createPopup, siteSearches } from './helpers/site-constants'

import { checkIsArticle, checkLinkSection, checkIsProperSource } from './helpers/getLinks-helpers'

import { toggleSummary } from './helpers/embed-helpers'

$(() => {
	const domain = window.location.hostname.split('www.')[1]
		, originTitle = siteTitles[domain] || domain
		, btmImg = chrome.runtime.getURL('icons/btm_logo.png')

	$('head').append("<style>@import url('https://fonts.googleapis.com/css?family=Josefin+Sans|PT+Serif');</style>")

	const hrefs = {}

	function checkFacebookLinks() {
		/* eslint no-prototype-builtins: "error" */
		let $links = $('a').toArray().filter(link => link.href && !Object.prototype.hasOwnProperty.call(hrefs, link.href) && checkIsProperSource(link) && checkIsArticle(link) && checkLinkSection(link))

		$links = uniqBy($links, link => link.href) // filters out duplicates

		$links.forEach(element => { // this is for nytimes only. not general
			hrefs[element.href] = true;

			const $element = $(element)
				, href = $element.attr('href')
				, slug = getSlug(href)
				, $newsfeedPost = $element.closest('.fbUserContent').first()
				, $postText = $newsfeedPost.find('.userContent')
				, $btmButton = getBTMIcon(btmImg)

			$btmButton.popover({
				trigger: "click",
				container: "body",
				html: "true",
				template: getPopoverHtml(slug),
				placement: (popover, parent) => {
					const distFromRight = $(window).width() - $(parent).offset().left
					return (distFromRight < 350) ? "left" : "right"
				},
				title: getPopoverTitle(),
				content: getLoading(slug)
			})

			$postText.first().append($btmButton);

			function openArticleLink(event) {
				event.preventDefault();
				const url = $(event.target).attr('href');
				chrome.runtime.sendMessage({
					targetUrl: url,
					type: "Outbound Link Click",
					source: "Facebook",
					originUrl: url,
					elapsedTime: 0
				});
				window.open(url);
			}

			function initPopover() {
				$('.btm-close').on('click', () => { $btmButton.popover('hide') });
				Promise.all(siteSearches(spectrumSites['nytimes.com'], slug)) // hard-coded for NYT only
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

			$btmButton.on('shown.bs.popover', initPopover.bind($btmButton, slug));
		})
	}

	if (domain === "facebook.com") {
		setInterval(checkFacebookLinks, 1000)
	}
})
