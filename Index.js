document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("login-btn").addEventListener("click", function () {
        openModal("login-modal");
    });

    document.getElementById("signup-btn").addEventListener("click", function () {
        openModal("signup-modal");
    });

    document.getElementById("signup-form").addEventListener("submit", function (event) {
        event.preventDefault();
        registerUser();
    });

    document.getElementById("login-form").addEventListener("submit", function (event) {
        event.preventDefault();
        loginUser();
    });
});

// Open/Close Modal
function openModal(modalId) {
    document.getElementById(modalId).style.display = "block";
}
function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}

// Load users from localStorage
let users = JSON.parse(localStorage.getItem("users")) || [];

// Auto-unlock expired locks
users.forEach(user => {
    if (user.lockUntil && Date.now() > user.lockUntil) {
        user.lockUntil = null;
        user.failedAttempts = 0;
    }
});
localStorage.setItem("users", JSON.stringify(users));

// Register User
function registerUser() {
    let username = document.getElementById("signup-username").value.trim();
    let email = document.getElementById("signup-email").value.trim();
    let password = document.getElementById("signup-password").value.trim();
    let confirmPassword = document.getElementById("signup-confirm-password").value.trim();
    let role = document.getElementById("signup-role").value;

    if (!role) {
        alert("Please select a role!");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    if (users.find(user => user.username.toLowerCase() === username.toLowerCase())) {
        alert("Username already exists!");
        return;
    }

    let userData = { username, email, password, role, failedAttempts: 0, lockUntil: null };
    users.push(userData);
    localStorage.setItem("users", JSON.stringify(users));

    alert(`Registered as ${role} successfully!`);
    closeModal("signup-modal");
}

// Login User
function loginUser() {
    let username = document.getElementById("login-username").value.trim();
    let password = document.getElementById("login-password").value.trim();
    let role = document.getElementById("login-role").value;

    if (!role) {
        alert("Please select your role!");
        return;
    }

    // Match only by username (case-insensitive)
    let user = users.find(u => u.username.toLowerCase() === username.toLowerCase());

    if (!user) {
        alert("Invalid username!");
        return;
    }

    const now = Date.now();

    // Check lock status
    if (user.lockUntil && now < user.lockUntil) {
        const minutesLeft = Math.ceil((user.lockUntil - now) / 60000);
        alert(`🚫 Your account is temporarily locked. Please try again after ${minutesLeft} minute(s).`);
        return;
    }

    // Validate password
    if (user.password !== password) {
        user.failedAttempts = (user.failedAttempts || 0) + 1;

        if (user.failedAttempts >= 3) {
            user.lockUntil = now + 5 * 60 * 1000; // Lock for 5 minutes
            user.failedAttempts = 0;
            alert("🔒 Account locked due to multiple failed login attempts. Please try again after 5 minutes.");
        } else {
            alert(`Invalid password! You have ${3 - user.failedAttempts} attempt(s) left.`);
        }

        localStorage.setItem("users", JSON.stringify(users));
        return;
    }

    // Validate role
    if (user.role !== role) {
        alert(`Incorrect role selected! You are registered as a ${user.role}`);
        return;
    }

    // Successful login
    user.failedAttempts = 0;
    user.lockUntil = null;
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(user));

    closeModal("login-modal");

    alert(`✅ Logged in as ${role} successfully!`);
    navigateToRolePage(role);
}


// Navigate by role
function navigateToRolePage(role) {
    switch (role.toLowerCase()) {
        case "student":
            window.location.href = "Profile.html";
            break;
        case "coordinator":
            window.location.href = "coordinator-dashboard.html";
            break;
        case "mentor":
            window.location.href = "mentor-dashboard.html";
            break;
        case "donor":
            window.location.href = "donor-dashboard.html";
            break;
        default:
            console.error("Invalid role selection!");
    }
}



// [Optional] Reset Password Feature (Not shown in UI but retained for dev use)
function showResetPassword() {
    const username = prompt("Enter your username:");
    if (!username) return;

    let user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (!user) {
        alert("Username not found!");
        return;
    }

    const newPassword = prompt("Enter your new password:");
    if (!newPassword) return;

    user.password = newPassword;
    user.failedAttempts = 0;
    user.lockUntil = null;

    localStorage.setItem("users", JSON.stringify(users));
    alert("Password reset successfully!");
}
