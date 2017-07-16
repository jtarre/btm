import { cipher, key } from '../../secrets.js'

const crypto = require('crypto-js')

export const searcher = '&key=' + crypto.AES.decrypt(cipher, key).toString(crypto.enc.Utf8)

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
