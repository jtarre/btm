export const getSlug = (href, domain) => {
	const hrefSegments = href.split('/');
	let slug = '';
	switch (domain) {
		case 'nytimes.com':
			slug = hrefSegments[hrefSegments.length - 1].replace(/\d+/g, '').split('.', 1)[0];
			break;
		case 'cnn.com':
			if (hrefSegments[hrefSegments.length - 1] === 'index.html') {
				slug = hrefSegments[hrefSegments.length - 2].split('.', 1)[0];
			}
			break;
		case 'foxnews.com':
			slug = hrefSegments[hrefSegments.length - 1].replace(/\d+/g, '').split('.', 1)[0];
			break;
		default:
			break;
	}
	return slug;
}

const banana = 'CRQkZe76Sgs3SBySazIA'
		, chipmunk = 'A7LZZG82AFeyBt8FW8'

export const searcher = `&key=${banana.split('').reverse().join().replace(/,/g, '')}_${chipmunk}`

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
