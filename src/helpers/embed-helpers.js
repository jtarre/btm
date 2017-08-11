export const openArticleLink = (event, source) => {
	event.preventDefault()
	const targetUrl = $(event.target).attr('href')
	chrome.runtime.sendMessage({
		targetUrl,
		type: 'Outbound Link Click',
		source,
		originUrl: window.location,
		elapsedTime: 0
	})
	window.open(targetUrl)
}

export const toggleArticles = (slug, event) => {
	function toggleVisible($container, $button) {
		chrome.runtime.sendMessage({
			source: window.location,
			type: "Show Alternatives Click"
		});
		$button.text('HIDE');
		$container.fadeIn();
	}
	function toggleInvisible($container, $button) {
		$button.text('SHOW ALTERNATIVES');
		$container.fadeOut();
	}
	if ($(`#btm-popover-body-${slug}:hidden`).length > 0)
		toggleVisible($(`#btm-popover-body-${slug}`), $(`#btm-btn-${slug}`));
	else
		toggleInvisible($(`#btm-popover-body-${slug}`), $(`#btm-btn-${slug}`));
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

