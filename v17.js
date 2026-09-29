function leaveRoom() {
  if (state.online) {
    send({ t: 'leave', s: state.seat });
    if (state.host && typeof showResult === 'function' && !state.scoreFinal) {
      showResult('pes', 1 - state.seat, state.seat);
      hostPush();
    }
  }
  closeNet();
  state.screen = 'home';
  state.scoreKind = null;
  home();
}

var _wire17 = wireConn;
wireConn = function (c) {
  _wire17(c);
  var prev = c._ondata17;
  c.on('data', function (msg) {
    if (msg && msg.t === 'leave') {
      var who = msg.s;
      if (state.host && typeof showResult === 'function') {
        showResult('pes', 1 - who, who);
        hostPush();
      } else {
        state.scoreKind = 'pes';
        state.scorePes = who;
        state.scoreFinal = true;
        state.screen = 'score';
        scoreView();
      }
    }
  });
};

var _home17 = home;
home = function () {
  _home17();
  var v = document.querySelector('.ver');
  if (v) v.textContent = 'V17';
  var go = document.getElementById('go');
  if (go) {
    go.style.display = 'none';
    go.disabled = false;
  }
  var loc = document.getElementById('btnlocal');
  if (loc) {
    loc.onclick = function () {
      state.netMode = 'local';
      state.online = false;
      var a = document.getElementById('n0');
      var b = document.getElementById('n1');
      if (a) state.nick[0] = a.value.trim();
      if (b) state.nick[1] = b.value.trim();
      if (!state.nick[0] || !state.nick[1]) {
        alert('Yerel oyun icin iki nick yaz');
        return;
      }
      var s = document.getElementById('secs');
      if (s) state.turnSec = parseInt(s.value, 10) || 10;
      var r = document.getElementById('rounds');
      if (r) state.totalRounds = parseInt(r.value, 10) || 4;
      startGame();
    };
  }
};

var _sv17 = scoreView;
scoreView = function () {
  _sv17();
  var v = document.querySelector('.ver');
  if (v) v.textContent = 'V17';
  if (!state.online) return;
  app.querySelectorAll('.score-card').forEach(function (card) {
    if (card.querySelector('.score-leave')) return;
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'score-leave';
    b.textContent = 'Odadan cik';
    b.onclick = function (e) {
      e.preventDefault();
      e.stopPropagation();
      leaveRoom();
    };
    card.appendChild(b);
  });
};

if (state.screen === 'home') home();
else if (state.screen === 'score') scoreView();
