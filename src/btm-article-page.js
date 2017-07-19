/* ---------- STYLES + HELPER FUNCTIONS --------- */

import { popoverStyle, popoverTitleStyle, btnPrimaryStyle, getPopoverHtml } from './link_hover_helpers/inline-styles.js'

import { spectrumSites, siteTitles, searcher, getSlug } from './link_hover_helpers/site-constants.js'

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
		console.log("something is happening!");
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
				'<div data-slug="' + slug + '" style="' + popoverStyle + ';position:fixed;' + side + ':50px;bottom:10px;">' +
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

	initNewsPageHover();


	function siteSearches(sites, slug) {
		return sites.map(function (site) {
			var site_ajax = siteSearch(site, slug);
			return site_ajax;
		})
	}

	function siteSearch(site, search) {
		var google_url = 'https://www.googleapis.com/customsearch/v1?q=' + search + ' &cx=013013877924597244999%3Atbq0ixuctim&dateRestrict=m[7]&siteSearch=' + site + searcher;
		return $.ajax({
			type: 'get',
			url: google_url,
			dataType: 'json'
		})
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
		elapsedTime = Math.round((endTime - startTime) / 60000); // calculate elapsedTime in minutes
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

	// css and html for each news snippet
	function createPopup(search_results, slug, style_addition) {
		if (!style_addition) style_addition = "";

		var html = "<div style='margin:10px;font-family: Helvetica Neue, Helvetica, Arial, sans-serif;" + style_addition + "'><ul class='list-unstyled'>";

		var html_style =
			"color: black;" +
			// "padding: 1px;" +
			"font-family: Helvetica Neue, Helvetica, Arial, sans-serif;" +
			"font-size: 14px;" +
			"font-style: normal;" +
			"font-weight: normal;" +
			"line-height: 1.42857143;" +
			"text-align: left;" +
			"text-align: start;";

		var site_title;

		search_results.forEach((search_result) => {
			if (search_result && search_result.items[0]) {
				html += "<li style='font-family: Helvetica Neue, Helvetica, Arial, sans-serif;'>" + item_template(search_result["queries"]["request"][0]["siteSearch"], search_result.items[0], slug) + "</li>";
			} else {
				site_title = siteTitles[search_result["queries"]["request"][0]["siteSearch"]];

				html += "<li><p style='" + html_style + "'><strong style='font-family: PT Serif;color:black;font-size:12px'>" + site_title + "</strong></br><span style='font-family: PT Serif;color:black;font-size:12px'>No Results</span></li>"
			}
		});
		html += "<ul></div>";
		return html;
	}

	// css and html for each news snippet
	function item_template(publisher, item, slug) {

		var popup_details = getPopupDetails(publisher, item);
		return createItemHtml(popup_details.site_title,
			popup_details.link,
			popup_details.headline,
			popup_details.description,
			popup_details.date, slug);
	}

	// css and html for each news snippet
	function createItemHtml(site, link, title, description, date, slug) {
		var site_id = site.replace(/\s/g, "");
		var random = Math.random() * 100;
		random = random.toString();
		if (date) date = " | " + date;
		else date = "| date unavailable";
		var html_style =
			"color: black;" +
			// "padding: 1px;" +
			"font-family: PT serif, serif;" +
			"font-size: 12px;" +
			"font-style: normal;" +
			"font-weight: normal;" +
			"line-height: 1.42857143;" +
			"text-align: left;" +
			"text-align: start;";
		var anchor_style =
			"font-family: PT Serif, serif;" +
			"color: black;" +
			"font-size: 12px;";

		var cache = slug + "-" + site_id + "-collapse";
		var html =
			"<p style='" + html_style + "'><strong style='font-family: PT Serif, serif;'>" + site + date + "</strong></br>" +
			"<a style='" + anchor_style + "' class='collapse-link' data-toggle='collapse' data-cache='" + cache + "' href='javascript:void(0);'>" + title + "<span id='btm-span-" + cache + "' class='fa fa-caret-down'></span></a></p>" +
			"<div class='collapse' id='" + slug + "-" + site_id + "-collapse'>" +
			"<div class='well'>" +
			"<h4 style='font-family: PT Serif, serif;color:black;font-size:12px' +><a class='popup-link' href='" + link + "'>" + "Read entire article</a>" +
			"</h4>" +
			"<p style='font-family: PT Serif, serif;color:black;font-size:12px' +>" + description + "</p>" +
			"</div>" +
			"</div>";
		return html;
	}

	// this is where we extract article info. embedly or mercury may make this unnecessary
	function getPopupDetails(publisher, item) {
		var site_title = siteTitles[publisher];
		var link;
		var headline;
		var description;
		var date;

		switch (publisher) {
			case "foxnews.com":
				link = item.link;
				headline = item.title;

				if (item && item.pagemap && item.pagemap.metatags && item.pagemap.metatags[0]["dc.description"]) description = item.pagemap.metatags[0]["dc.description"];
				else description = item.snippet;

				if (item && item.pagemap && item.pagemap.metatags && item.pagemap.metatags[0]['dc.date']) {
					date = item.pagemap.metatags[0]['dc.date'];
					date = new Date(date);
					date = date.toDateString();
				}
				break;

			case "nationalreview.com":
				link = item.link;

				/** headline**/
				if (item && item.pagemap && item.pagemap.article && item.pagemap.article[0].headline) headline = item.pagemap.article[0].headline;
				else headline = item.title;

				/** Description **/
				if (item && item.pagemap && item.pagemap.article && item.pagemap.article[0].articlebody) description = item.pagemap.article[0].articlebody;
				else description = item.snippet;

				/** Date **/
				if (item && item.pagemap && item.pagemap.article && item.pagemap.article[0].datepublished) {
					date = item.pagemap.article[0].datepublished;
					date = new Date(date);
					date = date.toDateString();
				}
				break;

			case "nypost.com":
				link = item.link;
				headline = item.title;
				/** Description **/
				if (item && item.pagemap && item.pagemap.metatags && item.pagemap.metatags[0]["og:description"]) description = item.pagemap.metatags[0]["og:description"];
				else description = item.snippet;

				/** Date **/
				if (item && item.pagemap && item.pagemap.metatags && item.pagemap.metatags[0]['article:published_time']) {
					date = item.pagemap.metatags[0]['article:published_time'];
					date = new Date(date);
					date = date.toDateString();
				}
				break;

			case "wsj.com":
				link = item.link;
				headline = item.title;

				/** Description **/
				if (item && item.pagemap && item.pagemap.webpage && item.pagemap.webpage[0].description) description = item.pagemap.webpage[0].description;
				else description = item.snippet;

				/** Date **/
				if (item && item.pagemap && item.pagemap.webpage && item.pagemap.webpage[0].datecreated) {
					date = item.pagemap.webpage[0].datecreated;
					date = new Date(date);
					date = date.toDateString();
				}
				break;
			case "thehill.com":
				break;
			case "thefiscaltimes.com":
				break;
			case "forbes.com":
				break;
			case "economist.com":
				break;
			case "theatlantic.com":
				link = item.link;
				headline = item.title;
				if (item && item.pagemap && item.pagemap.newsarticle && item.pagemap.newsarticle[0].description) description = item.pagemap.newsarticle[0].description;
				else description = item.snippet;

				if (item && item.pagemap && item.pagemap.newsarticle && item.pagemap.newsarticle[0].datepublished) {
					date = item.pagemap.newsarticle[0].datepublished;
					date = new Date(date);
					date = date.toDateString();
				}
				break;
			case "vice.com":
				link = item.link;
				headline = item.title;
				if (item && item.pagemap && item.pagemap.metatags && item.pagemap.metatags[0]["og:description"]) description = item.pagemap.metatags[0]["og:description"];
				else description = item.snippet;

				/** Date **/
				// if(item && item.pagemap && item.pagemap.metatags && item.pagemap.metatags[0]['article:published_time']) {
				// 	date = item.pagemap.metatags[0]['article:published_time'];
				// 	date = new Date(date);
				// 	date = date.toDateString();
				// }
				break;
			case "slate.com":
				link = item.link;
				headline = item.title;
				if (item && item.pagemap && item.pagemap.metatags && item.pagemap.metatags[0]["og:description"]) description = item.pagemap.metatags[0]["og:description"];
				else description = item.snippet;

				/** Date **/
				// if(item && item.pagemap && item.pagemap.metatags && item.pagemap.metatags[0]['article:published_time']) {
				// 	date = item.pagemap.metatags[0]['article:published_time'];
				// 	date = new Date(date);
				// 	date = date.toDateString();
				// }
				break;
			case "huffingtonpost.com":
				break;
			case "thedailybeast.com":
				break;
			case "reason.com":
				break;
			case "telegraph.co.uk":
				break;
			default:
				break;
		}

		var details = {
			site_title: site_title,
			link: link,
			headline: headline,
			description: description,
			date: date
		};

		return details;
	}
})
