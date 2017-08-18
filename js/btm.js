import uniqBy from 'lodash.uniqby'

import { spectrumSites, siteTitles, getSlug, createPopup, siteSearches, getPublisher } from './helpers/site-constants'

import { getLinks, checkIsArticleHead, checkLinkSection, checkIsProperSource } from './helpers/getLinks-helpers'

import { getPopoverHtml, getBTMIcon, getLoading, getPopoverTitle, getArticlePagePopover } from './helpers/inline-elements'

import { getPopoverSide, reposition, toggleSummary, openArticleLink } from './helpers/embed-helpers'

$(() => {
	const domain = window.location.hostname.split('www.')[1]
		, originTitle = siteTitles[domain] || domain
		, pathname = window.location.pathname
		, source = siteTitles[domain] || domain
		, btmIcon = chrome.runtime.getURL('assets/btm_logo.png')
		, btmBg = chrome.runtime.getURL('assets/header-bg.svg');

	$('head').append("<style>@import url('https://fonts.googleapis.com/css?family=Josefin+Sans');</style>")

	const hrefs = {}
		, startTime = new Date(); // this is initialized at the current time

	function checkFacebookLinks() {
		/* eslint no-prototype-builtins: "error" */
		let $links = $('a').toArray().filter(link => link.href && !Object.prototype.hasOwnProperty.call(hrefs, link.href) && checkIsProperSource(link) && checkIsArticleHead(link) && checkLinkSection(link.href))

		$links = uniqBy($links, link => link.href) // filters out duplicates

		$links.forEach(element => {
			hrefs[element.href] = true;

			const $element = $(element)
				, href = $element.attr('href')
				, slug = getSlug(href)
				, $newsfeedPost = $element.closest('.fbUserPost').first()
				, $postText = $newsfeedPost.find('.userContent')
				, $btmButton = getBTMIcon(btmIcon, slug)
				, publisher = getPublisher(href)
			let side = "right";

			$btmButton.popover({
				trigger: "click",
				container: "body",
				html: "true",
				template: getPopoverHtml(slug),
				placement: (popover, parent) => {
					const distFromRight = $(window).width() - $(parent).offset().left
					side = (distFromRight < 350) ? "left" : "right";
					return side;
				},
				title: getPopoverTitle(btmBg, btmIcon),
				content: getLoading(slug)
			})

			$postText.first().append($btmButton);

			function initPopover() {
				$('.btm-close').on('click', () => { $btmButton.popover('hide') });
				Promise.all(siteSearches(spectrumSites[publisher], slug))
					.then(results => {
						$(`#btm-loading-${slug}`).hide();
						$(`#btm-popover-body-${slug}`).after(createPopup(results, slug));
						reposition(slug, side);
						$('.collapse-link').on('click', toggleSummary);
						$('.popup-link').on('click', (event) => openArticleLink(event, 'Facebook'));
					})
				chrome.runtime.sendMessage({
					source: originTitle,
					type: "BTM Icon Click"
				});
			}

			$btmButton.on('shown.bs.popover', () => initPopover(slug));
		})
	}

	function initPageHover() {
		const pathnameArr = pathname.split('/');
		let slug, side;
		if (pathnameArr.length > 5) {
			switch (domain) { // currently hard-coded for NYT and FOX
				case 'foxnews.com':
					slug = pathnameArr[pathnameArr.length - 1].replace('.html', '');
					side = 'right';
					break;
				case 'nytimes.com':
					slug = pathnameArr[pathnameArr.length - 1].replace('.html', '');
					side = 'right';
					break;
				default:
					side = 'right';
					break;
			}
		}

		$('body').append($(getArticlePagePopover(slug, side)));
		$('.btm-close').on('click', () => {
			$('.btm-popover').fadeOut()
		});

		$('.google-search').on('click', () => {
			$('.google-search').fadeOut()
			$(`#btm-popover-body-${slug}`).append(getLoading(slug));
			chrome.runtime.sendMessage({
				source,
				type: "Show Alternatives Click"
			})
			Promise.all(siteSearches(spectrumSites[domain], slug))
				.then(results => {
					$(`#btm-loading-${slug}`).hide()
					$(`#btm-popover-body-${slug}`).append(createPopup(results, slug));
					$('.collapse-link').on('click', toggleSummary);
					$('.popup-link').on('click', (event) => openArticleLink(event, window.location, startTime));
				})
		});
	}

	function embedIcons() {
		const $links = getLinks()

		$links.forEach(element => { // this is for nytimes only. not general
			const $element = $(element)
				, href = $element.attr('href')
				, slug = getSlug(href)
				, $btmButton = getBTMIcon(btmIcon, slug);

			if ($element.find('h2.headline a').toArray().length === 0) {
				if ($element.find('h2.headline').toArray().length > 0) {
					$btmButton.appendTo($element.find('h2.headline').toArray()[0])
				} else if (!$element.next().is('a') && $element.attr('class') !== 'popup-link') {
					$btmButton.insertAfter($element);
				}
			}

			const side = getPopoverSide(slug)

			$btmButton.popover({
				trigger: "click",
				container: "body",
				html: "true",
				template: getPopoverHtml(slug, side),
				title: getPopoverTitle(btmBg, btmIcon),
				placement: side,
				content: getLoading(slug)
			})

			function initPopover() {
				$('.btm-close').on('click', () => { $btmButton.popover('hide') });
				Promise.all(siteSearches(spectrumSites[domain], slug))
					.then(results => { // this is the promise part of the site
						$(`#btm-loading-${slug}`).hide();
						$(`#btm-popover-body-${slug}`).after(createPopup(results, slug));
						reposition(slug, side);
						$('.collapse-link').on('click', toggleSummary);
						$('.popup-link').on('click', (event) => openArticleLink(event, source, startTime));
					})
				chrome.runtime.sendMessage({
					source,
					type: "BTM Icon Click"
				});
			}

			$btmButton.on('shown.bs.popover', () => initPopover(slug, href));
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
