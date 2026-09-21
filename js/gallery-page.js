(function () {

  "use strict";

  let galleryItems = [];
  let visibleItems = [];
  let currentIndex = 0;
  let initialized = false;

  let touchStartX = 0;
  let touchEndX = 0;


  const labels = {
    all: "All Photos",
    site: "Site Operations",
    team: "Personnel",
    industrial: "Industrial",
    training: "Training",
    event: "Events",
    vip: "VIP Protection",
    work: "Work Photos"
  };


  function escapeHtml(value) {

    const div =
      document.createElement("div");

    div.textContent =
      value || "";

    return div.innerHTML;

  }


  function getCategoryLabel(item) {

    if (item.categoryLabel) {
      return item.categoryLabel;
    }

    return (
      labels[item.category] ||
      item.category ||
      "Gallery"
    );

  }


  async function loadGallery() {

    const grid =
      document.getElementById(
        "essGalleryGrid"
      );

    const empty =
      document.getElementById(
        "essGalleryEmpty"
      );

    if (!grid) {
      return;
    }


    try {

      const response =
        await fetch(
          "data/gallery.json?ts=" +
          Date.now(),
          {
            cache: "no-store"
          }
        );


      if (!response.ok) {
        throw new Error(
          "Gallery data unavailable."
        );
      }


      galleryItems =
        await response.json();


      if (!Array.isArray(galleryItems)) {
        galleryItems = [];
      }


      if (!galleryItems.length) {

        grid.innerHTML = "";

        if (empty) {
          empty.hidden = false;
        }

        updatePhotoCount(0);

        return;
      }


      buildFilters();

      renderGallery("all");

    }

    catch (error) {

      console.error(
        "Ethics gallery error:",
        error
      );


      grid.innerHTML = "";

      if (empty) {
        empty.hidden = false;
      }

      updatePhotoCount(0);

    }

  }


  function buildFilters() {

    const filters =
      document.getElementById(
        "essGalleryFilters"
      );

    if (!filters) {
      return;
    }


    const categories =
      [
        ...new Set(
          galleryItems.map(
            function (item) {
              return (
                item.category ||
                "work"
              );
            }
          )
        )
      ];


    filters.innerHTML = "";


    ["all", ...categories]
      .forEach(
        function (category) {

          const button =
            document.createElement(
              "button"
            );


          button.type = "button";

          button.dataset.filter =
            category;

          button.textContent =
            labels[category] ||
            category;


          if (category === "all") {
            button.classList.add(
              "is-active"
            );
          }


          button.addEventListener(
            "click",
            function () {

              filters
                .querySelectorAll(
                  "button"
                )
                .forEach(
                  function (item) {

                    item.classList.remove(
                      "is-active"
                    );

                  }
                );


              button.classList.add(
                "is-active"
              );


              renderGallery(
                category
              );

            }
          );


          filters.appendChild(
            button
          );

        }
      );

  }


  function renderGallery(category) {

    const grid =
      document.getElementById(
        "essGalleryGrid"
      );

    const empty =
      document.getElementById(
        "essGalleryEmpty"
      );


    if (!grid) {
      return;
    }


    visibleItems =
      category === "all"
        ? [...galleryItems]
        : galleryItems.filter(
            function (item) {

              return (
                item.category ===
                category
              );

            }
          );


    updatePhotoCount(
      visibleItems.length
    );


    if (!visibleItems.length) {

      grid.innerHTML = "";

      if (empty) {
        empty.hidden = false;
      }

      return;
    }


    if (empty) {
      empty.hidden = true;
    }


    grid.innerHTML =
      visibleItems
        .map(
          function (item, index) {

            const title =
              escapeHtml(
                item.title ||
                "Ethics Security Service"
              );


            const categoryLabel =
              escapeHtml(
                getCategoryLabel(item)
              );


            return `
              <figure
                class="ess-gallery-clean-item"
                data-gallery-index="${index}"
                tabindex="0"
                role="button"
                aria-label="View ${title}"
              >

                <div class="ess-gallery-clean-photo">

                  <img
                    src="${item.src}"
                    alt="${title}"
                    loading="lazy"
                  >

                  <span class="ess-gallery-clean-open">
                    <i class="fa fa-search-plus"></i>
                  </span>

                </div>


                <figcaption>

                  <span>
                    ${categoryLabel}
                  </span>

                  <strong>
                    ${title}
                  </strong>

                </figcaption>

              </figure>
            `;

          }
        )
        .join("");


    grid
      .querySelectorAll(
        ".ess-gallery-clean-item"
      )
      .forEach(
        function (item) {

          function activate() {

            const index =
              Number(
                item.dataset
                  .galleryIndex
              );

            openLightbox(index);

          }


          item.addEventListener(
            "click",
            activate
          );


          item.addEventListener(
            "keydown",
            function (event) {

              if (
                event.key === "Enter" ||
                event.key === " "
              ) {

                event.preventDefault();

                activate();

              }

            }
          );

        }
      );

  }


  function updatePhotoCount(count) {

    const counter =
      document.getElementById(
        "essGalleryCount"
      );

    if (counter) {
      counter.textContent =
        String(count);
    }

  }


  function openLightbox(index) {

    const modal =
      document.getElementById(
        "essGalleryLightbox"
      );


    if (
      !modal ||
      !visibleItems[index]
    ) {
      return;
    }


    currentIndex = index;

    updateLightbox();


    modal.classList.add(
      "is-open"
    );

    modal.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.style.overflow =
      "hidden";

  }


  function updateLightbox() {

    const item =
      visibleItems[currentIndex];


    if (!item) {
      return;
    }


    const image =
      document.getElementById(
        "essGalleryLightboxImage"
      );

    const title =
      document.getElementById(
        "essGalleryLightboxTitle"
      );

    const category =
      document.getElementById(
        "essGalleryLightboxCategory"
      );

    const position =
      document.getElementById(
        "essGalleryLightboxPosition"
      );


    if (image) {

      image.src =
        item.src;

      image.alt =
        item.title ||
        "Gallery Photo";

    }


    if (title) {

      title.textContent =
        item.title ||
        "Gallery Photo";

    }


    if (category) {

      category.textContent =
        getCategoryLabel(item)
          .toUpperCase();

    }


    if (position) {

      position.textContent =
        (
          currentIndex + 1
        ) +
        " / " +
        visibleItems.length;

    }

  }


  function closeLightbox() {

    const modal =
      document.getElementById(
        "essGalleryLightbox"
      );


    if (!modal) {
      return;
    }


    modal.classList.remove(
      "is-open"
    );

    modal.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.style.overflow =
      "";

  }


  function previousPhoto() {

    if (!visibleItems.length) {
      return;
    }


    currentIndex =
      (
        currentIndex -
        1 +
        visibleItems.length
      ) %
      visibleItems.length;


    updateLightbox();

  }


  function nextPhoto() {

    if (!visibleItems.length) {
      return;
    }


    currentIndex =
      (
        currentIndex + 1
      ) %
      visibleItems.length;


    updateLightbox();

  }


  function initControls() {

    document
      .querySelectorAll(
        "[data-gallery-close]"
      )
      .forEach(
        function (button) {

          button.addEventListener(
            "click",
            closeLightbox
          );

        }
      );


    const prev =
      document.getElementById(
        "essGalleryPrev"
      );

    const next =
      document.getElementById(
        "essGalleryNext"
      );

    const imageArea =
      document.querySelector(
        ".ess-gallery-clean-lightbox-image"
      );


    if (prev) {

      prev.addEventListener(
        "click",
        previousPhoto
      );

    }


    if (next) {

      next.addEventListener(
        "click",
        nextPhoto
      );

    }


    if (imageArea) {

      imageArea.addEventListener(
        "touchstart",
        function (event) {

          touchStartX =
            event.changedTouches[0]
              .screenX;

        },
        {
          passive: true
        }
      );


      imageArea.addEventListener(
        "touchend",
        function (event) {

          touchEndX =
            event.changedTouches[0]
              .screenX;


          const distance =
            touchEndX -
            touchStartX;


          if (
            Math.abs(distance) <
            45
          ) {
            return;
          }


          if (distance < 0) {
            nextPhoto();
          }
          else {
            previousPhoto();
          }

        },
        {
          passive: true
        }
      );

    }


    document.addEventListener(
      "keydown",
      function (event) {

        const modal =
          document.getElementById(
            "essGalleryLightbox"
          );


        if (
          !modal ||
          !modal.classList.contains(
            "is-open"
          )
        ) {
          return;
        }


        if (event.key === "Escape") {
          closeLightbox();
        }


        if (event.key === "ArrowLeft") {
          previousPhoto();
        }


        if (event.key === "ArrowRight") {
          nextPhoto();
        }

      }
    );

  }


  function initialize() {

    if (initialized) {
      return;
    }


    const grid =
      document.getElementById(
        "essGalleryGrid"
      );


    if (!grid) {
      return;
    }


    initialized = true;

    initControls();

    loadGallery();

  }


  document.addEventListener(
    "ess:includes-loaded",
    initialize
  );


  document.addEventListener(
    "DOMContentLoaded",
    function () {

      setTimeout(
        initialize,
        150
      );

    }
  );

})();
