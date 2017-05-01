$(function() {

	$("a").popover({trigger: "manual",
					title: "Bridge the Media",
					html: "true",
					content: "<button class='google-search' href='javascript:void(0);'>Search for alternatives?</button> "})
				.on("mouseenter", popoverEnter)
	
	function popoverEnter () {
		_this = this;
		setTimeout(function () {
			if($(_this).is(':hover')) {
				$(_this).popover("show");
				var popover = $(_this).next();
				$(window).on('click', function () {
					event.preventDefault();
					if(!popover.is(':hover')) popover.popover('hide');
				 	});		
				$('.google-search').on('click', googleSearch.bind(_this))
			}
		}, 900);
	}

	/** accomplish without hover **/
	// we're going 
	var links = $("a");
	var urls = [];

	var opposite_news_sites = {
			"nytimes.com": ['fox_news', 'national_review', 'wsj'], 
			"cnn.com": '(site:breitbart.com or site:politico.com or site:nationalreview.com)'
		};

	var news_sites = {
		national_review: '(site:nationalreview.com) ', 
		wsj: '(site:online.wsj.com) ',
		fox_news: '(site:foxnews.com) '
	}


	function nationalReviewSearch(search) {
		var google_search = '(site:nationalreview.com) ' + search;
		var google_url ='https://www.googleapis.com/customsearch/v1?q=' + google_search + ' &cx=013013877924597244999%3Atbq0ixuctim&key=AIzaSyBS3sgS67eZkQRC_A7LZZG82AFeyBt8FW8';
		return $.ajax({
			type: 'get',
			url: google_url,
			dataType: 'json'
		})
	}

	function foxNewsSearch(search) {
		var google_search = '(site:foxnews.com) ' + search;
		var google_url ='https://www.googleapis.com/customsearch/v1?q=' + google_search + ' &cx=013013877924597244999%3Atbq0ixuctim&key=AIzaSyBS3sgS67eZkQRC_A7LZZG82AFeyBt8FW8';
		return $.ajax({
			type: 'get',
			url: google_url,
			dataType: 'json'
		})
	}

	function wsjSearch(search) {
		var google_search = '(site:wsj.com) ' + search;
		var google_url ='https://www.googleapis.com/customsearch/v1?q=' + google_search + ' &cx=013013877924597244999%3Atbq0ixuctim&key=AIzaSyBS3sgS67eZkQRC_A7LZZG82AFeyBt8FW8';
		return $.ajax({
			type: 'get',
			url: google_url,
			dataType: 'json'
		})
	}

	function nyPostSearch(search) {
		var google_search = '(site:nypost.com) ' + search;
		var google_url ='https://www.googleapis.com/customsearch/v1?q=' + google_search + ' &cx=013013877924597244999%3Atbq0ixuctim&key=AIzaSyBS3sgS67eZkQRC_A7LZZG82AFeyBt8FW8';
		return $.ajax({
			type: 'get',
			url: google_url,
			dataType: 'json'
		})
	}

	function googleSearch(event) {
		var $button = $(event.target);
		var $link = $button.parent().parent().prev()
		var href = $link.attr('href');
		var href_segments = href.split("/");
		var slug = href_segments[href_segments.length-1];
		
		slug = slug.split(".", 1);

		var national_review_search = nationalReviewSearch(slug);
		var wsj_search = wsjSearch(slug);
		var fox_news_search = foxNewsSearch(slug);
		var ny_post_search = nyPostSearch(slug);

		$.when(fox_news_search, national_review_search, wsj_search, ny_post_search)
		.then(function(fox_news_results, national_review_results, wsj_results, ny_post_results	) {
			if(fox_news_results == undefined && 
				national_review_results == undefined && 
				ny_post_results == undefined &&
				wsj_results == undefined) {
				$button.after('<p>No results. Try another link!</p>');
				return;
			}

			console.log('fn:', fox_news_results[0].items);
			console.log('nr:', national_review_results[0].items);
			console.log('nyp:', ny_post_results[0].items);
			console.log('wsj_results:', wsj_results[0].items);

			var popup = createNewsPopup(fox_news_results, national_review_results, wsj_results);
			$button.after(popup);
			createUrlEvents();
			createCollapseEvents();

			function createCollapseEvents() {
				$('.collapse-link').on('click', function(event) { 
					var $link = $(event.target);
					if($link.hasClass('caret')) $link = $link.parent();
					
					var cache = $link.data('cache');
					var $cache = $('#' + cache);
					$('#' + cache).collapse('toggle');
				});
			}

			function createUrlEvents() {
				$('.popup-link').on('click', function(event) { 
					var $link = $(event.target);
					var href = $link.attr('href');
					window.open(href); 
				})
			}

			function createNewsPopup(fox_news_results, national_review_results, wsj_results) {
					// args = search_results
				var html = "<div><ul>";
				if(fox_news_results[0].items) html += "<li>" + item_template_fox('Fox News', fox_news_results[0].items[0]) + "</li>";

				if(national_review_results[0].items) html += "<li>" + item_template_nat_review('National Review', national_review_results[0].items[0]) + "</li>";
				if(ny_post_results[0].items) html += "<li>" + item_template_ny_post('New York Post', ny_post_results[0].items[0]) + "</li>";
				if(wsj_results[0].items) html += "<li>" + item_template_wsj('Wall Street Journal', wsj_results[0].items[0]) + "</li>";
				html += "</ul></div>";
				
				return html;

				function item_template_fox(site_name, item) {
					var description;
					if(item.pagemap.metatags && item.pagemap.metatags[0]["dc.description"]) description = item.pagemap.metatags[0]["dc.description"];
					else description = item.snippet;
					var html = 
						"<p><strong>" + site_name + "</strong></br>" +
						"<a class='collapse-link' data-toggle='collapse' data-cache='fox-collapse' href='javascript:void(0);'>" + item.title + "<span class='caret'></span></p></a>" +
						"<div class='collapse' id='fox-collapse'>" + 
							"<div class='well'>" +
							"<h4><a class='popup-link' href='" + item.link + "'>" + "Read entire article</a></h4>" + 
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

					var html = 
						"<p><strong>" + site_name + "</strong></br>" +
						"<a class='collapse-link' data-toggle='collapse' data-cache='nat-review-collapse' href='javascript:void(0);'>" + headline + "<span class='caret'></span></p></a>" + 
						"<div class='collapse' id='nat-review-collapse'>" + 
							"<div class='well'>" +
							"<h4><a class='popup-link' href='" + item.link + "'>" + "Read entire article</a></h4>" + 
								"<p>" + articlebody + "</p>" +
							"</div>"+
						"</div>";
					return html;
				}

				function item_template_ny_post(site_name, item) {
					var description;
					if(item.pagemap.article && item.pagemap.metatags[0]["og:description"]) description = item.pagemap.metatags[0]["og:description"];
					else description = item.snippet;
					var html = 
						"<p><strong>" + site_name + "</strong></br>" +
						"<a class='collapse-link' data-toggle='collapse' data-cache='ny-post-collapse' href='javascript:void(0);'>" + item.title + "<span class='caret'></span></p></a>" + 
						"<div class='collapse' id='ny-post-collapse'>" + 
							"<div class='well'>" +
								"<h4><a class='popup-link' href='" + item.link + "'>" + "Read entire article</a></h4>" +
								"<p>" + description + "</p>"+ 
							"</div>"+
						"</div>";
					return html;
				}

				function item_template_wsj(site_name, item) {
					var description;
					if(item.pagemap.webpage && item.pagemap.webpage[0].description) description = item.pagemap.webpage[0].description;
					else description = item.snippet;
					var html = 
						"<p><strong>" + site_name + "</strong></br>" +
						"<a class='collapse-link' data-toggle='collapse' data-cache='wsj-collapse' href='javascript:void(0);'>" + item.title + "<span class='caret'></span></p></a>" + 
						"<div class='collapse' id='wsj-collapse'>" + 
							"<div class='well'>" +
								"<h4><a class='popup-link' href='" + item.link + "'>" + "Read entire article</a></h4>" + 
								"<p>" + description + "</p>" + 
							"</div>"+
						"</div>";
					return html;
				}
		// 		function createCollapseEvents() {
		// $('.collapse-link').on('click', function(event) { 
		// 	var $link = $(event.target);
		// 	var cacheId = $link.data('cache');
		// 	$('#' + cacheId).collapse('toggle');
		// })
	// }



// 				<button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
//   Button with data-target
// </button>
// <div class="collapse" id="collapseExample">
//   <div class="well">
//     ...
//   </div>
// </div>

				function item_template(site_name, item) {
					var headline;
					if(item.pagemap.article && item.pagemap.article.headline) headline = item.pagemap.article.headline;
					else headline = item.title;

					var html = 
						"<p><strong>" + site_name + "</a></strong></br>" +
						"<a class='collapse-link' href='" + item.link + "' >" + headline + "</p>";
						// "<a class='collapse-link' data-cache='" + item.cacheId + "' href='javascript:void(0);'>Read more...</a> | " + item.snippet + "</br></p>";
					return html;
				}
			}
		});
	}


		// var search = opposite_news_sites["nytimes.com"] + " " + slug;
		// var google_url ='https://www.googleapis.com/customsearch/v1?q=' + search + ' &cx=013013877924597244999%3Atbq0ixuctim&key=AIzaSyBS3sgS67eZkQRC_A7LZZG82AFeyBt8FW8';
		// $.ajax({
		// 	type: 'get',
		// 	url: google_url,
		// 	dataType: 'json'
		// })


		// .done(function(response) {
		// 	if(response.items) {
		// 		var items = response.items;
		// 		var popupHtml = createPopup(items);
		// 		$button.after(popupHtml);
		// 		createUrlEvents();
		// 	}
		// });
	
	function createPopup(items) {
			// args = search_results
			var html = "<div><ul>";
			for (var i = 0; i < 2; ++i) {
				html += "<li>" + item_template(items[i]) + "</li>"	;
			}
			html += "</ul></div>";
			return html;

			function item_template(item) {
				var html = 
					"<h4><a class='popup-link' href='http://" + item.displayLink + "' >" + item.pagemap.metatags[0]["og:site_name"] + ": " +
					"<a class='popup-link' href='" + item.link + "' >" + item.title + "</br>" +
					"<a class='popup-link' data-cache='" + item.cacheId + "' href='javascript:void(0);'>Read more...</a> | " + item.snippet + "</br></p>";
				return html;
			}
		}

	// links.each(function(index, link) {
			
	// 		var href = $(this).attr("href");
	// 		var article_segments;
	// 		var searchQuery;
	// 		var search;
	// 		var url;
	// 		// if(href && href.includes("nytimes.com")) {
	// 		// 	article_segments = href.split("/");
	// 		// 	if(article_segments[7] == "politics" || article_segments[6] == "world") {
	// 		// 		searchQuery = article_segments[8].replace(".html", "");
	// 		// 		var self = this;
	// 		// 		var search = opposite_news_sites["nytimes.com"] + " " + searchQuery;
	// 		// 		var google_url ='https://www.googleapis.com/customsearch/v1?q=' + search + ' &cx=013013877924597244999%3Atbq0ixuctim&key=AIzaSyBS3sgS67eZkQRC_A7LZZG82AFeyBt8FW8';
	// 		// 		urls.push({self: self, search: searchQuery, url: google_url});
	// 		// 	}
	// 		// }
			
	// });

});
