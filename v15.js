function scoreTitle() {
  if (state.scoreFinal) {
    if (state.scoreKind === 'pes') return state.nick[state.scorePes] + ' PES';
    if (state.wins[0] !== state.wins[1]) {
      var w = state.wins[0] > state.wins[1] ? 0 : 1;
      return state.nick[w] + ' kazandi';
    }
    if (state.penalty[0] !== state.penalty[1]) {
      var w2 = state.penalty[0] < state.penalty[1] ? 0 : 1;
      return state.nick[w2] + ' kazandi';
    }
    return 'Berabere';
  }
  if (state.scoreKind === 'draw') return 'Tur ' + state.round + ' berabere';
  return 'Tur ' + state.round + ' \u00b7 ' + state.nick[state.scoreWinner];
}
function scoreBtnLabel() {
  if (state.scoreFinal) return 'Yeni oyun';
  return state.scoreLast ? 'Sonuc' : 'Sonraki tur';
}
function scoreHalfHtml(p) {
  var o = 1 - p;
  var title = scoreTitle();
  var btn = scoreBtnLabel();
  var h = '<div class="score-half ' + (p === 1 ? 'top' : 'bot') + '" data-sp="' + p + '">';
  h += '<div class="score-card">';
  h += '<h2>' + esc(title) + '</h2>';
  h += '<div class="score-me"><b>' + esc(state.nick[p]) + '</b>';
  h += '<span>Tur ' + state.wins[p] + '</span><span>Ceza ' + state.penalty[p] + '</span></div>';
  h += '<div class="score-op"><b>' + esc(state.nick[o]) + '</b>';
  h += '<span>Tur ' + state.wins[o] + '</span><span>Ceza ' + state.penalty[o] + '</span></div>';
  h += '<button type="button" class="score-go">' + btn + '</button>';
  h += '</div></div>';
  return h;
}
function onScoreGo() {
  if (state.scoreFinal) {
    state.screen = 'home';
    state.scoreKind = null;
    home();
    return;
  }
  if (state.scoreLast) {
    state.scoreFinal = true;
    if (state.scoreKind !== 'pes') state.scoreKind = 'end';
    scoreView();
    return;
  }
  if (state.scoreKind === 'draw') state.starter = 1 - state.starter;
  else state.starter = 1 - state.scoreWinner;
  state.screen = 'play';
  beginRound();
}
function scoreView() {
  app.innerHTML = '<div class="score">' + scoreHalfHtml(1) + scoreHalfHtml(0) +
    '<div class="ver">V15</div></div>';
  app.querySelectorAll('.score-go').forEach(function (b) {
    b.onclick = onScoreGo;
  });
}
var _renderScore = render;
render = function () {
  if (state.screen === 'score' || state.screen === 'result') {
    scoreView();
    return;
  }
  _renderScore();
};
var _end15 = endRound;
endRound = function (kind, winner) {
  if (kind === 'draw') { state.wins[0] += 1; state.wins[1] += 1; }
  else state.wins[winner] += 1;
  state.penalty[0] += remainingSum(0);
  state.penalty[1] += remainingSum(1);
  if (typeof stopClock === 'function') stopClock();
  state.overlay = null;
  state.scoreKind = kind;
  state.scoreWinner = winner;
  state.scorePes = null;
  state.scoreLast = state.round >= state.totalRounds;
  state.scoreFinal = false;
  state.screen = 'score';
  scoreView();
};
var _fin15 = finishGame;
finishGame = function () {
  if (typeof stopClock === 'function') stopClock();
  state.overlay = null;
  state.scoreFinal = true;
  if (!state.scoreKind || state.scoreKind === 'draw' || state.scoreWinner != null) state.scoreKind = state.scoreKind || 'end';
  state.screen = 'score';
  scoreView();
};
if (typeof showResult === 'function') {
  var _sr15 = showResult;
  showResult = function (kind, winner, pesLoser, title) {
    if (typeof stopClock === 'function') stopClock();
    state.overlay = null;
    state.scoreKind = kind;
    state.scoreWinner = winner;
    state.scorePes = pesLoser;
    state.scoreFinal = true;
    state.screen = 'score';
    scoreView();
  };
}
var _home15 = home;
home = function () {
  _home15();
  var v = document.querySelector('.ver');
  if (v) v.textContent = 'V15';
};
if (state.screen === 'home') home();
