export const toggleSummary = (event) => {
  event.preventDefault();
  let $link = $(event.target);
  if ($link.hasClass('fa-caret-down') || $link.hasClass('fa-caret-up')) {
    $link = $link.parent();
  }
  const cache = $link.data('cache')
    , $cache = $(`#${cache}`)
    , $caret = $(`#btm-span-${cache}`).attr("style", "font-family: FontAwesome; margin-left: 0.5em");
  $cache.collapse('toggle');
  if ($caret.hasClass('fa-caret-up')) {
    $caret.addClass('fa-caret-down').removeClass('fa-caret-up')
  } else {
    $caret.addClass('fa-caret-up').removeClass('fa-caret-down')
  }
}

