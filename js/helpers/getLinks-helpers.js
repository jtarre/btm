/* ------ Helpers ------ */

export const checkIsArticleHead = (link) => (link.href && !link.href.includes('/comments/') && !link.href.includes('/video/') && $(link).parents('p').length === 0)

export const checkLinkSection = (url) => (url &&
	(url.includes("/world/") || url.includes("/us/") || url.includes("/politics/") || url.includes("/opinion/")) &&
	!url.includes("index.html") && !url.endsWith("#"))

export const checkIsProperSource = (link) => (link.href && (link.href.includes('nytimes.com') || link.href.includes('foxnews.com')));

const checkUndefinedDescendants = (descendants) => (descendants[0] === undefined)

// TODO: Revisit. This superfluously runs a forEach. Can we return true and exit the loop the moment we hit a true value?
const checkHasProperTextElements = (descendants) => {
	let result = false
	descendants.forEach(descendant => {
		const firstChild = descendant.childNodes[0]
			, nextSib = descendant.nextSibling;
		if (firstChild && firstChild['nodeName'] === '#text' && $(firstChild).parents('figcaption').length === 0) { result = true }
		if (nextSib && nextSib['nodeName'] === '#text' && descendant['nodeName'] !== "DIV" && $.trim(nextSib['textContent']) !== "") { result = true }
	})
	return result
}

export const checkDescendants = (descendants) =>
	(checkUndefinedDescendants(descendants) || checkHasProperTextElements(descendants))

/* ------ getLinks() ------ */

import _ from 'lodash';

export const getLinks = () => {
	const allLinks = $('a').not('.button').toArray()
		.filter(link => {
			const descendants = $(link).find('*').toArray();
			return link.href && checkIsArticleHead(link) && checkLinkSection(link.href) && checkDescendants(descendants)
		})
	return _.uniqBy(allLinks, link => link.href)
}
