const VERSION = 'V1';
const NUMS = [1,2,3,4,5,6,7,8,9,10,11,12];
const state = {
  screen: 'home', nick: ['', ''], totalRounds: 4, round: 0, starter: 0, turn: 0,
  wins: [0,0], penalty: [0,0], alive: [null,null], phase: 'needRoll',
  dice: [1,1], selDie: null, selOp: null, blink: null, reply: false,
  finishedThisTurn: false, ghost: null, shakeOp: null, ring: null, overlay: null
};
const app = document.getElementById('app');
function esc(s) {
  return String(s == null ? '' : s).split('&').join('&').split('<').join('<');
}
function render() { if (state.screen === 'home') home(); else table(); }
function home() {
  var n0 = state.nick[0], n1 = state.nick[1];
  var ok = n0.trim() && n1.trim();
  app.innerHTML = '<div class="home"><h1>HESAPLA</h1>' +
    '<label>1. oyuncu</label><input id="n0" maxlength="14" value="' + esc(n0) + '" placeholder="Nick" />' +
    '<label>2. oyuncu</label><input id="n1" maxlength="14" value="' + esc(n1) + '" placeholder="Nick" />' +
    '<label>Tur sayisi</label><select id="rounds">' +
    [2,4,6,8,10].map(function(n){ return '<option value="' + n + '"' + (n===state.totalRounds?' selected':'') + '>' + n + '</option>'; }).join('') +
    '</select>' +
    '<button class="start" id="go"' + (ok ? '' : ' disabled') + '>OYUNU BASLAT</button>' +
    '<div class="ver">' + VERSION + '</div>' +
    '<div class="yudoba"><span>YUDOBA</span></div></div>';
  var a = document.getElementById('n0');
  var b = document.getElementById('n1');
  var r = document.getElementById('rounds');
  function sync() {
    state.nick[0] = a.value; state.nick[1] = b.value;
    state.totalRounds = parseInt(r.value, 10);
    document.getElementById('go').disabled = !(a.value.trim() && b.value.trim());
  }
  a.oninput = b.oninput = r.onchange = sync;
  document.getElementById('go').onclick = startGame;
}
function startGame() {
  state.nick[0] = state.nick[0].trim();
  state.nick[1] = state.nick[1].trim();
  if (!state.nick[0] || !state.nick[1]) return;
  state.wins = [0,0]; state.penalty = [0,0]; state.round = 0;
  state.starter = Math.random() < 0.5 ? 0 : 1;
  state.screen = 'play';
  beginRound();
}
function freshAlive() { return NUMS.map(function(){ return true; }); }
function beginRound() {
  state.round += 1;
  state.alive = [freshAlive(), freshAlive()];
  state.turn = state.starter;
  state.phase = 'needRoll';
  state.selDie = null; state.selOp = null; state.blink = null; state.reply = false;
  state.finishedThisTurn = false; state.ghost = null; state.overlay = null;
  render();
}
function remainingSum(p) {
  var s = 0; for (var i = 0; i < 12; i++) if (state.alive[p][i]) s += NUMS[i]; return s;
}
function cleared(p) { return state.alive[p].every(function(v){ return !v; }); }
function halfHtml(p) {
  var canAct = state.turn === p && !state.overlay && (state.phase === 'needRoll' || state.phase === 'choose');
  var html = '<div class="half ' + (p===1?'top':'bot') + ' ' + (state.turn===p?'on':'off') + '" data-p="' + p + '">';
  html += '<div class="hud"><span class="nick">' + esc(state.nick[p]) + '</span><span class="stats">Tur ' + state.wins[p] + ' · Ceza ' + state.penalty[p] + '</span></div>';
  html += '<div class="grid">';
  for (var i = 0; i < 12; i++) {
    var cls = 'num';
    if (!state.alive[p][i]) cls += ' dead';
    if (state.blink && state.blink.p===p && state.blink.i===i) cls += ' blink';
    if (state.ring && state.ring.p===p && state.ring.i===i) cls += ' ring-out';
    html += '<div class="' + cls + '">' + NUMS[i] + '</div>';
  }
  html += '</div>';
  var rollOn = canAct && state.phase === 'needRoll';
  var pasOn = canAct && state.phase === 'choose';
  html += '<div class="actions"><button class="btn ink zar"' + (rollOn?'':' disabled') + '>ZAR</button><button class="btn pas"' + (pasOn?'':' disabled') + '>PAS</button></div></div>';
  return html;
}
function midHtml() {
  var ops = ['\u2212','+','\u00d7','\u00f7'];
  function col(arr) {
    return '<div class="ops">' + arr.map(function(op){
      var cls = 'op' + (state.selOp===op?' on':'') + (state.shakeOp===op?' shake':'');
      var mark = state.shakeOp===op ? '<i class="xmark"></i>' : '';
      return '<div class="' + cls + '" data-op="' + op + '">' + op + mark + '</div>';
    }).join('') + '</div>';
  }
  return '<div class="mid">' + col(ops.slice(0,2)) + '<div class="well">' + dieHtml(0) + dieHtml(1) +
    (state.ghost != null ? '<div class="ghost show">' + state.ghost + '<i class="slash"></i></div>' : '') +
    '</div>' + col(ops.slice(2)) + '</div>';
}
function pipMap(n) {
  var spots = {1:[4],2:[0,8],3:[0,4,8],4:[0,2,6,8],5:[0,2,4,6,8],6:[0,2,3,5,6,8]};
  var s = spots[n], h = '<div class="pips">';
  for (var i = 0; i < 9; i++) h += s.indexOf(i) >= 0 ? '<i class="pip"></i>' : '<i></i>';
  return h + '</div>';
}
function dieHtml(i) {
  var v = state.dice[i], pick = state.selDie === i ? ' pick' : '', faces = '';
  for (var f = 1; f <= 6; f++) faces += '<div class="face f' + f + '">' + pipMap(f) + '</div>';
  return '<div class="die-wrap' + pick + '" data-die="' + i + '"><div class="cube show-' + v + '" id="cube' + i + '">' + faces + '</div></div>';
}
function overlayHtml() {
  var o = state.overlay;
  return '<div class="overlay"><div class="card"><h2>' + esc(o.title) + '</h2>' +
    (o.lines||[]).map(function(l){ return '<p>' + esc(l) + '</p>'; }).join('') +
    '<button class="btn ink" id="ovok">' + esc(o.btn || 'Tamam') + '</button></div></div>';
}
function table() {
  app.innerHTML = '<div class="table">' + halfHtml(1) + midHtml() + halfHtml(0) + '</div>' + (state.overlay ? overlayHtml() : '');
  bindTable();
}
function bindTable() {
  app.querySelectorAll('.zar').forEach(function(b){
    b.onclick = function(){ var p = parseInt(b.closest('.half').dataset.p,10); if (state.turn!==p || state.phase!=='needRoll') return; rollDice(); };
  });
  app.querySelectorAll('.pas').forEach(function(b){
    b.onclick = function(){ var p = parseInt(b.closest('.half').dataset.p,10); if (state.turn!==p || state.phase!=='choose') return; passTurn(); };
  });
  app.querySelectorAll('.op').forEach(function(el){
    el.onclick = function(){ if (state.phase!=='choose' || state.selDie==null) return; state.selOp = el.dataset.op; render(); };
  });
  app.querySelectorAll('.die-wrap').forEach(function(el){
    el.onclick = function(){
      if (state.phase!=='choose') return;
      var i = parseInt(el.dataset.die,10);
      if (state.selDie==null || state.selOp==null) { state.selDie = i; render(); return; }
      if (i===state.selDie) { state.selDie=null; state.selOp=null; render(); return; }
      resolvePlay(state.selDie, state.selOp, i);
    };
  });
  var ov = document.getElementById('ovok'); if (ov) ov.onclick = onOverlay;
}
function playDiceSound() {
  try {
    var ctx = playDiceSound.ctx || (playDiceSound.ctx = new (window.AudioContext || window.webkitAudioContext)());
    var t = ctx.currentTime;
    for (var k = 0; k < 4; k++) {
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'triangle'; o.frequency.value = 160 + Math.random()*200;
      g.gain.setValueAtTime(0.0001, t+k*0.06);
      g.gain.exponentialRampToValueAtTime(0.1, t+k*0.06+0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t+k*0.06+0.25);
      o.connect(g); g.connect(ctx.destination); o.start(t+k*0.06); o.stop(t+k*0.06+0.25);
    }
  } catch (e) {}
}
function rollDice() {
  state.phase = 'rolling'; state.selDie = null; state.selOp = null; render(); playDiceSound();
  var cubes = [document.getElementById('cube0'), document.getElementById('cube1')];
  var t0 = Date.now(), dur = 3000 + Math.floor(Math.random()*3000);
  var iv = setInterval(function(){
    state.dice = [1+Math.floor(Math.random()*6), 1+Math.floor(Math.random()*6)];
    cubes.forEach(function(c,i){ if (!c) return; c.className = 'cube spin show-' + state.dice[i]; });
    if (Date.now()-t0 >= dur) {
      clearInterval(iv);
      state.dice = [1+Math.floor(Math.random()*6), 1+Math.floor(Math.random()*6)];
      state.phase = 'choose'; render();
    }
  }, 90);
}
function compute(a, op, b) {
  if (op === '+') return a+b;
  if (op === '\u2212') return a-b;
  if (op === '\u00d7') return a*b;
  if (op === '\u00f7') { if (b===0 || a%b!==0) return null; return a/b; }
  return null;
}
function legalValue(v) { return typeof v==='number' && isFinite(v) && Math.floor(v)===v && v>=1 && v<=12; }
function resolvePlay(i1, op, i2) {
  var raw = compute(state.dice[i1], op, state.dice[i2]);
  if (!legalValue(raw)) { flashInvalid(op); return; }
  var idx = raw-1, p = state.turn;
  if (!state.alive[p][idx]) { flashMissing(raw, p, idx); return; }
  state.phase = 'lock'; state.alive[p][idx] = false;
  state.blink = {p:p,i:idx}; state.finishedThisTurn = cleared(p); render();
  setTimeout(function(){ state.blink=null; afterPlay(); }, 3000);
}
function flashInvalid(op) {
  state.shakeOp = op; state.selDie = null; state.selOp = null; render();
  setTimeout(function(){ state.shakeOp=null; render(); }, 700);
}
function flashMissing(val, p, idx) {
  state.ghost = val; state.ring = {p:p,i:idx}; state.selDie=null; state.selOp=null; render();
  setTimeout(function(){ state.ghost=null; state.ring=null; render(); }, 900);
}
function passTurn() { state.selDie=null; state.selOp=null; state.finishedThisTurn=false; afterPlay(); }
function afterPlay() {
  var p = state.turn, other = 1-p;
  if (state.reply) { endRound(state.finishedThisTurn ? 'draw' : 'win', state.finishedThisTurn ? null : state.starter); return; }
  if (state.finishedThisTurn) {
    if (p !== state.starter) { endRound('win', p); return; }
    state.reply = true; state.turn = other; state.phase = 'needRoll'; state.finishedThisTurn = false; render(); return;
  }
  state.turn = other; state.phase = 'needRoll'; render();
}
function endRound(kind, winner) {
  if (kind === 'draw') { state.wins[0]+=1; state.wins[1]+=1; } else state.wins[winner]+=1;
  state.penalty[0]+=remainingSum(0); state.penalty[1]+=remainingSum(1);
  var last = state.round >= state.totalRounds, title, lines;
  if (kind === 'draw') { title = 'Tur ' + state.round + ' berabere'; lines = [state.nick[0] + ' ve ' + state.nick[1] + ' +1 tur']; }
  else { title = 'Tur ' + state.round + ' - ' + state.nick[winner]; lines = [state.nick[1-winner] + ' ceza +' + remainingSum(1-winner)]; }
  lines.push('Tur: ' + state.wins[0] + '-' + state.wins[1] + '  Ceza: ' + state.penalty[0] + '-' + state.penalty[1]);
  state.overlay = { title: title, lines: lines, btn: last ? 'Sonuc' : 'Sonraki tur', last: last, kind: kind, winner: winner };
  state.phase = 'overlay'; render();
}
function onOverlay() {
  var o = state.overlay; state.overlay = null;
  if (o.last) { finishGame(); return; }
  if (o.kind === 'draw') state.starter = 1 - state.starter; else state.starter = 1 - o.winner;
  beginRound();
}
function finishGame() {
  var title, lines;
  if (state.wins[0] !== state.wins[1]) {
    var w = state.wins[0] > state.wins[1] ? 0 : 1;
    title = state.nick[w] + ' kazandi';
    lines = ['Tur ' + state.wins[0] + '-' + state.wins[1], 'Ceza ' + state.penalty[0] + '-' + state.penalty[1]];
  } else if (state.penalty[0] !== state.penalty[1]) {
    var w2 = state.penalty[0] < state.penalty[1] ? 0 : 1;
    title = state.nick[w2] + ' kazandi'; lines = ['Tur esit', 'Dusuk ceza: ' + state.penalty[w2]];
  } else {
    title = 'Berabere'; lines = ['Tur ' + state.wins[0] + '-' + state.wins[1], 'Ceza ' + state.penalty[0] + '-' + state.penalty[1]];
  }
  state.overlay = { title: title, lines: lines, btn: 'Yeni oyun', last: false };
  state.phase = 'overlay'; render();
  var ov = document.getElementById('ovok');
  if (ov) ov.onclick = function(){ state.overlay=null; state.screen='home'; render(); };
}
render();
