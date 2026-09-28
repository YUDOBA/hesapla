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
    img.src = 'icon.svg?v=11';
    img.alt = 'HESAPLA';
    h1.replaceWith(img);
  }
  var y = document.querySelector('.yudoba');
  if (y) {
    var yi = document.createElement('img');
    yi.className = 'yudoba-img';
    yi.src = 'yudoba.svg?v=11';
    yi.alt = 'YUDOBA';
    y.replaceWith(yi);
  }
  var v = document.querySelector('.ver');
  if (v) v.textContent = 'V11';
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
    ['3. El', 'Sira sende ise ZAR. Gecerli islem veya sure dolumu eli bitirir.', 'PAS yoktur. Sure 0 olunca sira gecer.'],
    ['4. Islem', 'Zar, islem, zar. Ikinci zar kilitle. Jokersiz eski kural.', 'Ilk zara tekrar basarak iptal.'],
    ['5. Gecerli sonuc', 'Sonuc 1-12 tam sayi ve daire acik. Soldan saga: 6-2x3=12.', 'Once carpma yok. 2-6 gecersiz.'],
    ['6. Daire yoksa', 'Matematik dogru olsa da daire soluksa islem olmaz.', 'Uyari gelir. Sure durmaz.'],
    ['7. Soluklasma', 'Gecerli islemde daire 2 sn yanip solar.', 'Sure bitince sira rakibe.'],
    ['8. Sure', 'Zar durunca (joker secimi varsa ondan sonra) N den geri sayar.', 'Joker seciminde de sure akar, 0 ise joker alinmaz ve sira gecer.'],
    ['9. Tur bitisi', 'Tura kim basladiysa son el digerinde.', 'Baslayan 12 bitirdi: rakibe bir el.'],
    ['10. Puan', 'Tur kazanan +1. Beraberlikte iki tarafa +1. Kalan toplam ceza.', ''],
    ['11. Sonraki tur', 'Kaybeden baslar. Beraberlikte onceki tura baslamayan baslar.', 'Yesil top: sira sende.'],
    ['12. Oyun sonu', 'Cok tur alan kazanir. Tur esitse az ceza alan kazanir.', 'Tur dolmadan sonuc PES ile.'],
    ['13. PES', '1 ve 7 solundaki cizgiden kaydir.', 'PES diyen kaybeder.'],
    ['14. Joker', '1x1 veya 6x6 ve yer varsa 1-6 yuz sec. En fazla 2. Bu elde kullanilabilir.', 'Cephane 2 ise yeni joker yok. Bir elde 1 joker.'],
    ['15. J zinciri', 'J acik: zar islem zar islem zar. Ilk kaynaktan sonra J kilit.', 'J kapaliysa iki zar.']
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
  if (v) v.textContent = 'V11';
};
if (state.screen === 'home') home();
