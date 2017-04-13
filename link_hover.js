$(function() {
	console.log('loaded jquery stuff');
	

	var links = $("a");
	links.each(function(index, link) {
		// if(index < 50) console.log('link:', $(this).attr("href"));
		var href = $(this).attr("href");
		var article_segments;
		var searchQuery;
		if(href && href.includes("nytimes.com")) {
			// console.log($(this).attr("href"));
			article_segments = href.split("/");
			if(article_segments[7] == "politics") {
				searchQuery = article_segments[8].replace(".html", "");
				var self = this;
				google_search("nytimes.com", searchQuery, self);


				// $("<a href='#'><i class='fa fa-camera-retro fa-lg'></i></a>").insertAfter( $(this) );	
			}
		}
			
	})

	function createIcon(search) {

		var icon = '<a id="' + search + '" href="#"><i class="fa fa-camera-retro fa-lg"></i></a>';
		return icon;
	}

	function createPopup(items) {
			// args = search_results
			var html = "<div></div>";
			// for (var i = 0; i < items.length; ++i) {
			// 	html += item_template(items[i]);
			// }
			return html;

			function item_template(item) {
				var html = "<div class='modal'> " + 
					"<a href='" + item.site + "'>" + item.site_name + ": " +
					"<a href='" + item.article_link + "'>" + article_title + "</br>"
					"<a data-cache='" + item.cache_id + "' href='javascript:void(0);'>Read more... | " + item.article_description + "</br>"
					"div id='see-more-" + item.cache_id + "' class='row'>" + item.article_body + " </div>"
					// site: article title (link)
					// Read more | Article		
				"</div>";
			}
		}

	function createUnit(icon, popup) {
			console.log('unit', icon + popup);
			return $(icon);
	}
		

	function google_search(url, search, self) {
		var opposite_news_sites = {
			"nytimes.com": '(site:nationalreview.com)', 
			"cnn.com": '(site:breitbart.com or site:politico.com or site:nationalreview.com)'
		};

		var searchQuery = opposite_news_sites[url] + " " + search;

		var searchUrl ='https://www.googleapis.com/customsearch/v1?q=' + searchQuery + ' &cx=013013877924597244999%3Atbq0ixuctim&key=AIzaSyBS3sgS67eZkQRC_A7LZZG82AFeyBt8FW8';
		x = new XMLHttpRequest();

		x.open('GET', searchUrl);
		x.responseType = 'json';
		
		x.onload = function () {
			console.log("search:", searchQuery);
			if(x.response) {
				// console.log('items:', x.response.items);
				// var icon = createIcon(search);
				// console.log('icon html:', icon);
				// var popup = createPopup(x.response.items);
				// console.log('popup html:', popup);
				// var $unit = createUnit(icon, popup);
				// console.log('$unit', $unit);
				// $('<a href="#"><i class="fa fa-camera-retro fa-lg"></i></a>').insertAfter( $(self) );
				
				// var html = "<a data-search='" + search + "' class='btm-button' href='#'><i class='fa fa-camera-retro fa-lg'></i></a>";
				var html = "<button class='btm'>Hiii</button>"
				// var popup = "<div id='modal-" + search + "' class='modal'><div class='modal-content'><p>Test</p></div></div>";
	var popup =	'<div id="modal-"' + search + '" class="modal">' +

   '<!-- Modal content -->' +
  '<div class="modal-content">'
    '<span class="close">&times;</span>' +
    '<p>Some text in the Modal..</p>' +
  '</div>' + 

'</div>';
 var script = 
 "<script>"
	"$('.btm').on('click', function(event) {"+
"		console.log('test');" +
	"}) " +
	"</script>";
				var unit = html+popup+script;
				console.log('this', self, '$this', $(self), 'html:', unit);
				$(unit).insertAfter( $(self) );	
				return x.response;
			}
			return;
		}

		x.onerror = function() {
			console.log('error', x.response);

			return "error";
		}

		x.send()
	}

	// $("a").on("click", function(event) {
	// 	console.log("clicked");
	// })

	// $("a").mouseover(function(event) {
	// 	console.log("hovered over link");
	// })


	function manageModal(event) {
		event.preventDefault();
		console.log('manage modal');
		var search = $(this).data('search');
		$('#modal-' + search).toggle();

	}

});
