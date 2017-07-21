/* ---------- STYLES + HELPER FUNCTIONS --------- */

import { getPopoverHtml } from './helpers/inline-styles.js'

import { spectrumSites, siteTitles, getSlug, createPopup, siteSearches} from './helpers/site-constants.js'

$(function() {

	const domain = window.location.hostname.split('www.')[1]
		, pathname = window.location.pathname
		, originTitle = siteTitles[domain] !== undefined ? siteTitles[domain] : domain;

	let originUrl //url of current website
		, endTime //this will be set when the user clicks on a recommendation
		, elapsedTime
		, startTime = new Date(); //this is initialized at the current time

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
		var $a = $("a").filter(function (index) {
			var includesPoliticsOrOpinion = false;
			var hasRightElements = false;
			var href = $(this).attr("href");
			if (href !== undefined) {
				var elements = $(this).find('*').toArray();
				includesPoliticsOrOpinion = (href.includes("/politics/") || href.includes("/opinion/")) && !href.includes("index.html");
				hasRightElements = hasUndefinedElements(elements) || hasProperTextElements(elements);
			}
			return includesPoliticsOrOpinion && hasRightElements;
		});
		return $a;
	}

	function embedIcons() {
		let $links = getLinks();
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

						function initPopover(slug, href) {

							$btm_button = this;
							var sites = spectrumSites[domain];
							var sitePromises = siteSearches(sites, slug);
							$('.btm-close').on('click', function() { $btm_button.popover('hide') });
							Promise.all(sitePromises)
							.then(function(search_results) { // this is the promise part of the site
								// $('#btm-btn-' + slug).hide();
								$('#btm-loading-' + slug).hide();
								var popup = createPopup(search_results, slug);
								// add popup to page

								$('#btm-popover-body-' + slug).after(popup);
								$('.collapse-link').on('click', toggleSummary);
								$('.popup-link').on('click', openArticleLink);
							})

							chrome.runtime.sendMessage({source: originTitle, type: "BTM Icon Click"}, function(response) {
							});
						}

						function openArticleLink(event) {
							event.preventDefault();
							var $link = $(event.target);
							var href = $link.attr('href');
							var originUrl = (originUrl !== undefined ? originUrl : 'http://' + domain + pathname);
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
		}

	function toggleSummary(event) {
		event.preventDefault();
		var $link = $(event.target);
		var cache = $link.data('cache');
		var $cache = $('#' + cache);
		var $caret = $('#btm-span-' + cache);
		$cache.collapse('toggle');
	}

	/* Fires embedIcons as long as the user is not on Facebook. */
	if (domain !== 'facebook.com'){
		setInterval(embedIcons, 5000);
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

	function hidePopover(event) {
		$link = this;
	}

})
