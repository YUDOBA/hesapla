state.tape = null;
state.blink2 = null;

if (!document.getElementById('v22css')) {
  var st = document.createElement('style');
  st.id = 'v22css';
  st.textContent = ''
    + 'html,body,#app,*{-webkit-user-select:none!important;user-select:none!important;-webkit-touch-callout:none!important;-webkit-user-drag:none;}'
    + 'input,textarea,select{-webkit-user-select:text!important;user-select:text!important;}'
    + 'html,body{touch-action:manipulation;}'
    + '.tape{display:flex;gap:4px;justify-content:center;align-items:center;flex-wrap:wrap;min-height:40px;margin:2px 0;}'
    + '.tok{width:36px;height:36px;border-radius:9px;display:grid;place-items:center;font-weight:700;font-size:16px;background:#1a2744;color:#f7f1e6;box-shadow:0 2px 0 #0d1c36;}'
    + '.tok.eq{background:transparent;color:#1a2744;box-shadow:none;width:22px;}';
  document.head.appendChild(st);
}
document.addEventListener('contextmenu', function (e) { e.preventDefault(); }, { passive: false });
document.addEventListener('selectstart', function (e) {
  if (e.target && e.target.closest && e.target.closest('input,textarea,select')) return;
  e.preventDefault();
});
document.addEventListener('gesturestart', function (e) { e.preventDefault(); }, { passive: false });
document.addEventListener('touchmove', function (e) {
  if (e.touches && e.touches.length > 1) e.preventDefault();
}, { passive: false });

function srcNow(src) {
  if (!src || typeof src === 'string') return src;
  if (src.t === 'd') return state.dice[src.i];
  var arr = state.jokers[src.p] || [];
  return arr[src.i];
}
function lockedTape() {
  var ch = state.chain || [];
  if (ch.length === 5) {
    var a = srcNow(ch[0]), b = srcNow(ch[2]), c = srcNow(ch[4]);
    var mid = compute(a, ch[1], b);
    var fin = compute(mid, ch[3], c);
    return [a, ch[1], b, '=', mid, ch[3], c, '=', fin];
  }
  if (ch.length === 3) {
    var a2 = srcNow(ch[0]), b2 = srcNow(ch[2]);
    return [a2, ch[1], b2, '=', compute(a2, ch[1], b2)];
  }
  return null;
}
function liveParts() {
  if (state.tape && state.tape.length) return state.tape;
  if (!state.chain || !state.chain.length) return null;
  return state.chain.map(function (c) { return typeof c === 'string' ? c : srcNow(c); });
}
function tapeHtml(p) {
  if (state.turn !== p) return '';
  var parts = liveParts();
  if (!parts || !parts.length) return '';
  var h = '<div class="tape">';
  parts.forEach(function (x) {
    var eq = x === '=';
    h += '<span class="tok' + (eq ? ' eq' : '') + '">' + (x == null ? '' : x) + '</span>';
  });
  return h + '</div>';
}
function markBlink(html, p, idx) {
  if (idx == null || idx < 0) return html;
  var n = idx + 1;
  var re = new RegExp('(<div class="num(?: [^"]*)?">' + n + '</div>)');
  return html.replace(re, function (m) {
    if (m.indexOf('blink') >= 0) return m;
    return m.replace('class="num', 'class="num blink');
  });
}
var _half22 = halfHtml;
halfHtml = function (p) {
  var html = _half22(p);
  if (state.blink2 && state.blink2.p === p) html = markBlink(html, p, state.blink2.i);
  var tape = tapeHtml(p);
  if (tape && html.indexOf('class="grid"') >= 0) html = html.replace('<div class="grid">', tape + '<div class="grid">');
  return html;
};

var _fv22 = finishValue;
finishValue = function (raw) {
  var p = state.turn;
  var mid = null;
  if (state.jMode && state.chain && state.chain.length === 5) {
    mid = compute(srcNow(state.chain[0]), state.chain[1], srcNow(state.chain[2]));
  }
  if (legalValue(raw) && state.alive[p] && state.alive[p][raw - 1]) state.tape = lockedTape();
  var ok = _fv22(raw);
  if (!ok) { state.tape = null; return false; }
  if (mid != null && legalValue(mid) && mid !== raw && state.alive[p][mid - 1]) {
    state.alive[p][mid - 1] = false;
    state.blink2 = { p: p, i: mid - 1 };
    state.finishedThisTurn = cleared(p);
    render();
  }
  if (state.online && state.host && typeof hostPush === 'function') hostPush();
  return true;
};

var _ap22 = afterPlay;
afterPlay = function () {
  state.tape = null;
  state.blink2 = null;
  _ap22();
};

if (typeof packState === 'function') {
  var _ps22 = packState;
  packState = function () {
    var o = _ps22();
    o.blink2 = state.blink2 || null;
    o.tape = state.tape || null;
    return o;
  };
}
if (typeof applyPack === 'function') {
  var _apack22 = applyPack;
  applyPack = function (p) {
    _apack22(p);
    if (!p) return;
    if (p.blink2 !== undefined) state.blink2 = p.blink2;
    if (p.tape !== undefined) state.tape = p.tape;
  };
}

var _cv22 = (typeof chromeVer === 'function') ? chromeVer : null;
chromeVer = function () {
  if (_cv22) _cv22();
  var v = document.querySelector('.ver');
  if (v) v.textContent = 'V22';
};
if (state.screen === 'home') home();
else if (state.screen === 'play') render();
