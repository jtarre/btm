import { siteConfigurations } from './site-configs'
import { getHostname } from './site-constants'
import { getFacebookLinks, getLinks, getSitesSections } from './getLinks-helpers'
import { drawIcons } from './embed-helpers'

export const isSectionPage = (url) => {
	console.log(url);
	const hostname = getHostname(url)
	if (hostname.includes("facebook.com")) {
		return true
	}
	return siteConfigurations[hostname].sectionPages
		.filter(sectionPage => url.endsWith(`${hostname}${sectionPage}`)).length > 0
}

const seenLinks = {}
	, startTime = new Date()

const sitesSectionsFilter = (links, siteSections) => {
	let sections
	let hostname
	let siteSection
	const validLinks = links.filter((link, index) => {
		hostname = getHostname(link.href)
		sections = siteConfigurations[hostname].sections
		siteSection = siteSections[index]
		if (sections.includes(siteSection.toLowerCase())) {
			seenLinks[link.href] = true
			return true
		}
		return false
	})
	return validLinks
}


export const embedIcons = (url) => {
	const hostname = getHostname(url)
	let links = hostname.includes("facebook.com") ? getFacebookLinks(seenLinks) : getLinks(seenLinks)
	links = links.filter(link => !isSectionPage(link.href))
	let siteSections = getSitesSections(links)
	links = sitesSectionsFilter(links, siteSections)
	drawIcons(links, hostname, startTime)
}
