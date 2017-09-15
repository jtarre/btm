export const siteConfigurations = {
	"nytimes.com": {
		spectrumSites: ["foxnews.com", "nationalreview.com", "wsj.com", "nypost.com"],
		title: "NY Times",
		whitelist: true,
		sections: ["world", "us", "business", "opinion", "technology", "health",
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
		]
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
		]
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
	}
}
