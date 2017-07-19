export const getSlug = (href) => {
	const href_segments = href.split("/");
	let slug = '';
	slug = href_segments[href_segments.length-1];
	slug = slug.replace(/\d+/g, "");
	slug = slug.split(".", 1);
	slug = slug[0];
	return slug;
}

import { cipher, key } from '../../secrets.js'

const crypto = require('crypto-js')

export const searcher = '&key=' + require('crypto-js').AES.decrypt(cipher, key).toString(crypto.enc.Utf8)

export const spectrumSites = {
	"nytimes.com": ["foxnews.com", "nationalreview.com", "wsj.com", "nypost.com"],
	"cnn.com": ["thehill.com", "thefiscaltimes.com", "forbes.com", "economist.com"],
	"foxnews.com": ["theatlantic.com", "vice.com", "slate.com"],
	"politico.com": ["nypost.com", "foxnews.com", "washingtontimes.com"],
	"vox.com": ["nypost.com", "foxnews.com", "washingtontimes.com"],
	"nbcnews.com": ["nypost.com", "foxnews.com", "washingtontimes.com"]
}

export const siteTitles = {
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
	"telegraph.co.uk": "The Telegraph",
	"nytimes.com": "NY Times"
}

const getPopupDetails = (publisher, item) => {
	var site_title = siteTitles[publisher];
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
			break;
		case "slate.com":
			link = item.link;
			headline = item.title;
			if(item && item.pagemap && item.pagemap.metatags && item.pagemap.metatags[0]["og:description"]) description = item.pagemap.metatags[0]["og:description"];
			else description = item.snippet;
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

const itemTemplate = (publisher, item, slug) => {

	var popup_details = getPopupDetails(publisher, item);
	return createItemHtml(popup_details.site_title,
		popup_details.link,
		popup_details.headline,
		popup_details.description,
		popup_details.date, slug);
}

const createItemHtml = (site, link, title, description, date, slug) => {
	var html;
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
	if (title == undefined || description == undefined){
		html =
			"<p style='" + html_style + "'><strong style='font-family: PT Serif, serif;'>" + site + date + "</strong></br>" +
			"<a style='" + anchor_style + "'>No Results</a></p>";
	}
	else {
		html =
		"<p style='" + html_style + "'><strong style='font-family: PT Serif, serif;'>" + site + date + "</strong></br>" +
		"<a style='" + anchor_style + "' class='collapse-link' data-toggle='collapse' data-cache='" + cache + "' href='javascript:void(0);'>" + title + "</a></p>" +
		"<div class='collapse' id='" + slug + "-" + site_id + "-collapse'>" +
			"<div class='well'>" +
			"<h4 style='font-family: PT Serif, serif;color:black;font-size:12px' +><a class='popup-link' target='_blank' href='" + link + "'>" + "Read entire article</a>" +
			"</h4>" +
				"<p style='font-family: PT Serif, serif;color:black;font-size:12px' +>" + description + "</p>" +
			"</div>"+
		"</div>";
	}
	return html;
}

// css and html for each news snippet
export const createPopup = (search_results, slug, style_addition) => {
	if (!style_addition) style_addition = "";

	var html = "<div style='margin:10px;font-family: Helvetica Neue, Helvetica, Arial, sans-serif;" + style_addition + "'><ul class='list-unstyled'>";

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

	search_results.forEach((search_result) => {
		var result;
		if (search_result !== undefined){
			var result = search_result;
			var site = result["queries"]["request"][0]["siteSearch"];
			var item = result.items !== undefined ? result.items[0]: "";
		}

		if (result) {
			html += "<li style='font-family: Helvetica Neue, Helvetica, Arial, sans-serif;'>" + itemTemplate(site, item, slug) + "</li>";
		} else {
			site_title = siteTitles[site];

			html += "<li><p style='" + html_style + "'><strong style='font-family: PT Serif;color:black;font-size:12px'>" + site_title + "</strong></br><span style='font-family: PT Serif;color:black;font-size:12px'>No Results</span></li>"
		}
	});
	html += "<ul></div>";
	return html;
}

export const openArticleLink = (event, originUrl, domain, pathname) => {
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

export const siteSearches = (sites, slug) => {
	return sites.map(function(site) {
		var site_ajax = siteSearch(site, slug);
		return site_ajax;
	})
}

const siteSearch = (site, search) => {
	var google_url = 'https://www.googleapis.com/customsearch/v1?q=' + search + ' &cx=013013877924597244999%3Atbq0ixuctim&dateRestrict=m[7]&siteSearch=' + site + searcher;
	return $.ajax({
		type: 'get',
		url: google_url,
		dataType: 'json'
	})
}
