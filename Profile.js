document.addEventListener("DOMContentLoaded", function() {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser || currentUser.role !== "student") {
        window.location.href = "index.html"; // Redirect if not logged in as student
    }

    document.getElementById("email").value = currentUser.email;

    // Load saved profile data if exists
    let studentProfile = JSON.parse(localStorage.getItem("studentProfile")) || {};
    document.getElementById("first-name").value = studentProfile.firstName || "";
    document.getElementById("last-name").value = studentProfile.lastName || "";
    document.getElementById("contact").value = studentProfile.contact || "";
    document.getElementById("role-type").value = studentProfile.roleType || "Student";
    document.getElementById("yearly-income").value = studentProfile.yearlyIncome || "";

    // Load saved education details
    let educationEntries = studentProfile.education || [];
    educationEntries.forEach(entry => addEducation(entry));

    document.getElementById("profile-form").addEventListener("submit", function(event) {
        event.preventDefault();

        let updatedProfile = {
            firstName: document.getElementById("first-name").value,
            lastName: document.getElementById("last-name").value,
            contact: document.getElementById("contact").value,
            roleType: document.getElementById("role-type").value,
            yearlyIncome: document.getElementById("yearly-income").value,
            education: []
        };

        // Collect education entries
        document.querySelectorAll(".education-entry").forEach(entry => {
            updatedProfile.education.push({
                university: entry.querySelector(".university").value,
                major: entry.querySelector(".major").value,
                gpa: entry.querySelector(".gpa").value,
                year: entry.querySelector(".year").value
            });
        });

        localStorage.setItem("studentProfile", JSON.stringify(updatedProfile));
        alert("Profile updated successfully!");
    });

    document.getElementById("upload-image").addEventListener("change", previewImage);
});

function toggleEducationForm() {
    let eduForm = document.getElementById("education-form");
    eduForm.style.display = eduForm.style.display === "none" ? "block" : "none";
}

function addEducation(existingEntry = null) {
    let educationContainer = document.getElementById("education-entries");

    let entryDiv = document.createElement("div");
    entryDiv.classList.add("education-entry");

    entryDiv.innerHTML = `
        <input type="text" class="university" placeholder="College/University Name" value="${existingEntry ? existingEntry.university : ""}">
        <input type="text" class="major" placeholder="Major" value="${existingEntry ? existingEntry.major : ""}">
        <input type="text" class="gpa" placeholder="GPA" value="${existingEntry ? existingEntry.gpa : ""}">
        <input type="text" class="year" placeholder="Year of Passout" value="${existingEntry ? existingEntry.year : ""}">
    `;

    educationContainer.appendChild(entryDiv);
}

function toggleFinancialForm() {
    let finForm = document.getElementById("financial-form");
    finForm.style.display = finForm.style.display === "none" ? "block" : "none";
}

function previewImage(event) {
    let reader = new FileReader();
    reader.onload = function() {
        document.getElementById("profile-pic").src = reader.result;
        localStorage.setItem("profileImage", reader.result);
    };
    reader.readAsDataURL(event.target.files[0]);
}

function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}
