import uniqBy from 'lodash.uniqby'

import { spectrumSites, siteTitles, getSlug, createPopup, siteSearches, getPublisher } from './helpers/site-constants'
import { getLinks, checkIsArticleHead, checkLinkSection, checkIsProperSource } from './helpers/getLinks-helpers'
import { getBTMIcon, getLoading, getArticlePagePopover } from './helpers/inline-elements'
import { getPopoverSide, toggleSummary, openArticleLink, placePopover } from './helpers/embed-helpers'

$(() => {
	const domain = window.location.hostname.split('www.')[1]
		, pathname = window.location.pathname
		, source = siteTitles[domain] || domain
		, btmIcon = chrome.runtime.getURL('assets/btm_logo.png')
		, btmBg = chrome.runtime.getURL('assets/header-bg.svg');

	$('head').append("<style>@import url('https://fonts.googleapis.com/css?family=Josefin+Sans');</style>")

	const hrefs = {}
		, startTime = new Date();

	function checkFacebookLinks() {
		let $links = $('a').toArray().filter(link => link.href && !Object.prototype.hasOwnProperty.call(hrefs, link.href) && checkIsProperSource(link) && checkIsArticleHead(link) && checkLinkSection(link.href))

		$links = uniqBy($links, link => link.href)

		$links.forEach(element => {
			hrefs[element.href] = true;

			const $element = $(element)
				, href = $element.attr('href')
				, slug = getSlug(href)
				, $newsfeedPost = $element.closest('.fbUserPost').first()
				, $postText = $newsfeedPost.find('.userContent')
				, $btmButton = getBTMIcon(btmIcon, slug)
				, publisher = getPublisher(href)
				, placeButton = new Promise((resolve, reject) => {
					$postText.first().append($btmButton) ? resolve($btmButton.offset()) : reject('Not placed')
				})

			placeButton
				.then(offset => getPopoverSide(offset))
				.then(side => placePopover(side, $btmButton, slug, btmBg, btmIcon, source, publisher, startTime))
				.catch(console.error)
		})
	}

	function initPageHover() {
		const slug = getSlug(window.location.href)
			, side = 'right'
		$('body').append($(getArticlePagePopover(slug, side, btmBg, btmIcon)));
		$('.btm-close').on('click', () => {
			$('.btm-popover').fadeOut()
		});
		$('.hide-alts').on('click', (event) => {
			const popoverSlug = $(event.target).attr('data-slug')
			$(`#ul-${popoverSlug}`).collapse('toggle')
			$('.hide-alts').removeClass('visible')
			$('.show-alts').addClass('visible')
		})
		$('.show-alts').on('click', (event) => {
			const popoverSlug = $(event.target).attr('data-slug')
			$('.show-alts').removeClass('visible')
			chrome.runtime.sendMessage({
				source,
				type: "Show Alternatives Click"
			})
			if ($(`#ul-${popoverSlug}`).length) {
				$(`#ul-${popoverSlug}`).collapse('toggle')
			} else {
				$(getLoading(slug)).insertBefore($('.hide-alts'))
				Promise.all(siteSearches(spectrumSites[domain], slug))
					.then(results => {
						$('.btm-loading').fadeOut()
						$('.hide-alts').addClass('visible')
						$(createPopup(results, slug)).insertBefore($('.hide-alts'))
						$('.collapse-link').on('click', toggleSummary);
						$('.popup-link').on('click', (evt) => openArticleLink(evt, window.location, startTime));
					})
			}
		});
	}

	function embedIcons() {
		const $links = getLinks()

		$links.forEach(element => {
			const $element = $(element)
				, href = $element.attr('href')
				, slug = getSlug(href)
				, $btmButton = getBTMIcon(btmIcon, slug)
				, publisher = getPublisher(href)
				, placeButton = new Promise((resolve, reject) => {
					if ($element.find('h2.headline a').toArray().length === 0) {
						if ($element.find('h2.headline').toArray().length > 0) {
							$btmButton.appendTo($element.find('h2.headline').toArray()[0])
							resolve($btmButton.offset())
						} else if (!$element.next().is('a') && $element.attr('class') !== 'popup-link') {
							$btmButton.insertAfter($element);
							resolve($btmButton.offset())
						} else {
							reject('Not placeable')
						}
					} else {
						reject('Not placeable')
					}
				})

			placeButton
				.then(offset => getPopoverSide(offset))
				.then(side => placePopover(side, $btmButton, slug, btmBg, btmIcon, source, publisher, startTime))
				.catch(console.error)
		})
	}

	if (domain === "facebook.com") {
		setInterval(checkFacebookLinks, 1000)
	} else if (checkLinkSection(pathname)) {
		initPageHover()
	} else {
		setInterval(embedIcons, 3000);
	}
})
