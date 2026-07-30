(async function () {
  "use strict";
  const page = document.body.dataset.page;
  const base = page === "apps" || page === "art" ? "../" : "";
  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const visible = (items) => (items || []).filter((item) => item.visible !== false).sort((a,b) => (a.order || 0) - (b.order || 0));
  const asset = (path) => path ? `${base}${path}` : "";
  try {
    const [site, apps, artwork, about, quotes, watermarks] = await Promise.all([
      GitHomeData.loadFrom(base,"site"), GitHomeData.loadFrom(base,"apps"),
      GitHomeData.loadFrom(base,"artwork"), GitHomeData.loadFrom(base,"about").catch(() => null),
      GitHomeData.loadFrom(base,"quotes").catch(() => []),
      GitHomeData.loadFrom(base,"watermarks").catch(() => ({enabled:false,items:[]}))
    ]);
    const dailyQuote=selectSiteQuote(site,quotes);
    applyTheme(site); renderSiteIdentity(site); renderFooter(site,dailyQuote);
    if (page === "home") renderHome(site, apps, artwork,dailyQuote);
    if (page === "apps") renderApps(apps);
    if (page === "art") renderArt(artwork);
    if (page === "about" && about) renderAbout(about, site);
    renderWatermarks(watermarks);
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
  function renderFooter(site,q) {
    document.querySelectorAll("[data-footer]").forEach((root) => {
      root.classList.add("compact-footer");
      root.innerHTML=`<div class="footer-nav"><strong>brij@home</strong>:~$ open <a href="${base}app-pages/app.html">--work</a> <a href="${base}art-pages/index.html">--art</a> <a href="${base}about.html">--about</a> <span class="cursor"></span></div><div class="footer-shloka"><span class="footer-shloka-command"><strong>shloka</strong>:~$ ${esc(q.sanskrit)}</span><span>${esc(q.transliteration)}</span></div><div class="footer-credit">Concept, UX, design, and AI-assisted build by Brij.</div>`;
    });
  }
  function renderHome(site, apps, artwork,q) {
    text("[data-eyebrow]",site.eyebrow); text("[data-hero-heading]",site.heroHeading); text("[data-hero-supporting]",site.heroSupporting);
    html("[data-shloka]",`<div class="terminal-dots"><i></i><i></i><i></i></div><div class="terminal-command"><span class="prompt">brij@home</span>:~$ ${esc(q.sanskrit)} <span class="terminal-translit">${esc(q.transliteration)}</span><span class="cursor"></span></div>`);
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
    const facts=(a.facts||[]).map(x=>`<div><strong>${esc(x.value)}</strong><span>${esc(x.label)}</span></div>`).join("");
    const capabilities=(a.capabilities||[]).sort((x,y)=>(x.order||0)-(y.order||0)).map((x,i)=>`<article class="about-capability"><span>0${i+1}</span><h3>${esc(x.title)}</h3><p>${esc(x.copy)}</p></article>`).join("");
    const domains=(a.domains||[]).map((x,i)=>`<article class="domain-card" style="--i:${i}"><span>${String(i+1).padStart(2,"0")}</span><h3>${esc(x.name)}</h3><p>${esc(x.detail)}</p></article>`).join("");
    const companyMarks=(a.companyMarks||[]).map((x,i)=>{const box=String(x.viewBox||"").trim().split(/\s+/).map(Number),clip=`career-logo-${i}`;return `<figure class="career-mark" style="--i:${i}"><svg viewBox="${esc(x.viewBox)}" role="img" aria-label="${esc(x.name)}" preserveAspectRatio="xMidYMid meet"><defs><clipPath id="${clip}" clipPathUnits="userSpaceOnUse"><rect x="${box[0]}" y="${box[1]}" width="${box[2]}" height="${box[3]}"></rect></clipPath></defs><image href="assets/icons/corporate-icons.svg" width="303.99" height="471.79" clip-path="url(#${clip})"></image></svg><figcaption>${esc(x.name)}</figcaption></figure>`}).join("");
    const career=(a.career||[]).map(x=>`<li><time>${esc(x.period)}</time><div class="career-company"><h3>${esc(x.company)}</h3><p class="career-role">${esc(x.role)}</p></div><div class="career-detail"><p class="career-note">${esc(x.note)}</p><p class="career-work">${esc(x.work)}</p></div></li>`).join("");
    const process=(a.process||[]).map(x=>`<li><span>${esc(x.number)}</span><div><h3>${esc(x.title)}</h3><p>${esc(x.copy)}</p></div></li>`).join("");
    const independentProducts=(a.independentProducts||[]).map(x=>`<a class="bridge-product-link" href="${esc(externalUrl(x.url))}">${esc(x.name)}</a>`).join(", ");
    const workbench=(a.workbench||[]).map((group,i)=>`<article class="workbench-group" style="--i:${i}"><div class="workbench-group-head"><span>${String(i+1).padStart(2,"0")}</span><div><h3>${esc(group.title)}</h3><p>${esc(group.copy)}</p></div></div><ul>${(group.tools||[]).map(tool=>`<li>${tool.icon?`<img src="${esc(tool.icon)}" alt="" loading="lazy" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><span class="tool-mark" hidden>${esc(tool.mark)}</span>`:`<span class="tool-mark">${esc(tool.mark)}</span>`}<span>${esc(tool.name)}</span></li>`).join("")}</ul></article>`).join("");
    const craft=(a.craft||[]).map(x=>`<li><span aria-hidden="true">${esc(x.mark)}</span><div><h4>${esc(x.name)}</h4><p>${esc(x.detail)}</p></div></li>`).join("");
    document.querySelector("[data-about]").innerHTML=`
      <section class="about-hero reveal" id="profile">
        <p class="eyebrow">${esc(a.eyebrow)}</p>
        <h1>${productHeading(a.heading)}</h1>
        <div class="about-hero-copy"><p>${esc(a.intro)}</p><div>${(a.positioning||[]).map(x=>`<p>${esc(x)}</p>`).join("")}</div></div>
        <div class="about-facts">${facts}</div>
      </section>
      <nav class="about-index" aria-label="About page sections">
        <button class="about-index-toggle" type="button" aria-expanded="false" aria-controls="about-index-links"><span><b data-index-current>Profile</b><small data-index-context>Who I am</small></span><span>Sections <i aria-hidden="true">+</i></span></button>
        <div class="about-index-links" id="about-index-links">
          <a href="#profile"><b>Profile</b><span>Who I am</span></a>
          <a href="#practice"><b>Practice</b><span>What &amp; how</span></a>
          <a href="#domains"><b>Domains</b><span>Industries</span></a>
          <a href="#career"><b>Career</b><span>Where I’ve worked</span></a>
          <a href="#workbench"><b>Workbench</b><span>Tools I use</span></a>
          <a href="#outlook"><b>Outlook</b><span>My Happy Place</span></a>
        </div>
      </nav>
      <section class="about-practice reveal" id="practice">
        <div class="about-section-head"><p class="eyebrow">My practice</p><h2>${esc(a.practiceHeading||"What I do and how I work.")}</h2></div>
        <div class="practice-bridge"><h3>${esc(a.bridgeHeading)}</h3><div class="bridge-copy">${(a.bridge||[]).map(x=>`<p>${esc(x)}</p>`).join("")}<p>My independent products—${independentProducts}—are where I test that approach end to end: question, structure, interface, prototype, and revision.</p></div></div>
        <div class="practice-capabilities"><p class="eyebrow">What I actually do</p><h3>${esc(a.capabilityHeading||"From a vague problem to a useful direction.")}</h3><div class="capability-grid">${capabilities}</div></div>
        <div class="practice-process"><div><p class="eyebrow">Working method</p><h3>${esc(a.processHeading)}</h3></div><ol>${process}</ol></div>
      </section>
      <section class="about-domains reveal" id="domains">
        <div class="about-section-head"><p class="eyebrow">Industries and technologies</p><div><h2>${esc(a.domainsHeading)}</h2><p>${esc(a.domainsIntro)}</p></div></div>
        <div class="domain-grid">${domains}</div>
      </section>
      <section class="career-section reveal" id="career">
        <div class="career-heading"><div><p class="eyebrow">Brijesh was here</p><h2>${esc(a.careerHeading)}</h2><p>${esc(a.careerIntro)}</p></div></div>
        <div class="career-mark-field" aria-label="Companies from Brijesh's career">${companyMarks}</div>
        <div class="career-layout">
          <ol class="career-timeline">${career}</ol>
        </div>
      </section>
      <section class="about-workbench reveal" id="workbench">
        <div class="about-section-head"><p class="eyebrow">Tools and technologies</p><div><h2>${esc(a.workbenchHeading)}</h2><p>${esc(a.workbenchIntro)}</p></div></div>
        <div class="workbench-grid">${workbench}<article class="workbench-group craft-workbench"><div class="craft-workbench-head"><span>Making by hand</span><h3>${esc(a.craftHeading)}</h3><p>${esc(a.craftIntro)}</p></div><ul>${craft}</ul></article></div>
      </section>
      <section class="about-pitch reveal" id="outlook">
        <p class="eyebrow">A note about the future</p>
        <h2>${esc(a.pitchHeading)}</h2>
        <p class="pitch-main">${esc(a.pitch)}</p>
        <p>${esc(a.pitchSupport)}</p>
        <div class="contact-row"><a class="button" href="${esc(site.social.email)}">Start a conversation</a><a class="button ghost" href="${esc(site.social.linkedin)}">LinkedIn ↗</a><a class="button ghost" href="app-pages/app.html">See the work →</a></div>
      </section>`;
    setupAboutIndex();
    function productHeading(value) {
      const heading=String(value||""),term="products",index=heading.toLowerCase().lastIndexOf(term);
      if(index<0)return esc(heading);
      return `${esc(heading.slice(0,index))}<a class="about-product-link" href="app-pages/app.html">${esc(heading.slice(index,index+term.length))}</a>${esc(heading.slice(index+term.length))}`;
    }
    function setupAboutIndex() {
      const nav=document.querySelector(".about-index"), toggle=nav?.querySelector(".about-index-toggle"), links=[...document.querySelectorAll(".about-index a")], sections=links.map(x=>document.querySelector(x.hash)).filter(Boolean);
      const activate=(id)=>{
        links.forEach(x=>x.classList.toggle("active",x.hash===`#${id}`));
        const active=links.find(x=>x.hash===`#${id}`);
        if(active){text("[data-index-current]",active.querySelector("b")?.textContent);text("[data-index-context]",active.querySelector("span")?.textContent)}
      };
      activate("profile");
      toggle?.addEventListener("click",()=>{const open=nav.classList.toggle("open");toggle.setAttribute("aria-expanded",String(open));});
      links.forEach(link=>link.addEventListener("click",()=>{nav.classList.remove("open");toggle?.setAttribute("aria-expanded","false")}));
      document.addEventListener("click",event=>{if(nav&&!nav.contains(event.target)){nav.classList.remove("open");toggle?.setAttribute("aria-expanded","false")}});
      document.addEventListener("keydown",event=>{if(event.key==="Escape"){nav?.classList.remove("open");toggle?.setAttribute("aria-expanded","false")}});
      const observer=new IntersectionObserver(entries=>entries.forEach(entry=>entry.isIntersecting&&activate(entry.target.id)),{rootMargin:"-22% 0px -68%",threshold:0});
      sections.forEach(section=>observer.observe(section));
    }
  }
  function indiaDate(timezone="Asia/Kolkata") {
    const parts=Object.fromEntries(new Intl.DateTimeFormat("en-CA",{timeZone:timezone,year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(new Date()).filter(x=>x.type!=="literal").map(x=>[x.type,Number(x.value)]));
    const day=Math.floor((Date.UTC(parts.year,parts.month-1,parts.day)-Date.UTC(parts.year,0,1))/86400000)+1;
    return {year:parts.year,day};
  }
  function selectDailyItem(items,timezone="Asia/Kolkata") {
    if(!items?.length)return null;
    const date=indiaDate(timezone), shuffled=[...items];
    let seed=(date.year*2654435761)>>>0;
    const random=()=>{seed=(seed+0x6D2B79F5)>>>0;let t=seed;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296};
    for(let i=shuffled.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]]}
    return shuffled[(date.day-1)%shuffled.length];
  }
  function selectSiteQuote(site,quotes) {
    const settings=site.verseRotation||{},items=visible(quotes);
    if(settings.mode==="fixed")return items.find(item=>item.id===settings.fixedQuoteId)||site.shloka||items[0]||{};
    return selectDailyItem(items,settings.timezone||"Asia/Kolkata")||site.shloka||{};
  }
  function renderWatermarks(config) {
    if(!config?.enabled)return;
    const main=document.querySelector("main");if(!main)return;
    const candidates=visible(config.items).filter(item=>(item.pages||[]).includes(page)||item.pages?.includes("all"));
    if(!candidates.length)return;
    const mobile=matchMedia("(max-width: 760px)").matches;
    const allowed=candidates.filter(item=>!mobile||item.showOnMobile!==false);
    const limit=Math.max(0,Number(mobile?config.mobileMaxPerPage:config.maxPerPage)||0);
    const selected=config.dailyRotation===false?allowed.slice(0,limit):dailySequence(allowed,config.timezone||"Asia/Kolkata").slice(0,limit);
    if(!selected.length)return;
    const layer=document.createElement("div");layer.className="page-watermarks";layer.setAttribute("aria-hidden","true");
    layer.innerHTML=selected.map(item=>`<img class="page-watermark slot-${esc(item.placement||"bottom-right")} size-${esc(item.size||"medium")}" src="${asset(item.image)}" alt="" style="--watermark-opacity:${Math.min(.3,Math.max(0,Number(item.opacity)||.08))};--watermark-rotation:${Number(item.rotation)||0}deg">`).join("");
    main.prepend(layer);
  }
  function dailySequence(items,timezone) {
    if(!items.length)return [];
    const first=selectDailyItem(items,timezone),start=items.indexOf(first);
    return items.map((_,i)=>items[(start+i)%items.length]);
  }
  function setupReveals(motion) {const nodes=document.querySelectorAll(".reveal");if(!motion?.enabled||!motion?.sectionReveal||matchMedia("(prefers-reduced-motion: reduce)").matches){nodes.forEach(n=>n.classList.add("visible"));return}const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");io.unobserve(e.target)}}),{threshold:.08});nodes.forEach(n=>io.observe(n));}
  function text(s,v){const n=document.querySelector(s);if(n)n.textContent=v||""} function html(s,v){const n=document.querySelector(s);if(n)n.innerHTML=v||""} function attr(s,k,v){document.querySelector(s)?.setAttribute(k,v||"")}
  function prose(s,a){html(s,(a||[]).map(x=>`<p>${esc(x)}</p>`).join(""))} function real(u){return u&&u!=="#"} function externalUrl(u){const value=String(u||"").trim();return /^(?:[a-z][a-z\d+.-]*:|[/?#])/i.test(value)?value:`https://${value}`} function link(s,u){const n=document.querySelector(s);if(n){n.href=real(u)?externalUrl(u):"#";n.hidden=!real(u)}} function appNav(s,a,p="",q=""){const n=document.querySelector(s);n.href=`#${a.id}`;n.textContent=`${p}${a.name}${q}`} function artNav(s,a,p="",q=""){const n=document.querySelector(s);n.href=`#${a.id}`;n.textContent=`${p}${a.title}${q}`}
})();
