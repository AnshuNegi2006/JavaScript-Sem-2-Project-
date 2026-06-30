/* Multi-step scope estimator + complexity calculator */

// Scope helper for estimator
function calcScope(type, rush, numAddons) {
  var minHours = 20, maxHours = 40, developers = 1;
  if (type === "App") { minHours = 40; maxHours = 80; developers = 2; }
  if (type === "Custom Integration") { minHours = 35; maxHours = 70; developers = 2; }
  
  minHours += numAddons * 10;
  maxHours += numAddons * 15;
  if (numAddons > 2) developers = Math.min(developers + 1, 4);

  var weeks = Math.ceil(maxHours / (developers * 20));
  if (rush) {
    weeks = Math.max(1, Math.ceil(weeks * 0.6));
  }
  
  return minHours + " – " + maxHours + " Hours · ~" + developers + " Devs · " + weeks + " " + (weeks === 1 ? "Week" : "Weeks");
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
    var addonsChecked = est.querySelectorAll('input[name="addon"]:checked').length;
    var type = typeEl ? typeEl.value : "Website";
    var rush = rushEl && rushEl.value === "Rush";
    priceBox.textContent = calcScope(type, rush, addonsChecked);
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
    console.log("Scope planned:", JSON.stringify(payload, null, 2));
    est.innerHTML = '<div class="success-panel"><div class="success-icon">✓</div><h3>Scope Planned!</h3><p>Your collaborative estimation has been logged.</p><p class="text-gradient" style="margin-top:1rem;font-weight:700;">' + priceText + '</p></div>';
  };

  showStep(0);
});