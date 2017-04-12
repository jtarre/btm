$(function() {
	console.log('loaded jquery stuff');
	$("a").on("click", function(event) {
		console.log("clicked");
	})

	$("a").mouseover(function(event) {
		console.log("hovered over link");
	})

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
				google_search("nytimes.com", searchQuery);
				// get results of google search
				// add to html popup
				// this is like a react jsx situation
				// not really
				// just need to create the skeleton of the div
				// would be helpful to have a promise to continue control flow out here
				// otherwise, google_search is asynchronous
				$("<a href='#'><i class='fa fa-camera-retro fa-lg'></i></a>").insertAfter( $(this) );	
			}
		}
			
	})

	function createPopup(args) {
		// args = search_results
		var html = "<div></div>";
		return html;
	}

	/** next stage: attaching modal / popup to camera **/
	// how to
	// within the links each loop 
	// i have to search google (i already do)
	// get the query back, 
	// and display within a pop up
	// i have to add the pop up as html to the font awesome
	// also, have to have it work for the hover

	/** don't think about the results, just do your job like you know how to do **/

	function google_search(url, search) {
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
			console.log("search:", searchQuery, "response:", x.response);
			if(x.response) {
				console.log('items:', x.response.items);
				return x.response;
			}
			// console.log(x.response.items);
			return;
		}

		x.onerror = function() {
			console.error('request error');
			return "error";
		}

		x.send()
	}
});
