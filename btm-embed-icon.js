$(function() {
	var popover_style =
	  "width: 250px;" +
	  "max-width: 276px;" +
	  "color: black;" +
	  "padding: 1px;" +
	  "font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;" +
	  "font-size: 14px;" +
	  "font-style: normal;" +
	  "font-weight: normal;" +
	  "line-height: 1.42857143;" +
	  "text-align: left;" +
	  "text-align: start;" +
	  "text-decoration: none;" +
	  "text-shadow: none;" +
	  "text-transform: none;" +
	  "letter-spacing: normal;" +
	  "word-break: normal;" +
	  "word-spacing: normal;" +
	  "word-wrap: normal;" +
	  "white-space: normal;" +
	  "background-color: #fff;" +
	  "-webkit-background-clip: padding-box;" +
	  "background-clip: padding-box;" +
	  "border: 1px solid #ccc;" +
	  "border: 1px solid rgba(0, 0, 0, .2);" +
	  "border-radius: 6px;" +
	  "-webkit-box-shadow: 0 5px 10px rgba(0, 0, 0, .2);" +
	  "box-shadow: 0 5px 10px rgba(0, 0, 0, .2);" +
  		"line-break: auto;" +
  		"z-index: 25";
  
  	var popover_title_style =
		"color: black;" +
		  // "padding: 1px;" +
		  "font-family: Josefin Sans, serif;" +
		  "font-size: 16px;" +
		  "font-style: normal;" +
		  "font-weight: bolder;" +
		  "line-height: 1.42857143;" +
		  "text-align: left;" +
		  "text-align: start;" +
		"padding: 8px 14px;" +
		"margin: 0;" +
		"background-color: #f7f7f7;" +
		"border-bottom: 1px solid #ebebeb;" +
		"border-radius: 5px 5px 0 0;";

  	var btn_primary_style =
		"color: #4665B0;" +
		"background-color: #FECC08;" +
		"font-size:14px" +
		"font-family: PT Serif, serif" +
		"border-color: black;" +
		"margin: 10px";

	var spectrum_sites = {
		"www.nytimes.com": ["foxnews.com", "nationalreview.com", "wsj.com","nypost.com"],
		"www.cnn.com": ["thehill.com", "thefiscaltimes.com", "forbes.com","economist.com"],
		"www.foxnews.com": ["theatlantic.com", "vice.com", "slate.com"],
		"www.politico.com": ["nypost.com", "foxnews.com", "washingtontimes.com"],
		"www.vox.com": ["nypost.com", "foxnews.com", "washingtontimes.com"],
		"www.nbcnews.com": ["nypost.com", "foxnews.com", "washingtontimes.com"]
	}

	var get_site_title = {
		"foxnews.com": "Fox News",
		"nationalreview.com": "National Review",
		"wsj.com": "Wall Street Journal",
		"nypost.com": "New York Post",
		"thehill.com": "The Hill",
		"thefiscaltimes.com": "The Fiscal Times",
		"forbes.com": "Forbes",
		"economist.com": "The Economist",
		"theatlantic.com": "The Atlantic",
		"vice.com": "Vice",
		"slate.com": "Slate",
		"huffingtonpost.com": "Huffington Post",
		"thedailybeast.com": "Daily Beast",
		"reason.com": "Reason",
		"telegraph.co.uk": "The Telegraph"
	}

	var originUrl;

	function embedIconsInterval() {
		setInterval(embedIcons, 5000);
	}

	function hasUndefinedElements(elements){
		return elements[0] === undefined;
	}

	function hasProperTextElements(href, elements){
		var result = false;
		elements.forEach(function(element){

			if (element['childNodes'][0] !== undefined){
				if (element['childNodes'][0]['nodeName'] === '#text'){
					result = true;
				}
			}
			if (element['nextSibling'] !== null){
				if (element['nextSibling']['nodeName'] === '#text' && !element['nodeName'] === "DIV"){
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
    	   href = $(this).attr("href");
				 if (href !== undefined){
					 elements = $(this).find('*').toArray();
					 includesPoliticsOrOpinion = (href.includes("/politics/") || href.includes("/opinion/")) && !href.includes("index.html");
					 hasRightElements = hasUndefinedElements(elements) || hasProperTextElements(href, elements);
			 	}
				 return includesPoliticsOrOpinion && hasRightElements;
    	});
		return $a;
	}

	function embedIcons() {
		$links = getLinks();
		var href;
		var href_split;
		var slug;
		var $element;
		var pathname;
		var $newsfeed_post;
		var $post_text;
		$links.each(function(index, element) { // this is for nytimes only. not general
			$element = $(element);
			href = $element.attr('href')
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
								content: content
							})
						if (!$element.next().is('a')){
								$btm_button.insertAfter($element);
						}

						$btm_button.on('shown.bs.popover', initPopover.bind($btm_button, slug, href));
						$btm_button.on('shown.bs.popover', hidePopoverIfUnused.bind($btm_button, slug));

						function initPopover(slug, href) {
							originUrl = href;
							chrome.runtime.sendMessage({source: "Facebook", type: "Facebook BTM Icon Click"}, function(response) {
							});
							$btm_button = this;
							var sites = spectrum_sites["www.foxnews.com"];
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

						function hidePopoverIfUnused(slug) {
							var $btm_button = this;
							var interval = setInterval(btmHidePopover.bind($btm_button, slug),5000);
							function btmHidePopover (slug) {
								$popover = $('.popover[data-slug="' + slug + '"]');
								if(!$popover.is(':hover')) {
									$btm_button.popover('hide');
									$btm_button.on('hidden.bs.popover', function() {
										clearInterval(interval);
									});
								}
							}
					}
			})


		}

	function toggleSummary(event) {
		event.preventDefault();
		var $link = $(event.target);
		// console.log('(createCollapseEvents) link:', $link);
		// if($link.hasClass('fa-user-circle') || $link.hasClass('fa-meetup')) $link = $link.parent();

		var cache = $link.data('cache');
		var $cache = $('#' + cache);
		var $caret = $('#btm-span-' + cache);
		$cache.collapse('toggle');

		// if($caret.hasClass('fa-meetup')) $caret.addClass('fa-user-circle').removeClass('fa-meetup');
		// else $caret.addClass('fa-meetup').removeClass('fa-user-circle');
	}

	embedIconsInterval();

	function getPopoverHtml(slug) {
		return '<div data-slug="' + slug + '" class="popover" role="tooltip" style="' + popover_style + '">' +
		'<div class="arrow"></div>' +
		'<h3 style="' + popover_title_style + '" class="popover-title"><span>&times;</span></h3>' +
		'<div data-slug="' + slug + '" class="popover-content">' +
		'</div>' +
		'</div>';
	}

	function closeHover(event) {
		this.fadeOut();
	}

	function toggleArticles(slug, event) {
		// console.log('(toggleArticles) display:', $('#btm-popover-body-' + slug).attr('display'));
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
		var sites = spectrum_sites[window.location.hostname];
		var site_promises = siteSearches(sites, slug);
		$.when.apply($, site_promises)
		.then(function() { // this is the promise part of the site
			$('#btm-btn-' + slug).hide();
			var search_results = Array.prototype.slice.call(arguments);
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
		var google_url ='https://www.googleapis.com/customsearch/v1?q=' + search + ' &cx=013013877924597244999%3Atbq0ixuctim&dateRestrict=m[7]&siteSearch=' + site + '&key=AIzaSyBS3sgS67eZkQRC_A7LZZG82AFeyBt8FW8';
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
		console.log("clicking article!");
		console.log(href);
		console.log(originUrl);
		chrome.runtime.sendMessage({targetUrl: href,
															  type: "Outbound Link Click",
		                            source: "Facebook",
															  originUrl: originUrl,
															  elapsedTime: 0},
		                            function(response) {});
		window.open(href);
		$('.popup-link').on('click', openArticleLink)
	}

	function createPopup(search_results, slug, style_addition) {
		if(!style_addition) style_addition = "";
		var html = "<div style='margin:10px;font-family: Helvetica Neue, Helvetica, Arial, sans-serif;" + style_addition +"'><ul class='list-unstyled'>";
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
		search_results.forEach(function(search_result) {
			if(search_result && search_result[0].items) html += "<li style='font-family: Helvetica Neue, Helvetica, Arial, sans-serif;'>" + item_template(search_result[0]["queries"]["request"][0]["siteSearch"], search_result[0].items[0], slug) + "</li>";
			else {
				site_title = get_site_title[search_result[0]["queries"]["request"][0]["siteSearch"]];

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
		// function compare_date(items, article_date, args) {
		// 	for( var i = 0; i < args.length; ++i ) {
		// 		if(!args[i]) return;
		// 	}
		// 	var compare_date = new Date("August 31 2017");
		// 	var date = new Date(article_date);
		// }
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
		var site_title = get_site_title[publisher];
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
				if(item && item.pagemap && item.pagemap.metatags && item.pagemap.metatags[0]["og:description"]) description = item.pagemap.metatags[0]["og:description"];
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
