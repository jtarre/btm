export const popoverStyle =
	"width: 250px;" +
	"max-width: 276px;" +
	"color: black;" +
	"padding: 1px;" +
	"font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;" +
	"font-size: 14px;" +
	"font-style: normal;" +
	"font-weight: normal;" +
	"line-height: 1.42857143;" +
	"text-align: left;" +
	"text-align: start;" +
	"text-decoration: none;" +
	"text-shadow: none;" +
	"text-transform: none;" +
	"letter-spacing: normal;" +
	"word-break: normal;" +
	"word-spacing: normal;" +
	"word-wrap: normal;" +
	"white-space: normal;" +
	"background-color: #fff;" +
	"-webkit-background-clip: padding-box;" +
	"background-clip: padding-box;" +
	"border: 1px solid #ccc;" +
	"border: 1px solid rgba(0, 0, 0, .2);" +
	"border-radius: 6px;" +
	"-webkit-box-shadow: 0 5px 10px rgba(0, 0, 0, .2);" +
	"box-shadow: 0 5px 10px rgba(0, 0, 0, .2);" +
	"line-break: auto;" +
	"z-index: 25";

export const popoverTitleStyle =
	"color: black;" +
	"font-family: Josefin Sans, serif;" +
	"font-size: 16px;" +
	"font-style: normal;" +
	"font-weight: bolder;" +
	"line-height: 1.42857143;" +
	"text-align: left;" +
	"text-align: start;" +
	"padding: 8px 14px;" +
	"margin: 0;" +
	"background-color: #f7f7f7;" +
	"border-bottom: 1px solid #ebebeb;" +
	"border-radius: 5px 5px 0 0;";

export const popoverBTMstyle =
	"color: black;" +
	"font-family: Josefin Sans, serif;" +
	"font-size: 16px;" +
	"font-style: normal;" +
	"font-weight: bolder;" +
	"line-height: 1.42857143;" +
	"text-align: left;" +
	"text-align: start;";

export const btnPrimaryStyle =
	"color: #4665B0;" +
	"background-color: #FECC08;" +
	"font-size:14px" +
	"font-family: PT Serif, serif" +
	"border-color: black;" +
	"margin: 10px";

export const getPopoverHtml = (slug) => ('<div data-slug="' + slug + '" class="popover" role="tooltip" style="' + popoverStyle + '">' +
	'<div class="arrow"></div>' +
	'<h3 style="' + popoverTitleStyle + '" class="popover-title"><span>&times;</span></h3>' +
	'<div data-slug="' + slug + '" class="popover-content">' +
	'</div>' +
	'</div>')
