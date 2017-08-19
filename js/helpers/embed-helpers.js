import { getPopoverHtml, getPopoverTitle, getLoading } from './inline-elements'
import { siteSearches, spectrumSites, createPopup } from './site-constants'

export const getPopoverSide = (iconOffset) => {
	const distFromRight = $(window).width() - iconOffset.left
	return (distFromRight < 350) ? "left" : "right"
}

export const reposition = (slug, side) => {
	const iconOffset = $(`#btm-icon-${slug}`).offset()
		, newOffset = Object.assign({}, iconOffset);
	newOffset.top -= 20;
	if (side === 'right') {
		newOffset.left += 40;
	} else {
		const oldLeft = $(`[data-slug='${slug}']`).offset().left;
		newOffset.left = oldLeft - 20;
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

export const toggleSummary = (event) => {
	event.preventDefault();
	let $link = $(event.target);
	if ($link.hasClass('fa-caret-down') || $link.hasClass('fa-caret-up')) {
		$link = $link.parent();
	}
	const cache = $link.data('cache')
		, $cache = $(`#${cache}`)
		, $caret = $(`#btm-span-${cache}`).attr("style", "font-family: FontAwesome; margin-left: 0.5em");
	$cache.collapse('toggle');
	if ($caret.hasClass('fa-caret-up')) {
		$caret.addClass('fa-caret-down').removeClass('fa-caret-up')
	} else {
		$caret.addClass('fa-caret-up').removeClass('fa-caret-down')
	}
}

export const placePopover = (side, $btmButton, slug, btmBg, btmIcon, source, publisher, startTime) => {
	$btmButton.popover({
		trigger: "click",
		container: "body",
		html: "true",
		template: getPopoverHtml(slug, side),
		placement: side,
		title: getPopoverTitle(btmBg, btmIcon),
		content: getLoading(slug)
	})
	function initPopover() {
		$('.btm-close').on('click', () => { $btmButton.popover('hide') });
		Promise.all(siteSearches(spectrumSites[publisher], slug))
			.then(results => {
				$(`#btm-loading-${slug}`).hide();
				$(`#btm-popover-body-${slug}`).after(createPopup(results, slug));
				reposition(slug, side);
				$('.collapse-link').on('click', toggleSummary);
				$('.popup-link').on('click', (event) => openArticleLink(event, source, startTime));
			})
		chrome.runtime.sendMessage({
			source,
			type: "BTM Icon Click"
		});
	}
	$btmButton.on('shown.bs.popover', () => initPopover());
}
