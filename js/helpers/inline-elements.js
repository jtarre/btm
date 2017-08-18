export const getBTMIcon = (btmImg, slug) => ($(`<a href="javascript:void(0);" class="btm-icon" id="btm-icon-${slug}"><img src=${btmImg} style="height: 20px; width: 20px; vertical-align: middle; margin-left: 0.1em"></a>`))

export const getLoading = (slug) => (`<div id="btm-popover-body-${slug}"><div id="btm-loading-${slug}" class="btm-loading"><p>Loading...</p></div></div>`)

export const getPopoverTitle = (btmBg, btmIcon) => (`<div class="btm-popover-title">
  <img src=${btmBg} class="btm-header-bg" />
  <img src=${btmIcon} class="btm-header-icon" ></img>
  <h3 class="btm-header">BRIDGE THE MEDIA</h3>
  <span class='btm-close'><i class="fa fa-times" aria-hidden="true"></i></span>
</div>`)

export const getPopoverHtml = (slug, side) => (`<div
    data-slug="${slug}"
    class="popover btm-popover"
    role="tooltip">
    <div class="btm-arrow ${side}" />
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

export const getArticlePagePopover = (slug) => (`<div
    class="btm-popover"
    data-slug=${slug}>
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
