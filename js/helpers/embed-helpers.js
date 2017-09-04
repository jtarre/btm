import { getSlug, getHostname, siteSearches, createPopup } from './site-constants'
import { getPopoverHtml, getBTMIcon, getLoading, getPopoverTitle } from './inline-elements'
import { siteConfigurations } from './site-configs'

export const getPopoverSide = (iconOffset) => {
	const distFromRight = $(window).width() - iconOffset.left
	return (distFromRight < 350) ? "left" : "right"
}

export const reposition = (slug, side) => {
	const iconOffset = $(`#btm-icon-${slug}`).offset()
		, newOffset = Object.assign({}, iconOffset)
	newOffset.top -= 20
	if (side === 'right') {
		newOffset.left += 40
	} else {
		const oldLeft = $(`[data-slug='${slug}']`).offset().left
		newOffset.left = oldLeft - 20
	}
	$(`[data-slug='${slug}']`).offset(newOffset)
	$(`[data-slug='${slug}'].popover-content`).css("top", "0")
	$(`.btm-arrow.loading`).css("display", "inline-block")
}

export const openArticleLink = (event, source, startTime) => {
	event.preventDefault()
	const targetUrl = $(event.target).attr('href')
	chrome.runtime.sendMessage({
		targetUrl,
		type: 'Outbound Link Click',
		source,
		originUrl: window.location,
		elapsedTime: Math.round((new Date() - startTime) / 60000)
	})
	window.open(targetUrl)
}

export const placePopover = (side, $btmButton, slug, btmBg, btmIcon, source, hostnameOfLink, startTime) => {
	$btmButton.on('shown.bs.popover', () => {
		$('.btm-close').on('click', () => {
			$btmButton.popover('hide')
		})
		Promise.all(siteSearches(siteConfigurations[hostnameOfLink].spectrumSites, slug))
			.then(results => {
				$(`#btm-loading-${slug}`).hide()
				if ($(`.btm-popover-body`).length === 0) {
					$(`#btm-popover-body-${slug}`).after(createPopup(results, slug))
				}
				reposition(slug, side)
				$('.collapse-link').on('click', toggleSummary)
				$('.popup-link').on('click', (event) => openArticleLink(event, source, startTime))
			})
		chrome.runtime.sendMessage({
			source,
			type: "BTM Icon Click"
		})
	})
}

export const toggleSummary = (event) => {
	event.preventDefault()
	let $link = $(event.target)
	if ($link.hasClass('fa-caret-down') || $link.hasClass('fa-caret-up')) {
		$link = $link.parent()
	}
	const cache = $link.data('cache')
		, $cache = $(`#${cache}`)
		, $caret = $(`#btm-span-${cache}`).attr("style", "font-family: FontAwesome; margin-left: 0.5em")
	$cache.collapse('toggle');
	if ($caret.hasClass('fa-caret-up')) {
		$caret.addClass('fa-caret-down').removeClass('fa-caret-up')
	} else {
		$caret.addClass('fa-caret-up').removeClass('fa-caret-down')
	}
}

const placeBtmIcon = ($element, $btmIcon) => {
	if (window.location.hostname === "www.facebook.com") {
		const $postText = $element.closest('.fbUserPost').first().find('.userContent');
		$postText.first().append($btmIcon)
	} else if ($element.find('h2.headline a').toArray().length === 0) {
		if ($element.find('h2.headline').toArray().length > 0) {
			$btmIcon.appendTo($element.find('h2.headline').toArray()[0])
		} else if (!$element.next().is('a') && $element.attr('class') !== 'popup-link') {
			$btmIcon.insertAfter($element)
		}
	}
}

export const drawIcons = (links, hostname, startTime) => {
	const btmImg = chrome.runtime.getURL('assets/btm_logo.png')
		, btmBg = chrome.runtime.getURL('assets/header-bg.svg')
	const source = hostname.includes("facebook.com") ? "Facebook" : siteConfigurations[hostname].title

	links.forEach(link => {
		const $element = $(link)
			, href = $element.attr('href')
			, slug = getSlug(href)
			, $btmIcon = getBTMIcon(btmImg, slug)
			, hostnameOfLink = getHostname(href)

		let side

		placeBtmIcon($element, $btmIcon)

		side = getPopoverSide($btmIcon.offset())
		$btmIcon.popover({
			trigger: "click",
			container: "body",
			html: "true",
			template: getPopoverHtml(slug, side),
			placement: side,
			title: getPopoverTitle(btmBg, btmImg),
			content: getLoading(slug)
		})

		$('body').on('click', `a#btm-icon-${slug}.btm-icon`, (event) => {
				event.stopImmediatePropagation()
				placePopover(side, $btmIcon, slug, btmBg, btmImg, source, hostnameOfLink, startTime)
		})
	})
}
