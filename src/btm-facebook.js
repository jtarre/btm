import uniqBy from 'lodash.uniqby'

import { getPopoverHtml, getBTMIcon, getLoading, getPopoverTitle } from './helpers/inline-elements'

import { spectrumSites, siteTitles, getSlug, createPopup, siteSearches, getPublisher } from './helpers/site-constants'

import { checkIsArticle, checkLinkSection, checkIsProperSource } from './helpers/getLinks-helpers'

import { toggleSummary, openArticleLink } from './helpers/embed-helpers'

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
				, $newsfeedPost = $element.closest('.fbUserPost').first()
				, $postText = $newsfeedPost.find('.userContent')
				, $btmButton = getBTMIcon(btmImg)
				, publisher = getPublisher(href)

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

			function initPopover() {
				$('.btm-close').on('click', () => { $btmButton.popover('hide') });
				Promise.all(siteSearches(spectrumSites[publisher], slug))
					.then(results => {
						$(`#btm-loading-${slug}`).hide();
						$(`#btm-popover-body-${slug}`).after(createPopup(results, slug));
						$('.collapse-link').on('click', toggleSummary);
						$('.popup-link').on('click', (event) => openArticleLink(event, 'Facebook'));
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
