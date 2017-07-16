/* ---------- STYLES + HELPER FUNCTIONS --------- */

import { popoverStyle, popoverTitleStyle, btnPrimaryStyle, getPopoverHtml } from './link_hover_helpers/inline-styles.js'

import { spectrumSites, siteTitles, searcher } from './link_hover_helpers/site-constants.js'

	function getSlug(href, domain) {
		let hrefSegments = href.split('/')
			, slug = '';
		switch (domain) {
			case 'nytimes.com':
				slug = hrefSegments[hrefSegments.length - 1].replace(/\d+/g, '').split('.', 1)[0];
				break;
			case 'cnn.com':
				if (hrefSegments[hrefSegments.length - 1] === 'index.html') {
					slug = hrefSegments[hrefSegments.length - 2].split('.', 1)[0];
				}
				break;
			case 'foxnews.com':
				slug = hrefSegments[hrefSegments.length - 1].replace(/\d+/g, '').split('.', 1)[0];
				break;
			default:
				break;
		}
		return slug;
	}

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
					console.log('(init page news hover) pathname:', pathnameArr);
					slug = pathnameArr[pathnameArr.length - 1].replace('.html', '');
					console.log('(init page hover (switch)) slug:', slug);
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
		var sites = spectrumSites[domain];
		var site_promises = siteSearches(sites, slug);
		Promise.all(site_promises)
			.then((search_results) => {
				console.log('(init page hover) search results:', search_results);
				var popup = createPopup(search_results, slug);
				console.log('(btmHover) popup:', popup)
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
		console.log('(toggleArticles) display:', $('#btm-popover-body-' + slug).attr('display'));
		if ($('#btm-popover-body-' + slug + ':hidden').length > 0)
			toggleVisible($('#btm-popover-body-' + slug), $('#btm-btn-' + slug));
		else
			toggleInvisible($('#btm-popover-body-' + slug), $('#btm-btn-' + slug));

		function toggleVisible($container, $button) {
			chrome.runtime.sendMessage({ source: originTitle, type: "Show Alternatives Click" }, function (response) {
				console.log(response);
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

	function initNYTAnchor(pathnameArr) {
		if (pathnameArr[1] === "") {
			return $('.TemplateUtils-column--2kfG7 a, .lede-package-region a, .first-column-region a, .second-column-region a, .opinion-c-col-left-region a, .opinion-c-col-right-region a, .well-region a, .inside-nyt-browser a'); // means we're on the nyt home page
		} else if (pathnameArr.length >= 3 && pathnameArr[1] === "section") {
			return $('.story-menu a'); // section/world or section/world/africas (or another country) or section/us
		} else if (pathnameArr.length >= 3 && pathnameArr[2] === "opinion") {
			return $('.abColumn a, .bColumn a, .cColumn a'); // pages/opinion section
		} else if (pathnameArr.length >= 3 && pathnameArr[2] === "politics") {
			return $('.aColumn a, .bColumn a, .cColumn .videoDetails a, .cColumn .extVidPlayerThumbsContainer a'); // pages/politics section
		} else {
			return $("#nolinks");
		}
	}

	function initFoxAnchor(pathnameArr) {
		if (pathnameArr.length > 2) // it's a individual page
			return $('.ob-last a'); // this class is associated with a bar called "More from Fox News"
		else if (pathnameArr[1] == "") // it's the homepage
			return $('#col a, .rail a, #opinion a');
		else {
			// header page - i.e. Politics, Opinion, World
			var header = pathnameArr[1];
			var $a;
			switch (header) {
				case "opinion.html":
					$a = $('.row-1 a, .row-2 .mod-2 a, .row-2 .mod-3 a, .row-3 .mod-4 a, .row-4 a, .row-5 a, .row-6 .mod-7 a');
					break;
				case "us.html":
					$a = $('.row-1 a, .row-2 a, .row-3 a, .row-4 .bkt-4 a, .row-5 .bkt-5 a, .row-6 a, .row-7 a, .row-8 a, .row-9 a, .row-10 a')
					break;
				case "politics.html":
					$a = $('.mod-1 a, .mod-2 a, .in-house a, .mod-4 a, .video-ct a, .article-ct a, .mod-5 a, .mod-7 a');
					break;
				case "world.html":
					$a = $('.row-1 a, .row-2 a, .row-3 .video-ct a, .row-4 .left a, .row-4 .right a, .row-5, .row-6 .right .video-ct a, .row-6 .right .article-ct a, .row-7 .js-infinite-scroll-list a');
					break;
				default:
					$a = $('#nolinks');
					break;
			}
			return $a
		}
	}

	// initialization for a home page such as nytimes.com or foxnews.com
	// this is the place where we specify what parts of the page have the btm hover made active.
	function initAnchor() {
		let $a;
		const pathnameArr = pathname.split('/');
		switch (domain) {
			case "nytimes.com":
				$a = initNYTAnchor(pathname.split('/'));
				console.log('(initAnchor) pathnameArr:', pathnameArr);
				break;
			case "foxnews.com":
				$a = initFoxAnchor(pathnameArr)
				break;
			default:
				$a = $('a');
		}
		console.log('(init before return) a links:', $a);
		return $a;
	}

	var $a = initAnchor();

	// todo: wrap in a function call
	// this each loop 1) turns each link into a popover enabled link and
	// 2) specifies the html and code for the popover.
	$a.each(function (index, link) {
		var $link = $(link);
		var href = $link.attr("href");
		var placement = "right";

		if (href) {
			var slug = getSlug(href, domain);
			var popover_html = getPopoverHtml(slug);
			var content = '<button id="btm-btn-' + slug + '" style="' + btnPrimaryStyle + '" class="google-search btn btn-primary" href="javascript:void(0);" data-slug="' + slug + '">' +
				'SHOW ALTERNATIVES' +
				'</button><div id="btm-popover-body-' + slug + '"></div>';
			var title_style =
				"color: black;" +
				// "padding: 1px;" +
				"font-family: Josefin Sans, serif;" +
				"font-size: 16px;" +
				"font-style: normal;" +
				"font-weight: bolder;" +
				"line-height: 1.42857143;" +
				"text-align: left;" +
				"text-align: start;";
			// todo: this should be its own function for clarity
			$link.popover({
				trigger: "manual", // this code right here initializes the popover.
				html: "true",
				template: popover_html,
				title: "<span style='" + title_style + "'>BRIDGE THE MEDIA<span class='btm-close btm-pull-right'>&times;</span></span>",
				placement: placement,
				content: content
			})
				.on("mouseenter", popoverEnter.bind($link, slug))
		}
	})

	// this function defines how the popover interacts with the mouse
	// e.g. how long you have to hover over a link before the bubble pops up
	// this is
	function popoverEnter(slug) {
		var $link = this;
		originUrl = $link.attr("href");
		setTimeout(function setupPopover() {
			if ($link.is(':hover')) {
				$('.popover:not([data-slug="' + slug + '"])').hide();
				setTimeout(function showPopover() {
					$link.popover("show");
					var $popover = $('.popover[data-slug="' + slug + '"]');
					$('.google-search').on('click', displayArticles.bind($popover, slug));
					$('.btm-close').on('click', function () { $link.popover('hide') });
					$(window).on('click', function (event) {
						// event.preventDefault();
						if ($popover.filter(':hover').length < 1) $link.popover('hide');
					});
				}, 500)
			}
		}, 900); // this is how long the hover waits before displaying
	}

	function hidePopover(event) {
		$link = this;
	}

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
		.then(res => res.data)
		// .catch(res => res.error)
	}

	function toggleSummary(event) {
		event.preventDefault();
		var $link = $(event.target);
		console.log('(createCollapseEvents) link:', $link);
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
		$('.popup-link').on('click', openArticleLink)
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
		// function compare_date(items, article_date, args) {
		// 	for( var i = 0; i < args.length; ++i ) {
		// 		if(!args[i]) return;
		// 	}
		// 	var compare_date = new Date("August 31 2017");
		// 	var date = new Date(article_date);
		// }
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

	function displayArticles(slug, event) {
		var sites = spectrumSites[domain];
		var site_promises = siteSearches(sites, slug);
		Promise.all(site_promises)
			.then(function (search_results) { // this is the promise part of the site
				$('#btm-btn-' + slug).hide();
				var popup = createPopup(search_results, slug);
				// add popup to page
				$('#btm-popover-body-' + slug).after(popup);
				$('.collapse-link').on('click', toggleSummary);
				$('.popup-link').on('click', openArticleLink);

				// Get current news publication and send it to popup.js when Show Alternatives is clicked
				chrome.runtime.sendMessage({ source: originTitle, type: "Show Alternatives Click" }, function (response) {
					console.log(response);
				});
			})
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
