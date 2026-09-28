state.rulesFrom = 'home';
state.rulesFlip = false;
function openRules(from, flip) {
  state.rulesFrom = from || 'home';
  state.rulesFlip = !!flip;
  state.screen = 'rules';
  render();
}
function closeRules() {
  state.screen = state.rulesFrom === 'play' ? 'play' : 'home';
  render();
}
var _renderRules = render;
render = function () {
  if (state.screen === 'rules') { rulesView(); return; }
  _renderRules();
};
var _homeRules = home;
home = function () {
  _homeRules();
  var go = document.getElementById('go');
  if (go && !document.getElementById('rulesbtn')) {
    var b = document.createElement('button');
    b.id = 'rulesbtn';
    b.type = 'button';
    b.className = 'rules-home';
    b.textContent = 'KURALLAR';
    b.onclick = function () { openRules('home', false); };
    go.insertAdjacentElement('afterend', b);
  }
  var h1 = document.querySelector('.home h1');
  if (h1 && !document.querySelector('.brand')) {
    var img = document.createElement('img');
    img.className = 'brand';
    img.src = 'icon.svg?v=12';
    img.alt = 'HESAPLA';
    h1.replaceWith(img);
  }
  var y = document.querySelector('.yudoba');
  if (y) {
    var yi = document.createElement('img');
    yi.className = 'yudoba-img';
    yi.src = 'yudoba.svg?v=12';
    yi.alt = 'YUDOBA';
    y.replaceWith(yi);
  }
  var v = document.querySelector('.ver');
  if (v) v.textContent = 'V12';
};
pesHtml = function (p) {
  var open = state.pesOpen[p] ? ' open' : '';
  var h = '<div class="pes-rail' + open + '" data-pes="' + p + '">';
  h += '<div class="pes-line"></div>';
  h += '<button class="pes-btn" type="button">PES</button>';
  h += '<button class="pes-rules" type="button">KURALLAR</button>';
  h += '</div>';
  if (state.pesAsk === p) {
    h += '<div class="pes-ask"><p>Emin misiniz?</p><button class="pes-ok" type="button">OK</button><button class="pes-no" type="button">Vazgec</button></div>';
  }
  return h;
};
var _bindPesRules = bindPes;
bindPes = function () {
  _bindPesRules();
  app.querySelectorAll('.pes-rules').forEach(function (b) {
    b.onclick = function (e) {
      e.stopPropagation();
      var p = parseInt(b.closest('.pes-rail').dataset.pes, 10);
      openRules('play', p === 1);
    };
  });
};
function rulesView() {
  var items = [
    ['1. Duzen', 'Iki kisi, ayni telefon, dikey. Ust yari rakibe ters durur.', 'Telefonu yatay cevirmeyin.'],
    ['2. Baslangic', 'Iki nick zorunlu. Tur 2-4-6-8-10. Sure 5-30, varsayilan 10.', 'Nick bosse baslamaz.'],
    ['3. El', 'ZAR sonrasi gecerli islem, sure dolumu veya yesil lambaya 0.5 sn basili tutunca el biter.', 'PAS butonu yok. Zar atmadan lamba pas vermez.'],
    ['4. Islem', 'Zar, islem, zar. Jokersiz eski kural.', 'Ilk zara tekrar basarak iptal.'],
    ['5. Gecerli sonuc', 'Sonuc 1-12. Soldan saga: 6-2x3=12.', 'Once carpma yok.'],
    ['6. Daire yoksa', 'Daire soluksa islem olmaz.', 'Sure durmaz.'],
    ['7. Soluklasma', 'Daire 2 sn yanip solar.', ''],
    ['8. Sure', 'Zar durunca (joker seciminden sonra) N den geri sayar.', '0 olunca sira gecer.'],
    ['9. Tur bitisi', 'Tura kim basladiysa son el digerinde.', ''],
    ['10. Puan', 'Tur +1. Beraberlikte iki tarafa +1. Kalan toplam ceza.', ''],
    ['11. Sonraki tur', 'Kaybeden baslar.', 'Yesil lamba: sira sende.'],
    ['12. Oyun sonu', 'Cok tur alan kazanir. Tur esitse az ceza.', ''],
    ['13. PES', '1 ve 7 solundaki cizgiden kaydir.', 'PES diyen kaybeder.'],
    ['14. Lamba pas', 'Yesil lambaya 0.5 sn basili tut. Erken birakilirsa pas olmaz.', 'Zar geldikten sonra.'],
    ['15. Joker', '1x1 veya 6x6 ve yer varsa 1-6 yuz. En fazla 2.', 'Bir elde 1 joker.'],
    ['16. J zinciri', 'J acik: zar islem zar islem zar. Ilk kaynaktan sonra J kilit.', 'J kapaliysa iki zar.']
  ];
  var body = items.map(function (it) {
    return '<article><h3>' + it[0] + '</h3><p>' + it[1] + '</p><p class="warn">' + it[2] + '</p></article>';
  }).join('');
  app.innerHTML = '<div class="rules' + (state.rulesFlip ? ' flip' : '') + '">' +
    '<button class="rules-back" type="button" id="rulesback">Geri</button>' +
    '<div class="rules-scroll"><h1>KURALLAR</h1>' + body + '</div></div>';
  document.getElementById('rulesback').onclick = closeRules;
}
var _resultView = resultView;
resultView = function () {
  _resultView();
  var v = document.querySelector('.ver');
  if (v) v.textContent = 'V12';
};
if (state.screen === 'home') home();
