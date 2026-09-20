document.addEventListener("DOMContentLoaded", function () {

  const body = document.body;

  const openBtn =
    document.querySelector(".ess-mobile-toggle") ||
    document.querySelector(".mobile-nav-toggle") ||
    document.querySelector(".menu-toggle") ||
    document.querySelector(".hamburger");

  const closeBtn =
    document.querySelector(".ess-mobile-close") ||
    document.querySelector(".mobile-menu-close") ||
    document.querySelector(".close-menu");

  const menu =
    document.querySelector(".ess-mobile-nav") ||
    document.querySelector(".mobile-menu") ||
    document.querySelector(".ess-mobile-menu");

  if (!menu) return;

  let overlay = document.querySelector(".ess-mobile-overlay");

  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "ess-mobile-overlay";
    document.body.appendChild(overlay);
  }

  function openMenu() {
    body.classList.add("menu-open");
    if (openBtn) openBtn.setAttribute("aria-expanded", "true");
  }

  function closeMenu() {
    body.classList.remove("menu-open");
    if (openBtn) openBtn.setAttribute("aria-expanded", "false");
  }

  if (openBtn) {
    openBtn.addEventListener("click", function (e) {
      e.preventDefault();
      openMenu();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", function (e) {
      e.preventDefault();
      closeMenu();
    });
  }

  overlay.addEventListener("click", closeMenu);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  /* auto close after click */
  menu.querySelectorAll("a[href]").forEach(function (link) {
    link.addEventListener("click", function () {
      const parent = link.parentElement;

      if (
        parent &&
        parent.classList.contains("menu-item-has-children") &&
        (link.getAttribute("href") === "#" || link.getAttribute("href") === "")
      ) {
        return;
      }

      closeMenu();
    });
  });

  /* submenu */
  menu.querySelectorAll(".menu-item-has-children > a").forEach(function (trigger) {
    trigger.addEventListener("click", function (e) {
      if (window.innerWidth > 991) return;

      const parent = trigger.parentElement;
      const submenu =
        parent.querySelector(".sub-menu") ||
        parent.querySelector(".dropdown-menu");

      if (!submenu) return;

      e.preventDefault();
      parent.classList.toggle("open");
    });
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 991) {
      closeMenu();
      menu.querySelectorAll(".menu-item-has-children.open").forEach(function (item) {
        item.classList.remove("open");
      });
    }
  });

});
