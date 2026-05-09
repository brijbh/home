(function () {
  "use strict";

  if (!window.siteConfig && typeof siteConfig === "undefined") {
    console.error("siteConfig is missing.");
    return;
  }

  const config = window.siteConfig || siteConfig;
  const projects = Array.isArray(config.projects) ? config.projects : [];

  applyTheme(config.theme);
  populateSharedLinks(config.links || {});
  renderProjects(projects);

  function applyTheme(themeConfig) {
    const activeTheme = themeConfig && themeConfig.themes
      ? themeConfig.themes[themeConfig.active] || themeConfig.themes.light
      : null;

    if (!activeTheme) {
      return;
    }

    const root = document.documentElement;
    Object.entries(activeTheme).forEach(([key, value]) => {
      root.style.setProperty(`--${toKebabCase(key)}`, value);
    });
  }

  function populateSharedLinks(links) {
    document.querySelectorAll("[data-shared-link]").forEach((element) => {
      const key = element.getAttribute("data-shared-link");
      const url = links[key];

      if (!url) {
        return;
      }

      element.setAttribute("href", url);
      element.setAttribute("target", "_blank");
      element.setAttribute("rel", "noopener noreferrer");
    });
  }

  function renderProjects(items) {
    const grid = document.getElementById("projects-grid");
    if (!grid) {
      return;
    }

    grid.innerHTML = "";
    items.forEach((project) => {
      grid.appendChild(createProjectCard(project));
    });
  }

  function createProjectCard(project) {
    const card = document.createElement("article");
    const hasImage = Boolean(project.imagePath);
    const imageMode = project.imageMode || (hasImage ? "screenshot" : "placeholder");
    const isScreenshot = hasImage && imageMode === "screenshot";
    const defaultImageFit = isScreenshot ? "contain" : "cover";
    const defaultImagePosition = isScreenshot ? "center top" : "center center";

    card.className = `project-card ${hasImage ? "has-image" : "has-placeholder"} image-mode-${escapeClassName(imageMode)}`;
    card.style.setProperty("--project-accent", project.accent || "var(--accent-primary)");
    card.style.setProperty("--project-image-fit", project.imageFit || defaultImageFit);
    card.style.setProperty("--project-image-position", project.imagePosition || defaultImagePosition);
    card.style.setProperty("--project-preview-aspect", project.previewAspect || "5 / 4");

    const tags = Array.isArray(project.tags) ? project.tags : [];
    const preview = hasImage
      ? `
          <div class="project-image-frame">
            <img class="preview-image ${isScreenshot ? "is-screenshot" : "is-artwork"}" src="${escapeHtml(project.imagePath)}" alt="${escapeHtml(project.name)} screenshot" loading="lazy" />
          </div>
        `
      : `<div class="project-image-frame project-placeholder-frame">${createPreviewMarkup(project.previewStyle)}</div>`;
    const icon = project.iconPath
      ? `<span class="project-icon-box"><img class="project-icon" src="${escapeHtml(project.iconPath)}" alt="" loading="lazy" /></span>`
      : `<span class="project-icon-box project-icon-fallback" aria-hidden="true">${escapeHtml(getInitials(project.name || "Project"))}</span>`;

    card.innerHTML = `
      <div class="project-preview ${hasImage ? `has-real-image is-${escapeClassName(imageMode)}` : `preview-${escapeHtml(project.previewStyle || "default")}`}">
        ${preview}
      </div>
      <div class="project-content">
        <div class="project-heading">
          <div class="project-title-wrap">
            ${icon}
            <div>
            <p class="project-type">${escapeHtml(project.type || "")}</p>
            <h3>${escapeHtml(project.name || "Untitled")}</h3>
            <p class="project-tagline">${escapeHtml(project.tagline || "")}</p>
            </div>
          </div>
          ${project.status ? `<span class="status-badge">${escapeHtml(project.status)}</span>` : ""}
        </div>
        <p class="project-description">${escapeHtml(project.description || "")}</p>
        <div class="tag-list">
          ${tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
        </div>
        <div class="project-actions">
          <a class="card-button card-button-secondary" href="${escapeHtml(project.detailUrl || "#")}">Know More</a>
          <a class="card-button card-button-primary" href="${escapeHtml(project.liveUrl || "#")}" ${externalAttrs(project.liveUrl)}>Visit Site</a>
        </div>
      </div>
    `;

    return card;
  }

  function createPreviewMarkup(style) {
    switch (style) {
      case "workspace":
        return `
          <div class="workspace-sidebar"></div>
          <div class="workspace-panel">
            <span></span><span></span><span></span>
            <strong>Prompt: Marketing email</strong>
            <p></p><p></p><p></p>
          </div>
          <div class="workspace-result"><span></span><p></p><p></p></div>
        `;
      case "calculator":
        return `
          <div class="calc-lines"><span></span><span></span><span></span></div>
          <div class="calc-total"></div>
          <div class="calc-bars"><span></span><span></span><span></span></div>
        `;
      case "kolam":
        return `
          <div class="kolam-grid"></div>
          <div class="kolam-line line-one"></div>
          <div class="kolam-line line-two"></div>
          <div class="kolam-line line-three"></div>
          <div class="kolam-line line-four"></div>
        `;
      case "pattern":
        return `
          <div class="pattern-word">PLAY</div>
          <div class="pattern-word">BUILD</div>
          <div class="pattern-word">REPEAT</div>
        `;
      case "color":
        return `
          <div class="color-photo"></div>
          <div class="color-swatches"><span></span><span></span><span></span><span></span></div>
        `;
      default:
        return `<div class="preview-empty"></div>`;
    }
  }

  function externalAttrs(url) {
    return url && url !== "#" ? 'target="_blank" rel="noopener noreferrer"' : "";
  }

  function toKebabCase(value) {
    return value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function escapeClassName(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function getInitials(value) {
    return String(value)
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase();
  }
})();
