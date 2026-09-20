(function () {

  function initAssessmentForm() {

    const form =
      document.getElementById("essAssessmentForm");

    if (!form) {
      return;
    }


    form.addEventListener(
      "submit",
      function (event) {

        event.preventDefault();


        if (!form.checkValidity()) {

          form.reportValidity();

          return;
        }


        const get =
          function (id) {

            const el =
              document.getElementById(id);

            return el
              ? el.value.trim()
              : "";

          };


        const name =
          get("assessmentName");

        const company =
          get("assessmentCompany");

        const phone =
          get("assessmentPhone");

        const email =
          get("assessmentEmail");

        const industry =
          get("assessmentIndustry");

        const location =
          get("assessmentLocation");

        const service =
          get("assessmentService");

        const people =
          get("assessmentPeople");

        const duty =
          get("assessmentDuty");

        const start =
          get("assessmentStart");

        const message =
          get("assessmentMessage");


        const subject =
          "Security Assessment Request - " +
          company;


        const body = [

          "Dear Ethics Security Service,",

          "",

          "I would like to request an assessment for the following requirement.",

          "",

          "CONTACT INFORMATION",

          "Name: " + name,

          "Company / Organization: " + company,

          "Phone: " + phone,

          "Email: " + (email || "Not specified"),

          "",

          "SITE INFORMATION",

          "Facility / Industry: " + industry,

          "Site Location: " + location,

          "",

          "SERVICE REQUIREMENT",

          "Service Required: " + service,

          "Estimated Personnel: " + (people || "To be discussed"),

          "Duty / Shift Requirement: " + (duty || "To be discussed"),

          "Expected Start Date: " + (start || "To be discussed"),

          "",

          "OPERATING DETAILS",

          message,

          "",

          "Regards,",

          name,

          company

        ].join("\n");


        window.location.href =
          "mailto:ethicssupplier@gmail.com" +
          "?subject=" +
          encodeURIComponent(subject) +
          "&body=" +
          encodeURIComponent(body);

      }
    );

  }


  if (
    document.readyState === "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      initAssessmentForm
    );

  } else {

    initAssessmentForm();

  }

})();
