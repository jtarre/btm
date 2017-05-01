$(function() {
	


	// if(chrome && chrome.runtime && chrome.runtime.onUpdateAvailble) {
	// 	chrome.runtime.onUpdateAvailable.addListener(function(details) {
	// 	  chrome.runtime.reload();
	// 	});
	// }


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

  		"line-break: auto;";

  	var popover_title_style =
		"padding: 8px 14px;" +
		"color: black;" +
		"margin: 0;" +
		"font-size: 14px;" +
		"background-color: #f7f7f7;" +
		"border-bottom: 1px solid #ebebeb;" +
		"border-radius: 5px 5px 0 0;";

  	var btn_primary_style = 
		"color: #fff;" +
		"background-color: #337ab7;" +
		"border-color: #2e6da4;" +
		"margin: 10px";

	function getPopoverHtml(slug) {
		return '<div data-slug="' + slug + '" class="popover" role="tooltip" style="' + popover_style + '">' + 
		'<div class="arrow"></div>' + 
		'<h3 style="' + popover_title_style + '" class="popover-title"></h3>' + 
		'<div data-slug="' + slug + '" class="popover-content">' +
		'</div>' +
		'</div>';

	}

	function getSlug(href) {
		var href_segments;
		var slug = ""; 
		var last;
		switch(window.location.hostname){
			case "www.nytimes.com":
				href_segments = href.split("/");
				slug = href_segments[href_segments.length-1];
				slug = slug.replace(/\d+/g, "");
				
				slug = slug.split(".", 1);
				slug = slug[0];
				break;
			case "www.cnn.com":
				href_segments = href.split("/");
				
				last = href_segments[href_segments.length-1];
				if(last == "index.html"){
					slug = href_segments[href_segments.length-2];
					slug = slug.split(".", 1);
					slug = slug[0];
				} else {
					break;
				}
				break;
			default:
				break;
		}
				
	return slug;
	}

	$a = $("a");
	$a.each(function(index, link) {
		$link = $(link);
		$link.attr('data-container', 'body');
		href = $link.attr("href");

		if(href) {
			var slug = getSlug(href);
			var popover_html = getPopoverHtml(slug);
			var content = '<button id="btm-btn-' + slug + '" style="' + btn_primary_style + '" class="google-search btn btn-primary" href="javascript:void(0);" data-slug="' + slug + '">' +
				'Show alternatives' +
			'</button><div id="btm-popover-body-' + slug + '"></div>';
			$link.popover({trigger: "manual",
						html: "true",
						template: popover_html,
						title: "Bridge the Media",
						content: content
					})
					.on("mouseenter", popoverEnter.bind($link, slug))
		}
	})	
	
	function popoverEnter (slug) {
		var $link = this;
		
		setTimeout(function setupPopover () {
			if($link.is(':hover')) {
				$('.popover:not([data-slug="' + slug + '"])').hide();
				setTimeout(function showPopover() {
					$link.popover("show");	
					var $popover = $('.popover[data-slug="' + slug + '"]');
					$('.google-search').on('click', displayPopup.bind($popover, slug));
				}, 500)
			}
		}, 900);
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

	var spectrum_sites = {
		"www.nytimes.com": ["foxnews.com", "nationalreview.com", "wsj.com","nypost.com"],
		"www.cnn.com": ["foxnews.com", "nationalreview.com", "wsj.com","nypost.com"]
	}

	var get_site_title= {
		"foxnews.com": "Fox News",
		"nationalreview.com": "National Review",
		"wsj.com": "Wall Street Journal",
		"nypost.com": "New York Post"
	}

	function displayPopup(slug, event) {
		console.log('(displayPopup) this', this);
		
		var $popover = this;
		$children = $popover.children();
		$popover_content = $($children[2]).children();
		$popover_body = $($popover_content[1]);
		var sites = spectrum_sites[window.location.hostname];
		var site_promises = siteSearches(sites, slug);

		$.when.apply($, site_promises)
		.then(function() {
			var search_results = Array.prototype.slice.call(arguments);
			var popup = createPopup(search_results, slug);
			// add popup to page
			$popover_body.after(popup);
			createUrlEvents();
			createCollapseEvents();

			function createCollapseEvents() {
				$('.collapse-link').on('click', function(event) { 
					event.preventDefault();
					var $link = $(event.target);
					if($link.hasClass('fa-caret-down') || $link.hasClass('fa-caret-up')) $link = $link.parent();
					
					var cache = $link.data('cache');
					console.log('(createCollapseEvents:', cache);
					var $cache = $('#' + cache);
					console.log($cache);
					var caret_id = cache.replace("-collapse", "");
					var $caret = $('#span-' + caret_id);
					$cache.collapse('toggle');

					if($caret.hasClass('fa-caret-up')) $caret.addClass('fa-caret-down').removeClass('fa-caret-up');
					else $caret.addClass('fa-caret-up').removeClass('fa-caret-down');
				});
			}

			function createUrlEvents() {
				$('.popup-link').on('click', function(event) { 
					event.preventDefault();
					var $link = $(event.target);
					var href = $link.attr('href');
					window.open(href); 
				})
			}
		})

		function createPopup(search_results, slug) {
			var html = "<div style='margin:10px'><ul>";
			search_results.forEach(function(search_result) {
				if(search_result && search_result[0].items) html += "<li>" + item_template(search_result[0]["queries"]["request"][0]["siteSearch"], search_result[0].items[0], slug) + "</li>";
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

		function createItemHtml(site, link, title, description, date) {
			var site_id = site.replace(/\s/g, "");
			var random = Math.random() * 100;
			random = random.toString();
			if (date) date = " | " + date;
			else date = "";
			var html = 
				"<p><strong>" + site + "</strong></p>" +
				"<a class='collapse-link' data-toggle='collapse' data-cache='" + slug + "-" + site_id + "-collapse' href='javascript:void(0);'>" + title + "</a><span id='span-" + site_id + "' class='fa fa-caret-down'></span>" +
				"<div class='collapse' id='" + slug + "-" + site_id + "-collapse'>" + 
					"<div class='well'>" +
					"<h4><a class='popup-link' href='" + link + "'>" + "Read entire article</a>" +
					date +  
					"</h4>" +  
						"<p>" + description + "</p>" +
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
					
					if(item.pagemap.metatags && item.pagemap.metatags[0]["dc.description"]) description = item.pagemap.metatags[0]["dc.description"];
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
					if(item.pagemap.article && item.pagemap.article[0].headline) headline= item.pagemap.article[0].headline;
					else headline= item.title;

					/** Description **/
					if(item.pagemap.article && item.pagemap.article[0].articlebody) description = item.pagemap.article[0].articlebody;
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

				default: 
			}
			
			return { 
				site_title: site_title, 
				link: link, 
				headline: headline,
				description: description, 
				date: date 
			}
		}
	}
})
