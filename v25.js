if (!document.getElementById('v25css')) {
  var st = document.createElement('style');
  st.id = 'v25css';
  st.textContent = ''
    + '.tok.ok{background:#e7f8ea!important;color:#157a22!important;animation:tokblink .45s steps(2,end) infinite;}'
    + '.tok.bad{background:#fde8e6!important;color:#c0392b!important;animation:tokblink .45s steps(2,end) infinite;}'
    + '@keyframes tokblink{50%{opacity:.28}}';
  document.head.appendChild(st);
}
lockedTape = function () {
  var ch = state.chain || [];
  var p = state.turn;
  function ok(v) { return legalValue(v) && state.alive[p] && state.alive[p][v - 1]; }
  if (ch.length === 5) {
    var a = srcNow(ch[0]), b = srcNow(ch[2]), c = srcNow(ch[4]);
    var mid = compute(a, ch[1], b);
    var fin = compute(mid, ch[3], c);
    var midOk = legalValue(mid) && mid !== fin && ok(mid);
    return [
      { v: a }, { v: ch[1] }, { v: b }, { v: '=' },
      { v: mid, k: midOk ? 'ok' : 'bad' },
      { v: ch[3] }, { v: c }, { v: '=' },
      { v: fin, k: 'ok' }
    ];
  }
  if (ch.length === 3) {
    var a2 = srcNow(ch[0]), b2 = srcNow(ch[2]);
    var fin2 = compute(a2, ch[1], b2);
    return [{ v: a2 }, { v: ch[1] }, { v: b2 }, { v: '=' }, { v: fin2, k: 'ok' }];
  }
  return null;
};
tapeHtml = function (p) {
  if (state.turn !== p) return '';
  var parts = liveParts();
  if (!parts || !parts.length) return '';
  var h = '<div class="tape">';
  parts.forEach(function (x) {
    var v = (x && typeof x === 'object') ? x.v : x;
    var k = (x && typeof x === 'object' && x.k) ? x.k : '';
    var eq = v === '=';
    h += '<span class="tok' + (eq ? ' eq' : '') + (k ? ' ' + k : '') + '">' + (v == null ? '' : v) + '</span>';
  });
  return h + '</div>';
};
var _cv25 = (typeof chromeVer === 'function') ? chromeVer : null;
chromeVer = function () {
  if (_cv25) _cv25();
  var v = document.querySelector('.ver');
  if (v) v.textContent = 'V25';
};
if (state.screen === 'home') home();
else if (state.screen === 'play') render();
