$(function() {
	
	console.log('url:', window.location.href);


	if(chrome && chrome.runtime && chrome.runtime.onUpdateAvailble) {
		chrome.runtime.onUpdateAvailable.addListener(function(details) {
		  console.log("updating to version " + details.version);
		  chrome.runtime.reload();
		});
	}


	var popover_style = 
  "position: absolute;" +
  "top: 0;" +
  "left: 0;" +
  "z-index: 1060;" +
  "display: none;" +
  "max-width: 276px;" +
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
	"border-color: #2e6da4;";

	
	$("a").popover({trigger: "manual",
					title: "Bridge the Media",
					html: "true",
					container: "body"
					content: "<button class='google-search' href='javascript:void(0);'>Search for alternatives?</button> "})
				.on("mouseenter", popoverEnter)
	function popoverEnter () {
		_this = this;
		console.log('popover enter');
		setTimeout(function () {
			if($(_this).is(':hover')) {
				$(_this).popover("show");
				var popover = $(_this).next();
				$(window).on('click', function (event) {
					// event.preventDefault();
					console.log('hover');
					if(!popover.is(':hover')) popover.popover('hide');
				 	});		
				$('.google-search').on('click', googleSearch.bind(_this))
			}
		}, 900);
	}

	function siteSearch(site, search) {
		var google_url ='https://www.googleapis.com/customsearch/v1?q=' + search + ' &cx=013013877924597244999%3Atbq0ixuctim&dateRestrict=m[7]&siteSearch=' + site + '&fields=items&key=AIzaSyBS3sgS67eZkQRC_A7LZZG82AFeyBt8FW8';
		return $.ajax({
			type: 'get',
			url: google_url,
			dataType: 'json'
		})
	}

	function googleSearch(event) {
		
		/** nytimes specific **/
		var $button = $(event.target);

		var $link; 
		if(window.location.href.includes("nytimes")) $link = $button.parent().parent().prev();
		if(window.location.href.includes("nbcnews")) $link = $button.parent().parent().prev();
		if(window.location.href.includes("cnn")) $link = $button.parent().parent().prev();
		

		var href = $link.attr('href');
		var href_segments = href.split("/");
		var slug = href_segments[href_segments.length-1];
		slug = slug.replace(/\d+/g, "");
		
		slug = slug.split(".", 1);
		slug = slug[0];

		var national_review_search = siteSearch('nationalreview.com', slug);
		var wsj_search = siteSearch('wsj.com', slug);
		var fox_news_search = siteSearch('foxnews.com', slug);
		var ny_post_search = siteSearch('nypost.com',slug);

		$.when(fox_news_search, national_review_search, wsj_search, ny_post_search)
		.then(function(fox_news_results, national_review_results, wsj_results, ny_post_results	) {
			if(fox_news_results == undefined && 
				national_review_results == undefined && 
				ny_post_results == undefined &&
				wsj_results == undefined) {
				$button.after('<p>No results. Try another link!</p>');
				return;
			}

			var popup = createNewsPopup(fox_news_results, national_review_results, wsj_results, ny_post_results);
			$button.after(popup);
			createUrlEvents();
			createCollapseEvents();

			console.log(ny_post_results);

			function createCollapseEvents() {
				$('.collapse-link').on('click', function(event) { 
					var $link = $(event.target);
					if($link.hasClass('fa-caret-down') || $link.hasClass('fa-caret-up')) $link = $link.parent();
					
					var cache = $link.data('cache');
					var $cache = $('#' + cache);
					console.log('cache:', cache);
					var caret_id = cache.replace("-collapse", "");
					var $caret = $('#span-' + caret_id);
					console.log('caret', $caret);
					$cache.collapse('toggle');
					
					console.log('up: ', $caret.hasClass('fa-caret-up'), 'down:', $caret.hasClass('fa-caret-down'))

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
		});
	}

	// meant to be used with fun.call(this, args)
	function createNewsPopup(fox_news_results, national_review_results, wsj_results, ny_post_results) {
		// args = search_results

		var html = "<div><ul>";
		if(fox_news_results && fox_news_results[0].items) html += "<li>" + item_template_fox('Fox News', fox_news_results[0].items[0]) + "</li>";
		if(national_review_results && national_review_results[0].items) html += "<li>" + item_template_nat_review('National Review', national_review_results[0].items[0]) + "</li>";
		if(ny_post_results && ny_post_results[0].items) html += "<li>" + item_template_ny_post('New York Post', ny_post_results[0].items[0]) + "</li>";
		if(wsj_results && wsj_results[0].items) html += "<li>" + item_template_wsj('Wall Street Journal', wsj_results[0].items[0]) + "</li>";
		html += "</ul></div>";
		
		return html;
	}


	function item_template_fox(site_name, item) {
		var description;
		if(item.pagemap.metatags && item.pagemap.metatags[0]["dc.description"]) description = item.pagemap.metatags[0]["dc.description"];
		else description = item.snippet;
		var date;
		if(item && item.pagemap && item.pagemap.metatags && item.pagemap.metatags[0]['dc.date']) {
			date = item.pagemap.metatags[0]['dc.date'];
			date = new Date(date);
			date = date.toDateString();
		}
		return createItemHtml(site_name, item.link, item.title, description, date);
	}

	function compare_date(items, article_date, args) {

		for( var i = 0; i < args.length; ++i ) {
			if(!args[i]) return;
		}

		var compare_date = new Date("August 31 2017");
		var date = new Date(article_date);

	}

	function createItemHtml(site, link, title, description, date) {
		var site_id = site.replace(/\s/g, "");
		if (date) date = " | " + date;
		else date = "";
		console.log('site id: ', site_id);
		var html = 
			"<p><strong>" + site + "</strong></br>" +
			"<a class='collapse-link' data-toggle='collapse' data-cache='" + site_id + "-collapse' href='javascript:void(0);'>" + title + "<span id='span-" + site_id + "' class='fa fa-caret-down'></span></p></a>" +
			"<div class='collapse' id='" + site_id + "-collapse'>" + 
				"<div class='well'>" +
				"<h4><a class='popup-link' href='" + link + "'>" + "Read entire article</a>" +
				date +  
				"</h4>" +  
					"<p>" + description + "</p>" +
				"</div>"+
			"</div>";					
		return html;
	}

	function item_template_nat_review(site_name, item) {
		var headline;
		if(item.pagemap.article && item.pagemap.article[0].headline) headline = item.pagemap.article[0].headline;
		else headline = item.title;

		var articlebody;
		if(item.pagemap.article && item.pagemap.article[0].articlebody) articlebody = item.pagemap.article[0].articlebody;
		else articlebody = item.snippet;

		var date;
		if(item && item.pagemap && item.pagemap.article && item.pagemap.article[0].datepublished) {
			date = item.pagemap.article[0].datepublished;
			date = new Date(date);
			date = date.toDateString();
		}
		return createItemHtml(site_name, item.link, headline, articlebody, date);
	}

	function item_template_ny_post(site_name, item) {
		var description;
		if(item && item.pagemap && item.pagemap.metatags && item.pagemap.metatags[0]["og:description"]) description = item.pagemap.metatags[0]["og:description"];
		else description = item.snippet;

		var date;
		if(item && item.pagemap && item.pagemap.metatags && item.pagemap.metatags[0]['article:published_time']) {
			date = item.pagemap.metatags[0]['article:published_time'];
			date = new Date(date);
			date = date.toDateString();
		}
		return createItemHtml(site_name, item.link, item.title, description, date);
	}

	function item_template_wsj(site_name, item) {
		var description;
		if(item && item.pagemap && item.pagemap.webpage && item.pagemap.webpage[0].description) description = item.pagemap.webpage[0].description;
		else description = item.snippet;

		var date;
		if(item && item.pagemap && item.pagemap.webpage && item.pagemap.webpage[0].datecreated) {
			date = item.pagemap.webpage[0].datecreated;
			date = new Date(date);
			date = date.toDateString();
		} 
		return createItemHtml(site_name, item.link, item.title, description, date);
	}
});
