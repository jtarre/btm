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
