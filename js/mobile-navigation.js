(function () {
  "use strict";
  const drawer = document.getElementById("mobile-drawer");
  const menuButton = document.querySelector(".menu-button");
  const closeButton = document.querySelector(".drawer-close");
  let lastFocus = null;

  if (!drawer || !menuButton || !closeButton) return;

  menuButton.addEventListener("click", openDrawer);
  closeButton.addEventListener("click", closeDrawer);
  drawer.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeDrawer));
  document.addEventListener("keydown", (event) => {
    if (drawer.hidden) return;
    if (event.key === "Escape") closeDrawer();
    if (event.key === "Tab") trapFocus(event);
  });

  function openDrawer() {
    lastFocus = document.activeElement;
    drawer.hidden = false;
    document.body.style.overflow = "hidden";
    menuButton.setAttribute("aria-expanded", "true");
    closeButton.focus();
  }

  function closeDrawer() {
    drawer.hidden = true;
    document.body.style.overflow = "";
    menuButton.setAttribute("aria-expanded", "false");
    (lastFocus || menuButton).focus();
  }

  function trapFocus(event) {
    const focusable = drawer.querySelectorAll("a[href],button:not([disabled])");
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
})();
