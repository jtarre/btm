import { getPopoverHtml, getBTMIcon, getLoading, getPopoverTitle } from './helpers/inline-elements'

import { spectrumSites, siteTitles, createPopup, siteSearches } from './helpers/site-constants'

import { toggleSummary, toggleArticles } from './helpers/embed-helpers'

$(() => {
	const domain = window.location.hostname.split('www.')[1]
		, pathname = window.location.pathname
		, originUrl = `http://${domain}${pathname}`
		, source = siteTitles[domain] || domain;

	let startTime = new Date(); //this is initialized at the current time

	$('head').append("<style>@import url('https://fonts.googleapis.com/css?family=Josefin+Sans|PT+Serif');</style>")

	function initPageHover() {
		const pathnameArr = pathname.split('/');
		let btmPopover, btmButton, slug, side;
		if (pathnameArr.length > 5) { // it's a news page, need to add hover to bottom left of page
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

			btmButton = `<button
				id="btm-btn-${slug}"
				style="margin: 1em;"
				class="google-search btn btn-primary btm-btn"
				href="javascript:void(0);"
				data-slug=${slug}>
					SHOW ALTERNATIVES
				</button>`;

			btmPopover =
				`<div
          class="btm-popover"
          data-slug=${slug}
          style="position:fixed; ${side}:50px; top:100px">
					<div class="btm-popover-title">
						BRIDGE THE MEDIA
						<span class='btm-close btm-pull-right'>&times;</span>
					</div>
          <div id="btm-hover-${slug}">
						<div
							style="max-height:450px;overflow:scroll;" id="btm-popover-body-${slug}"
						/>
            	${btmButton}
          	</div>
        </div>`
		}

		$('body').append($(btmPopover));
		$('.btm-close').on('click', () => {
			$('.btm-popover').fadeOut()
		});

		$('.google-search').on('click', () => {
			$('.google-search').fadeOut()
			chrome.runtime.sendMessage({
				source: window.location,
				type: "Show Alternatives Click"
			})
			Promise.all(siteSearches(spectrumSites[domain], slug))
				.then(results => {
					$(`#btm-popover-body-${slug}`).append(createPopup(results, slug));
					$('.collapse-link').on('click', toggleSummary);
					$('.popup-link').on('click', openArticleLink);
				})
		});
	}

	function openArticleLink(event) {
		event.preventDefault();
		const href = $(event.target).attr('href');
		chrome.runtime.sendMessage({
			targetUrl: href,
			type: "Outbound Link Click",
			source,
			originUrl,
			elapsedTime: Math.round((new Date() - startTime) / 60000)
		});
		startTime = new Date(); // reset startTime
		window.open(href);
	}

	if (pathname.includes("/opinion/") || pathname.includes("/politics/")) {
		initPageHover();
	}
})
