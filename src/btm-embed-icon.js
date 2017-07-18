/* ---------- STYLES + HELPER FUNCTIONS --------- */

import { getPopoverHtml } from './link_hover_helpers/inline-styles.js'

import { spectrumSites, siteTitles, searcher, getSlug } from './link_hover_helpers/site-constants.js'


$(function() {

	const domain = window.location.hostname.split('www.')[1]
		, pathname = window.location.pathname
		, originTitle = siteTitles[domain] !== undefined ? siteTitles[domain] : domain;

	let originUrl //url of current website
		, endTime //this will be set when the user clicks on a recommendation
		, elapsedTime
		, startTime = new Date(); //this is initialized at the current time

	function embedIconsInterval() {
		setInterval(embedIcons, 5000);
	}

	function hasUndefinedElements(elements){
		return elements[0] === undefined;
	}

	function hasProperTextElements(elements){
		var result = false;

		elements.forEach(function(element){

			if (element['childNodes'][0] !== undefined){
				if (element['childNodes'][0]['nodeName'] === '#text' && $(element['childNodes'][0]).parents('figcaption').length === 0){
					result = true;
				}
			}
			if (element['nextSibling'] !== null){
				if (element['nextSibling']['nodeName'] === '#text' && element['nodeName'] !== "DIV" && $.trim(element['nextSibling']['textContent']) !== ""){
					result = true;
				}
			}
		});
		return result;
	}


  function getLinks() {
		var $a;
		var $a = $("a");
      $a = $a.filter(function(index){
				 var includesPoliticsOrOpinion = false;
				 var hasRightElements = false;
    	   var href = $(this).attr("href");
				 if (href !== undefined){
					 var elements = $(this).find('*').toArray();
					 includesPoliticsOrOpinion = (href.includes("/politics/") || href.includes("/opinion/")) && !href.includes("index.html");
					 hasRightElements = hasUndefinedElements(elements) || hasProperTextElements(elements);
			 	}
				 return includesPoliticsOrOpinion && hasRightElements;
    	});
		return $a;
	}

	function embedIcons() {
		$links = getLinks();
		var href;
		var slug;
		var $element;
		$links.each(function(index, element) { // this is for nytimes only. not general
			$element = $(element);
			href = $element.attr('href');
			slug = getSlug(href);
			var placement = "right";
			var btmimg = chrome.runtime.getURL('icons/btm_logo.png');
		  var $btm_button = $('<a href="javascript:void(0);"><img src="' + btmimg + '" height="20" width="20"></a>');
		  var popover_html = getPopoverHtml(slug);
			var content = '<div id="btm-popover-body-' + slug + '"><div id="btm-loading-' + slug + '"><p>Loading...</p></div></div>';
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
						$btm_button.popover({trigger: "click",
								container: "body",
								html: "true",
								template: popover_html,
								title: "<span style='" + title_style +"'>BRIDGE THE MEDIA<span class='btm-close btm-pull-right'>&times;</span></span>",
								placement: placement,
								content: content
							})
						if (!$element.next().is('a') && $element.attr('class')!== 'popup-link'){
								$btm_button.insertAfter($element);
						}

						$btm_button.on('shown.bs.popover', initPopover.bind($btm_button, slug, href));
						// $btm_button.on('shown.bs.popover', hidePopoverIfUnused.bind($btm_button, slug));

						function initPopover(slug, href) {
							chrome.runtime.sendMessage({source: originTitle, type: "BTM Icon Click"}, function(response) {
							});
							$btm_button = this;
							var sites = spectrumSites[domain];
							var site_promises = siteSearches(sites, slug);
							$('.btm-close').on('click', function() { $btm_button.popover('hide') });
							$.when.apply($, site_promises)
							.then(function() { // this is the promise part of the site
								// $('#btm-btn-' + slug).hide();
								$('#btm-loading-' + slug).hide();
								var search_results = Array.prototype.slice.call(arguments);
								var popup = createPopup(search_results, slug);
								// add popup to page

								$('#btm-popover-body-' + slug).after(popup);
								$('.collapse-link').on('click', toggleSummary);
								$('.popup-link').on('click', openArticleLink);
							})
						}

					// 	function hidePopoverIfUnused(slug) {
					// 		var $btm_button = this;
					// 		var $popover;
					// 		var interval = setInterval(btmHidePopover.bind($btm_button, slug),5000);
					// 		function btmHidePopover (slug) {
					// 			$popover = $('.popover[data-slug="' + slug + '"]');
					// 			if(!$popover.is(':hover')) {
					// 				$btm_button.popover('hide');
					// 				$btm_button.on('hidden.bs.popover', function() {
					// 					clearInterval(interval);
					// 				});
					// 			}
					// 		}
					// }
			})


		}

	function toggleSummary(event) {
		event.preventDefault();
		var $link = $(event.target);
		var cache = $link.data('cache');
		var $cache = $('#' + cache);
		var $caret = $('#btm-span-' + cache);
		$cache.collapse('toggle');
	}

	if (window.location.hostname !== "www.facebook.com"){
		embedIconsInterval();
	}

	function closeHover(event) {
		this.fadeOut();
	}

	function toggleArticles(slug, event) {
		if($('#btm-popover-body-' + slug + ':hidden').length > 0)
			toggleVisible($('#btm-popover-body-' + slug), $('#btm-btn-' + slug));
		else
			toggleInvisible($('#btm-popover-body-' + slug), $('#btm-btn-' + slug));

		function toggleVisible($container, $button) {
			$button.text('HIDE');
			$container.fadeIn();
		}

		function toggleInvisible($container, $button) {
			$button.text('SHOW ALTERNATIVES');
			$container.fadeOut();
		}
	}

	function displayArticles(slug, event) {
		var sitePromises = siteSearches(spectrumSites[domain], slug);
		Promise.all(sitePromises)
			.then(function (search_results) { // this is the promise part of the site
				$('#btm-btn-' + slug).hide();
				var popup = createPopup(search_results, slug);
				// add popup to page
				$('#btm-popover-body-' + slug).after(popup);
				$('.collapse-link').on('click', toggleSummary);
				$('.popup-link').on('click', openArticleLink);
			})
	}

	function hidePopover(event) {
		$link = this;
	}

	function siteSearches(sites, slug) {
		return sites.map(function(site) {
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

	function openArticleLink(event) {
		event.preventDefault();
		var $link = $(event.target);
		var href = $link.attr('href');
		originUrl = originUrl != undefined ? originUrl : window.location.hostname + window.location.pathname;
		endTime = new Date();
		elapsedTime = Math.round((endTime - startTime)/60000); // calculate elapsedTime in minutes
		startTime = new Date(); // reset startTime
		chrome.runtime.sendMessage({targetUrl: href,
															  type: "Outbound Link Click",
		                            source: originTitle,
															  originUrl: originUrl,
															  elapsedTime: elapsedTime},
		                            function(response) {});
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
			var result = search_result[0];
			var site = result["queries"]["request"][0]["siteSearch"];
			var item = result.items !== undefined ? result.items[0]: "";
			if (result) {
				html += "<li style='font-family: Helvetica Neue, Helvetica, Arial, sans-serif;'>" + item_template(site, item, slug) + "</li>";
			} else {
				site_title = siteTitles[site];

				html += "<li><p style='" + html_style + "'><strong style='font-family: PT Serif;color:black;font-size:12px'>" + site_title + "</strong></br><span style='font-family: PT Serif;color:black;font-size:12px'>No Results</span></li>"
			}
		});
		html += "<ul></div>";
		return html;
	}

	function item_template(publisher, item, slug) {

		var popup_details = getPopupDetails(publisher, item);
		return createItemHtml(popup_details.site_title,
			popup_details.link,
			popup_details.headline,
			popup_details.description,
			popup_details.date, slug);
	}

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
			"<a style='" + anchor_style + "' class='collapse-link' data-toggle='collapse' data-cache='" + cache + "' href='javascript:void(0);'>" + title + "</a></p>" +
			"<div class='collapse' id='" + slug + "-" + site_id + "-collapse'>" +
				"<div class='well'>" +
				"<h4 style='font-family: PT Serif, serif;color:black;font-size:12px' +><a class='popup-link' href='" + link + "'>" + "Read entire article</a>" +
				"</h4>" +
					"<p style='font-family: PT Serif, serif;color:black;font-size:12px' +>" + description + "</p>" +
				"</div>"+
			"</div>";
		return html;
	}

	function getPopupDetails(publisher, item) {
		var site_title = siteTitles[publisher];
		var link;
		var headline;
		var description;
		var date;

		switch(publisher) {
			case "foxnews.com":
				link = item.link;
				headline= item.title;

				if(item && item.pagemap && item.pagemap.metatags && item.pagemap.metatags[0]["dc.description"]) description = item.pagemap.metatags[0]["dc.description"];
				else description = item.snippet;

				if(item && item.pagemap && item.pagemap.metatags && item.pagemap.metatags[0]['dc.date']) {
					date = item.pagemap.metatags[0]['dc.date'];
					date = new Date(date);
					date = date.toDateString();
				}
				break;

			case "nationalreview.com":
				link = item.link;

				/** headline**/
				if(item && item.pagemap && item.pagemap.article && item.pagemap.article[0].headline) headline= item.pagemap.article[0].headline;
				else headline= item.title;

				/** Description **/
				if(item && item.pagemap && item.pagemap.article && item.pagemap.article[0].articlebody) description = item.pagemap.article[0].articlebody;
				else description = item.snippet;

				/** Date **/
				if(item && item.pagemap && item.pagemap.article && item.pagemap.article[0].datepublished) {
					date = item.pagemap.article[0].datepublished;
					date = new Date(date);
					date = date.toDateString();
				}
				break;

			case "nypost.com":
				link = item.link;
				headline= item.title;
				/** Description **/
				if(item && item.pagemap && item.pagemap.metatags && item.pagemap.metatags[0]["og:description"]) description = item.pagemap.metatags[0]["og:description"];
				else description = item.snippet;

				/** Date **/
				if(item && item.pagemap && item.pagemap.metatags && item.pagemap.metatags[0]['article:published_time']) {
					date = item.pagemap.metatags[0]['article:published_time'];
					date = new Date(date);
					date = date.toDateString();
				}
				break;

			case "wsj.com":
				link = item.link;
				headline= item.title;

				/** Description **/
				if(item && item.pagemap && item.pagemap.webpage && item.pagemap.webpage[0].description) description = item.pagemap.webpage[0].description;
				else description = item.snippet;

				/** Date **/
				if(item && item.pagemap && item.pagemap.webpage && item.pagemap.webpage[0].datecreated) {
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
				if(item && item.pagemap && item.pagemap.newsarticle && item.pagemap.newsarticle[0].description) description = item.pagemap.newsarticle[0].description;
				else description = item.snippet;

				if(item && item.pagemap && item.pagemap.newsarticle && item.pagemap.newsarticle[0].datepublished) {
					date = item.pagemap.newsarticle[0].datepublished;
					date = new Date(date);
					date = date.toDateString();
				}
				break;
			case "vice.com":
				link = item.link;
				headline = item.title;
				if(item && item.pagemap && item.pagemap.metatags && item.pagemap.metatags[0]["og:description"]) description = item.pagemap.metatags[0]["og:description"];
				else description = item.snippet;
				break;
			case "slate.com":
				link = item.link;
				headline = item.title;
				if(item && item.pagemap && item.pagemap.metatags && item.pagemap.metatags[0]["og:description"]) description = item.pagemap.metatags[0]["og:description"];
				else description = item.snippet;
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
