import { siteConfigurations } from './site-configs'
import { getHostname } from './site-constants'
import { getFacebookLinks, getLinks, getSitesSections } from './getLinks-helpers'
import { drawIcons } from './embed-helpers'

export const isSectionPage = (url) => {
	const hostname = getHostname(url)
	if (hostname.includes("facebook.com")) {
		return true
	}

	if (siteConfigurations[hostname].sectionPages !== undefined){
		return siteConfigurations[hostname].sectionPages
			.filter(sectionPage => url.endsWith(`${hostname}${sectionPage}`)).length > 0
	}
	return false
}

const seenLinks = {}
	, startTime = new Date()

const sitesSectionsFilter = (links, siteSections) => {
	let sections
	let hostname
	let siteSection
	let shouldWhiteList
	const validLinks = links.filter((link, index) => {
		hostname = getHostname(link.href)
		sections = siteConfigurations[hostname].sections
		siteSection = siteSections[index]
		shouldWhiteList = siteConfigurations[hostname].whitelist
		seenLinks[link.href] = true
		if ((sections.includes(siteSection.toLowerCase()) && shouldWhiteList) ||
				(!sections.includes(siteSection.toLowerCase()) && !shouldWhiteList))
				{
					return true
				}
		return false
	})
	return validLinks
}

const linkAlreadySeen = (hrefs, link) => {
	return Object.prototype.hasOwnProperty.call(hrefs, link.href)
}


export const embedIcons = (url) => {
	const hostname = getHostname(url)
	let postProcess
	let index
	let links = hostname.includes("facebook.com") ? getFacebookLinks() : getLinks()
	links = links.filter(link => siteConfigurations[getHostname(link.href)] !== undefined)
	.filter(link => !isSectionPage(link.href))
	.filter(link => !linkAlreadySeen(seenLinks, link))
	getSitesSections(links.slice(0, 100))
		.then(result => {
			const siteSections = result.article_sections.map(section => section.section)
				.map((section, index) => {
					section = section !== "" ? section : "N/A"
					postProcess = siteConfigurations[getHostname(result.article_sections[index].url)].postProcess
					return postProcess !== undefined && section !== "N/A" ? postProcess(section) : section
				})
			links = sitesSectionsFilter(links.slice(0, 100), siteSections)
			drawIcons(links, hostname, startTime)
		})
}
