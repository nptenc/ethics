(function () {

  let galleryItems = [];
  let visibleItems = [];
  let currentIndex = 0;


  const labels = {
    all: "All Photos",
    work: "Work Photos",
    industrial: "Industrial",
    training: "Training",
    event: "Events",
    vip: "VIP Protection",
    team: "Personnel",
    site: "Sites"
  };


  function escapeHtml(value) {

    const div = document.createElement("div");

    div.textContent = value || "";

    return div.innerHTML;

  }


  async function initGallery() {

    const grid =
      document.getElementById("essGalleryGrid");

    const filters =
      document.getElementById("essGalleryFilters");

    const empty =
      document.getElementById("essGalleryEmpty");

    if (!grid || !filters) {
      return;
    }


    try {

      const response =
        await fetch(
          "data/gallery.json?ts=" + Date.now(),
          {
            cache: "no-store"
          }
        );


      if (!response.ok) {
        throw new Error("Gallery data unavailable.");
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

    }

  }


  function buildFilters() {

    const filters =
      document.getElementById("essGalleryFilters");

    const categories =
      [...new Set(
        galleryItems.map(
          item => item.category || "work"
        )
      )];


    filters.innerHTML = "";


    ["all", ...categories]
      .forEach(function (category) {

        const button =
          document.createElement("button");

        button.type = "button";

        button.dataset.filter =
          category;

        button.textContent =
          labels[category] ||
          category;


        if (category === "all") {
          button.classList.add("is-active");
        }


        button.addEventListener(
          "click",
          function () {

            filters
              .querySelectorAll("button")
              .forEach(
                b => b.classList.remove(
                  "is-active"
                )
              );


            button.classList.add(
              "is-active"
            );


            renderGallery(category);

          }
        );


        filters.appendChild(button);

      });

  }


  function renderGallery(category) {

    const grid =
      document.getElementById("essGalleryGrid");

    const empty =
      document.getElementById("essGalleryEmpty");


    visibleItems =
      category === "all"
        ? [...galleryItems]
        : galleryItems.filter(
            item =>
              item.category === category
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
        .map(function (item, index) {

          const title =
            escapeHtml(
              item.title || "Ethics Security Service"
            );

          const categoryLabel =
            escapeHtml(
              labels[item.category] ||
              item.category ||
              "Work Photo"
            );


          return `
            <figure
              class="ess-gallery-item"
              data-gallery-index="${index}"
            >

              <img
                src="${item.src}"
                alt="${title}"
                loading="lazy"
              >

              <figcaption
                class="ess-gallery-item-overlay"
              >

                <div>

                  <span>
                    ${categoryLabel}
                  </span>

                  <strong>
                    ${title}
                  </strong>

                </div>

                <i
                  class="fa fa-search-plus"
                ></i>

              </figcaption>

            </figure>
          `;

        })
        .join("");


    grid
      .querySelectorAll(".ess-gallery-item")
      .forEach(function (item) {

        item.addEventListener(
          "click",
          function () {

            const index =
              Number(
                item.dataset.galleryIndex
              );

            openLightbox(index);

          }
        );

      });

  }


  function openLightbox(index) {

    const modal =
      document.getElementById(
        "essGalleryLightbox"
      );

    if (!modal || !visibleItems[index]) {
      return;
    }


    currentIndex = index;

    updateLightbox();


    modal.classList.add("is-open");

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


    image.src =
      item.src;

    image.alt =
      item.title || "Gallery Photo";

    title.textContent =
      item.title || "Gallery Photo";

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
        currentIndex +
        1
      ) %
      visibleItems.length;

    updateLightbox();

  }


  function initControls() {

    document
      .querySelectorAll(
        "[data-gallery-close]"
      )
      .forEach(function (button) {

        button.addEventListener(
          "click",
          closeLightbox
        );

      });


    const prev =
      document.getElementById(
        "essGalleryPrev"
      );

    const next =
      document.getElementById(
        "essGalleryNext"
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


  document.addEventListener(
    "ess:includes-loaded",
    function () {

      initGallery();

      initControls();

    }
  );


  if (
    document.readyState !== "loading"
  ) {

    setTimeout(
      function () {

        initGallery();

        initControls();

      },
      150
    );

  }

})();
