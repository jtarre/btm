import { initPageHover, isValidArticle } from './helpers/article-page'
import { isSectionPage, embedIcons } from './helpers/section-page'

import { initPageHover } from './helpers/article-page'

$(() => {
	const url = window.location.href
	$('head').append("<style>@import url('https://fonts.googleapis.com/css?family=Josefin+Sans');</style>")
	if (isSectionPage(url)) {
		setTimeout(embedIcons(url), 3000)
	} else if (isValidArticle(url)) {
		initPageHover(url)
})
