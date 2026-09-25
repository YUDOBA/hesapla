var __half = halfHtml;
halfHtml = function (p) {
  var html = __half(p);
  if (html.indexOf('turn-dot') < 0 && html.slice(-6) === '</div>' && state.turn === p) {
    html = html.slice(0, -6) + '<div class="turn-dot"></div></div>';
  }
  return html;
};
if (state.screen === 'play') render();
