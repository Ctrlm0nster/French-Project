/**
 * Shared helpers: detail URLs, Google Translate (FR ↔ EN), search redirect.
 */
(function () {

  /* ── Google Translate bootstrap ───────────────────────────────────────── */
  function bootTranslate() {
    // Hidden container required by Google Translate API
    if (!document.getElementById('google_translate_element')) {
      var div = document.createElement('div');
      div.id = 'google_translate_element';
      div.style.cssText = 'position:fixed;bottom:-9999px;left:-9999px;visibility:hidden;pointer-events:none;';
      document.body.appendChild(div);
    }

    // Inject CSS overrides (hides Google bar, styles the select)
    if (!document.getElementById('cinematheque-translate-css')) {
      var link = document.createElement('link');
      link.id = 'cinematheque-translate-css';
      link.rel = 'stylesheet';
      link.href = 'assets/css/google-translate.css';
      document.head.appendChild(link);
    }

    // Called by Google after their script loads
    window.googleTranslateElementInit = function () {
      if (!window.google || !window.google.translate) return;
      new window.google.translate.TranslateElement({
        pageLanguage: 'fr',
        includedLanguages: 'en,fr',
        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false,
      }, 'google_translate_element');
    };

    // Load the Google Translate script (idempotent guard)
    if (!document.getElementById('gt-script')) {
      var s = document.createElement('script');
      s.id = 'gt-script';
      s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      s.async = true;
      document.head.appendChild(s);
    }
  }

  /* ── Public SiteCommon API ─────────────────────────────────────────────── */
  window.SiteCommon = {
    /** Fisher-Yates shuffle (non-mutating). */
    shuffleArray: function (array) {
      var arr = array.slice();
      for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
      }
      return arr;
    },

    detailHref: function (type, title) {
      return 'detail.html?type=' + encodeURIComponent(type) + '&title=' + encodeURIComponent(title);
    },

    /** Legacy - kept for backwards compatibility. */
    initGoogleTranslate: function () { bootTranslate(); },
  };

  /* ── DOM Ready ─────────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    // Always boot Google Translate so it's ready when user clicks
    bootTranslate();

    function isEnglish() {
      return document.cookie.indexOf('googtrans=/fr/en') !== -1 ||
             document.cookie.indexOf('googtrans=/auto/en') !== -1;
    }

    // Update language button visual to reflect current state
    function updateLangButtons() {
      var en = isEnglish();
      document.querySelectorAll('[data-icon="language"]').forEach(function (el) {
        var btn = el.closest('button');
        if (btn) {
          btn.setAttribute('title', en ? 'Passer en Francais' : 'Switch to English');
          btn.style.color = en ? '#c084fc' : '';
        }
      });
    }
    updateLangButtons();

    // Toggle translate on click of any language-icon button
    document.body.addEventListener('click', function (e) {
      var btn = e.target.closest('button');
      if (!btn) return;
      var icon = btn.querySelector('[data-icon="language"]');
      if (!icon) return;
      e.preventDefault();

      if (isEnglish()) {
        // Reset to French
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + location.hostname;
        document.cookie = 'googtrans=/fr/fr; path=/;';
        document.cookie = 'googtrans=/fr/fr; path=/; domain=' + location.hostname;
      } else {
        // Switch to English
        document.cookie = 'googtrans=/fr/en; path=/;';
        document.cookie = 'googtrans=/fr/en; path=/; domain=' + location.hostname;
      }
      location.reload();
    });
  });
})();
