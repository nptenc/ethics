(function () {

  function initFinalNav() {

    const nav =
      document.querySelector(".ess-nav-services");

    const toggle =
      document.querySelector(".ess-services-toggle");

    const menu =
      document.querySelector(".ess-services-menu");

    const navbar =
      document.getElementById("essNavbar");


    if (!nav || !toggle || !menu) {
      return;
    }


    if (toggle.dataset.essReady === "1") {
      return;
    }


    toggle.dataset.essReady = "1";


    function setOpen(open) {

      nav.classList.toggle(
        "is-open",
        open
      );

      toggle.setAttribute(
        "aria-expanded",
        open ? "true" : "false"
      );

    }


    toggle.addEventListener(
      "click",
      function (event) {

        event.preventDefault();

        event.stopPropagation();

        setOpen(
          !nav.classList.contains("is-open")
        );

      }
    );


    document.addEventListener(
      "click",
      function (event) {

        if (!nav.contains(event.target)) {
          setOpen(false);
        }

      }
    );


    document.addEventListener(
      "keydown",
      function (event) {

        if (event.key === "Escape") {

          setOpen(false);

        }

      }
    );


    menu.querySelectorAll("a").forEach(
      function (link) {

        link.addEventListener(
          "click",
          function () {

            setOpen(false);

            if (
              window.innerWidth <= 991 &&
              navbar &&
              window.jQuery &&
              window.jQuery.fn &&
              window.jQuery.fn.collapse
            ) {

              window.jQuery(
                navbar
              ).collapse("hide");

            }

          }
        );

      }
    );

  }


  document.addEventListener(
    "ess:includes-loaded",
    initFinalNav
  );


  document.addEventListener(
    "DOMContentLoaded",
    function () {

      setTimeout(
        initFinalNav,
        100
      );

    }
  );

})();
