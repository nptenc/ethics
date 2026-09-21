(function () {

  "use strict";


  function getStatusElements() {

    return {

      modal:
        document.getElementById(
          "essAssessmentStatus"
        ),

      icon:
        document.getElementById(
          "essAssessmentStatusIcon"
        ),

      label:
        document.getElementById(
          "essAssessmentStatusLabel"
        ),

      title:
        document.getElementById(
          "essAssessmentStatusTitle"
        ),

      message:
        document.getElementById(
          "essAssessmentStatusMessage"
        )

    };

  }


  function showStatus(type, title, message) {

    const status =
      getStatusElements();


    if (!status.modal) {
      return;
    }


    status.modal.classList.remove(
      "is-success",
      "is-error"
    );


    status.modal.classList.add(
      type === "error"
        ? "is-error"
        : "is-success"
    );


    if (status.title) {
      status.title.textContent =
        title;
    }


    if (status.message) {
      status.message.textContent =
        message;
    }


    if (status.label) {

      status.label.textContent =
        type === "error"
          ? "ACTION REQUIRED"
          : "REQUEST STATUS";

    }


    if (status.icon) {

      status.icon.innerHTML =
        type === "error"
          ? '<i class="fa fa-exclamation"></i>'
          : '<i class="fa fa-check"></i>';

    }


    status.modal.classList.add(
      "is-open"
    );


    status.modal.setAttribute(
      "aria-hidden",
      "false"
    );

  }


  function closeStatus() {

    const status =
      getStatusElements();


    if (!status.modal) {
      return;
    }


    status.modal.classList.remove(
      "is-open"
    );


    status.modal.setAttribute(
      "aria-hidden",
      "true"
    );

  }


  function initStatusPopup() {

    document
      .querySelectorAll(
        "[data-assessment-status-close]"
      )
      .forEach(
        function (button) {

          button.addEventListener(
            "click",
            closeStatus
          );

        }
      );


    document.addEventListener(
      "keydown",
      function (event) {

        if (event.key === "Escape") {
          closeStatus();
        }

      }
    );

  }


  function initAssessmentForm() {

    const form =
      document.getElementById(
        "essAssessmentForm"
      );


    if (!form) {
      return;
    }


    form.addEventListener(
      "submit",
      function (event) {

        event.preventDefault();


        if (!form.checkValidity()) {

          showStatus(
            "error",
            "Please complete the required fields",
            "Enter your name, phone number, required service and site location before continuing."
          );


          setTimeout(
            function () {
              form.reportValidity();
            },
            250
          );


          return;

        }


        function get(id) {

          const element =
            document.getElementById(id);


          return element
            ? String(
                element.value || ""
              ).trim()
            : "";

        }


        const name =
          get("assessmentName");

        const phone =
          get("assessmentPhone");

        const company =
          get("assessmentCompany");

        const email =
          get("assessmentEmail");

        const service =
          get("assessmentService");

        const location =
          get("assessmentLocation");

        const people =
          get("assessmentPeople");

        const duty =
          get("assessmentDuty");

        const start =
          get("assessmentStart");

        const message =
          get("assessmentMessage");


        const subjectParts = [
          "Assessment Request",
          service
        ];


        if (company) {

          subjectParts.push(
            company
          );

        }
        else {

          subjectParts.push(
            name
          );

        }


        const subject =
          subjectParts.join(" - ");


        const lines = [

          "Dear Ethics Security Service,",

          "",

          "I would like to request an assessment.",

          "",

          "CONTACT",

          "Name: " + name,

          "Phone: " + phone

        ];


        if (company) {

          lines.push(
            "Company / Organization: " +
            company
          );

        }


        if (email) {

          lines.push(
            "Email: " +
            email
          );

        }


        lines.push(
          "",
          "REQUIREMENT",
          "Service: " + service,
          "Location: " + location
        );


        if (people) {

          lines.push(
            "Estimated Personnel: " +
            people
          );

        }


        if (duty) {

          lines.push(
            "Duty / Shift: " +
            duty
          );

        }


        if (start) {

          lines.push(
            "Expected Start Date: " +
            start
          );

        }


        if (message) {

          lines.push(
            "",
            "ADDITIONAL DETAILS",
            message
          );

        }


        lines.push(
          "",
          "Regards,",
          name
        );


        if (company) {

          lines.push(
            company
          );

        }


        const body =
          lines.join("\n");


        const mailto =
          "mailto:ethicssupplier@gmail.com" +
          "?subject=" +
          encodeURIComponent(subject) +
          "&body=" +
          encodeURIComponent(body);


        /*
         * IMPORTANT:
         * Mailto cannot confirm that an email
         * was actually sent.
         *
         * We therefore tell the user accurately
         * that the request has been prepared.
         */

        showStatus(
          "success",
          "Your request is ready",
          "Your email application is opening with the request prepared. Please review the message and press Send."
        );


        setTimeout(
          function () {

            window.location.href =
              mailto;

          },
          700
        );

      }
    );

  }


  function initialize() {

    initStatusPopup();

    initAssessmentForm();

  }


  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      initialize
    );

  }
  else {

    initialize();

  }

})();
