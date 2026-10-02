function paintSameColor() {
  if (!state.online) return;
  var t = app.querySelector('.table');
  if (t) t.classList.add('samecolor');
  var halves = app.querySelectorAll('.score-half');
  if (halves.length >= 2) {
    halves[0].setAttribute('data-p', String(1 - state.seat));
    halves[1].setAttribute('data-p', String(state.seat));
  }
  var v = document.querySelector('.ver');
  if (v) v.textContent = 'V21';
}
if (!document.getElementById('samecolor-css')) {
  var st = document.createElement('style');
  st.id = 'samecolor-css';
  st.textContent = ''
    + '.table.samecolor .half[data-p="0"]{background:linear-gradient(#a9bbd4,#7e96b4)!important;}'
    + '.table.samecolor .half[data-p="0"].on{background:linear-gradient(#cfe8ff,#2f8cff)!important;}'
    + '.table.samecolor .half[data-p="1"]{background:linear-gradient(#d4a8a5,#b87874)!important;}'
    + '.table.samecolor .half[data-p="1"].on{background:linear-gradient(#ffd2cc,#ff5a4e)!important;}'
    + '.table.samecolor .half[data-p="0"] .stats.last{color:#1e4f8a;}'
    + '.table.samecolor .half[data-p="1"] .stats.last{color:#9b2b2b;}'
    + '.table.samecolor .half[data-p="0"] .pes-line{color:#1e4f8a;}'
    + '.table.samecolor .half[data-p="1"] .pes-line{color:#9b2b2b;}'
    + '.score-half[data-p="0"]{background:linear-gradient(#cfe8ff,#2f8cff)!important;}'
    + '.score-half[data-p="1"]{background:linear-gradient(#ffd2cc,#ff5a4e)!important;}';
  document.head.appendChild(st);
}
var _bind21 = bindTable;
bindTable = function () {
  _bind21();
  paintSameColor();
};
var _sv21 = scoreView;
scoreView = function () {
  _sv21();
  paintSameColor();
};
var _cv21 = (typeof chromeVer === 'function') ? chromeVer : null;
chromeVer = function () {
  if (_cv21) _cv21();
  var v = document.querySelector('.ver');
  if (v) v.textContent = 'V21';
};
if (state.screen === 'play') paintSameColor();
if (state.screen === 'score') scoreView();
if (state.screen === 'home') home();
