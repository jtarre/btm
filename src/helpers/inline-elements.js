export const getBTMIcon = (btmImg) => ($(`<a href="javascript:void(0);" class="btm-icon"><img src=${btmImg} style="height: 20px; width: 20px; vertical-align: middle; margin-left: 0.1em"></a>`))

export const getLoading = (slug) => (`<div id="btm-popover-body-${slug}"><div id="btm-loading-${slug}" style="text-align: center;"><p>Loading...</p></div></div>`)

export const getPopoverTitle = () => (`<span class="btm-header">BRIDGE THE MEDIA<span class='btm-close btm-pull-right'>&times;</span></span>`)

export const getPopoverHtml = (slug) => (`<div
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

const getAltsBtn = (slug) => (`<button
	  id="btm-btn-${slug}"
	  style="margin: 1em;"
	  class="google-search btn  btn-primary btm-btn"
	  href="javascript:void(0);"
	  data-slug=${slug}>
	  	SHOW ALTERNATIVES
	  </button>`
)

export const getArticlePagePopover = (slug, side) => (`<div
    class="btm-popover"
    data-slug=${slug}
    style="position: fixed; ${side}: 50px; top: 100px; z-index: 1000">
	  <div class="btm-popover-title">
	  	BRIDGE THE MEDIA
	  	<span class='btm-close btm-pull-right'>&times;</span>
	  </div>
    <div id="btm-hover-${slug}">
	  	<div
        style="max-height: 450px; overflow: scroll;"
        id="btm-popover-body-${slug}"
	  	/>
      	${getAltsBtn(slug)}
    	</div>
    </div>`
)
