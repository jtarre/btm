import { getPopoverHtml, popoverTitleStyle, popoverBTMStyle } from './helpers/inline-styles.js'

import { spectrumSites, siteTitles, getSlug, createPopup, siteSearches} from './helpers/site-constants.js'

$(function() {

	const domain = window.location.hostname.split('www.')[1]
		, pathname = window.location.pathname
		, originTitle = siteTitles[domain] !== undefined ? siteTitles[domain] : domain;

	var facebook_links = {};
	var slug_list = {};

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
						$newsfeed_post = $element.closest('.fbUserContent').first();
						$post_text = $newsfeed_post.find('.userContent');
						const btmimg = chrome.runtime.getURL('icons/btm_logo.png')
								, $btm_button = $(`<p><a href="javascript:void(0);"><img src="${btmimg}" height="24" width="26"></a></p>`)
								, popover_html = getPopoverHtml(slug)
								, loading = `<div id="btm-popover-body-${slug}"><div id="btm-loading-${slug}"><p>Loading...</p></div></div>`;

						$btm_button.popover({
							trigger: "click",
							container: "body",
							html: "true",
							template: popover_html,
							title: `<span style=${popoverBTMStyle}>BRIDGE THE MEDIA<span class='btm-close btm-pull-right'>&times;</span></span>`,
							content: loading
						})

						$post_text.first().append($btm_button);
						$btm_button.on('shown.bs.popover', initPopover.bind($btm_button, slug, href));

						function initPopover(slug, href) {
							const sites = spectrumSites['nytimes.com'] //hard-coded for NYT only
									, sitePromises = siteSearches(sites, slug);

							$('.btm-close').on('click', () => { $btm_button.popover('hide') });

							Promise.all(sitePromises)
								.then(results => {
									$(`#btm-loading-${slug}`).hide();
									$(`#btm-popover-body-${slug}`).after(createPopup(results, slug));
									$('.collapse-link').on('click', toggleSummary);
									$('.popup-link').on('click', openArticleLink);
								})

							chrome.runtime.sendMessage({ source: originTitle, type: "BTM Icon Click" }, function (response) {
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
		if ($link.hasClass('fa-caret-down') || $link.hasClass('fa-caret-up')) $link = $link.parent();
		var cache = $link.data('cache');
		var $cache = $(`#${cache}`);
		var $caret = $(`#btm-span-${cache}`).attr("style", "font-family: FontAwesome")
		$cache.collapse('toggle');
		if ($caret.hasClass('fa-caret-up')) {
			$caret.addClass('fa-caret-down').removeClass('fa-caret-up')
		} else {
			$caret.addClass('fa-caret-up').removeClass('fa-caret-down')
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

	if (domain === "facebook.com") {
		setInterval(checkFacebookLinks, 1000)
	}

})
