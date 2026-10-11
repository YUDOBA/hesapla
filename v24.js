if (!document.getElementById('v24css')) {
  var st = document.createElement('style');
  st.id = 'v24css';
  st.textContent = '.half .grid{margin-top:30px!important;}.tape{top:50px!important;}';
  document.head.appendChild(st);
}
var _cv24 = (typeof chromeVer === 'function') ? chromeVer : null;
chromeVer = function () {
  if (_cv24) _cv24();
  var v = document.querySelector('.ver');
  if (v) v.textContent = 'V24';
};
if (state.screen === 'home') home();
else if (state.screen === 'play') render();
