/**
 * Shared helpers: detail URLs, Google Translate (FR → EN), search redirect.
 */
(function () {
  function injectTranslateStylesheet() {
    if (document.getElementById('cinematheque-translate-css')) return;
    var link = document.createElement('link');
    link.id = 'cinematheque-translate-css';
    link.rel = 'stylesheet';
    link.href = 'assets/css/google-translate.css';
    document.head.appendChild(link);
  }

  window.SiteCommon = {
    /** Fisher–Yates shuffle (copy) — random order on each page load. */
    shuffleArray: function (array) {
      var arr = array.slice();
      for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = arr[i];
        arr[i] = arr[j];
        arr[j] = t;
      }
      return arr;
    },

    detailHref: function (type, title) {
      return (
        'detail.html?type=' +
        encodeURIComponent(type) +
        '&title=' +
        encodeURIComponent(title)
      );
    },

    /** Call once per page (e.g. on DOMContentLoaded). Loads Google Translate script. */
    initGoogleTranslate: function () {
      if (window._gtInitScheduled) return;
      window._gtInitScheduled = true;
      injectTranslateStylesheet();

      window.googleTranslateElementInit = function () {
        if (!window.google || !google.translate) return;
        new google.translate.TranslateElement(
          {
            pageLanguage: 'fr',
            includedLanguages: 'en,fr',
            layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
            /* Do not auto-open the translate widget / top bar */
            autoDisplay: false,
          },
          'google_translate_element'
        );
      };
      var s = document.createElement('script');
      s.src =
        'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      s.async = true;
      document.head.appendChild(s);
    },
  };

  // Wire up custom toggle buttons globally via event delegation and auto-init GT if English selected
  document.addEventListener("DOMContentLoaded", function() {
    var isEn = document.cookie.indexOf('googtrans=/fr/en') !== -1 || document.cookie.indexOf('googtrans=/auto/en') !== -1;
    if (isEn && window.SiteCommon && window.SiteCommon.initGoogleTranslate) {
      window.SiteCommon.initGoogleTranslate();
    }
    
    document.body.addEventListener('click', function(e) {
      var icon = e.target.closest('[data-icon="language"]');
      if (icon) {
        e.preventDefault();
        var currentlyEn = document.cookie.indexOf('googtrans=/fr/en') !== -1 || document.cookie.indexOf('googtrans=/auto/en') !== -1;
        if (currentlyEn) {
          // Switch back to original (French)
          document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + location.hostname;
          document.cookie = "googtrans=/fr/fr; path=/;";
          location.reload();
        } else {
          // Switch to English
          document.cookie = "googtrans=/fr/en; path=/;";
          location.reload();
        }
      }
    });
  });
})();
