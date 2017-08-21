import getPopupDetails from './getPopupDetails'

const { Tagger, Lexer } = require('pos')
	, allowedPOSTags = ["NN", "NNP", "NNPS", "NNS", "JJ"];

const extractWordsWithAllowedPOSTags = (slug) => {
	const spaces = slug.split("-").join(" ")
		, words = new Lexer().lex(spaces)
		, tagger = new Tagger();
	return tagger.tag(words).filter(word => (allowedPOSTags.indexOf(word[1]) > -1)).map(word => word[0]).join("-");
}

export const getSlug = (href) => {
	const hrefSegments = href.split("/")
		, slug = hrefSegments[hrefSegments.length - 1].replace(/\d+/g, "").split(".", 1)[0];
	return extractWordsWithAllowedPOSTags(slug);
}

const banana = 'CRQkZe76Sgs3SBySazIA'
	, chipmunk = 'A7LZZG82AFeyBt8FW8'

const searcher = `&key=${banana.split('').reverse().join().replace(/,/g, '')}_${chipmunk}`

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

const createItemHtml = (site, link, title, description, date, slug) => {
	const siteName = site.replace(/\s/g, "")
		, dateString = date ? ` | ${date}` : ' | date unavailable'
		, cache = `${slug}-${siteName}-collapse`
	if (!title || !description) {
		return (`<p class="btm-site-header">
				<strong style='font-family: PT Serif, serif; font-weight: bold'>${site}${dateString}</strong>
				</br>
				<a class="btm-anchor">No Results</a>
			</p>`)
	}
	return (`<p class="btm-site-header">
				<strong style='font-family: PT Serif, serif; font-weight: bold'>${site}${dateString}</strong>
				</br>
				<a class='collapse-link btm-anchor' data-toggle='collapse' data-cache="${cache}">
					${title}
					<span id="btm-span-${cache}" class='fa fa-caret-down' style="font-family: FontAwesome; margin-left: 0.5em;"></span>
				</a>
			</p>
			<div class='collapse' id='${slug}-${siteName}-collapse'>
				<div class='well'>
					<h4 class="btm-anchor">
						<a class='popup-link' target='_blank' href='${link}'>Read entire article</a>
					</h4>
					<p class="btm-anchor">${description}</p>
				</div>
			</div>`)
}

const itemTemplate = (publisher, item, slug) => {
	const { siteTitle, link, headline, description, date } = getPopupDetails(publisher, item);
	return createItemHtml(siteTitle, link, headline, description, date, slug);
}

export const createPopup = (results, slug) => {
	let html = `<div class="btm-popover-body"><ul class='list-unstyled collapse in' id="ul-${slug}">`;
	results.forEach(result => {
		const site = result["queries"]["request"][0]["siteSearch"];
		if (result.items) {
			const item = result.items[0]
			html += `<li style='font-family: Helvetica Neue, Helvetica, Arial, sans-serif;'>${itemTemplate(site, item, slug)}</li>`
		} else {
			html += `<li><p class="btm-result"><strong class="btm-anchor">${siteTitles[site]}</strong></br><span class="btm-anchor">No Results</span></li>`
		}
	});
	return `${html}</ul></div>`;
}

const siteSearch = (site, slug) => $.ajax({
	type: 'get',
	url: `https://www.googleapis.com/customsearch/v1?q=${slug}&cx=013013877924597244999%3Atbq0ixuctim&dateRestrict=m[7]&siteSearch=${site}${searcher}`,
	dataType: 'json'
})

export const siteSearches = (sites, slug) => sites.map(site => siteSearch(site, slug))

export const getPublisher = (url) => url.substring(url.indexOf("www.") + 4, url.indexOf(".com") + 4)
