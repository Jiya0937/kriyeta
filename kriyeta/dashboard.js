document.addEventListener("DOMContentLoaded", async () => {
  // Check Auth
  const localData = JSON.parse(localStorage.getItem("student"));
  if (!localData || !localData._id) {
    window.location.href = "student-login.html";
    return;
  }

  const userId = localData._id;

  // 1. Fetch latest profile
  try {
    const res = await fetch(`http://localhost:5000/api/profile/${userId}`);
    if (res.ok) {
      const student = await res.json();
      localStorage.setItem("Student", JSON.stringify(student));
      updateDashboardUI(student);

      // Setup interactions that depend on user data
      setupPhotoUpload(userId);
      setupProfileForm(student);

    } else {
      console.warn("Using cached profile");
      updateDashboardUI(localData);
      setupPhotoUpload(userId);
      setupProfileForm(localData);
    }
  } catch (err) {
    console.error("Profile fetch error:", err);
    updateDashboardUI(localData);
    setupPhotoUpload(userId);
    setupProfileForm(localData);
  }
});

function updateDashboardUI(user) {
  // Name
  document.querySelectorAll(".user-name-display").forEach(el => {
    el.textContent = user.fullName || "Student";
  });

  // Helper to set values
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val || "";
  };

  // Identity
  setVal("profile-fullname", user.fullName);
  setVal("profile-college", user.college);
  setVal("profile-email", user.email);
  setVal("profile-branch-year", `${user.branch || ""} ${user.year ? "• " + user.year + " Year" : ""}`);
  setVal("profile-scholar", user.scholarNo);
  setVal("profile-enrollment", user.enrollmentNo);

  // Professional
  setVal("profile-bio", user.bio);
  setVal("profile-skills", user.skills);
  setVal("profile-achievements", user.achievements);
  setVal("profile-certifications", user.certifications);
  setVal("profile-interests", user.interests);

  // Links
  setVal("profile-linkedin", user.linkedin);
  setVal("profile-github", user.github);
  setVal("profile-portfolio", user.portfolio);

  // Photo
  if (user.photo) {
    const photoPath = user.photo.replace(/\\/g, "/");
    const url = `http://localhost:5000/${photoPath}`;

    document.querySelectorAll(".user-avatar, .avatar-preview").forEach(el => {
      el.style.backgroundImage = `url('${url}')`;
      el.style.backgroundSize = "cover";
    });
  }

  // Resume Display
  const filenameEl = document.getElementById("resume-filename");
  const viewLink = document.getElementById("view-resume-link");
  if (user.resume) {
    filenameEl.textContent = "Resume.pdf"; // Or extract filename if possible
    filenameEl.style.color = "#333";
    viewLink.style.display = "inline-block";

    // Fix path separators
    const resumePath = user.resume.replace(/\\/g, "/");
    viewLink.href = `http://localhost:5000/${resumePath}`;
  } else {
    filenameEl.textContent = "No resume uploaded";
    filenameEl.style.color = "#999";
    viewLink.style.display = "none";
    viewLink.href = "#";
  }
}

function setupPhotoUpload(userId) {
  const uploadLabel = document.querySelector(".upload-label");
  const fileInput = document.getElementById("dashboard-photo-input");

  if (!uploadLabel || !fileInput) return;

  uploadLabel.style.cursor = "pointer";

  // Clean listeners
  const newLabel = uploadLabel.cloneNode(true);
  uploadLabel.parentNode.replaceChild(newLabel, uploadLabel);

  newLabel.addEventListener("click", () => fileInput.click());

  fileInput.onchange = async () => {
    if (!fileInput.files.length) return;
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("photo", file);

    const originalText = newLabel.textContent;
    newLabel.textContent = "Uploading...";

    try {
      const res = await fetch(`http://localhost:5000/api/profile/upload-photo/${userId}`, {
        method: "POST",
        body: formData
      });
      const result = await res.json();

      if (res.ok) {
        // Update local storage
        const currentData = JSON.parse(localStorage.getItem("Student")) || {};
        currentData.photo = result.path;
        localStorage.setItem("Student", JSON.stringify(currentData));

        // Update UI
        const photoPath = result.path.replace(/\\/g, "/");
        const url = `http://localhost:5000/${photoPath}`;
        document.querySelectorAll(".user-avatar, .avatar-preview").forEach(el => {
          el.style.backgroundImage = `url('${url}')`;
        });
        alert("Photo updated successfully!");
      } else {
        alert(result.message || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading photo");
    } finally {
      newLabel.textContent = originalText;
    }
  };
}

function setupProfileForm(user) {
  const editBtn = document.getElementById("toggle-edit-btn");
  const saveBtn = document.getElementById("save-profile-btn");
  const cancelBtn = document.getElementById("cancel-profile-btn");
  const editActions = document.getElementById("edit-actions");

  // Resume specific
  const uploadResumeBtn = document.getElementById("upload-resume-btn");
  const resumeInput = document.getElementById("resume-upload-input");
  const resumeHelp = document.getElementById("resume-help-text");

  // Fields to toggle
  const fields = [
    "profile-bio", "profile-skills", "profile-achievements",
    "profile-certifications", "profile-interests",
    "profile-linkedin", "profile-github", "profile-portfolio"
  ];

  if (!editBtn) return;

  // Edit Mode Toggle
  editBtn.addEventListener("click", () => {
    editBtn.style.display = "none";
    editActions.style.display = "flex";

    // Enable fields
    fields.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.disabled = false;
        el.style.backgroundColor = "#fff";
        el.style.border = "1px solid #ccc";
      }
    });

    // Show upload resume
    if (uploadResumeBtn) uploadResumeBtn.style.display = "inline-block";
    if (resumeHelp) resumeHelp.style.display = "block";
  });

  // Cancel
  cancelBtn.addEventListener("click", () => {
    // Revert UI
    updateDashboardUI(user);

    // Reset View
    editBtn.style.display = "inline-block";
    editActions.style.display = "none";

    fields.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.disabled = true;
        el.style.backgroundColor = ""; // Reset to CSS default (usually inherited or gray)
        el.style.border = "";
      }
    });

    if (uploadResumeBtn) uploadResumeBtn.style.display = "none";
    if (resumeHelp) resumeHelp.style.display = "none";
  });

  // Save
  saveBtn.addEventListener("click", async () => {
    saveBtn.textContent = "Saving...";
    saveBtn.disabled = true;

    const payload = {};
    fields.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        const key = id.replace("profile-", ""); // e.g. profile-bio -> bio
        payload[key] = el.value;
      }
    });

    try {
      const res = await fetch(`http://localhost:5000/api/profile/update/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const updatedUser = await res.json();
        // Update Local & State
        localStorage.setItem("Student", JSON.stringify(updatedUser));
        Object.assign(user, updatedUser); // Update the reference

        alert("Profile saved successfully!");

        // Return to view mode (trigger cancel click effectively to reset UI state but with new data)
        cancelBtn.click();

      } else {
        alert("Failed to save profile.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving profile");
    } finally {
      saveBtn.textContent = "Save Changes";
      saveBtn.disabled = false;
    }
  });

  // Resume Upload Logic
  if (uploadResumeBtn && resumeInput) {
    uploadResumeBtn.addEventListener("click", () => resumeInput.click());

    resumeInput.onchange = async () => {
      if (!resumeInput.files.length) return;

      const file = resumeInput.files[0];
      const formData = new FormData();
      formData.append("resume", file);

      uploadResumeBtn.textContent = "Uploading...";
      uploadResumeBtn.disabled = true;

      try {
        const res = await fetch(`http://localhost:5000/api/profile/upload-resume/${user._id}`, {
          method: "POST",
          body: formData
        });

        const result = await res.json();
        if (res.ok) {
          user.resume = result.path;
          localStorage.setItem("Student", JSON.stringify(user));
          updateDashboardUI(user); // shows new resume
          alert("Resume uploaded!");
        } else {
          alert("Resume upload failed: " + result.message);
        }
      } catch (err) {
        console.error(err);
        alert("Error uploading resume");
      } finally {
        uploadResumeBtn.textContent = "Upload New Resume (PDF)";
        uploadResumeBtn.disabled = false;
        resumeInput.value = ""; // reset
      }
    };
  }
}

window.logout = function () {
  localStorage.clear();
  window.location.href = "student-login.html";
};

window.toggleSidebar = function () {
  const sidebar = document.getElementById("sidebar");
  if (sidebar) sidebar.classList.toggle("active");
};

window.switchSection = function (targetId) {
  document.querySelectorAll(".dash-section").forEach(s => s.classList.remove("active"));
  const target = document.getElementById(targetId);
  if (target) target.classList.add("active");

  document.querySelectorAll(".nav-item-v2").forEach(n => n.classList.remove("active"));
  const navItem = document.querySelector(`.nav-item-v2[data-target="${targetId}"]`);
  if (navItem) navItem.classList.add("active");

  // Lazy Load Logic
  if (targetId === 'section-internships') {
    if (typeof loadInternships === 'function') {
      setTimeout(loadInternships, 100);
    }
  } else if (targetId === 'section-hackathons') {
    if (typeof loadHackathons === 'function') {
      setTimeout(loadHackathons, 100);
    }
  }
};

document.querySelectorAll(".nav-item-v2").forEach(link => {
  link.addEventListener("click", (e) => {
    const target = link.getAttribute("data-target");
    if (target) {
      e.preventDefault();
      switchSection(target);
    }
  });
});
