import { siteConfigurations } from './site-configs'

export default (publisher, item) => {
	const siteTitle = siteConfigurations[publisher]["title"];
	let link, headline, description, date;

	switch (publisher) {
		case "foxnews.com":
			link = item.link;
			headline = item.title;

			if (item && item.pagemap && item.pagemap.metatags) {
				description = item.pagemap.metatags[0]['dc.description'] || item.snippet;
				date = item.pagemap.metatags[0]['dc.date'] ? new Date(item.pagemap.metatags[0]['dc.date']).toDateString() : ''
			}
			break;

		case "nationalreview.com":
			link = item.link;

			/** headline**/
			if (item && item.pagemap && item.pagemap.article && item.pagemap.article[0].headline) headline = item.pagemap.article[0].headline;
			else headline = item.title;

			/** Description **/
			if (item && item.pagemap && item.pagemap.article && item.pagemap.article[0].articlebody) description = item.pagemap.article[0].articlebody;
			else description = item.snippet;

			/** Date **/
			if (item && item.pagemap && item.pagemap.article && item.pagemap.article[0].datepublished) {
				date = item.pagemap.article[0].datepublished;
				date = new Date(date);
				date = date.toDateString();
			}
			break;

		case "nypost.com":
			link = item.link;
			headline = item.title;
			/** Description **/
			if (item && item.pagemap && item.pagemap.metatags && item.pagemap.metatags[0]["og:description"]) description = item.pagemap.metatags[0]["og:description"];
			else description = item.snippet;

			/** Date **/
			if (item && item.pagemap && item.pagemap.metatags && item.pagemap.metatags[0]['article:published_time']) {
				date = item.pagemap.metatags[0]['article:published_time'];
				date = new Date(date);
				date = date.toDateString();
			}
			break;

		case "wsj.com":
			link = item.link;
			headline = item.title;

			/** Description **/
			if (item && item.pagemap && item.pagemap.webpage && item.pagemap.webpage[0].description) description = item.pagemap.webpage[0].description;
			else description = item.snippet;

			/** Date **/
			if (item && item.pagemap && item.pagemap.webpage && item.pagemap.webpage[0].datecreated) {
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
			if (item && item.pagemap && item.pagemap.newsarticle && item.pagemap.newsarticle[0].description) description = item.pagemap.newsarticle[0].description;
			else description = item.snippet;

			if (item && item.pagemap && item.pagemap.newsarticle && item.pagemap.newsarticle[0].datepublished) {
				date = item.pagemap.newsarticle[0].datepublished;
				date = new Date(date);
				date = date.toDateString();
			}
			break;
		case "vice.com":
			link = item.link;
			headline = item.title;
			if (item && item.pagemap && item.pagemap.metatags && item.pagemap.metatags[0]["og:description"]) description = item.pagemap.metatags[0]["og:description"];
			else description = item.snippet;
			break;
		case "slate.com":
			link = item.link;
			headline = item.title;
			if (item && item.pagemap && item.pagemap.metatags && item.pagemap.metatags[0]["og:description"]) description = item.pagemap.metatags[0]["og:description"];
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

	return {
		siteTitle,
		link,
		headline,
		description,
		date
	};
}
