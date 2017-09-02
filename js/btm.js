import { initPageHover, isValidArticle } from './helpers/article-page'
import { isSectionPage, embedIcons } from './helpers/section-page'

$(() => {
	const url = window.location.href
	$('head').append("<style>@import url('https://fonts.googleapis.com/css?family=Josefin+Sans');</style>")
	if (isSectionPage(url)) {
		embedIcons(url)
	} else if (isValidArticle(url)) {
		initPageHover(url)
	}
})
