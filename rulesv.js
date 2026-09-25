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
    img.src = 'icon.svg';
    img.alt = 'HESAPLA';
    h1.replaceWith(img);
  }
  var y = document.querySelector('.yudoba');
  if (y) {
    var yi = document.createElement('img');
    yi.className = 'yudoba-img';
    yi.src = 'yudoba.svg';
    yi.alt = 'YUDOBA';
    y.replaceWith(yi);
  }
  var v = document.querySelector('.ver');
  if (v) v.textContent = 'V8';
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
    ['1. Duzen', 'Iki kisi, ayni telefon, dikey. Ust yari rakibe ters durur.', 'Telefonu yatay cevirmeyin. Ana ekrandan acilinca dikey kilit denenir.'],
    ['2. Baslangic', 'Iki nick zorunlu. Tur 2-4-6-8-10. Ilk baslayan rastgele.', 'Nick bosse oyun baslamaz. Tur sayisi cift olmalidir.'],
    ['3. El', 'Sira sende ise ZAR. Bu elde bir gecerli islem veya PAS.', 'Otomatik pas yoktur. Zar gelmeden islem yapilmaz.'],
    ['4. Islem', 'Zar, sonra + - x bolu, sonra diger zar. Ikinci zar kilitle.', 'Ikinci zardan once ilk zara tekrar basarak iptal. Kilit sonrasi geri alinmaz.'],
    ['5. Gecerli sonuc', 'Sonuc 1-12 tam sayi ve daire acik olmali. 6-2=4, 6x2=12.', '2-6 gecersiz. 5/2 gecersiz. 0 a bolme yok. 1-12 disi gecersiz.'],
    ['6. Daire yoksa', 'Matematik dogru olsa da daire soluksa islem olmaz.', 'Bu sayi kalmamis uyarisi gelir. Yeni islem veya PAS.'],
    ['7. Soluklasma', 'Gecerli islemde daire 2 sn yanip solar.', 'Bu surede islem degismez. Sure bitince sira rakibe gecer.'],
    ['8. PAS', 'PAS a 1 saniye basili tut. Dolum erken birakilirsa iptal.', 'Tek dokunusla PAS olmaz.'],
    ['9. Tur bitisi', 'Tura kim basladiysa son el digerinde. Baslamayan 12 bitirdi: tur biter. Baslayan 12 bitirdi: rakibe bir el daha. O da bitirirse beraber.', 'Baslayan 12 bitirdi diye tur hemen kapanmaz.'],
    ['10. Puan', 'Tur kazanan +1. Beraberlikte iki tarafa +1. Kalan daire toplami cezaya yazilir.', 'Ceza tur icinde dusmez. Beraberlikte de ceza yazilir.'],
    ['11. Sonraki tur', 'Kaybeden baslar. Beraberlikte onceki tura baslamayan baslar.', 'Yesil top: sira sende. Cizgi: turu sen kapatirsin.'],
    ['12. Oyun sonu', 'Cok tur alan kazanir. Tur esitse az ceza alan kazanir. Ikisi esitse beraber.', 'Tur dolmadan sonuc yalniz PES ile acilir.'],
    ['13. PES', '1 ve 7 solundaki cizgiden kaydir. Onay sonrasi sonuc ekrani.', 'PES diyen skoru iyi olsa da kaybeder. Vazgec dersen oyun devam eder.'],
    ['14. Dokunma', 'Yalniz sirasi gelen kendi ZAR / PAS / zar / islem tuslarini kullanir.', 'Rakip sahaya basmak ise yaramaz.']
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
  if (v) v.textContent = 'V8';
};
if (state.screen === 'home') home();
