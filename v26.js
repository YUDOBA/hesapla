if (!document.getElementById('v26css')) {
  var st = document.createElement('style');
  st.id = 'v26css';
  st.textContent = ''
    + '.home.stack,.home.gate{align-items:center!important;}'
    + '.home.stack .blk,.home.stack .pair,.home.stack .start,.home.stack .rules-home,.home.stack .netrow,.home.gate .gatebtn,.home.gate .rules-home{'
    + 'width:min(300px,calc(100vw - 56px))!important;max-width:300px!important;'
    + 'margin-left:auto!important;margin-right:auto!important;align-self:center!important;box-sizing:border-box!important;}'
    + '.home.stack .blk label,.home.stack .blk input,.home.stack .pair label,.home.stack .pair select{'
    + 'width:100%!important;max-width:none!important;margin-left:0!important;margin-right:0!important;align-self:stretch!important;text-align:left!important;}'
    + '.home.stack .pair label{white-space:nowrap!important;font-size:11px!important;letter-spacing:.04em!important;}'
    + '.pes-ask{position:absolute;left:50%;top:46%;transform:translate(-50%,-50%);z-index:40;width:min(240px,78%);background:#fff6e6;color:#1a2744;border-radius:14px;padding:14px 12px 12px;text-align:center;box-shadow:0 4px 0 #1a2744,0 8px 16px rgba(0,0,0,.25);}'
    + '.pes-ask p{margin:0 0 10px;font-weight:700;font-size:16px;}'
    + '.pes-ask button{border:0;border-radius:8px;font:inherit;font-weight:700;padding:8px 16px;margin:0 4px;}'
    + '.pes-ok{background:#8a2b2b;color:#fffaf0;}'
    + '.pes-no{background:#1a2744;color:#f7f1e6;}';
  document.head.appendChild(st);
}
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
