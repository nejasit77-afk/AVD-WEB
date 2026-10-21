// Номер счётчика Яндекс Метрики
var METRIKA_ID = 113719924;

// Ключ, под которым запоминается выбор посетителя по cookies
var CONSENT_KEY = 'cookie_consent';

function getConsent() {
  try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; }
}

function setConsent(value) {
  try { localStorage.setItem(CONSENT_KEY, value); } catch (e) { /* приватный режим — просто не запоминаем */ }
}

// Подключение Метрики. Вызывается только после согласия посетителя.
function loadMetrika() {
  if (window.ym) return;
  (function (m, e, t, r, i, k, a) {
    m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); };
    m[i].l = 1 * new Date();
    for (var j = 0; j < document.scripts.length; j++) {
      if (document.scripts[j].src === r) { return; }
    }
    k = e.createElement(t); a = e.getElementsByTagName(t)[0];
    k.async = 1; k.src = r; a.parentNode.insertBefore(k, a);
  })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');

  ym(METRIKA_ID, 'init', {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true
  });
}

// Отправка цели в Метрику. Если посетитель отказался от cookies, ничего не уходит.
function reachGoal(goal, params) {
  if (typeof window.ym === 'function') {
    ym(METRIKA_ID, 'reachGoal', goal, params || {});
  }
}

// Цели на клики: элементы с атрибутом data-goal.
// click_order — кнопки «Заказать» (в параметре service — какая услуга),
// click_phone — клик по телефону, click_email — клик по почте.
document.addEventListener('click', function (event) {
  var el = event.target.closest('[data-goal]');
  if (!el) return;
  var params = el.dataset.service ? { service: el.dataset.service } : {};
  reachGoal(el.dataset.goal, params);
});

// Cookie-баннер
(function () {
  var banner = document.getElementById('cookie');
  var consent = getConsent();

  if (consent === 'accepted') {
    loadMetrika();
    return;
  }
  if (consent === 'declined' || !banner) return;

  banner.hidden = false;
  banner.addEventListener('click', function (event) {
    var btn = event.target.closest('[data-cookie]');
    if (!btn) return;
    var accepted = btn.dataset.cookie === 'accept';
    setConsent(accepted ? 'accepted' : 'declined');
    banner.hidden = true;
    if (accepted) loadMetrika();
  });
})();

// Мобильное меню
(function () {
  var burger = document.querySelector('.header__burger');
  var nav = document.getElementById('nav');
  if (!burger || !nav) return;

  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
  });

  nav.addEventListener('click', function (event) {
    if (event.target.tagName === 'A') {
      nav.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });
})();
