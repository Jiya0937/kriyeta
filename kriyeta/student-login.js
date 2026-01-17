document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");

  // Toggle Password Visibility
  const toggleBtn = document.querySelector(".toggle-password");
  const passwordInput = document.getElementById("password");
  const eyeIcon = document.getElementById("eye-icon");

  if (toggleBtn && passwordInput && eyeIcon) {
    toggleBtn.addEventListener("click", () => {
      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        eyeIcon.textContent = "visibility";
      } else {
        passwordInput.type = "password";
        eyeIcon.textContent = "visibility_off";
      }
    });
  }

  // Handle Login
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const submitBtn = loginForm.querySelector('button[type="submit"]');

      if (submitBtn) {
        submitBtn.textContent = "Logging in...";
        submitBtn.disabled = true;
      }

      try {
        const res = await fetch("http://localhost:5000/api/login", { // Updated to match server.js route mount /api + /login = /api/login? Wait. server.js has app.use("/api", authRoutes). authRoutes has router.post("/login"). So it is /api/login.
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email, password })
        });

        const result = await res.json();

        if (!res.ok) {
          if (res.status === 404) {
            // Show Create Account Prompt
            const prompt = document.getElementById("create-account-prompt");
            if (prompt) {
              prompt.style.display = "block";
              // Optional: visual shake or scrolling to make it obvious
              prompt.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          } else {
            alert(result.message || "Login failed");
          }

          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = "Login to Dashboard";
          }
          return;
        }

        // Store student data
        localStorage.setItem("student", JSON.stringify(result));

        // Redirect
        window.location.href = "dashboard.html";

      } catch (err) {
        console.error("LOGIN ERROR:", err);
        alert("Server error. Please try again.");
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Login to Dashboard";
        }
      }
    });
  }
});
