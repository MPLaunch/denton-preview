(function () {
  "use strict";

  var header = document.querySelector("[data-header]");
  var menuButton = document.querySelector(".menu-button");
  var mobileMenu = document.querySelector(".mobile-menu");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function updateHeader() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 24);
  }

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  function closeMenu() {
    if (!menuButton || !mobileMenu) return;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open menu");
    mobileMenu.classList.remove("open");
    document.body.classList.remove("menu-open");
  }

  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", function () {
      var isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Open menu" : "Close menu");
      mobileMenu.classList.toggle("open", !isOpen);
      document.body.classList.toggle("menu-open", !isOpen);
    });

    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  var revealElements = document.querySelectorAll(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach(function (element) {
      element.classList.add("in");
    });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -7% 0px", threshold: 0.08 }
    );

    revealElements.forEach(function (element) {
      revealObserver.observe(element);
    });
  }

  if (window.__revealRescue !== undefined) {
    clearTimeout(window.__revealRescue);
    window.__revealRescue = undefined;
  }

  document.querySelectorAll(".faq-item button").forEach(function (button) {
    button.addEventListener("click", function () {
      var currentItem = button.closest(".faq-item");
      var isOpen = currentItem.classList.contains("open");

      document.querySelectorAll(".faq-item").forEach(function (item) {
        item.classList.remove("open");
        var itemButton = item.querySelector("button");
        if (itemButton) itemButton.setAttribute("aria-expanded", "false");
      });

      if (!isOpen) {
        currentItem.classList.add("open");
        button.setAttribute("aria-expanded", "true");
      }
    });
  });

  var enquiryForm = document.querySelector("#enquiry-form");

  if (enquiryForm) {
    enquiryForm.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!enquiryForm.reportValidity()) return;

      var data = new FormData(enquiryForm);
      var name = String(data.get("name") || "").trim();
      var phone = String(data.get("phone") || "").trim();
      var email = String(data.get("email") || "").trim();
      var enquiryFor = String(data.get("enquiry-for") || "").trim();
      var subject = "Appointment enquiry — " + name;
      var body = [
        "Hello Denton Clinical Psychology,",
        "",
        "I would like to request a callback.",
        "",
        "Name: " + name,
        "Phone: " + phone,
        "Email: " + email,
        "Enquiring for: " + enquiryFor.replace(/-/g, " "),
        "",
        "Thank you."
      ].join("\n");
      var status = enquiryForm.querySelector(".form-status");

      if (status) {
        status.textContent = "Opening a private email to the practice…";
      }

      window.location.href =
        "mailto:admin@dentonpsychology.com.au?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(body);
    });
  }
})();
