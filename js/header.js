(function () {

  let initialized = false;


  function initEthicsHeader() {

    const navbar =
      document.getElementById("essNavbar");

    const toggler =
      document.querySelector(".ess-navbar-toggler");


    if (!navbar || !toggler) {
      return;
    }


    if (initialized) {
      return;
    }


    initialized = true;


    const links =
      navbar.querySelectorAll(
        "a"
      );


    function closeMenu() {

      if (
        window.innerWidth > 991
      ) {
        return;
      }


      if (
        window.jQuery &&
        window.jQuery.fn &&
        window.jQuery.fn.collapse
      ) {

        window.jQuery(
          navbar
        ).collapse("hide");

      }
      else {

        navbar.classList.remove(
          "show"
        );

        toggler.classList.add(
          "collapsed"
        );

        toggler.setAttribute(
          "aria-expanded",
          "false"
        );

      }

    }


    links.forEach(
      function (link) {

        link.addEventListener(
          "click",
          closeMenu
        );

      }
    );


    /* CLOSE IF USER TAPS OUTSIDE */

    document.addEventListener(
      "click",
      function (event) {

        if (
          window.innerWidth > 991
        ) {
          return;
        }


        if (
          navbar.classList.contains("show") &&
          !navbar.contains(event.target) &&
          !toggler.contains(event.target)
        ) {

          closeMenu();

        }

      }
    );


    /* CLOSE WITH ESC KEY */

    document.addEventListener(
      "keydown",
      function (event) {

        if (
          event.key === "Escape" &&
          navbar.classList.contains("show")
        ) {

          closeMenu();

          toggler.focus();

        }

      }
    );


    /* RESET WHEN RETURNING TO DESKTOP */

    window.addEventListener(
      "resize",
      function () {

        if (
          window.innerWidth > 991
        ) {

          navbar.classList.remove(
            "show"
          );

          toggler.classList.add(
            "collapsed"
          );

          toggler.setAttribute(
            "aria-expanded",
            "false"
          );

        }

      }
    );

  }


  document.addEventListener(
    "ess:includes-loaded",
    initEthicsHeader
  );


  document.addEventListener(
    "DOMContentLoaded",
    function () {

      window.setTimeout(
        initEthicsHeader,
        100
      );

    }
  );

})();
