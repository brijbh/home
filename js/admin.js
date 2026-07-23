(function(){
  "use strict";
  const files=["site","apps","artwork","about","quotes"];
  const state={site:null,apps:[],artwork:[],about:null,quotes:[]};
  const ui={section:"site",appIndex:0,artIndex:0};
  const view=document.querySelector("[data-editor-view]");
  const preview=document.querySelector("[data-visual-preview]");
  const jsonPreview=document.querySelector("[data-json-preview]");
  const status=document.querySelector(".save-status");
  const updateButton=document.querySelector("[data-update-changes]");
  const nav=document.querySelector("[data-admin-nav]");
  const esc=(v)=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const draftKey=(name)=>`git-home-draft-${name}`;

  init();

  async function init(){
    nav.addEventListener("click",e=>{const button=e.target.closest("[data-section]");if(button){ui.section=button.dataset.section;render();}});
    view.addEventListener("input",handleField);
    view.addEventListener("change",handleField);
    view.addEventListener("click",handleAction);
    document.querySelector("[data-copy-json]").addEventListener("click",copyJson);
    updateButton.addEventListener("click",updateChanges);
    try{
      const loaded=await Promise.all(files.map(async name=>{
        const draft=localStorage.getItem(draftKey(name));
        return draft?JSON.parse(draft):fetch(`data/${name}.json`,{cache:"no-store"}).then(r=>r.json());
      }));
      files.forEach((name,i)=>state[name]=loaded[i]);
      message("Content loaded.","ok");
      render();
    }catch(error){message(`Unable to load content: ${error.message}`,"error");}
  }

  function render(){
    nav.querySelectorAll("button").forEach(b=>b.classList.toggle("active",b.dataset.section===ui.section));
    const renderers={site:renderSite,homepage:renderHomepage,apps:renderApps,art:renderArt,about:renderAbout,theme:renderTheme,motion:renderMotion,export:renderExport};
    view.innerHTML=renderers[ui.section]();
    document.querySelector("[data-preview-label]").textContent=ui.section[0].toUpperCase()+ui.section.slice(1);
    renderPreview();
    updateJsonPreview();
  }

  function heading(title,copy,action=""){return `<div class="view-heading"><div><p class="kicker">${esc(ui.section)}</p><h2>${esc(title)}</h2><p>${esc(copy)}</p></div>${action}</div>`;}
  function input(label,path,value,type="text",wide=""){return `<label class="field ${wide}"><span>${esc(label)}</span><input type="${type}" data-path="${esc(path)}" value="${esc(value)}"></label>`;}
  function area(label,path,value,wide="wide",cls=""){return `<label class="field ${wide}"><span>${esc(label)}</span><textarea class="${cls}" data-path="${esc(path)}">${esc(value)}</textarea></label>`;}
  function toggle(label,path,value){return `<label class="toggle"><input type="checkbox" data-path="${esc(path)}" ${value?"checked":""}><span>${esc(label)}</span></label>`;}
  function color(label,key,value){return `<label class="field"><span>${esc(label)}</span><div class="color-field"><input type="color" data-color-key="${esc(key)}" value="${esc(value||"#000000")}"><input type="text" data-path="site.theme.${esc(key)}" value="${esc(value)}" placeholder="Inherit"></div></label>`;}
  function card(title,body){return `<section class="form-card"><h3>${esc(title)}</h3>${body}</section>`;}

  function renderSite(){
    const s=state.site;
    return heading("Site settings","Identity, contact details, and shared footer content.")+
      card("Identity",`<div class="form-grid">${input("Site title","site.name",s.name)}${input("Full name","site.fullName",s.fullName)}${input("Positioning line","site.eyebrow",s.eyebrow,"text","wide")}</div>`)+
      card("Contact and social",`<div class="form-grid">${input("Email","site.social.email",s.social.email)}${input("GitHub URL","site.social.github",s.social.github,"url")}${input("LinkedIn URL","site.social.linkedin",s.social.linkedin,"url")}</div>`)+
      card("Footer",`<div class="form-grid">${input("Status","site.footer.status",s.footer.status)}${input("Location","site.footer.location",s.footer.location)}${input("Currently","site.footer.currently",s.footer.currently,"text","wide")}${input("Sign-off","site.footer.signoff",s.footer.signoff,"text","wide")}</div>`);
  }

  function renderHomepage(){
    const s=state.site;
    const links=s.pageLinks.map((x,i)=>`<div class="form-card"><div class="form-grid">${input("Label",`site.pageLinks.${i}.label`,x.label)}${input("Link",`site.pageLinks.${i}.href`,x.href)}${input("Description",`site.pageLinks.${i}.description`,x.description,"text","wide")}${toggle("Visible",`site.pageLinks.${i}.visible`,x.visible)}</div></div>`).join("");
    const models=s.mentalModels.map((x,i)=>`<div class="form-card"><div class="form-grid">${input("Title",`site.mentalModels.${i}.title`,x.title)}${input("Number",`site.mentalModels.${i}.number`,x.number)}${area("Description",`site.mentalModels.${i}.copy`,x.copy)}${input("Accent color",`site.mentalModels.${i}.color`,x.color,"text")}${toggle("Visible",`site.mentalModels.${i}.visible`,x.visible)}</div><div class="button-row"><button data-action="move-model-up" data-index="${i}">Move up</button><button data-action="move-model-down" data-index="${i}">Move down</button></div></div>`).join("");
    return heading("Homepage","Hero, shloka, navigation paths, and mental model.")+
      card("Hero",`<div class="form-grid">${area("Hero heading","site.heroHeading",s.heroHeading)}${area("Supporting text","site.heroSupporting",s.heroSupporting)}</div>`)+
      card("Terminal shloka",`<div class="form-grid">${input("Sanskrit","site.shloka.sanskrit",s.shloka.sanskrit,"text","wide")}${input("Transliteration","site.shloka.transliteration",s.shloka.transliteration,"text","wide")}${input("Translation","site.shloka.translation",s.shloka.translation,"text","wide")}${input("Source","site.shloka.source",s.shloka.source,"text","wide")}</div>`)+
      `<h3>Page links</h3>${links}<h3>Mental model</h3>${models}`;
  }

  function renderApps(){
    const a=state.apps[ui.appIndex]||state.apps[0];
    const list=state.apps.map((x,i)=>`<button data-action="select-app" data-index="${i}" class="${i===ui.appIndex?"active":""}"><img src="${esc(x.icon)}" alt=""><span><b>${esc(x.name||"Untitled app")}</b><small>${esc(x.status||"")}</small></span></button>`).join("");
    return heading("Apps","Add products and edit complete case-study content.",`<button class="btn primary" data-action="add-app">Add app</button>`)+
      `<div class="item-layout"><div><div class="item-list">${list}</div><div class="list-actions"><button data-action="move-app-up">↑</button><button data-action="move-app-down">↓</button><button data-action="remove-app">Remove</button></div></div>${a?appForm(a,ui.appIndex):"<p>Add your first app.</p>"}</div>`;
  }
  function appForm(a,i){const p=`apps.${i}`;return `<div>${card("App identity",`<div class="form-grid">${input("Name",`${p}.name`,a.name)}${input("ID / slug",`${p}.id`,a.id)}${input("Status",`${p}.status`,a.status)}${input("Type",`${p}.type`,a.type)}${toggle("Visible",`${p}.visible`,a.visible)}${toggle("Featured",`${p}.featured`,a.featured)}</div>`)}${card("Story",`<div class="form-grid">${area("Question",`${p}.question`,a.question)}${area("Short description",`${p}.shortDescription`,a.shortDescription)}${area("Why it exists",`${p}.whyItExists`,joinLines(a.whyItExists),"wide","small-area")}${area("Product thinking",`${p}.productThinking`,joinLines(a.productThinking),"wide","small-area")}${area("UX / design decisions",`${p}.uxDecisions`,joinLines(a.uxDecisions),"wide","small-area")}${area("What I learned",`${p}.learnings`,joinLines(a.learnings),"wide","small-area")}</div>`)}${card("Media and links",`<div class="form-grid">${input("Icon path",`${p}.icon`,a.icon,"text","wide")}${input("Cover image path",`${p}.coverImage`,a.coverImage,"text","wide")}${area("Screenshot paths — one per line",`${p}.screenshots`,joinLines(a.screenshots))}${area("Tags — one per line",`${p}.categories`,joinLines(a.categories))}${input("Live site URL",`${p}.websiteUrl`,a.websiteUrl,"url")}${input("GitHub URL",`${p}.githubUrl`,a.githubUrl,"url")}${input("Accent color",`${p}.accentColor`,a.accentColor)}${input("Preview background",`${p}.previewColor`,a.previewColor)}</div>`)}</div>`;}

  function renderArt(){
    const a=state.artwork[ui.artIndex]||state.artwork[0];
    const list=state.artwork.map((x,i)=>`<button data-action="select-art" data-index="${i}" class="${i===ui.artIndex?"active":""}"><img src="${esc(x.thumbnail)}" alt=""><span><b>${esc(x.title||"Untitled artwork")}</b><small>${esc(x.medium||"")}</small></span></button>`).join("");
    return heading("Artwork","Add pieces and edit gallery/detail information.",`<button class="btn primary" data-action="add-art">Add artwork</button>`)+
      `<div class="item-layout"><div><div class="item-list">${list}</div><div class="list-actions"><button data-action="move-art-up">↑</button><button data-action="move-art-down">↓</button><button data-action="remove-art">Remove</button></div></div>${a?artForm(a,ui.artIndex):"<p>Add your first artwork.</p>"}</div>`;
  }
  function artForm(a,i){const p=`artwork.${i}`;return `<div>${card("Artwork details",`<div class="form-grid">${input("Title",`${p}.title`,a.title)}${input("ID / slug",`${p}.id`,a.id)}${input("Year",`${p}.year`,a.year)}${input("Medium",`${p}.medium`,a.medium)}${toggle("Visible",`${p}.visible`,a.visible)}${toggle("Featured",`${p}.featured`,a.featured)}${area("Description",`${p}.description`,a.description)}${area("Tags — one per line",`${p}.tags`,joinLines(a.tags))}</div>`)}${card("Images",`<div class="form-grid">${input("Thumbnail path",`${p}.thumbnail`,a.thumbnail,"text","wide")}${input("Full image path",`${p}.image`,a.image,"text","wide")}${area("Alt text",`${p}.alt`,a.alt)}</div>`)}</div>`;}

  function renderAbout(){
    const a=state.about;
    return heading("About","Professional profile, strengths, and working approach.")+
      card("Introduction",`<div class="form-grid">${input("Eyebrow","about.eyebrow",a.eyebrow)}${area("Heading","about.heading",a.heading)}${area("Introduction","about.intro",a.intro)}${area("Career story — one paragraph per line","about.story",joinLines(a.story))}</div>`)+
      card("Profile content",`<div class="form-grid">${area("How I work — one item per line","about.howIWork",joinLines(a.howIWork))}${area("Experience","about.experience",a.experience)}</div>`)+
      `<h3>Strengths</h3>`+a.strengths.map((x,i)=>card(x.title||`Strength ${i+1}`,`<div class="form-grid">${input("Title",`about.strengths.${i}.title`,x.title)}${area("Description",`about.strengths.${i}.copy`,x.copy)}${toggle("Visible",`about.strengths.${i}.visible`,x.visible)}</div>`)).join("");
  }

  function renderTheme(){
    const t=state.site.theme;
    return heading("Theme","Global palette with optional section and element overrides.")+
      card("Global colors",`<div class="form-grid">${color("Paper","paper",t.paper)}${color("Ink","ink",t.ink)}${color("Deep red","deepRed",t.deepRed)}${color("Red","red",t.red)}${color("Blue","blue",t.blue)}${color("Olive","olive",t.olive)}${color("Orange","orange",t.orange)}${color("Green","green",t.green)}${color("Teal","teal",t.teal)}</div>`)+
      card("Optional overrides",`<div class="form-grid">${area("Section overrides (JSON)","site.theme.sectionOverrides",JSON.stringify(t.sectionOverrides||{},null,2))}${area("Element overrides (JSON)","site.theme.elementOverrides",JSON.stringify(t.elementOverrides||{},null,2))}</div>`);
  }

  function renderMotion(){
    const m=state.site.motion;
    return heading("Motion","Subtle motion controls. Reduced-motion preferences always win.")+
      card("Motion settings",`<div class="form-grid">${toggle("Enable motion","site.motion.enabled",m.enabled)}${toggle("Terminal typing","site.motion.terminalTyping",m.terminalTyping)}${toggle("Section reveal","site.motion.sectionReveal",m.sectionReveal)}${toggle("Card hover","site.motion.cardHover",m.cardHover)}${toggle("Image hover zoom","site.motion.imageHoverZoom",m.imageHoverZoom)}<label class="field"><span>Duration</span><select data-path="site.motion.duration"><option ${m.duration==="fast"?"selected":""}>fast</option><option ${m.duration==="normal"?"selected":""}>normal</option><option ${m.duration==="slow"?"selected":""}>slow</option></select></label></div>`);
  }

  function renderExport(){
    return heading("Save and export","Store drafts, write JSON files, or download a portable copy.")+
      `<div class="export-grid"><div class="export-option"><h3>Save browser draft</h3><p>Keep all current edits in this browser for continued editing and preview.</p><button class="btn primary" data-action="save-drafts">Save all drafts</button></div><div class="export-option"><h3>Save to project folder</h3><p>Choose the Git Home folder. Supported browsers write directly into its data folder.</p><button class="btn" data-action="save-folder">Choose folder and save</button></div><div class="export-option"><h3>Download JSON</h3><p>Download each updated data file as a fallback.</p><button class="btn" data-action="download-all">Download all files</button></div><div class="export-option"><h3>Preview edited site</h3><p>Open the public site using the saved browser drafts.</p><button class="btn" data-action="open-preview">Open preview ↗</button></div></div>`;
  }

  function handleField(e){
    const el=e.target;if(!el.dataset.path&&!el.dataset.colorKey)return;
    if(el.dataset.colorKey){
      const key=el.dataset.colorKey,text=view.querySelector(`[data-path="site.theme.${key}"]`);
      if(text)text.value=el.value;
      setPath(`site.theme.${key}`,el.value);
      markDirty();renderPreview();updateJsonPreview();return;
    }
    const path=el.dataset.path;let value=el.type==="checkbox"?el.checked:el.value;
    if(path.includes(".screenshots")||path.includes(".categories")||path.endsWith(".tags")||path.endsWith(".whyItExists")||path.endsWith(".productThinking")||path.endsWith(".uxDecisions")||path.endsWith(".learnings")||path==="about.story"||path==="about.howIWork")value=lines(value);
    if(path==="site.theme.sectionOverrides"||path==="site.theme.elementOverrides"){try{value=JSON.parse(value||"{}")}catch{return message("Override JSON is not valid yet.","error")}}
    setPath(path,value);
    markDirty();
    renderPreview();updateJsonPreview();
  }

  function handleAction(e){
    const button=e.target.closest("[data-action]");if(!button)return;
    const action=button.dataset.action,index=Number(button.dataset.index);
    if(action==="select-app"){ui.appIndex=index;render()}
    if(action==="select-art"){ui.artIndex=index;render()}
    if(action==="add-app"){state.apps.push(newApp());ui.appIndex=state.apps.length-1;normalize(state.apps);markDirty();render()}
    if(action==="add-art"){state.artwork.push(newArt());ui.artIndex=state.artwork.length-1;normalize(state.artwork);markDirty();render()}
    if(action==="remove-app"&&state.apps.length&&confirm("Remove this app from the draft?")){state.apps.splice(ui.appIndex,1);ui.appIndex=Math.max(0,ui.appIndex-1);normalize(state.apps);markDirty();render()}
    if(action==="remove-art"&&state.artwork.length&&confirm("Remove this artwork from the draft?")){state.artwork.splice(ui.artIndex,1);ui.artIndex=Math.max(0,ui.artIndex-1);normalize(state.artwork);markDirty();render()}
    if(action==="move-app-up")move(state.apps,ui,"appIndex",-1);
    if(action==="move-app-down")move(state.apps,ui,"appIndex",1);
    if(action==="move-art-up")move(state.artwork,ui,"artIndex",-1);
    if(action==="move-art-down")move(state.artwork,ui,"artIndex",1);
    if(action==="move-model-up")moveAt(state.site.mentalModels,index,-1);
    if(action==="move-model-down")moveAt(state.site.mentalModels,index,1);
    if(action==="save-drafts")saveDrafts();
    if(action==="save-folder")saveFolder();
    if(action==="download-all")downloadAll();
    if(action==="open-preview"){saveDrafts();window.open("index.html?preview=draft","git-home-preview")}
  }

  function renderPreview(){
    if(!state.site)return;
    const section=ui.section;
    if(section==="apps"){const a=state.apps[ui.appIndex];preview.innerHTML=a?`<article class="preview-card"><img src="${esc(a.coverImage)}" alt=""><div class="preview-card-body"><div class="preview-title"><img src="${esc(a.icon)}" alt=""><h3>${esc(a.name)}</h3></div><p><strong>${esc(a.question)}</strong></p><p>${esc(a.shortDescription)}</p><div class="preview-tags">${(a.categories||[]).map(x=>`<span>${esc(x)}</span>`).join("")}</div></div></article>`:"No app selected.";return}
    if(section==="art"){const a=state.artwork[ui.artIndex];preview.innerHTML=a?`<article class="preview-card art-preview-card"><img src="${esc(a.image||a.thumbnail)}" alt=""><div class="preview-card-body"><h3>${esc(a.title)}</h3><p>${esc(a.medium)} · ${esc(a.year)}</p><p>${esc(a.description)}</p></div></article>`:"No artwork selected.";return}
    if(section==="theme"){preview.style.background=state.site.theme.paper;preview.style.color=state.site.theme.ink;preview.innerHTML=`<div class="theme-preview">${Object.entries(state.site.theme).filter(([,v])=>typeof v==="string"&&v.startsWith("#")).map(([k,v])=>`<div class="theme-swatch" style="background:${esc(v)}">${esc(k)}<br>${esc(v)}</div>`).join("")}</div>`;return}
    preview.style.background="";preview.style.color="";
    if(section==="about"){preview.innerHTML=`<div class="preview-hero"><p class="kicker">${esc(state.about.eyebrow)}</p><h2>${esc(state.about.heading)}</h2><p>${esc(state.about.intro)}</p></div>`;return}
    if(section==="motion"){preview.innerHTML=`<div class="preview-hero"><p class="kicker">Motion preview</p><h2>${state.site.motion.enabled?"Subtle motion is enabled.":"Motion is disabled."}</h2><p>Terminal typing: ${yes(state.site.motion.terminalTyping)}<br>Section reveal: ${yes(state.site.motion.sectionReveal)}<br>Card hover: ${yes(state.site.motion.cardHover)}</p></div>`;return}
    preview.innerHTML=`<div class="preview-hero"><p class="kicker">${esc(state.site.eyebrow)}</p><h2>${esc(state.site.heroHeading)}</h2><p>${esc(state.site.heroSupporting)}</p></div>`;
  }

  function updateJsonPreview(){const key=ui.section==="apps"?"apps":ui.section==="art"?"artwork":ui.section==="about"?"about":"site";jsonPreview.value=JSON.stringify(state[key],null,2)}
  function setPath(path,value){const parts=path.split(".");let target=state;for(let i=0;i<parts.length-1;i++)target=target[parts[i]];target[parts.at(-1)]=value}
  function joinLines(v){return Array.isArray(v)?v.join("\n"):v||""}function lines(v){return String(v).split("\n").map(x=>x.trim()).filter(Boolean)}
  function normalize(items){items.forEach((x,i)=>x.order=i+1)}
  function move(items,holder,key,delta){const from=holder[key],to=from+delta;if(to<0||to>=items.length)return;[items[from],items[to]]=[items[to],items[from]];holder[key]=to;normalize(items);markDirty();render()}
  function moveAt(items,from,delta){const to=from+delta;if(to<0||to>=items.length)return;[items[from],items[to]]=[items[to],items[from]];normalize(items);markDirty();render()}
  function newApp(){const n=state.apps.length+1;return{id:`new-app-${n}`,visible:true,featured:false,order:n,name:"New app",question:"What useful question does this app answer?",shortDescription:"Short app description.",status:"Draft",type:"Product",categories:[],icon:"assets/icons/bb-icon.svg",coverImage:"assets/illustrations/hopefarm-cover.svg",accentColor:"#C96A3D",previewColor:"#F3ECE2",websiteUrl:"#",githubUrl:"",whyItExists:[],productThinking:[],uxDecisions:[],screenshots:[],learnings:[]}}
  function newArt(){const n=state.artwork.length+1;return{id:`new-art-${n}`,visible:true,featured:false,order:n,title:"New artwork",year:new Date().getFullYear(),medium:"Digital study",thumbnail:"assets/illustrations/art-abstract.svg",image:"assets/illustrations/art-abstract.svg",alt:"Describe this artwork",description:"Artwork note.",tags:[]}}
  function saveDrafts(){files.forEach(name=>localStorage.setItem(draftKey(name),JSON.stringify(state[name],null,2)));setClean();message("All drafts saved in this browser.","ok")}
  async function saveFolder(){if(!("showDirectoryPicker" in window))return message("Direct folder save is unavailable. Use Download all files.","error");try{const root=await showDirectoryPicker({mode:"readwrite"}),dir=await root.getDirectoryHandle("data",{create:false});for(const name of files){const handle=await dir.getFileHandle(`${name}.json`,{create:true}),stream=await handle.createWritable();await stream.write(JSON.stringify(state[name],null,2)+"\n");await stream.close()}files.forEach(name=>localStorage.setItem(draftKey(name),JSON.stringify(state[name],null,2)));setClean();message("Changes updated in the project data folder.","ok")}catch(e){if(e.name!=="AbortError")message(`Folder save failed: ${e.message}`,"error")}}
  function downloadAll(){files.forEach((name,i)=>setTimeout(()=>download(name,state[name]),i*180));message("Downloading all JSON files.","ok")}
  function download(name,data){const blob=new Blob([JSON.stringify(data,null,2)+"\n"],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`${name}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)}
  async function copyJson(){try{await navigator.clipboard.writeText(jsonPreview.value);message("JSON copied.","ok")}catch{message("Clipboard access was unavailable.","error")}}
  async function updateChanges(){if("showDirectoryPicker" in window){await saveFolder()}else{saveDrafts();message("Draft updated. Use Export to download the changed JSON files.","ok")}}
  function markDirty(){status.textContent="Unsaved changes.";status.className="save-status";updateButton.disabled=false;updateButton.classList.add("dirty")}
  function setClean(){updateButton.disabled=true;updateButton.classList.remove("dirty")}
  function yes(v){return v?"On":"Off"}function message(text,type=""){status.textContent=text;status.className=`save-status ${type}`}
})();
