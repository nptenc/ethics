(function () {

  function initDocumentViewer() {

    const modal =
      document.getElementById("essDocumentLightbox");

    const image =
      document.getElementById("essDocumentLightboxImage");

    const title =
      document.getElementById("essDocumentLightboxTitle");

    const close =
      document.getElementById("essDocumentLightboxClose");

    if (!modal || !image || !title || !close) {
      return;
    }


    function closeViewer() {

      modal.classList.remove("is-open");

      modal.setAttribute(
        "aria-hidden",
        "true"
      );

      document.body.style.overflow = "";

      image.src = "";

    }


    document
      .querySelectorAll(".ess-document-preview")
      .forEach(function (button) {

        button.addEventListener(
          "click",
          function () {

            const src =
              button.getAttribute(
                "data-document-image"
              );

            const documentTitle =
              button.getAttribute(
                "data-document-title"
              ) || "Official Document";


            image.src = src;

            image.alt = documentTitle;

            title.textContent =
              documentTitle;


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
        );

      });


    close.addEventListener(
      "click",
      closeViewer
    );


    modal
      .querySelector(
        ".ess-document-lightbox-backdrop"
      )
      .addEventListener(
        "click",
        closeViewer
      );


    document.addEventListener(
      "keydown",
      function (event) {

        if (
          event.key === "Escape" &&
          modal.classList.contains("is-open")
        ) {
          closeViewer();
        }

      }
    );

  }


  document.addEventListener(
    "ess:includes-loaded",
    initDocumentViewer
  );


  if (
    document.readyState !== "loading"
  ) {
    setTimeout(
      initDocumentViewer,
      200
    );
  }

})();
