/* ------ Helpers ------ */
import uniqBy from 'lodash.uniqby'
import { siteConfigurations } from './site-configs'
import { getHostname } from './site-constants'

export const checkIsArticleHead = (link) => (link.href &&
	!link.href.includes('/comments/') &&
	!link.href.includes('/video/') &&
	$(link).parents('p').length === 0)


export const checkIsProperSource = (link) => link.href !== undefined &&
		siteConfigurations[getHostname(link.href)] !== undefined

const checkUndefinedDescendants = (descendants) => (descendants[0] === undefined)

// TODO: Revisit. This superfluously runs a forEach
const checkHasProperTextElements = (descendants) => {
	let result = false
	descendants.forEach(descendant => {
		const firstChild = descendant.childNodes[0]
			, nextSib = descendant.nextSibling
		if (firstChild && firstChild.nodeName === '#text' && $(firstChild).parents('figcaption').length === 0) { result = true }
		if (nextSib && nextSib.nodeName === '#text' && descendant.nodeName !== "DIV" && $.trim(nextSib.textContent) !== "") { result = true }
	})
	return result
}

export const checkDescendants = (descendants) =>
	(checkUndefinedDescendants(descendants) || checkHasProperTextElements(descendants))

const linkAlreadySeen = (hrefs, link) => {
		Object.prototype.hasOwnProperty.call(hrefs, link.href)
	}

// TODO: Revisit this once backend is setup
const getSiteSection = (url, hostname) => {
	let sections = siteConfigurations[hostname].sections
	for (let section of sections){
		if (url.includes(`/${section}/`)){
			return section
		}
	}
	return "N/A"
}

export const getSitesSections = (urls) => {
	let hostname
	return urls.map((url) => {
		hostname = getHostname(url.href)
		return getSiteSection(url.href, hostname)
	})
}
/* ------ getLinks() ------ */

export const getLinks = (hrefs) => {
	const links = $('a').not('.button').toArray()
		.filter(link => {
			const descendants = $(link).find('*').toArray()
			return link.href && checkIsArticleHead(link) &&
				checkDescendants(descendants) &&
				!linkAlreadySeen(hrefs, link)
		})
	return uniqBy(links, link => link.href)
}

export const getFacebookLinks = (hrefs) => {
	const links = $('a').toArray()
		.filter(link => link.href && !linkAlreadySeen(hrefs, link) &&
			checkIsProperSource(link) &&
			checkIsArticleHead(link))
	return uniqBy(links, link => link.href)
}
