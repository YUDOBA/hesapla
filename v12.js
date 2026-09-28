var _home12 = home;
home = function () {
  _home12();
  var v = document.querySelector('.ver');
  if (v) v.textContent = 'V12';
};

var _half12 = halfHtml;
halfHtml = function (p) {
  var html = _half12(p);
  if (html.indexOf('class="midkit"') >= 0) return html;
  var canJ = state.jokers[p] && state.jokers[p].length && state.turn === p && state.phase === 'choose' && !state.jLocked;
  var jcls = 'jbtn' + (state.jMode && state.turn === p ? ' on' : '') + (canJ ? '' : ' off');
  var lamp = (state.turn === p) ? '<div class="turn-dot holdable"><span class="dfill"></span></div>' : '';
  var mid = '<div class="midkit">' + lamp + '<button type="button" class="' + jcls + '" data-j="' + p + '">J</button>' + jokerHud(p) + '</div>';
  return html.replace('</span><span class="stats', '</span>' + mid + '<span class="stats');
};

var _bind12 = bindTable;
bindTable = function () {
  _bind12();
  app.querySelectorAll('.midkit .jbtn').forEach(function (b) {
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
  app.querySelectorAll('.midkit .mdie.pickable').forEach(function (el) {
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
  app.querySelectorAll('.midkit .mdie.owned').forEach(function (el) {
    el.onclick = function (e) {
      e.stopPropagation();
      if (state.phase !== 'choose' || !state.jMode) return;
      var p = parseInt(el.closest('.half').dataset.p, 10);
      if (p !== state.turn) return;
      pickSource({ t: 'j', i: parseInt(el.getAttribute('data-ji'), 10), p: p });
    };
  });
  app.querySelectorAll('.midkit .turn-dot.holdable').forEach(function (dot) {
    var hold = null;
    function cancel() {
      if (hold) { clearTimeout(hold); hold = null; }
      dot.classList.remove('holding');
    }
    dot.onpointerdown = function (e) {
      e.preventDefault();
      e.stopPropagation();
      var p = parseInt(dot.closest('.half').dataset.p, 10);
      if (state.turn !== p) return;
      if (state.phase !== 'choose' && state.phase !== 'pickJoker') return;
      dot.classList.add('holding');
      hold = setTimeout(function () {
        hold = null;
        dot.classList.remove('holding');
        state.jPick = false;
        state.jMode = false;
        state.jLocked = false;
        state.chain = [];
        clearSel();
        state.finishedThisTurn = false;
        afterPlay();
      }, 500);
    };
    dot.onpointerup = dot.onpointerleave = dot.onpointercancel = cancel;
  });
};

var _rv12 = resultView;
if (typeof resultView === 'function') {
  resultView = function () {
    _rv12();
    var v = document.querySelector('.ver');
    if (v) v.textContent = 'V12';
  };
}

if (state.screen === 'home') home();
else if (state.screen === 'play') render();
