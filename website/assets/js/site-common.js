/**
 * Shared helpers: detail URLs, Google Translate (FR → EN), search redirect.
 */
(function () {
  window.SiteCommon = {
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
      window.googleTranslateElementInit = function () {
        if (!window.google || !google.translate) return;
        new google.translate.TranslateElement(
          {
            pageLanguage: 'fr',
            includedLanguages: 'en,fr',
            layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
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
})();
