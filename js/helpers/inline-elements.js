export const getBTMIcon = (btmImg, slug) => ($(`<a href="javascript:void(0)" class="btm-icon" id="btm-icon-${slug}"><img src=${btmImg} style="height: 20px; width: 20px; vertical-align: middle; margin-left: 0.1em"></a>`))

export const getLoading = (slug) => (`<div id="btm-popover-body-${slug}"><div id="btm-loading-${slug}" class="btm-loading"><p>Loading...</p></div></div>`)

export const getPopoverTitle = (btmBg, btmIcon) => (`<div class="btm-popover-title">
  <img src=${btmBg} class="btm-header-bg" />
  <img src=${btmIcon} class="btm-header-icon" />
  <h3 class="btm-header">BRIDGE THE MEDIA</h3>
  <span class='btm-close'><i class="fa fa-times" aria-hidden="true"></i></span>
</div>`)

export const getPopoverHtml = (slug, side) => (`<div
    data-slug="${slug}"
    class="popover btm-popover"
    role="tooltip"
    >
    <div class="btm-arrow ${side} loading" />
    <div class="popover-title" />
    <div
      data-slug="${slug}"
      class="popover-content"/>
  </div>`)

const getShowAlts = (slug) => (`<a
  id="btm-btn-${slug}"
  class="collapse-link show-alts visible"
  data-toggle='collapse'
  href="javascript:void(0)"
  data-slug=${slug}>
    Show Alternatives <i class="fa fa-caret-down" aria-hidden="true"></i>
  </a>`)

const getHideAlts = (slug) => (`<a
  id="btm-btn-${slug}"
  class="collapse-link hide-alts"
  data-toggle='collapse'
  href="javascript:void(0)"
  data-slug=${slug}>
    Hide Alternatives <i class="fa fa-caret-up" aria-hidden="true"></i>
  </a>`
)

const getArticlePagePopoverTitle = (slug, btmBg, btmIcon) => (`<div class="btm-article-popover-title">
  <img src="${btmBg}" class="btm-header-bg" />
  <img src="${btmIcon}" class="btm-header-icon" />
  <div class="btm-article-header">
    ${getShowAlts(slug)}
    <h3 class="btm-header btm-head">
      BRIDGE THE MEDIA
    </h3>
  </div>
  <span class='btm-close'><i class="fa fa-times" aria-hidden="true"></i></span>
</div>`)

export const getArticlePagePopover = (slug, side, btmBg, btmIcon) => (`<div
    class="btm-popover ${side} btm-article-popover"
    data-slug=${slug}>
	  ${getArticlePagePopoverTitle(slug, btmBg, btmIcon)}
    <div class="btm-article-popover-body">
    ${getHideAlts(slug)}
    </div>
</div>`)
