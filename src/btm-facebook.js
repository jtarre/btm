import { getPopoverHtml } from './helpers/inline-styles.js'

import { spectrumSites, siteTitles, getSlug, createPopup, siteSearches} from './helpers/site-constants.js'
$(function() {

	const domain = window.location.hostname.split('www.')[1]
		, pathname = window.location.pathname
		, originTitle = siteTitles[domain] !== undefined ? siteTitles[domain] : domain;

	var facebook_links = {};
	var slug_list = {};
	function facebookInit() {
		switch(window.location.hostname) {
			case "www.facebook.com":
				break;
			default:
				break;
		}
		checkFacebookLinks();
	}

	function facebookInterval() {
		setInterval(checkFacebookLinks, 5000);
	}

	function checkFacebookLinks() {
		let $links = $('a');
		$links = $links.filter(function(index, element) {
			var href = element.href;
			return href.indexOf('www.nytimes.com') > 0;
		})
		var href;
		var slug;
		var $element;
		var pathname;
		var $newsfeed_post;
		var $post_text;
		$links.each(function(index, element) { // this is for nytimes only. not general
			$element = $(element);
			href = $element.attr('href');
			if(href.includes('/politics/') || href.includes('/opinion/')) {
				// href_split = href.split('%2F');
				// href_split.forEach(function(element) { // this is for nytimes
				// 	if(element.indexOf('.html') > 0) {
				// 		slug = element.split(".html")[0];
				// 	}
				// });
				var slug = getSlug(href)
				if(!facebook_links.hasOwnProperty(href)) {
					facebook_links[href] = 1;
					if(href.indexOf('www.nytimes.com') > 0 && !slug_list.hasOwnProperty(slug)) {
						slug_list[slug] = 1;
						$newsfeed_post = $element.closest('.fbUserContent').first(); // this is wrong level of abstraction. where to start. let's make the thing work.
						$post_text = $newsfeed_post.find('.userContent');
						var btmimg = chrome.runtime.getURL('icons/btm_logo.png');
						var $btm_button = $('<p><a href="javascript:void(0);"><img src="' + btmimg + '" height="24" width="26"></a></p>');
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
								content: content
							})
						$post_text.first().append($btm_button);
						$btm_button.on('shown.bs.popover', initPopover.bind($btm_button, slug, href));

						function initPopover(slug, href) {
							$btm_button = this;
							var sites = spectrumSites["nytimes.com"];
							var sitePromises = siteSearches(sites, slug);
							$('.btm-close').on('click', function() { $btm_button.popover('hide') });
							Promise.all(sitePromises)
							.then(function(search_results) {
								$('#btm-loading-' + slug).hide();
								var popup = createPopup(search_results, slug);

								$('#btm-popover-body-' + slug).after(popup);
								$('.collapse-link').on('click', toggleSummary);
								$('.popup-link').on('click', openArticleLink);
							})
							chrome.runtime.sendMessage({source: "Facebook", type: "BTM Icon Click"}, function(response) {
							});
						}
					}
				}
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

	facebookInterval();

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

	function openArticleLink(event) {
		event.preventDefault();
		var $link = $(event.target);
		var href = $link.attr('href');
		let originUrl = href;
		chrome.runtime.sendMessage({targetUrl: href,
															  type: "Outbound Link Click",
		                            source: "Facebook",
															  originUrl: originUrl,
															  elapsedTime: 0},
		                            function(response) {});
		window.open(href);
	}

})
