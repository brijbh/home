(function () {
  "use strict";
  const cache = {};
  window.GitHomeData = {
    async load(name) {
      if (cache[name]) return cache[name];
      const response = await fetch(`data/${name}.json`, { cache: "no-cache" });
      if (!response.ok) throw new Error(`Unable to load ${name}.json`);
      cache[name] = await response.json();
      return cache[name];
    },
    async loadFrom(base, name) {
      if (cache[base + name]) return cache[base + name];
      if (new URLSearchParams(location.search).get("preview") === "draft") {
        const draft = localStorage.getItem(`git-home-draft-${name}`);
        if (draft) {
          const parsed = JSON.parse(draft);
          cache[base + name] = parsed && parsed.data ? parsed.data : parsed;
          return cache[base + name];
        }
      }
      const response = await fetch(`${base}data/${name}.json`, { cache: "no-cache" });
      if (!response.ok) throw new Error(`Unable to load ${name}.json`);
      cache[base + name] = await response.json();
      return cache[base + name];
    }
  };
})();
