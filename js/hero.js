(function () {

  let initialized = false;


  function initEthicsHero() {

    if (initialized) {
      return;
    }


    const slides =
      Array.from(
        document.querySelectorAll(
          ".ess-hero-slide"
        )
      );


    if (!slides.length) {
      return;
    }


    initialized = true;


    const navItems =
      Array.from(
        document.querySelectorAll(
          ".ess-hero-nav-item"
        )
      );


    const previousButton =
      document.getElementById(
        "essHeroPrevious"
      );


    const nextButton =
      document.getElementById(
        "essHeroNext"
      );


    const currentCounter =
      document.getElementById(
        "essCurrentSlide"
      );


    const stage =
      document.querySelector(
        ".ess-hero-stage"
      );


    let current = 0;

    let timer = null;

    const interval = 6500;


    function render(index) {

      current =
        (index + slides.length) %
        slides.length;


      slides.forEach(
        function (slide, slideIndex) {

          slide.classList.toggle(
            "is-active",
            slideIndex === current
          );

        }
      );


      navItems.forEach(
        function (navItem, navIndex) {

          navItem.classList.remove(
            "is-active"
          );


          if (navIndex === current) {

            void navItem.offsetWidth;

            navItem.classList.add(
              "is-active"
            );

          }

        }
      );


      if (currentCounter) {

        currentCounter.textContent =
          String(current + 1)
            .padStart(2, "0");

      }

    }


    function stopAutoPlay() {

      if (timer) {

        clearInterval(timer);

        timer = null;

      }

    }


    function startAutoPlay() {

      stopAutoPlay();

      timer =
        setInterval(
          function () {

            render(current + 1);

          },
          interval
        );

    }


    navItems.forEach(
      function (item) {

        item.addEventListener(
          "click",
          function () {

            render(
              Number(
                item.dataset.targetSlide
              )
            );

            startAutoPlay();

          }
        );

      }
    );


    if (previousButton) {

      previousButton.addEventListener(
        "click",
        function () {

          render(current - 1);

          startAutoPlay();

        }
      );

    }


    if (nextButton) {

      nextButton.addEventListener(
        "click",
        function () {

          render(current + 1);

          startAutoPlay();

        }
      );

    }


    if (stage) {

      stage.addEventListener(
        "mouseenter",
        stopAutoPlay
      );


      stage.addEventListener(
        "mouseleave",
        startAutoPlay
      );


      let startX = 0;


      stage.addEventListener(
        "touchstart",
        function (event) {

          startX =
            event.changedTouches[0]
              .clientX;

        },
        {
          passive: true
        }
      );


      stage.addEventListener(
        "touchend",
        function (event) {

          const endX =
            event.changedTouches[0]
              .clientX;


          const distance =
            startX - endX;


          if (
            Math.abs(distance) < 50
          ) {
            return;
          }


          render(
            distance > 0
              ? current + 1
              : current - 1
          );


          startAutoPlay();

        },
        {
          passive: true
        }
      );

    }


    document.addEventListener(
      "visibilitychange",
      function () {

        if (document.hidden) {
          stopAutoPlay();
        }
        else {
          startAutoPlay();
        }

      }
    );


    render(0);

    startAutoPlay();

  }


  document.addEventListener(
    "ess:includes-loaded",
    initEthicsHero
  );


  document.addEventListener(
    "DOMContentLoaded",
    function () {

      window.setTimeout(
        initEthicsHero,
        100
      );

    }
  );

})();
