(function () {
  "use strict";
  let quotes = [];
  let activeQuote = null;

  window.GitHomeQuotes = {
    init(items) {
      quotes = Array.isArray(items) ? items : [];
      activeQuote = pickQuote();
      renderQuote(activeQuote);
      renderFooterQuote(quotes.find((q) => q.id === "taittiriya-2-1-1") || activeQuote);
      bind();
    },
    showRandom() {
      activeQuote = pickQuote(activeQuote && activeQuote.id);
      renderQuote(activeQuote);
      renderModal(activeQuote);
    },
    open() {
      renderModal(activeQuote || pickQuote());
      document.querySelector(".quote-overlay").hidden = false;
      document.querySelector(".quote-close").focus();
    }
  };

  function pickQuote(previousId) {
    if (!quotes.length) return null;
    const pool = quotes.length > 1 ? quotes.filter((quote) => quote.id !== previousId) : quotes;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function renderQuote(quote) {
    if (!quote) return;
    set("[data-quote='sanskrit']", quote.sanskrit);
    set("[data-quote='translation']", quote.translation);
    set("[data-quote='source']", `- ${quote.source} ${quote.reference}`);
  }

  function renderFooterQuote(quote) {
    if (!quote) return;
    set("[data-footer-quote='sanskrit']", quote.sanskrit);
    set("[data-footer-quote='translation']", `${quote.translation} - ${quote.source}`);
  }

  function renderModal(quote) {
    if (!quote) return;
    set("[data-modal-quote='sanskrit']", quote.sanskrit);
    set("[data-modal-quote='translation']", quote.translation);
    set("[data-modal-quote='source']", `- ${quote.source} ${quote.reference}`);
    set("[data-modal-quote='explanation']", quote.explanation);
  }

  function bind() {
    document.querySelectorAll("[data-random-quote]").forEach((button) => button.addEventListener("click", window.GitHomeQuotes.showRandom));
    document.querySelector("[data-open-quote]")?.addEventListener("click", window.GitHomeQuotes.open);
    document.querySelector("[data-another-quote]")?.addEventListener("click", window.GitHomeQuotes.showRandom);
    document.querySelector(".quote-close")?.addEventListener("click", close);
    document.querySelector(".quote-overlay")?.addEventListener("click", (event) => {
      if (event.target.classList.contains("quote-overlay")) close();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !document.querySelector(".quote-overlay")?.hidden) close();
      if (event.key === "Enter" && document.activeElement?.matches("[data-open-quote], [data-another-quote]")) window.GitHomeQuotes.showRandom();
    });
  }

  function close() {
    document.querySelector(".quote-overlay").hidden = true;
    document.querySelector("[data-open-quote]")?.focus();
  }

  function set(selector, value) {
    const node = document.querySelector(selector);
    if (node) node.textContent = value || "";
  }
})();
