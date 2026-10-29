function centerForm() {
  var box = document.querySelector('.home');
  if (!box || box.classList.contains('gate')) return;
  box.querySelectorAll('label,input,select,.blk,.pair,.start,.rules-home,.netrow').forEach(function (el) {
    el.style.width = '';
    el.style.maxWidth = '';
    el.style.alignSelf = '';
    el.style.marginLeft = '';
    el.style.marginRight = '';
  });
}
var _lay26 = (typeof layoutHome === 'function') ? layoutHome : null;
if (_lay26) {
  layoutHome = function () {
    _lay26();
    centerForm();
    var v = document.querySelector('.ver');
    if (v) v.textContent = 'V26';
  };
}
if (typeof pesHtml === 'function') {
  var _pes26 = pesHtml;
  pesHtml = function (p) {
    return _pes26(p).replace('>OK<', '>\u00c7IK<').replace('>Vazgec<', '>\u0130PTAL<');
  };
}
var _cv26 = (typeof chromeVer === 'function') ? chromeVer : null;
chromeVer = function () {
  if (_cv26) _cv26();
  var v = document.querySelector('.ver');
  if (v) v.textContent = 'V26';
};
if (state.screen === 'home') home();
else if (state.screen === 'play') render();
