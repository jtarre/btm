export const siteConfigurations = {
	"nytimes.com": {
		spectrumSites: ["foxnews.com", "nationalreview.com", "wsj.com", "nypost.com"],
		title: "NY Times",
		whitelist: true,
		sections: ["world", "us", "u.s.", "business", "opinion", "technology", "health",
			"science", "upshot", "reader-center", "politics"],
		selector: 'meta[property=\"article:section\"]',
		attribute: "content",
		sectionPages: ["/section/world",
			"/section/us",
			"/section/politics",
			"/section/business",
			"/pages/opinion/index.html",
			"/section/technology",
			"/section/science",
			"/section/health",
			"/section/reader-center",
			"/section/upshot",
			"/",
			"/pages/world/index.html",
			"/pages/politics/index.html",
			"/pages/business/index.html",
			"/pages/technology/index.html",
			"/pages/health/index.html"
		],
		postProcess: undefined
	},
	"foxnews.com": {
		spectrumSites: ["theatlantic.com", "vice.com", "slate.com"],
		title: "Fox News",
		whitelist: true,
		sections: ["world", "us", "politics", "opinion", "tech", "health",
			"science", "markets", "features"],
		selector: 'meta[name=\"prism.section\"]',
		attribute: "content",
		sectionPages: ["/politics.html",
			"/us.html",
			"/opinion.html",
			"/tech.html",
			"/science.html",
			"/health.html",
			"/"
		],
		postProcess: undefined
	},
	"npr.org":{
		title: "NPR",
		spectrumSites: ["economist.com", "thehill.com"],
		whitelist: true,
		sections: ["international", "politics", "business", "america", "the two-way",
			"code switch podcast", "technology", "around the nation", "npr ed"],
		selector: "header.contentheader",
		attribute: "data-metrics",
		sectionPages: [
			"/",
			"",
			"/sections/news/",
			"/sections/us/",
			"/sections/politics/",
			"/sections/business/",
			"/sections/impact-of-war/",
			"/sections/investigations/",
			"/sections/national-security/",
			"/sections/technology/",
			"/sections/health/",
			"/sections/thetwo-way/"
		],
		postProcess: (section) => {
			if (section === "{\"category\":null}"){
				return "N/A"
			}
			return JSON.parse(section.replace(/"/g, "\"")).category
		}
	},
	"nationalreview.com": {
		title: "National Review"
	},
	"wsj.com": {
		title: "Wall Street Journal"
	},
	"nypost.com": {
		title: "New York Post"
	},
	"theatlantic.com": {
		title: "The Atlantic"
	},
	"vice.com": {
		title: "Vice"
	},
	"slate.com": {
		title: "Slate"
	},
	"economist.com": {
		title: "The Economist",
		getPopupDetails: (item) => {
			try {
				return {
					description: item.pagemap.metatags[0]["og:description"],
					date: item.snippet.split(" ... ")[0]
				}
			} catch (e) {
					return {}
				}
		}
	},
	"thehill.com": {
		title: "The Hill",
		getPopupDetails: (item) => {
			try {
				return {
					description: item.pagemap.metatags[0]["dcterms.description"],
					date: new Date(item.pagemap.metatags[0]["dcterms.date"]).toDateString()
				}
			} catch (e) {
					return {}
				}
			}
		}
	}
