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
	"border-radius: 5px 5px 0 0;"

export const popoverBTMStyle =
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

export const getPopoverHtml = (slug) =>
(`<div
		data-slug="${slug}"
		class="popover btm-popover"
		role="tooltip"
		>` +
		`<div class="arrow"></div>` +
		`<h3
			style="${popoverTitleStyle}" class="popover-title">` +
			`<span>&times;</span>` +
		`</h3>` +
		`<div
			data-slug="${slug}"
			class="popover-content"></div>` +
	`</div>`)
