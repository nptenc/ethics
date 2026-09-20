document.addEventListener("DOMContentLoaded", async function () {

  const components = Array.from(
    document.querySelectorAll("[data-include]")
  );

  try {

    await Promise.all(
      components.map(async function (component) {

        const file =
          component.getAttribute("data-include");

        const response =
          await fetch(file, {
            cache: "no-store"
          });

        if (!response.ok) {
          throw new Error(
            "Unable to load component: " + file
          );
        }

        component.innerHTML =
          await response.text();

      })
    );


    document.dispatchEvent(
      new CustomEvent("ess:includes-loaded")
    );

  }
  catch (error) {

    console.error(
      "Ethics component loading error:",
      error
    );

  }

});
