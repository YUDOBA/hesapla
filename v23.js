if (!document.getElementById('v23css')) {
  var st = document.createElement('style');
  st.id = 'v23css';
  st.textContent = ''
    + '.half{position:relative;}'
    + '.tape{position:absolute!important;left:6px;right:6px;top:40px;z-index:14;pointer-events:none;'
    + 'min-height:0!important;height:26px;margin:0!important;flex-wrap:nowrap!important;gap:3px!important;}'
    + '.tok{width:22px!important;height:22px!important;font-size:11px!important;border-radius:6px!important;box-shadow:none!important;}'
    + '.tok.eq{width:12px!important;font-size:11px!important;}';
  document.head.appendChild(st);
}
var _cv23 = (typeof chromeVer === 'function') ? chromeVer : null;
chromeVer = function () {
  if (_cv23) _cv23();
  var v = document.querySelector('.ver');
  if (v) v.textContent = 'V23';
};
if (state.screen === 'home') home();
else if (state.screen === 'play') render();
