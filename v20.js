function chromeVer() {
  var v = document.querySelector('.ver');
  if (v) v.textContent = 'V20';
}
var _lay20 = layoutHome;
layoutHome = function () {
  _lay20();
  var box = document.querySelector('.home');
  if (!box) return;
  box.querySelectorAll('label').forEach(function (lab) {
    lab.style.alignSelf = 'center';
    lab.style.textAlign = 'left';
    lab.style.width = 'min(320px, calc(100% - 44px))';
    lab.style.maxWidth = '320px';
  });
  box.querySelectorAll('input, select').forEach(function (el) {
    el.style.alignSelf = 'center';
    el.style.width = 'min(320px, calc(100% - 44px))';
    el.style.maxWidth = '320px';
    el.style.minHeight = '48px';
    el.style.fontSize = '20px';
    el.style.boxSizing = 'border-box';
  });
  var pair = box.querySelector('.pair');
  if (pair) {
    pair.style.width = 'min(320px, calc(100% - 44px))';
    pair.style.maxWidth = '320px';
    pair.style.alignSelf = 'center';
    pair.querySelectorAll('select').forEach(function (el) {
      el.style.width = '100%';
      el.style.maxWidth = 'none';
      el.style.minHeight = '48px';
    });
  }
  chromeVer();
};
if (state.screen === 'home') home();
