export const getBTMIcon = (btmImg) => ($(`<a href="javascript:void(0);" class="btm-icon"><img src=${btmImg} style="height: 20px; width: 20px; vertical-align: middle; margin-left: 0.1em"></a>`))

export const getLoading = (slug) => (`<div id="btm-popover-body-${slug}"><div id="btm-loading-${slug}" class="btm-loading"><p>Loading...</p></div></div>`)

export const getPopoverTitle = () => (`<div class="btm-popover-title">
  <span class="btm-header">BRIDGE THE MEDIA</span>
  <span class='btm-close'><i class="fa fa-times" aria-hidden="true"></i></span>
</div>`)

export const getPopoverHtml = (slug) => (`<div
    data-slug="${slug}"
    class="popover btm-popover"
    role="tooltip">
    <div class="arrow" />
    <h3 class="popover-title">
    </h3>
    <div
      data-slug="${slug}"
      class="popover-content"/>
  </div>`)

const getAltsBtn = (slug) => (`<button
	  id="btm-btn-${slug}"
	  style="margin: 1em;"
	  class="google-search btn btn-primary btm-btn"
	  href="javascript:void(0);"
	  data-slug=${slug}>
	  	SHOW ALTERNATIVES
	  </button>`
)

export const getArticlePagePopover = (slug, side) => (`<div
    class="btm-popover"
    data-slug=${slug}
    style="position: fixed; ${side}: 50px; top: 100px; z-index: 1000">
	  ${getPopoverTitle()}
    <div id="btm-hover-${slug}">
	  	<div
        style="max-height: 450px; overflow: scroll;"
        id="btm-popover-body-${slug}"
	  	/>
      	${getAltsBtn(slug)}
    	</div>
    </div>`
)
