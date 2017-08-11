import uniqBy from 'lodash.uniqby'

import { spectrumSites, siteTitles, getSlug, createPopup, siteSearches } from './helpers/site-constants'

import { checkIsArticle, checkLinkSection } from './helpers/getLinks-helpers'

import { getPopoverHtml, getBTMIcon, getLoading, getPopoverTitle } from './helpers/inline-elements'

$(() => {
	const domain = window.location.hostname.split('www.')[1]
		, pathname = window.location.pathname
		, originUrl = `http://${domain}${pathname}`
		, source = siteTitles[domain] || domain
		, btmImg = chrome.runtime.getURL('icons/btm_logo.png');

	$('head').append("<style>@import url('https://fonts.googleapis.com/css?family=Josefin+Sans');</style>")

	let hrefs = {};
	let startTime = new Date(); //this is initialized at the current time

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


			// function openArticleLink(event) {
			// 	event.preventDefault();
			// 	const url = $(event.target).attr('href');
			// 	chrome.runtime.sendMessage({
			// 		targetUrl: url,
			// 		type: "Outbound Link Click",
			// 		source: "Facebook",
			// 		originUrl: url,
			// 		elapsedTime: 0
			// 	});
			// 	window.open(url);
			// }

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
					source: 'Facebook',
					type: "BTM Icon Click"
				});
			}

			$btmButton.on('shown.bs.popover', initPopover.bind($btmButton, slug));
		})
	}

	function initNewsPageHover() {
		const pathnameArr = pathname.split('/');
		let btmHover, btmButton, slug, side;
		if (pathnameArr.length > 5) { // it's a news page, at least for fox news, need to add hover to bottom left of page
			switch (domain) {
				case 'foxnews.com':
					slug = pathnameArr[pathnameArr.length - 1].replace('.html', '');
					side = 'left';
					break;
				case 'nytimes.com':
					slug = pathnameArr[pathnameArr.length - 1].replace('.html', '');
					side = 'right';
					break;
				default:
					side = 'right';
					break;
			}

			btmButton = `<button id="btm-btn-${slug}" class="google-search btn btn-primary btm-btn" href="javascript:void(0);" data-slug=${slug}>SHOW ALTERNATIVES</button>`;

			btmHover =
				`<div
          class="btm-popover"
          data-slug=${slug}
          style="position:fixed; ${side}:50px; bottom:10px;">
          <h3 class="btm-popover-title">BRIDGE THE MEDIA</h3>
          <div id="btm-hover-${slug}>
            <div style="max-height:450px;overflow:scroll;" id="btm-popover-body-${slug}" />
            ${btmButton}
          </div>
        </div>`
		}

		$('body').append($(btmHover));
		var sitePromises = siteSearches(spectrumSites[domain], slug);
		Promise.all(sitePromises)
			.then((search_results) => {
				var popup = createPopup(search_results, slug);
				// // add popup to page
				$('#btm-popover-body-' + slug).css('display', 'none');
				$('#btm-popover-body-' + slug).append(popup);
				$('.collapse-link').on('click', toggleSummary);
				$('.popup-link').on('click', openArticleLink);
				$('.btm-close').on('click', closeHover.bind($('#btm-hover-' + slug)));

			})
		$('.google-search').on('click', toggleArticles.bind($(btmHover), slug));
	}

	function embedIcons() {
		const $links = getLinks()
			, btmImg = chrome.runtime.getURL('icons/btm_logo.png');

		$links.forEach(element => { // this is for nytimes only. not general
			const $element = $(element)
				, href = $element.attr('href')
				, slug = getSlug(href)
				, $btm_button = getBTMIcon(btmImg)

			$btm_button.popover({
				trigger: "click",
				container: "body",
				html: "true",
				template: getPopoverHtml(slug),
				title: getPopoverTitle(),
				placement: (popover, parent) => {
					const distFromRight = $(window).width() - $(parent).offset().left
					return (distFromRight < 350) ? "left" : "right"
				},
				content: getLoading(slug)
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
					source,
					type: "BTM Icon Click"
				});
			}
		})
	}

	if (domain === "facebook.com") {
		setInterval(checkFacebookLinks, 1000)
	} else if (pathname.includes('/opinion/') || pathname.includes('/politics/')) {
		initNewsPageHover()
	} else {
		setInterval(embedIcons, 3000);
	}
})
