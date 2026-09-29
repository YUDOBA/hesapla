function chromeVer() {
  var v = document.querySelector('.ver');
  if (v) v.textContent = 'V20';
}
function wrapBlk(lab, ctrl) {
  if (!lab || !ctrl || ctrl.closest('.blk')) return;
  var d = document.createElement('div');
  d.className = 'blk';
  lab.parentNode.insertBefore(d, lab);
  d.appendChild(lab);
  d.appendChild(ctrl);
}
var _lay20 = layoutHome;
layoutHome = function () {
  _lay20();
  var box = document.querySelector('.home');
  if (!box) { chromeVer(); return; }
  var n0 = document.getElementById('n0');
  var n1 = document.getElementById('n1');
  var on = document.getElementById('onick');
  if (n0 && n0.previousElementSibling && n0.previousElementSibling.tagName === 'LABEL') wrapBlk(n0.previousElementSibling, n0);
  if (n1 && n1.previousElementSibling && n1.previousElementSibling.tagName === 'LABEL') wrapBlk(n1.previousElementSibling, n1);
  if (on && on.previousElementSibling && on.previousElementSibling.tagName === 'LABEL') wrapBlk(on.previousElementSibling, on);
  var pair = box.querySelector('.pair');
  if (pair) {
    pair.classList.add('blk');
    pair.querySelectorAll('select').forEach(function (el) {
      el.style.width = '100%';
      el.style.maxWidth = 'none';
      el.style.minHeight = '52px';
      el.style.fontSize = '20px';
    });
  }
  chromeVer();
};
if (state.screen === 'home') home();
