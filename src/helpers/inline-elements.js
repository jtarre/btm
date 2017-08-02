export const getBTMIcon = (btmImg) => ($(`<a href="javascript:void(0);"><img src=${btmImg} style="height: 20px; width: 20px; vertical-align: middle; margin-left: 0.1em"></a>`))

export const getLoading = (slug) => (`<div id="btm-popover-body-${slug}"><div id="btm-loading-${slug}"><p>Loading...</p></div></div>`)

export const getPopoverTitle = () => (`<span class="btm-header">BRIDGE THE MEDIA<span class='btm-close btm-pull-right'>&times;</span></span>`)

export const getPopoverHtml = (slug) =>
  (`<div
    data-slug="${slug}"
    class="popover btm-popover"
    role="tooltip">
    <div class="arrow" />
    <h3 class="popover-title btm-popover-title">
      <span>&times;</span>
    </h3>
    <div
      data-slug="${slug}"
      class="popover-content"/>
  </div>`)
