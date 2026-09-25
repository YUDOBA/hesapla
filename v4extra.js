VERSION = 'V4';
state.pesOpen = [false, false];
state.pesAsk = null;
state.result = null;
state.rollIv = null;
state.blinkT = null;
function lockPortrait() {
  try { if (screen.orientation && screen.orientation.lock) screen.orientation.lock('portrait').catch(function(){}); } catch (e) {}
}
lockPortrait();
function stopTimers() {
  if (state.rollIv) { clearInterval(state.rollIv); state.rollIv = null; }
  if (state.blinkT) { clearTimeout(state.blinkT); state.blinkT = null; }
}
function render() {
  if (state.screen === 'home') home();
  else if (state.screen === 'result') resultView();
  else table();
}
var _startGame = startGame;
startGame = function () {
  _startGame();
  state.pesOpen = [false, false];
  state.pesAsk = null;
  lockPortrait();
};
function pesHtml(p) {
  var open = state.pesOpen[p] ? ' open' : '';
  var h = '<div class="pes-rail' + open + '" data-pes="' + p + '"><div class="pes-line"></div><button class="pes-btn" type="button">PES</button></div>';
  if (state.pesAsk === p) {
    h += '<div class="pes-ask"><p>Emin misiniz?</p><button class="pes-ok" type="button">OK</button><button class="pes-no" type="button">Vazgec</button></div>';
  }
  return h;
}
var _halfHtml = halfHtml;
halfHtml = function (p) {
  var html = _halfHtml(p);
  if (html.slice(-6) === '</div>') html = html.slice(0, -6) + pesHtml(p) + '</div>';
  return html;
};
var _bindTable = bindTable;
bindTable = function () {
  _bindTable();
  bindPes();
};
function bindPes() {
  app.querySelectorAll('.pes-rail').forEach(function (rail) {
    var p = parseInt(rail.dataset.pes, 10);
    var startX = null;
    rail.addEventListener('touchstart', function (e) { startX = e.changedTouches[0].clientX; }, {passive:true});
    rail.addEventListener('touchend', function (e) {
      if (startX == null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (p === 1) dx = -dx;
      startX = null;
      if (dx > 28) state.pesOpen[p] = true;
      else if (dx < -28) { state.pesOpen[p] = false; if (state.pesAsk === p) state.pesAsk = null; }
      render();
    }, {passive:true});
    var line = rail.querySelector('.pes-line');
    if (line) line.onclick = function () {
      state.pesOpen[p] = !state.pesOpen[p];
      if (!state.pesOpen[p] && state.pesAsk === p) state.pesAsk = null;
      render();
    };
    var btn = rail.querySelector('.pes-btn');
    if (btn) btn.onclick = function (e) { e.stopPropagation(); state.pesAsk = p; render(); };
  });
  app.querySelectorAll('.pes-ok').forEach(function (b) { b.onclick = function () { confirmPes(state.pesAsk); }; });
  app.querySelectorAll('.pes-no').forEach(function (b) { b.onclick = function () { state.pesAsk = null; render(); }; });
}
function confirmPes(p) {
  if (p !== 0 && p !== 1) return;
  stopTimers();
  state.pesAsk = null;
  state.pesOpen = [false, false];
  state.overlay = null;
  showResult('pes', 1 - p, p);
}
function playSuccess() {
  try {
    var ctx = getCtx(); if (!ctx) return;
    var t = ctx.currentTime;
    var o1 = ctx.createOscillator(); var g1 = ctx.createGain();
    o1.type = 'sine'; o1.frequency.value = 523;
    g1.gain.setValueAtTime(0.07, t); g1.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
    o1.connect(g1); g1.connect(ctx.destination); o1.start(t); o1.stop(t + 0.17);
    var o2 = ctx.createOscillator(); var g2 = ctx.createGain();
    o2.type = 'sine'; o2.frequency.value = 784;
    g2.gain.setValueAtTime(0.08, t + 0.08); g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);
    o2.connect(g2); g2.connect(ctx.destination); o2.start(t + 0.08); o2.stop(t + 0.33);
  } catch (e) {}
}
resolvePlay = function (i1, op, i2) {
  var raw = compute(state.dice[i1], op, state.dice[i2]);
  if (!legalValue(raw)) { flashInvalid(op); return; }
  var idx = raw - 1, p = state.turn;
  if (!state.alive[p][idx]) { flashMissing(raw, p, idx); return; }
  playSuccess();
  state.phase = 'lock'; state.alive[p][idx] = false;
  state.blink = {p:p,i:idx}; state.finishedThisTurn = cleared(p); render();
  if (state.blinkT) clearTimeout(state.blinkT);
  state.blinkT = setTimeout(function(){ state.blinkT=null; state.blink=null; clearSel(); afterPlay(); }, 2000);
};
finishGame = function () {
  var w = null, title;
  if (state.wins[0] !== state.wins[1]) w = state.wins[0] > state.wins[1] ? 0 : 1;
  else if (state.penalty[0] !== state.penalty[1]) w = state.penalty[0] < state.penalty[1] ? 0 : 1;
  title = w == null ? 'Berabere' : state.nick[w] + ' kazandi';
  showResult('end', w, null, title);
};
function showResult(kind, winner, pesLoser, title) {
  stopTimers();
  if (kind === 'pes') { title = state.nick[pesLoser] + ' PES'; winner = 1 - pesLoser; }
  state.result = { kind: kind, title: title, winner: winner, pesLoser: pesLoser };
  state.screen = 'result';
  state.overlay = null;
  render();
}
function resultView() {
  var r = state.result || {};
  var wname = r.winner == null ? '' : state.nick[r.winner];
  var sub = r.kind === 'pes'
    ? state.nick[r.pesLoser] + ' pes etti. ' + wname + ' kazandi.'
    : (r.winner == null ? 'Tur ve ceza esit.' : wname + ' kazandi.');
  app.innerHTML = '<div class="result"><h1>SONUC</h1><p class="result-sub">' + esc(sub) + '</p>' +
    '<div class="result-row"><b>' + esc(state.nick[0]) + '</b><span>Tur ' + state.wins[0] + '</span><span>Ceza ' + state.penalty[0] + '</span></div>' +
    '<div class="result-row"><b>' + esc(state.nick[1]) + '</b><span>Tur ' + state.wins[1] + '</span><span>Ceza ' + state.penalty[1] + '</span></div>' +
    '<button class="start" id="resgo">Yeni oyun</button><div class="ver">' + VERSION + '</div></div>';
  document.getElementById('resgo').onclick = function () { state.result = null; state.screen = 'home'; render(); };
}
render();
