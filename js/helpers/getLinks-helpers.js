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

export const getSitesSections = (urls) => {
	let hostname
	let sections
	const request = urls.map((url) => {
		hostname = getHostname(url.href)
		return {"url": url.href,
			"selector": siteConfigurations[hostname].selector,
			"attribute": siteConfigurations[hostname].attribute}
	})
	$.ajax({
		type: 'post',
		url: 'https://bridge-the-media.herokuapp.com/article-sections',
		data: {"articles": request},
		dataType: 'json',
		success: function(results) { sections = results }
	})
	return sections
}
/* ------ getLinks() ------ */

export const getLinks = () => {
	const links = $('a').not('.button').toArray()
		.filter(link => {
			const descendants = $(link).find('*').toArray()
			return link.href && checkIsArticleHead(link) &&
				checkDescendants(descendants)
		})
	return uniqBy(links, link => link.href)
}

export const getFacebookLinks = () => {
	const links = $('a').toArray()
		.filter(link => link.href &&
			checkIsProperSource(link) &&
			checkIsArticleHead(link))
	return uniqBy(links, link => link.href)
}
