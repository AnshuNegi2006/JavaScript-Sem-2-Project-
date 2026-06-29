document.addEventListener("DOMContentLoaded", function () {
  // Sticky navbar + mobile menu
  var nav = document.querySelector(".navbar");
  if (nav) {
    function checkScroll() {
      nav.classList.toggle("scrolled", window.scrollY > 20);
    }
    window.addEventListener("scroll", checkScroll);
    checkScroll();
  }

  var toggle = document.querySelector(".menu-toggle");
  var menu = document.querySelector(".mobile-menu");
  if (toggle && menu) {
    toggle.onclick = function () {
      menu.classList.toggle("open");
    };
  }

  // Footer copyright year
  var year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }
});