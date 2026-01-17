document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("onboarding-form");
  const nextBtn = document.getElementById("next-btn");
  const prevBtn = document.getElementById("prev-btn");
  const submitBtn = document.getElementById("submit-btn");
  const steps = document.querySelectorAll(".form-step");
  const progressFill = document.getElementById("progress-bar");
  const currentStepNum = document.getElementById("current-step-num");

  let currentStep = 1;
  const totalSteps = steps.length;

  // Helper: Update UI based on step
  function updateUI() {
    // Show/Hide Steps
    steps.forEach(step => {
      if (parseInt(step.dataset.step) === currentStep) {
        step.classList.add("active");
      } else {
        step.classList.remove("active");
      }
    });

    // Update Progress
    const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
    if (progressFill) progressFill.style.width = `${progress}%`;
    if (currentStepNum) currentStepNum.textContent = currentStep;

    // Button States
    if (currentStep === 1) {
      prevBtn.style.display = "none";
    } else {
      prevBtn.style.display = "inline-block";
    }

    if (currentStep === totalSteps) {
      nextBtn.style.display = "none";
      submitBtn.style.display = "inline-block";
      populateReview(); // Populate summary on last step
    } else {
      nextBtn.style.display = "inline-block";
      submitBtn.style.display = "none";
    }
  }

  // Helper: Validate inputs in current step
  function validateStep() {
    const currentStepEl = document.querySelector(`.form-step[data-step="${currentStep}"]`);
    const inputs = currentStepEl.querySelectorAll("input, select, textarea");
    let valid = true;

    inputs.forEach(input => {
      if (input.hasAttribute("required") && !input.value.trim()) {
        valid = false;
        input.style.borderColor = "red";
        // Optionally add shake animation or error text
      } else {
        input.style.borderColor = ""; // Reset
      }
    });

    if (!valid) {
      alert("Please fill in all required fields to proceed.");
    }
    return valid;
  }

  // Populate Review Step
  function populateReview() {
    const setText = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val || "-";
    };

    setText("review-name", document.getElementById("full-name").value);
    setText("review-college", document.getElementById("college-name").value);
    setText("review-skills", document.getElementById("skills").value);
  }

  // File Preview Helpers
  const photoInput = document.getElementById("profile-photo");
  if (photoInput) {
    photoInput.addEventListener("change", (e) => {
      if (e.target.files.length > 0) {
        const text = document.querySelector(".upload-label");
        if (text) text.textContent = "Photo Selected: " + e.target.files[0].name;
      }
    });
  }

  const resumeInput = document.getElementById("resume-upload");
  if (resumeInput) {
    resumeInput.addEventListener("change", (e) => {
      if (e.target.files.length > 0) {
        const nameDisplay = document.getElementById("resume-name");
        if (nameDisplay) nameDisplay.textContent = e.target.files[0].name;
      }
    });
  }


  // Next Button Click
  nextBtn.addEventListener("click", () => {
    if (validateStep()) {
      if (currentStep < totalSteps) {
        currentStep++;
        updateUI();
      }
    }
  });

  // Prev Button Click
  prevBtn.addEventListener("click", () => {
    if (currentStep > 1) {
      currentStep--;
      updateUI();
    }
  });

  // Form Submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Final validation
    if (document.getElementById("create-password").value !== document.getElementById("confirm-password").value) {
      alert("Passwords do not match!");
      return;
    }

    const formData = new FormData(form);

    // Debug: Log FormData entries
    for (let [key, value] of formData.entries()) {
      console.log(`FormData: ${key} = ${value}`);
    }

    submitBtn.textContent = "Creating Account...";
    submitBtn.disabled = true;

    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        body: formData
      });

      let result;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        result = await res.json();
      } else {
        const text = await res.text();
        console.error("Non-JSON Response:", text);
        throw new Error("Server returned non-JSON response (possibly a crash). Check console.");
      }

      if (!res.ok) {
        alert(result.message || "Registration failed");
        submitBtn.disabled = false;
        submitBtn.textContent = "Create Pathlynx Account";
        return;
      }

      alert("Account created successfully! Please login.");
      window.location.href = "student-login.html";

    } catch (err) {
      console.error("Signup Error:", err);
      alert("Error: " + err.message);
      submitBtn.disabled = false;
      submitBtn.textContent = "Create Pathlynx Account";
    }
  });

  // Init
  updateUI();
});
