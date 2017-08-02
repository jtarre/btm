import { getPopoverHtml, getBTMIcon, getLoading, getPopoverTitle } from './helpers/inline-elements'

import { spectrumSites, siteTitles, getSlug, createPopup, siteSearches } from './helpers/site-constants'

import { getLinks } from './helpers/getLinks-helpers'

import { toggleSummary } from './helpers/embed-helpers'

$(() => {
  const domain = window.location.hostname.split('www.')[1]
    , pathname = window.location.pathname
    , originUrl = `http://${domain}${pathname}`
    , source = siteTitles[domain] || domain;

  let startTime = new Date(); //this is initialized at the current time

  $('head').append("<style>@import url('https://fonts.googleapis.com/css?family=Josefin+Sans|PT+Serif');</style>")

  function embedIcons() {
    const $links = getLinks()
      , btmImg = chrome.runtime.getURL('icons/btm_logo.png');

    $links.forEach(element => { // this is for nytimes only. not general
      const $element = $(element)
        , href = $element.attr('href')
        , slug = getSlug(href)
        , $btm_button = getBTMIcon(btmImg)

      $btm_button.popover({
        trigger: "click",
        container: "body",
        html: "true",
        template: getPopoverHtml(slug),
        title: getPopoverTitle(),
        placement: (popover, parent) => {
          const distFromRight = $(window).width() - $(parent).offset().left
          return (distFromRight < 350) ? "left" : "right"
        },
        content: getLoading(slug)
      })

      if (!$element.next().is('a') && $element.attr('class') !== 'popup-link') {
        $btm_button.insertAfter($element);
      }

      $btm_button.on('shown.bs.popover', initPopover.bind($btm_button, slug, href));

      function initPopover() {
        $('.btm-close').on('click', () => { $btm_button.popover('hide') });
        Promise.all(siteSearches(spectrumSites[domain], slug))
          .then(results => { // this is the promise part of the site
            $(`#btm-loading-${slug}`).hide();
            $(`#btm-popover-body-${slug}`).after(createPopup(results, slug));
            $('.collapse-link').on('click', toggleSummary);
            $('.popup-link').on('click', openArticleLink);
          })
        chrome.runtime.sendMessage({
          source,
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
      source,
      originUrl,
      elapsedTime: Math.round((new Date() - startTime) / 60000)
    });
    startTime = new Date(); // reset startTime
    window.open(href);
  }

  /* Fires embedIcons as long as the user is not on Facebook. */
  if (domain !== 'facebook.com') {
    setInterval(embedIcons, 3000);
  }
})
