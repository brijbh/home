(async function () {
  "use strict";
  const page = document.body.dataset.page;
  const base = page === "apps" || page === "art" ? "../" : "";
  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const visible = (items) => (items || []).filter((item) => item.visible !== false).sort((a,b) => (a.order || 0) - (b.order || 0));
  const asset = (path) => path ? `${base}${path}` : "";
  try {
    const [site, apps, artwork, about] = await Promise.all([
      GitHomeData.loadFrom(base,"site"), GitHomeData.loadFrom(base,"apps"),
      GitHomeData.loadFrom(base,"artwork"), GitHomeData.loadFrom(base,"about").catch(() => null)
    ]);
    applyTheme(site); renderSiteIdentity(site); renderFooter(site);
    if (page === "home") renderHome(site, apps, artwork);
    if (page === "apps") renderApps(apps);
    if (page === "art") renderArt(artwork);
    if (page === "about" && about) renderAbout(about, site);
    setupReveals(site.motion);
  } catch (error) {
    console.error(error);
    document.querySelector("main")?.insertAdjacentHTML("afterbegin",'<p class="terminal">content_error: Start the site through a local web server so JSON files can load.</p>');
  }

  function applyTheme(site) {
    const t = site.theme || {};
    const map = {paper:"--paper",ink:"--ink",red:"--red",deepRed:"--deep-red",blue:"--blue",olive:"--olive",orange:"--orange",green:"--green",teal:"--teal"};
    Object.entries(map).forEach(([key, css]) => t[key] && document.documentElement.style.setProperty(css,t[key]));
    if (site.motion?.enabled === false) document.documentElement.classList.add("no-motion");
  }
  function renderSiteIdentity(site) {
    document.querySelectorAll("[data-site-name]").forEach(node => node.textContent = site.name || "Git Home");
    if (page === "home") document.title = `${site.name || "Git Home"} — ${site.fullName || "Brijesh Bhaskaran"}`;
  }
  function renderFooter(site) {
    document.querySelectorAll("[data-footer]").forEach((root) => {
      root.classList.add("compact-footer");
      root.innerHTML=`<div><strong>brij@home</strong>:~$ open <a href="${base}app-pages/app.html">--work</a> <a href="${base}art-pages/index.html">--art</a> <a href="${base}about.html">--about</a> <span class="cursor"></span></div><div>Concept, UX, design, and AI-assisted build by Brij.</div>`;
    });
  }
  function renderHome(site, apps, artwork) {
    text("[data-eyebrow]",site.eyebrow); text("[data-hero-heading]",site.heroHeading); text("[data-hero-supporting]",site.heroSupporting);
    const q=site.shloka||{}; html("[data-shloka]",`<div class="terminal-dots"><i></i><i></i><i></i></div><div class="terminal-command"><span class="prompt">brij@home</span>:~$ ${esc(q.sanskrit)} <span class="terminal-translit">${esc(q.transliteration)}</span><span class="cursor"></span></div>`);
    html("[data-page-links]",visible(site.pageLinks).map(x=>`<a class="page-link" href="${esc(x.href)}"><b>${esc(x.label)}</b></a>`).join(""));
    html("[data-models]",visible(site.mentalModels).map(x=>`<article class="model" style="--accent:${esc(x.color)}"><i class="model-icon">${x.id==="build"?"✦":"●"}</i><div><h3>${esc(x.title)}</h3><p>${esc(x.copy)}</p></div></article>`).join(""));
    html("[data-featured-apps]",visible(apps).filter(x=>x.featured).slice(0,3).map(storyCard).join(""));
    html("[data-artwork-preview]",visible(artwork).filter(x=>x.featured).slice(0,3).map((x,i)=>`<a class="art-mini" href="art-pages/index.html#${esc(x.id)}"><img src="${asset(x.thumbnail)}" alt="${esc(x.alt)}"><span><b>${esc(x.title)}</b><small>${i===0?"Single artwork page with previous / next controls.":i===1?"Card links into the art gallery and related work.":"A lighter entry point into the broader sketch archive."}</small><em>View piece →</em></span></a>`).join(""));
  }
  function storyCard(a) {
    const questions={hoodi:"How can prompt testing feel less chaotic?",kolampodu:"What makes a traditional pattern feel learnable?",domlur:"How can randomness become a usable visual system?"};
    const labels={hoodi:"Question",kolampodu:"Kolam systems",domlur:"Generative visual play"};
    return `<article class="story-card story-${esc(a.id)}"><a class="story-visual" style="--preview:${esc(a.previewColor)}" href="app-pages/app.html#${esc(a.id)}"><img src="${asset(a.coverImage)}" alt="${esc(a.name)} preview"></a><div><p class="eyebrow">${labels[a.id]||esc(a.type)}</p><h3 class="story-question">${esc(questions[a.id]||a.question)}</h3><p class="story-copy">${esc(a.shortDescription)}</p><div class="story-links"><a class="button" href="app-pages/app.html#${esc(a.id)}">${a.id==="hoodi"?"Read story":"Open project page"} →</a>${a.id==="hoodi"&&real(a.websiteUrl)?`<a class="button ghost" href="${esc(externalUrl(a.websiteUrl))}">Visit site</a>`:""}</div></div></article>`;
  }
  function renderApps(apps) {
    const ordered=visible(apps), index=document.querySelector("[data-app-index]"), study=document.querySelector("[data-case-study]");
    html("[data-app-grid]",ordered.map(a=>`<article class="app-card" style="--preview:${esc(a.previewColor)}"><div class="app-card-preview"><img src="${asset(a.coverImage)}" alt="${esc(a.name)} preview"></div><div class="app-card-body"><div class="app-card-title"><img src="${asset(a.icon)}" alt=""><div><p class="eyebrow">${esc(a.type)}</p><h2>${esc(a.name)}</h2></div></div><p class="question">${esc(a.question)}</p><p class="desc">${esc(a.shortDescription)}</p><div class="story-meta">${(a.categories||[]).map(t=>`<span>${esc(t)}</span>`).join("")}</div><div class="card-actions"><a href="#${esc(a.id)}">Read story →</a>${real(a.websiteUrl)?`<a href="${esc(externalUrl(a.websiteUrl))}">Visit site ↗</a>`:""}</div></div></article>`).join(""));
    const update=()=>{const id=decodeURIComponent(location.hash.slice(1));const current=ordered.find(a=>a.id===id);index.hidden=!!current;document.querySelector(".app-index-hero").hidden=!!current;study.hidden=!current;if(!current)return;fillCase(current,ordered);window.scrollTo({top:0,behavior:"instant"});};
    addEventListener("hashchange",update); update();
  }
  function fillCase(a,items) {
    document.title=`${a.name} — Git Home`; text("[data-case-type]",`${a.type} / ${a.status}`);text("[data-case-name]",a.name);text("[data-case-question]",a.question);text("[data-case-description]",a.shortDescription);
    attr("[data-case-icon]","src",asset(a.icon));attr("[data-case-icon]","alt",`${a.name} icon`);attr("[data-case-cover]","src",asset(a.coverImage));attr("[data-case-cover]","alt",`${a.name} preview`);
    link("[data-case-site]",a.websiteUrl);link("[data-case-github]",a.githubUrl);
    prose("[data-case-why]",a.whyItExists);prose("[data-case-thinking]",a.productThinking);prose("[data-case-ux]",a.uxDecisions);prose("[data-case-learnings]",a.learnings);
    const screens=a.screenshots||[];html("[data-case-screens]",screens.map((s,i)=>`<figure><img src="${asset(s)}" alt="${esc(a.name)} screenshot ${i+1}" loading="lazy"></figure>`).join(""));
    document.querySelector(".screens").hidden=!screens.length;
    const i=items.indexOf(a); appNav("[data-prev-app]",items[(i-1+items.length)%items.length],"← ");appNav("[data-next-app]",items[(i+1)%items.length],""," →");
  }
  function renderArt(items) {
    const ordered=visible(items), gallery=document.querySelector("[data-gallery]"), detail=document.querySelector("[data-art-detail]"), intro=document.querySelector("[data-gallery-intro]");
    const tags=["All",...new Set(ordered.flatMap(x=>x.tags||[]))];html("[data-art-filters]",tags.map((t,i)=>`<button class="${i?"":"active"}" data-filter="${esc(t)}">${esc(t)}</button>`).join(""));
    const draw=(filter="All")=>gallery.innerHTML=ordered.filter(x=>filter==="All"||(x.tags||[]).includes(filter)).map(x=>`<a class="art-card" href="#${esc(x.id)}"><figure><img src="${asset(x.thumbnail)}" alt="${esc(x.alt)}" loading="lazy"></figure><h2>${esc(x.title)}</h2><p>${esc(x.medium)} · ${esc(x.year)}</p></a>`).join("");
    document.querySelector("[data-art-filters]").addEventListener("click",e=>{if(!e.target.matches("button"))return;document.querySelectorAll("[data-art-filters] button").forEach(b=>b.classList.toggle("active",b===e.target));draw(e.target.dataset.filter);}); draw();
    const update=()=>{const current=ordered.find(x=>x.id===decodeURIComponent(location.hash.slice(1)));gallery.hidden=!!current;intro.hidden=!!current;detail.hidden=!current;if(!current)return;const i=ordered.indexOf(current);text("[data-art-title]",current.title);text("[data-art-description]",current.description);text("[data-art-meta]",`${current.medium} / ${current.year}`);attr("[data-art-image]","src",asset(current.image));attr("[data-art-image]","alt",current.alt);html("[data-art-tags]",(current.tags||[]).map(t=>`<span>${esc(t)}</span>`).join(""));artNav("[data-prev-art]",ordered[(i-1+ordered.length)%ordered.length],"← ");artNav("[data-next-art]",ordered[(i+1)%ordered.length],""," →");scrollTo({top:0,behavior:"instant"});};addEventListener("hashchange",update);update();
  }
  function renderAbout(a,site) {
    const strengths=visible(a.strengths).map(x=>`<article class="strength"><p class="eyebrow">0${x.order}</p><h3>${esc(x.title)}</h3><p>${esc(x.copy)}</p></article>`).join("");
    document.querySelector("[data-about]").innerHTML=`<section class="about-intro"><p class="eyebrow">${esc(a.eyebrow)}</p><h1>${esc(a.heading)}</h1><p class="lede">${esc(a.intro)}</p></section><section class="about-story"><h2>From explaining systems to shaping products.</h2><div class="story-text">${a.story.map(x=>`<p>${esc(x)}</p>`).join("")}</div></section><section><p class="eyebrow">Strengths</p><div class="strength-grid">${strengths}</div></section><section class="work-grid"><div><p class="eyebrow">How I work</p><h2>Clarity is a process.</h2><p>${esc(a.experience)}</p></div><ol>${a.howIWork.map(x=>`<li>${esc(x)}</li>`).join("")}</ol></section><div class="terminal profile-terminal"><strong>brij@home:~$</strong> currently<br>exploring: ${esc(site.footer.currently)}<br>location: ${esc(site.footer.location)} <span class="cursor"></span></div><section><p class="eyebrow">Connect</p><h2>Let’s compare notes.</h2><div class="contact-row"><a class="button" href="${esc(site.social.email)}">Email me</a><a class="button ghost" href="${esc(site.social.linkedin)}">LinkedIn ↗</a><a class="button ghost" href="${esc(site.social.github)}">GitHub ↗</a></div></section>`;
  }
  function setupReveals(motion) {const nodes=document.querySelectorAll(".reveal");if(!motion?.enabled||!motion?.sectionReveal||matchMedia("(prefers-reduced-motion: reduce)").matches){nodes.forEach(n=>n.classList.add("visible"));return}const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");io.unobserve(e.target)}}),{threshold:.08});nodes.forEach(n=>io.observe(n));}
  function text(s,v){const n=document.querySelector(s);if(n)n.textContent=v||""} function html(s,v){const n=document.querySelector(s);if(n)n.innerHTML=v||""} function attr(s,k,v){document.querySelector(s)?.setAttribute(k,v||"")}
  function prose(s,a){html(s,(a||[]).map(x=>`<p>${esc(x)}</p>`).join(""))} function real(u){return u&&u!=="#"} function externalUrl(u){const value=String(u||"").trim();return /^(?:[a-z][a-z\d+.-]*:|[/?#])/i.test(value)?value:`https://${value}`} function link(s,u){const n=document.querySelector(s);if(n){n.href=real(u)?externalUrl(u):"#";n.hidden=!real(u)}} function appNav(s,a,p="",q=""){const n=document.querySelector(s);n.href=`#${a.id}`;n.textContent=`${p}${a.name}${q}`} function artNav(s,a,p="",q=""){const n=document.querySelector(s);n.href=`#${a.id}`;n.textContent=`${p}${a.title}${q}`}
})();
