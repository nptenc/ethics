(function () {

  function initContactForm() {

    const form = document.getElementById("essContactForm");

    if (!form) {
      return;
    }

    form.addEventListener("submit", function (event) {

      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const name =
        document.getElementById("essContactName").value.trim();

      const company =
        document.getElementById("essContactCompany").value.trim();

      const phone =
        document.getElementById("essContactPhone").value.trim();

      const email =
        document.getElementById("essContactEmail").value.trim();

      const service =
        document.getElementById("essContactService").value.trim();

      const location =
        document.getElementById("essContactLocation").value.trim();

      const message =
        document.getElementById("essContactMessage").value.trim();


      const subject =
        "Security / Manpower Requirement - " +
        service;


      const body = [
        "Dear Ethics Security Service,",
        "",
        "I would like to discuss the following requirement:",
        "",
        "Name: " + name,
        "Company / Organization: " + (company || "Not specified"),
        "Phone: " + phone,
        "Email: " + (email || "Not specified"),
        "Service Required: " + service,
        "Site / Location: " + (location || "Not specified"),
        "",
        "Requirement Details:",
        message,
        "",
        "Regards,",
        name
      ].join("\n");


      const mailto =
        "mailto:ethicssupplier@gmail.com" +
        "?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(body);


      window.location.href = mailto;

    });

  }


  if (document.readyState === "loading") {

    document.addEventListener(
      "DOMContentLoaded",
      initContactForm
    );

  } else {

    initContactForm();

  }

})();
