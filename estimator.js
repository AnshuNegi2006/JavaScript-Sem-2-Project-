//Busniess Logic

/* Multi-step scope estimator + pricing calculator */
// Pricing helper for scope estimator
function calcPrice(type, rush) {
  var min = 8000, max = 25000, weeks = "4–10";
  if (type === "App") { min = 25000; max = 80000; weeks = "8–20"; }
  if (type === "Custom Integration") { min = 15000; max = 50000; weeks = "6–14"; }
  if (rush) { min = Math.round(min * 1.35); max = Math.round(max * 1.35); }
  return "$" + min.toLocaleString() + " – $" + max.toLocaleString() + " · " + weeks + " weeks";
}

document.addEventListener("DOMContentLoaded", function () {
  var est = document.getElementById("estimator-form");
  if (!est) return;

  var step = 0;
  var steps = est.querySelectorAll(".est-step");
  var dots = est.querySelectorAll(".step-dot");
  var backBtn = document.getElementById("est-back");
  var nextBtn = document.getElementById("est-next");
  var priceBox = document.getElementById("est-price");

  function updatePrice() {
    var typeEl = est.querySelector('input[name="type"]:checked');
    var rushEl = est.querySelector('input[name="rush"]:checked');
    var type = typeEl ? typeEl.value : "Website";
    var rush = rushEl && rushEl.value === "Rush";
    priceBox.textContent = calcPrice(type, rush);
  }

  function showStep(n) {
    step = n;
    for (var i = 0; i < steps.length; i++) {
      steps[i].classList.toggle("active", i === step);
    }
    for (var d = 0; d < dots.length; d++) {
      dots[d].classList.remove("active", "done");
      if (d === step) dots[d].classList.add("active");
      if (d < step) dots[d].classList.add("done");
    }
    backBtn.style.visibility = step === 0 ? "hidden" : "visible";
    nextBtn.textContent = step === 2 ? "Get My Estimate →" : "Continue →";
    if (step === 2) updatePrice();
  }

  var options = est.querySelectorAll(".option-card");
  for (var o = 0; o < options.length; o++) {
    options[o].onclick = function () {
      var input = this.querySelector("input");
      if (input.type === "radio") {
        input.checked = true;
        var group = this.parentElement.querySelectorAll(".option-card");
        for (var g = 0; g < group.length; g++) group[g].classList.remove("selected");
        this.classList.add("selected");
      } else {
        input.checked = !input.checked;
        this.classList.toggle("selected", input.checked);
      }
      if (step === 2) updatePrice();
    };
  }

  backBtn.onclick = function () { showStep(step - 1); };
  nextBtn.onclick = function () {
    if (step < 2) {
      showStep(step + 1);
      return;
    }
    var payload = {
      type: est.querySelector('input[name="type"]:checked').value,
      rush: est.querySelector('input[name="rush"]:checked').value,
      addons: []
    };
    var checks = est.querySelectorAll('input[name="addon"]:checked');
    for (var c = 0; c < checks.length; c++) payload.addons.push(checks[c].value);
    var priceText = priceBox.textContent;
    console.log("Estimate submitted:", JSON.stringify(payload, null, 2));
    est.innerHTML = '<div class="success-panel"><div class="success-icon">✓</div><h3>Estimate Submitted!</h3><p>We will contact you within 24 hours.</p><p class="text-gradient" style="margin-top:1rem;font-weight:700;">' + priceText + '</p></div>';
  };

  showStep(0);
});