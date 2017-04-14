$(function() {
	console.log('loaded jquery stuff');
	$("a").on("click", function(event) {
		console.log("clicked");
	})

	$("a").mouseover(function(event) {
		console.log("hovered over link");
	})	

	var links = $("a");
	
	var urls = [];
	var opposite_news_sites = {
			"nytimes.com": '(site:nationalreview.com)', 
			"cnn.com": '(site:breitbart.com or site:politico.com or site:nationalreview.com)'
		};
	links.each(function(index, link) {
		// if(index < 50) console.log('link:', $(this).attr("href"));
			// console.log('link:', link);
			var href = $(this).attr("href");

			var article_segments;
			var searchQuery;
			var search;
			var url;
			if(href && href.includes("nytimes.com")) {
				// console.log($(this).attr("href"));
				article_segments = href.split("/");
				if(article_segments[7] == "politics" || article_segments[6] == "world") {
					searchQuery = article_segments[8].replace(".html", "");
					var self = this;
					var search = opposite_news_sites["nytimes.com"] + " " + searchQuery;
					var google_url ='https://www.googleapis.com/customsearch/v1?q=' + search + ' &cx=013013877924597244999%3Atbq0ixuctim&key=AIzaSyBS3sgS67eZkQRC_A7LZZG82AFeyBt8FW8';
					urls.push({self: self, search: searchQuery, url: google_url});
					 // google_search("nytimes.com", searchQuery, self); 
				}
			}
			
	});
	// console.log('urls:', urls);
	for(var i = 0; i < urls.length; ++i) {
		(function (lockedIndex) {
			$.ajax({
				type: 'get',
				url: urls[lockedIndex]["url"],
				dataType: 'json'
			})

			.done(function(response) {
				// console.log('search: ', urls[lockedIndex]["search"], 'response pre if:', response);
				if(response.items) {
					var items = response.items.slice();
					var links = createPopup(items);
					// console.log('search query', searchQuery, 'items:');
					var html = "<button id='" + urls[lockedIndex]["search"] + "' data-search='" + urls[lockedIndex]["search"] + "' class='btm' >BTM</button>";
					var popup =	'<div id="modal-' + urls[lockedIndex]["search"] + '" class="modal">' +
					   '<!-- Modal content -->' +
					  '<div class="modal-content">' + 
					    '<span id="close-modal-' + urls[lockedIndex]["search"] + '" data-search="' + urls[lockedIndex]["search"] + '"class="close" style="color:#aaaaaa; float: right; font-size: 28px; font-weight: bold">&times;</span>' +
					    links +
					  '</div>' + 
					'</div>';
					var unit = html+popup;
					// console.log('this', self, '$this', $(self), 'html:', unit);
					// $(unit).after( $(urls[lockedIndex]["self"]) );
					console.log($(urls[lockedIndex]["self"]));
					$(urls[lockedIndex]["self"]).after(unit);	
					$('#' + urls[lockedIndex]["search"]).on('click', openModal);
					$('#close-modal-' + urls[lockedIndex]["search"]).on('click', closeModal);
				}
			});
		})(i);
	}

	function createPopup(items_cp) {
			// args = search_results
			var items = items_cp.slice();
			var html = "<div><ul>";
			for (var i = 0; i < 4; ++i) {
				html += item_template(items[i]);
			}
			html += "</ul></div>";
			return html;

			function item_template(item) {
				// return "<li><a href='" + item.displayLink + "'>" + item.displayLink + "</a></li>";
				var html = "<div class='link'> " + 
					"<a href='" + item.displayLink + "'>" + item.pagemap.metatags[0]["og:site_name"] + ": " +
					"<a href='" + item.link + "'>" + item.title + "</br>" +
					"<a data-cache='" + item.cacheId + "' href='javascript:void(0);'>Read more...</a> | " + item.snippet + "</br></p>";
				return html;
			}
		}

		function openModal(event) {
			event.preventDefault();
			var search = $(this).data('search');
			var modal = document.getElementById('modal-' + search);
			modal.style.display = "inline-	block";
			window.onclick = function(event) {
			    if (event.target == modal) {
			        modal.style.display = "none";
			    }
			}
		}

		function closeModal(event) {
			event.preventDefault();
			// console.log('close modal');
			var search = $(this).data('search');
			var modal = document.getElementById('modal-' + search);
			modal.style.display = "none";
		}
});
