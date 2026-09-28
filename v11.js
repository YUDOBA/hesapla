state.turnSec = state.turnSec || 10;
state.jokers = state.jokers || [[], []];
state.jMode = false;
state.jLocked = false;
state.jPick = false;
state.chain = [];
state.timeLeft = 0;
state.timeIv = null;
state.usedJoker = false;

function stopClock() {
  if (state.timeIv) { clearInterval(state.timeIv); state.timeIv = null; }
}
function startClock() {
  stopClock();
  state.timeLeft = state.turnSec || 10;
  paintClock();
  state.timeIv = setInterval(function () {
    state.timeLeft -= 1;
    paintClock();
    if (state.timeLeft <= 0) {
      stopClock();
      onTimeUp();
    }
  }, 1000);
}
function paintClock() {
  app.querySelectorAll('.clock').forEach(function (el) {
    var p = parseInt(el.closest('.half').dataset.p, 10);
    el.textContent = (state.turn === p && (state.phase === 'choose' || state.phase === 'pickJoker')) ? String(Math.max(0, state.timeLeft)) : '';
  });
}
function onTimeUp() {
  if (state.phase !== 'choose' && state.phase !== 'pickJoker') return;
  state.jPick = false;
  state.jMode = false;
  state.jLocked = false;
  state.chain = [];
  state.usedJoker = false;
  clearSel();
  state.finishedThisTurn = false;
  afterPlay();
}

var _home11 = home;
home = function () {
  _home11();
  var v = document.querySelector('.ver');
  if (v) v.textContent = 'V11';
  if (!document.getElementById('secs')) {
    var rounds = document.getElementById('rounds');
    if (rounds) {
      var lab = document.createElement('label');
      lab.textContent = 'Hamle suresi';
      var sel = document.createElement('select');
      sel.id = 'secs';
      [5, 10, 15, 20, 25, 30].forEach(function (n) {
        var o = document.createElement('option');
        o.value = n;
        o.textContent = n + ' sn';
        if (n === (state.turnSec || 10)) o.selected = true;
        sel.appendChild(o);
      });
      rounds.insertAdjacentElement('afterend', sel);
      rounds.insertAdjacentElement('afterend', lab);
      sel.onchange = function () { state.turnSec = parseInt(sel.value, 10); };
    }
  }
};

var _start11 = startGame;
startGame = function () {
  var s = document.getElementById('secs');
  if (s) state.turnSec = parseInt(s.value, 10) || 10;
  state.jokers = [[], []];
  state.jMode = false;
  state.jLocked = false;
  state.jPick = false;
  state.chain = [];
  stopClock();
  _start11();
};

var _begin11 = beginRound;
beginRound = function () {
  stopClock();
  state.jMode = false;
  state.jLocked = false;
  state.jPick = false;
  state.chain = [];
  state.usedJoker = false;
  _begin11();
};

function miniDie(n, extra) {
  var spots = {1:[4],2:[0,8],3:[0,4,8],4:[0,2,6,8],5:[0,2,4,6,8],6:[0,2,3,5,6,8]};
  var s = spots[n] || [];
  var h = '<div class="mdie ' + (extra || '') + '" data-jv="' + n + '"><div class="mpips">';
  for (var i = 0; i < 9; i++) h += s.indexOf(i) >= 0 ? '<i class="mpip"></i>' : '<i></i>';
  return h + '</div></div>';
}

function jokerHud(p) {
  var h = '<div class="jhud">';
  if (state.jPick && state.turn === p) {
    h += '<div class="jpick">';
    for (var n = 1; n <= 6; n++) h += miniDie(n, 'pickable');
    h += '</div>';
  } else {
    (state.jokers[p] || []).forEach(function (n, i) {
      var on = '';
      state.chain.forEach(function (c) {
        if (c && c.t === 'j' && c.i === i && c.p === p) on = ' on';
      });
      h += miniDie(n, 'owned' + on + '" data-ji="' + i);
    });
  }
  h += '</div>';
  return h;
}

var _half11 = halfHtml;
halfHtml = function (p) {
  var html = _half11(p);
  html = html.replace(/<button class="btn pas"[^>]*>PAS<\/button>/, '');
  var canJ = state.jokers[p] && state.jokers[p].length && state.turn === p && state.phase === 'choose' && !state.jLocked;
  var jcls = 'jbtn' + (state.jMode && state.turn === p ? ' on' : '') + (canJ ? '' : ' off');
  html = html.replace(
    '<span class="stats',
    '<button type="button" class="' + jcls + '" data-j="' + p + '">J</button><span class="stats'
  );
  html = html.replace(
    '<div class="hud">',
    '<div class="hud">' + jokerHud(p)
  );
  html = html.replace('>ZAR</button></div>', '>ZAR</button><div class="clock"></div></div>');
  return html;
};

var _roll11 = rollDice;
rollDice = function () {
  stopClock();
  state.jMode = false;
  state.jLocked = false;
  state.jPick = false;
  state.chain = [];
  state.usedJoker = false;
  state.phase = 'rolling';
  clearSel();
  render();
  var cubes = [document.getElementById('cube0'), document.getElementById('cube1')];
  var t0 = Date.now();
  var dur = 2000 + Math.floor(Math.random() * 2000);
  playWoodRoll(dur);
  if (state.rollIv) clearInterval(state.rollIv);
  state.rollIv = setInterval(function () {
    state.dice = [1 + Math.floor(Math.random() * 6), 1 + Math.floor(Math.random() * 6)];
    cubes.forEach(function (c, i) { if (c) c.className = 'cube spin show-' + state.dice[i]; });
    if (Date.now() - t0 >= dur) {
      clearInterval(state.rollIv);
      state.rollIv = null;
      state.dice = [1 + Math.floor(Math.random() * 6), 1 + Math.floor(Math.random() * 6)];
      var dub = state.dice[0] === state.dice[1] && (state.dice[0] === 1 || state.dice[0] === 6);
      var room = state.jokers[state.turn].length < 2;
      if (dub && room) {
        state.phase = 'pickJoker';
        state.jPick = true;
        render();
        startClock();
      } else {
        state.phase = 'choose';
        render();
        startClock();
      }
    }
  }, 90);
};

function srcVal(src) {
  if (src.t === 'd') return state.dice[src.i];
  return state.jokers[src.p][src.i];
}

function applyChain() {
  var ch = state.chain;
  if (ch.length === 3 && !state.jMode) {
    return compute(srcVal(ch[0]), ch[1], srcVal(ch[2]));
  }
  if (ch.length === 5 && state.jMode) {
    var mid = compute(srcVal(ch[0]), ch[1], srcVal(ch[2]));
    if (mid == null) return null;
    return compute(mid, ch[3], srcVal(ch[4]));
  }
  return null;
}

function finishValue(raw) {
  if (!legalValue(raw)) { flashInvalid(state.selOp || (state.chain[1] || '+')); return false; }
  var idx = raw - 1, p = state.turn;
  if (!state.alive[p][idx]) { flashMissing(raw, p, idx); return false; }
  stopClock();
  state.chain.forEach(function (c) {
    if (c && c.t === 'j') state.jokers[c.p].splice(c.i, 1);
  });
  if (typeof playSuccess === 'function') playSuccess();
  state.phase = 'lock';
  state.alive[p][idx] = false;
  state.blink = { p: p, i: idx };
  state.finishedThisTurn = cleared(p);
  state.jMode = false;
  state.jLocked = false;
  state.jPick = false;
  render();
  if (state.blinkT) clearTimeout(state.blinkT);
  state.blinkT = setTimeout(function () {
    state.blinkT = null;
    state.blink = null;
    state.chain = [];
    clearSel();
    afterPlay();
  }, 2000);
  return true;
}

function pickSource(src) {
  if (state.phase !== 'choose' || state.turn == null) return;
  var need = state.jMode ? 5 : 3;
  if (state.chain.length === 0 || (state.chain.length === 2 && state.jMode) || (state.chain.length === 2 && !state.jMode) || (state.chain.length === 4 && state.jMode)) {
    if (state.chain.length === 0) {
      state.jLocked = true;
      state.chain = [src];
      state.selDie = src.t === 'd' ? src.i : null;
      render();
      return;
    }
    var last = state.chain[state.chain.length - 1];
    if (typeof last !== 'string') return;
    var used = state.chain.filter(function (c) { return c && c.t; });
    for (var u = 0; u < used.length; u++) {
      if (used[u].t === src.t && used[u].i === src.i && used[u].p === src.p) return;
    }
    state.chain.push(src);
    if (src.t === 'd') state.selDie2 = src.i;
    render();
    if (state.chain.length === need) {
      var raw = applyChain();
      finishValue(raw);
    }
    return;
  }
  if (src.t === 'd' && state.chain[0] && state.chain[0].t === 'd' && state.chain[0].i === src.i && state.chain.length === 1) {
    state.chain = [];
    state.jLocked = false;
    clearSel();
    render();
  }
}

var _bind11 = bindTable;
bindTable = function () {
  _bind11();
  app.querySelectorAll('.pas').forEach(function (b) { b.style.display = 'none'; });
  app.querySelectorAll('.jbtn').forEach(function (b) {
    b.onclick = function (e) {
      e.preventDefault();
      e.stopPropagation();
      var p = parseInt(b.dataset.j, 10);
      if (state.turn !== p || state.phase !== 'choose') return;
      if (state.jLocked) return;
      if (!state.jokers[p].length) return;
      state.jMode = !state.jMode;
      state.chain = [];
      clearSel();
      render();
    };
  });
  app.querySelectorAll('.mdie.pickable').forEach(function (el) {
    el.onclick = function (e) {
      e.stopPropagation();
      if (state.phase !== 'pickJoker') return;
      var n = parseInt(el.dataset.jv, 10);
      var p = state.turn;
      if (state.jokers[p].length >= 2) return;
      state.jokers[p].push(n);
      state.jPick = false;
      state.phase = 'choose';
      stopClock();
      render();
      startClock();
    };
  });
  app.querySelectorAll('.mdie.owned').forEach(function (el) {
    el.onclick = function (e) {
      e.stopPropagation();
      if (state.phase !== 'choose' || !state.jMode) return;
      var p = parseInt(el.closest('.half').dataset.p, 10);
      if (p !== state.turn) return;
      var i = parseInt(el.getAttribute('data-ji'), 10);
      pickSource({ t: 'j', i: i, p: p });
    };
  });
  app.querySelectorAll('.op').forEach(function (el) {
    el.onclick = function () {
      if (state.phase !== 'choose') return;
      if (!state.chain.length) return;
      var last = state.chain[state.chain.length - 1];
      if (typeof last === 'string') {
        state.chain[state.chain.length - 1] = el.dataset.op;
      } else {
        if (state.chain.length === 1 || (state.jMode && state.chain.length === 3)) {
          state.chain.push(el.dataset.op);
        } else return;
      }
      state.selOp = el.dataset.op;
      render();
    };
  });
  app.querySelectorAll('.die-wrap').forEach(function (el) {
    el.onclick = function () {
      if (state.phase !== 'choose') return;
      var i = parseInt(el.dataset.die, 10);
      pickSource({ t: 'd', i: i, p: state.turn });
    };
  });
  paintClock();
};

var _inv11 = flashInvalid;
flashInvalid = function (op) {
  state.chain = [];
  state.jLocked = false;
  _inv11(op);
};
var _miss11 = flashMissing;
flashMissing = function (val, p, idx) {
  state.chain = [];
  state.jLocked = false;
  _miss11(val, p, idx);
};

var _after11 = afterPlay;
afterPlay = function () {
  stopClock();
  state.jMode = false;
  state.jLocked = false;
  state.jPick = false;
  state.chain = [];
  _after11();
};

var _rv11 = resultView;
if (typeof resultView === 'function') {
  resultView = function () {
    _rv11();
    var v = document.querySelector('.ver');
    if (v) v.textContent = 'V11';
  };
}

if (state.screen === 'home') home();
else render();
