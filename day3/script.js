let heights = [0,1,0,2,1,0,1,3,2,1,2,1];
let currentStep = 0;
let stepData = [];
let autoPlayInterval = null;

// DOM references
const barsDiv = document.getElementById("bars");
const resultDiv = document.getElementById("result");
const stepLog = document.getElementById("stepLog");
const progress = document.getElementById("progress");

// Presets
function setPreset(type) {
  if (type === "easy") heights = [3,0,2];
  if (type === "medium") heights = [4,2,0,3,2,5];
  if (type === "hard") heights = [0,1,0,2,1,0,1,3,2,1,2,1];
  document.getElementById("inputHeights").value = heights.join(",");
  generateBars();
}

// Generate bars for display and reset all states
function generateBars() {
  const input = document.getElementById("inputHeights").value.trim();
  heights = input.split(",").map(Number).filter(x => !isNaN(x));

  barsDiv.innerHTML = "";
  heights.forEach(h => {
    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = (h * 20) + "px";
    barsDiv.appendChild(bar);
  });

  // Reset everything
  resultDiv.textContent = "Total Water: 0";
  stepLog.textContent = "";
  progress.textContent = "Step 0 of 0";
  currentStep = 0;
  stepData = [];
  clearInterval(autoPlayInterval);
}

// Core two-pointer algorithm (build step-by-step data)
function calculateSteps(arr) {
  let left = 0, right = arr.length - 1;
  let leftMax = 0, rightMax = 0, total = 0;
  const water = Array(arr.length).fill(0);
  const steps = [];

  while (left <= right) {
    let log = "";
    if (arr[left] <= arr[right]) {
      if (arr[left] >= leftMax) {
        leftMax = arr[left];
        log = `Index ${left}: Update leftMax = ${leftMax}`;
      } else {
        water[left] = leftMax - arr[left];
        total += water[left];
        log = `Index ${left}: Trap ${water[left]} unit(s) (leftMax=${leftMax})`;
      }
      steps.push({ left, right, water: [...water], log, total });
      left++;
    } else {
      if (arr[right] >= rightMax) {
        rightMax = arr[right];
        log = `Index ${right}: Update rightMax = ${rightMax}`;
      } else {
        water[right] = rightMax - arr[right];
        total += water[right];
        log = `Index ${right}: Trap ${water[right]} unit(s) (rightMax=${rightMax})`;
      }
      steps.push({ left, right, water: [...water], log, total });
      right--;
    }
  }
  return { steps, total };
}

// Render water overlays, highlight pointers, and update total dynamically
function renderState(step) {
  const bars = document.querySelectorAll(".bar");
  bars.forEach(bar => {
    bar.classList.remove("active-left", "active-right");
    const oldWater = bar.querySelector(".water");
    if (oldWater) oldWater.remove();
  });

  // Draw trapped water
  step.water.forEach((w, i) => {
    if (w > 0) {
      const waterDiv = document.createElement("div");
      waterDiv.classList.add("water");
      waterDiv.style.height = (w * 20) + "px";
      bars[i].appendChild(waterDiv);
    }
  });

  // Highlight current pointers
  bars[step.left]?.classList.add("active-left");
  bars[step.right]?.classList.add("active-right");

  // Update step text & progress
  stepLog.textContent += step.log + "\n";
  progress.textContent = `Step ${currentStep + 1} of ${stepData.length}`;

  // Live total water
  resultDiv.textContent = "Total Water (so far): " + step.total;
}

// Quick Mode
function startQuickMode() {
  clearInterval(autoPlayInterval);
  const { steps, total } = calculateSteps(heights);
  stepData = steps;
  renderState(steps[steps.length - 1]);
  resultDiv.textContent = "Total Water: " + total;
  stepLog.textContent = "Quick Mode Result: Total water trapped = " + total;
  progress.textContent = `Completed in ${steps.length} steps`;
}

// Tutorial Mode
function startTutorialMode() {
  clearInterval(autoPlayInterval);
  const { steps, total } = calculateSteps(heights);
  stepData = steps;
  currentStep = 0;

  stepLog.textContent = "";
  progress.textContent = `Step 0 of ${steps.length}`;
  resultDiv.textContent = "Total Water (so far): 0";

  const speed = parseInt(document.getElementById("speedControl").value) * 1000;

  autoPlayInterval = setInterval(() => {
    if (currentStep >= stepData.length) {
      clearInterval(autoPlayInterval);
      resultDiv.textContent = "Final Total Water: " + total;
      return;
    }
    renderState(stepData[currentStep]);
    currentStep++;
  }, speed);
}

// Manual Next Step (pauses auto-play)
function nextStep() {
  clearInterval(autoPlayInterval);
  if (!stepData.length) {
    const { steps } = calculateSteps(heights);
    stepData = steps;
    currentStep = 0;
  }
  if (currentStep < stepData.length) {
    renderState(stepData[currentStep]);
    currentStep++;
  } else {
    resultDiv.textContent = "Final Total Water: " + stepData[stepData.length - 1].total;
  }
}

// Restart animation (without changing array)
function restartAnimation() {
  clearInterval(autoPlayInterval);
  currentStep = 0;
  stepLog.textContent = "";
  progress.textContent = `Step 0 of ${stepData.length}`;
  barsDiv.querySelectorAll(".bar").forEach(bar => {
    const oldWater = bar.querySelector(".water");
    if (oldWater) oldWater.remove();
    bar.classList.remove("active-left", "active-right");
  });
  resultDiv.textContent = "Total Water: 0";
}
