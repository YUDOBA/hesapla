state.gate = state.gate || 'pick';
function chromeVer() {
  var v = document.querySelector('.ver');
  if (v) v.textContent = 'V18';
}
function homeChrome() {
  if (!document.querySelector('.brand')) {
    var h1 = document.querySelector('.home h1');
    var img = document.createElement('img');
    img.className = 'brand';
    img.src = 'icon.svg?v=18';
    img.alt = 'HESAPLA';
    if (h1) h1.replaceWith(img);
    else document.querySelector('.home').insertBefore(img, document.querySelector('.home').firstChild);
  }
  if (!document.querySelector('.yudoba-img')) {
    var yi = document.createElement('img');
    yi.className = 'yudoba-img';
    yi.src = 'yudoba.svg?v=12';
    yi.alt = 'YUDOBA';
    document.querySelector('.home').appendChild(yi);
  }
  if (!document.getElementById('rulesbtn')) {
    var b = document.createElement('button');
    b.id = 'rulesbtn';
    b.type = 'button';
    b.className = 'rules-home';
    b.textContent = 'KURALLAR';
    b.onclick = function () { openRules('home', false); };
    var host = document.querySelector('.home');
    host.appendChild(b);
  }
  chromeVer();
}
function renderGate() {
  app.innerHTML = '<div class="home gate">' +
    '<img class="brand" src="icon.svg?v=18" alt="HESAPLA" />' +
    '<button type="button" class="gatebtn" id="g-local">Yerel</button>' +
    '<button type="button" class="gatebtn" id="g-on">Cevrimici</button>' +
    '<button type="button" class="rules-home" id="rulesbtn">KURALLAR</button>' +
    '<div class="ver">V18</div>' +
    '<img class="yudoba-img" src="yudoba.svg?v=12" alt="YUDOBA" />' +
    '</div>';
  document.getElementById('g-local').onclick = function () {
    state.gate = 'local'; state.online = false; home();
  };
  document.getElementById('g-on').onclick = function () {
    state.gate = 'online'; state.online = false; home();
  };
  document.getElementById('rulesbtn').onclick = function () { openRules('home', false); };
}
function renderOnlineSetup() {
  var n = state.netNick || '';
  var tr = state.totalRounds || 4;
  var ts = state.turnSec || 10;
  var rounds = [2,4,6,8,10].map(function (x) {
    return '<option value="' + x + '"' + (x === tr ? ' selected' : '') + '>' + x + '</option>';
  }).join('');
  var secs = [5,10,15,20,25,30].map(function (x) {
    return '<option value="' + x + '"' + (x === ts ? ' selected' : '') + '>' + x + '</option>';
  }).join('');
  app.innerHTML = '<div class="home">' +
    '<img class="brand" src="icon.svg?v=18" alt="HESAPLA" />' +
    '<label>Nick</label><input id="onick" maxlength="14" value="' + esc(n) + '" placeholder="Nick" />' +
    '<label>Tur sayisi</label><select id="orounds">' + rounds + '</select>' +
    '<label>Sure</label><select id="osecs">' + secs + '</select>' +
    '<div class="netrow">' +
    '<button type="button" class="netbtn" id="ohost">Oda kur</button>' +
    '<button type="button" class="netbtn" id="ojoin">Odaya gir</button>' +
    '</div>' +
    '<button type="button" class="start" id="oback">Geri</button>' +
    '<button type="button" class="rules-home" id="rulesbtn">KURALLAR</button>' +
    '<div class="ver">V18</div>' +
    '<img class="yudoba-img" src="yudoba.svg?v=12" alt="YUDOBA" />' +
    '</div>';
  function readForm() {
    state.netNick = (document.getElementById('onick').value || '').trim();
    state.totalRounds = parseInt(document.getElementById('orounds').value, 10) || 4;
    state.turnSec = parseInt(document.getElementById('osecs').value, 10) || 10;
    return state.netNick;
  }
  document.getElementById('ohost').onclick = function () {
    if (!readForm()) { alert('Nick yaz'); return; }
    state.nick[0] = state.netNick;
    openHost();
  };
  document.getElementById('ojoin').onclick = function () {
    if (!readForm()) { alert('Nick yaz'); return; }
    state.nick[1] = state.netNick;
    openJoinCode();
  };
  document.getElementById('oback').onclick = function () { state.gate = 'pick'; home(); };
  document.getElementById('rulesbtn').onclick = function () { openRules('home', false); };
}
function openJoinCode() {
  waitHtml('Gir', '<p class="waitlab">Oda kodu</p>' +
    '<input id="jc" maxlength="6" placeholder="KOD" style="text-transform:uppercase" />' +
    '<button type="button" class="start" id="jgo">Baglan</button>');
  chromeVer();
  document.getElementById('jgo').onclick = function () {
    var code = (document.getElementById('jc').value || '').trim().toUpperCase();
    if (code.length < 4) { alert('Kod yaz'); return; }
    var nick = state.netNick || state.nick[1];
    if (!nick) { alert('Nick yaz'); state.gate = 'online'; home(); return; }
    state.nick[1] = nick;
    state.seat = 1;
    state.host = false;
    state.online = true;
    state.room = code;
    if (typeof Peer === 'undefined') { alert('Baglanti yok'); return; }
    net.peer = new Peer();
    net.peer.on('open', function () {
      var c = net.peer.connect(peerId(code), { reliable: true });
      c.on('open', function () { wireConn(c); send({ t: 'hello', nick: nick }); });
      c.on('error', function () { alert('Oda bulunamadi'); closeNet(); state.gate = 'online'; home(); });
    });
    net.peer.on('error', function () { alert('Baglanamadi'); closeNet(); state.gate = 'online'; home(); });
  };
}
var _home18 = home;
home = function () {
  if (!state.gate || state.gate === 'pick') {
    renderGate();
    return;
  }
  if (state.gate === 'online') {
    renderOnlineSetup();
    return;
  }
  _home18();
  var nr = document.getElementById('netrow');
  if (nr) nr.remove();
  var go = document.getElementById('go');
  if (go) {
    go.style.display = '';
    go.textContent = 'OYUNU BASLAT';
    var a = document.getElementById('n0');
    var b = document.getElementById('n1');
    go.disabled = !(a && b && a.value.trim() && b.value.trim());
    go.onclick = function () {
      state.online = false;
      if (a) state.nick[0] = a.value.trim();
      if (b) state.nick[1] = b.value.trim();
      if (!state.nick[0] || !state.nick[1]) { alert('Iki nick yaz'); return; }
      var s = document.getElementById('secs');
      if (s) state.turnSec = parseInt(s.value, 10) || 10;
      var r = document.getElementById('rounds');
      if (r) state.totalRounds = parseInt(r.value, 10) || 4;
      startGame();
    };
  }
  if (!document.getElementById('lback')) {
    var back = document.createElement('button');
    back.id = 'lback';
    back.type = 'button';
    back.className = 'start';
    back.textContent = 'Geri';
    back.onclick = function () { state.gate = 'pick'; home(); };
    if (go) go.insertAdjacentElement('afterend', back);
  }
  chromeVer();
};
var _leave18 = leaveRoom;
leaveRoom = function () {
  state.gate = 'pick';
  _leave18();
};
var _wait18 = waitHtml;
waitHtml = function (title, body) {
  _wait18(title, body);
  chromeVer();
  var nb = document.getElementById('netback');
  if (nb) nb.onclick = function () { closeNet(); state.gate = 'online'; home(); };
};
if (state.screen === 'home') home();
