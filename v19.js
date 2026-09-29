function chromeVer() {
  var v = document.querySelector('.ver');
  if (v) v.textContent = 'V19';
}
function layoutHome() {
  var box = document.querySelector('.home');
  if (!box) return;
  box.classList.add('stack');
  box.querySelectorAll('button').forEach(function (b) {
    if (b.dataset.keep) return;
    b.textContent = String(b.textContent || '').trim().toLocaleUpperCase('tr-TR');
  });
  var r = document.getElementById('rounds') || document.getElementById('orounds');
  var s = document.getElementById('secs') || document.getElementById('osecs');
  if (r && s && !r.closest('.pair')) {
    var pair = document.createElement('div');
    pair.className = 'pair';
    var c1 = document.createElement('div');
    var c2 = document.createElement('div');
    var lr = r.previousElementSibling;
    var ls = s.previousElementSibling;
    if (lr && lr.tagName === 'LABEL') c1.appendChild(lr);
    c1.appendChild(r);
    if (ls && ls.tagName === 'LABEL') c2.appendChild(ls);
    c2.appendChild(s);
    pair.appendChild(c1);
    pair.appendChild(c2);
    var hook = document.getElementById('go') || box.querySelector('.netrow') || document.getElementById('oback');
    if (hook) box.insertBefore(pair, hook);
    else box.appendChild(pair);
  }
  chromeVer();
}
var _gate19 = renderGate;
renderGate = function () {
  _gate19();
  layoutHome();
};
var _on19 = renderOnlineSetup;
renderOnlineSetup = function () {
  _on19();
  layoutHome();
};
var _home19 = home;
home = function () {
  _home19();
  if (state.screen === 'home') layoutHome();
};
var _wait19 = waitHtml;
waitHtml = function (title, body) {
  _wait19(title, body);
  layoutHome();
};
if (state.screen === 'home') home();
