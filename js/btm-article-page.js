import { getArticlePagePopover } from './helpers/inline-elements'

import { spectrumSites, siteTitles, createPopup, siteSearches } from './helpers/site-constants'

import { toggleSummary, openArticleLink } from './helpers/embed-helpers'

$(() => {
	const domain = window.location.hostname.split('www.')[1]
		, pathname = window.location.pathname
		, source = siteTitles[domain] || domain
		, startTime = new Date(); // this is initialized at the current time

	$('head').append("<style>@import url('https://fonts.googleapis.com/css?family=Josefin+Sans|PT+Serif');</style>")

	function initPageHover() {
		const pathnameArr = pathname.split('/');
		let slug, side;
		if (pathnameArr.length > 5) {
			switch (domain) {
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
			chrome.runtime.sendMessage({
				source,
				type: "Show Alternatives Click"
			})
			Promise.all(siteSearches(spectrumSites[domain], slug))
				.then(results => {
					$('.google-search').fadeOut()
					$(`#btm-popover-body-${slug}`).append(createPopup(results, slug));
					$('.collapse-link').on('click', toggleSummary);
					$('.popup-link').on('click', (event) => openArticleLink(event, window.location, startTime));
				})
		});
	}

	if (pathname.includes("/opinion/") || pathname.includes("/politics/")) {
		initPageHover();
	}
})
