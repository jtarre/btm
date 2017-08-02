/* ---------- STYLES + HELPER FUNCTIONS --------- */

import { popoverTitleStyle, btnPrimaryStyle, getPopoverHtml } from './helpers/inline-styles.js'

import { spectrumSites, siteTitles, getSlug, createPopup, siteSearches } from './helpers/site-constants.js'

$(function () {
	// if(chrome && chrome.runtime && chrome.runtime.onUpdateAvailble) {
	// 	chrome.runtime.onUpdateAvailable.addListener(function(details) {
	// 	  chrome.runtime.reload();
	// 	});
	// }


	/** Current Algorithm **/
	/** on a per site basis **/
	/*
	Switch statements abound
	1. Identify the links - initAnchor (switch)
	2. Identify the slugs - getSlug (switch)
	displayPopup
	3. Google search based on site searches - siteSearches
	4. Create Popup - createPopup / create_item_template (getPopupDetails (switch)) / createItemHtml

	 */

	const domain = window.location.hostname.split('www.')[1]
		, pathname = window.location.pathname
		, originTitle = siteTitles[domain] !== undefined ? siteTitles[domain] : domain;

	let originUrl //url of current website
		, endTime //this will be set when the user clicks on a recommendation
		, startTime = new Date(); //this is initialized at the current time

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

			btmButton = '<button id="btm-btn-' + slug + '" style="' + btnPrimaryStyle + '" class="google-search btn btn-primary" href="javascript:void(0);" data-slug="' + slug + '">' +
				'SHOW ALTERNATIVES' +
				'</button>';

			btmHover =
				'<div class="btm-popover" data-slug="' + slug + '" style="position:fixed;' + side + ':50px;bottom:10px;">' +
				'<h3 style="' + popoverTitleStyle + '">' +
				'BRIDGE THE MEDIA' +
				'</h3>' +
				'<div id="btm-hover-' + slug + '">' +
				"<div style='max-height:450px;overflow:scroll;'id='btm-popover-body-" + slug + "'></div>" + btmButton +
				"</div>" +
				'</div>';
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

	function closeHover(event) {
		this.fadeOut();
	}

	function toggleArticles(slug, event) {
		if ($('#btm-popover-body-' + slug + ':hidden').length > 0)
			toggleVisible($('#btm-popover-body-' + slug), $('#btm-btn-' + slug));
		else
			toggleInvisible($('#btm-popover-body-' + slug), $('#btm-btn-' + slug));

		function toggleVisible($container, $button) {
			chrome.runtime.sendMessage({ source: originTitle, type: "Show Alternatives Click" }, function (response) {
			});
			$button.text('HIDE');
			$container.fadeIn();
		}

		function toggleInvisible($container, $button) {
			$button.text('SHOW ALTERNATIVES');
			$container.fadeOut();
		}
	}

	if (pathname.includes("/opinion/") || pathname.includes("/politics/")){
		initNewsPageHover();
	}

	function toggleSummary(event) {
		event.preventDefault();
		var $link = $(event.target);
		if ($link.hasClass('fa-caret-down') || $link.hasClass('fa-caret-up')) $link = $link.parent();

		var cache = $link.data('cache');
		var $cache = $('#' + cache);
		var $caret = $('#btm-span-' + cache);
		$cache.collapse('toggle');

		if ($caret.hasClass('fa-caret-up')) $caret.addClass('fa-caret-down').removeClass('fa-caret-up');
		else $caret.addClass('fa-caret-up').removeClass('fa-caret-down');
	}

	function openArticleLink(event) {
		event.preventDefault();
		var $link = $(event.target);
		var href = $link.attr('href');
		originUrl = (originUrl !== undefined ? originUrl : 'http://' + domain + pathname);
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
