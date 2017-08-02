import uniqBy from 'lodash.uniqby'

import { getPopoverHtml, getBTMIcon, getLoading, getPopoverTitle } from './helpers/inline-elements'

import { spectrumSites, siteTitles, getSlug, createPopup, siteSearches } from './helpers/site-constants'

import { checkIsArticle, checkLinkSection } from './helpers/getLinks-helpers'

import { toggleSummary } from './helpers/embed-helpers'

$(() => {
  const domain = window.location.hostname.split('www.')[1]
    , originTitle = siteTitles[domain] || domain
    , btmImg = chrome.runtime.getURL('icons/btm_logo.png')

  $('head').append("<style>@import url('https://fonts.googleapis.com/css?family=Josefin+Sans|PT+Serif');</style>")

  let hrefs = {}

  function checkFacebookLinks() {
    let $links = $('a').toArray().filter(link => link.href && !hrefs.hasOwnProperty(link.href) && link.href.includes('nytimes.com') && checkIsArticle(link) && checkLinkSection(link))

    $links = uniqBy($links, link => link.href) // filters out duplicates

    $links.forEach(element => { // this is for nytimes only. not general

      hrefs[element.href] = true;

      const $element = $(element)
        , href = $element.attr('href')
        , slug = getSlug(href)
        , $newsfeed_post = $element.closest('.fbUserContent').first()
        , $post_text = $newsfeed_post.find('.userContent')
        , $btm_button = getBTMIcon(btmImg)

      $btm_button.popover({
        trigger: "click",
        container: "body",
        html: "true",
        template: getPopoverHtml(slug),
        placement: (popover, parent) => {
          const distFromRight = $(window).width() - $(parent).offset().left
          return (distFromRight < 350) ? "left" : "right"
        },
        title: getPopoverTitle(),
        content: getLoading(slug)
      })

      $post_text.first().append($btm_button);
      $btm_button.on('shown.bs.popover', initPopover.bind($btm_button, slug));

      function initPopover() {
        $('.btm-close').on('click', () => { $btm_button.popover('hide') });
        Promise.all(siteSearches(spectrumSites['nytimes.com'], slug)) //hard-coded for NYT only
          .then(results => {
            $(`#btm-loading-${slug}`).hide();
            $(`#btm-popover-body-${slug}`).after(createPopup(results, slug));
            $('.collapse-link').on('click', toggleSummary);
            $('.popup-link').on('click', openArticleLink);
          })
        chrome.runtime.sendMessage({
          source: originTitle,
          type: "BTM Icon Click"
        });
      }
    })
  }

  function openArticleLink(event) {
    event.preventDefault();
    const href = $(event.target).attr('href');
    chrome.runtime.sendMessage({
      targetUrl: href,
      type: "Outbound Link Click",
      source: "Facebook",
      originUrl: href,
      elapsedTime: 0
    });
    window.open(href);
  }

  if (domain === "facebook.com") {
    setInterval(checkFacebookLinks, 1000)
  }

})
