import { siteConfigurations } from './site-configs'
import { getHostname, createPopup, siteSearches, getSlug } from './site-constants'
import { getLoading, getArticlePagePopover } from './inline-elements'
import { openArticleLink, toggleSummary } from './embed-helpers'

export const isValidArticle = (url) => {
	const hostname = getHostname(url)
	const selector = siteConfigurations[hostname].selector
	const attribute = siteConfigurations[hostname].attribute
	const sections = siteConfigurations[hostname].sections
	const shouldWhiteList = siteConfigurations[hostname].whitelist
	const sectionInDocument = $(selector).attr(attribute).toLowerCase()
	return ((shouldWhiteList && sections.indexOf(sectionInDocument > -1)) ||
		(!shouldWhiteList && sections.indexOf(sectionInDocument) === -1))
}

export const initPageHover = (url) => {
	const hostname = getHostname(url)
		, slug = getSlug(url)
		, source = siteConfigurations[hostname].title
		, startTime = new Date()
		, side = 'right'
		, btmIcon = chrome.runtime.getURL('assets/btm_logo.png')
		, btmBg = chrome.runtime.getURL('assets/header-bg.svg')

	$('body').append($(getArticlePagePopover(slug, side, btmBg, btmIcon)))
	$('.btm-close').on('click', () => {
		$('.btm-popover').fadeOut()
	})
	$('.hide-alts').on('click', (event) => {
			const popoverSlug = $(event.target).attr('data-slug')
			$(`#ul-${popoverSlug}`).collapse('toggle')
			$('.btm-article-popover-body').removeClass('visible')
			$('.hide-alts').removeClass('visible')
			$('.btm-head').removeClass('visible')
			$('.show-alts').addClass('visible')
		})
		$('.show-alts').on('click', (event) => {
			const popoverSlug = $(event.target).attr('data-slug')
			$('.show-alts').removeClass('visible')
			$('.btm-head').addClass('visible')
			$('.btm-article-popover-body').addClass('visible')
			chrome.runtime.sendMessage({
				source,
				type: "Show Alternatives Click"
			})
			if ($(`#ul-${popoverSlug}`).length) {
				$(`#ul-${popoverSlug}`).collapse('toggle')
				$('.hide-alts').addClass('visible')
			} else {
				$(getLoading(slug)).insertBefore($('.hide-alts'))
				Promise.all(siteSearches(siteConfigurations[hostname].spectrumSites, slug))
					.then(results => {
						$('.btm-loading').fadeOut()
						$('.hide-alts').addClass('visible')
						$(createPopup(results, slug)).insertBefore($('.hide-alts'))
						$('.collapse-link').on('click', toggleSummary);
						$('.popup-link').on('click', (evt) => openArticleLink(evt, window.location, startTime));
					})
				}
			});
	}
