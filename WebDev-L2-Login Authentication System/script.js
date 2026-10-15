
"use strict";

const USERS_KEY = "secureAccessUsers";
const SESSION_KEY = "secureAccessSession";

function getUsers() {
    try {
        const savedUsers = localStorage.getItem(USERS_KEY);
        const users = savedUsers ? JSON.parse(savedUsers) : [];

        return Array.isArray(users) ? users : [];
    } catch (error) {
        return [];
    }
}

function showMessage(element, message, type = "error") {
    if (!element) return;

    element.textContent = message;
    element.className = `message ${type}`;
}


function generateSalt() {
    const bytes = crypto.getRandomValues(new Uint8Array(16));

    return Array.from(bytes, byte =>
        byte.toString(16).padStart(2, "0")
    ).join("");
}


async function hashPassword(password, salt) {
    if (!crypto.subtle) {
        throw new Error(
            "Secure hashing requires HTTPS or localhost. Open this project using GitHub Pages."
        );
    }

    const data = new TextEncoder().encode(salt + password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);

    return Array.from(new Uint8Array(hashBuffer), byte =>
        byte.toString(16).padStart(2, "0")
    ).join("");
}


function usernameExists(users, username) {
    return users.some(user =>
        user.username.toLowerCase() === username.toLowerCase()
    );
}


function emailExists(users, email) {
    return users.some(user =>
        user.email.toLowerCase() === email.toLowerCase()
    );
}



const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async event => {
        event.preventDefault();

        const message = document.getElementById("registerMessage");
        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim().toLowerCase();
        const password = document.getElementById("password").value;
        const confirmPassword =
            document.getElementById("confirmPassword").value;

        showMessage(message, "");

        if (!username || !email || !password || !confirmPassword) {
            showMessage(message, "Please complete all fields.");
            return;
        }

        if (username.length < 3 || username.length > 30) {
            showMessage(message, "Username must be between 3 and 30 characters.");
            return;
        }

        if (!/^[a-zA-Z0-9_.-]+$/.test(username)) {
            showMessage(
                message,
                "Username may only contain letters, numbers, dots, underscores and hyphens."
            );
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showMessage(message, "Please enter a valid email address.");
            return;
        }

        if (password.length < 8 || !/[0-9]/.test(password)) {
            showMessage(
                message,
                "Password must contain at least 8 characters and at least 1 number."
            );
            return;
        }

        if (password !== confirmPassword) {
            showMessage(message, "The passwords do not match.");
            return;
        }

        const users = getUsers();

        if (usernameExists(users, username)) {
            showMessage(message, "That username is already registered.");
            return;
        }

        if (emailExists(users, email)) {
            showMessage(message, "That email address is already registered.");
            return;
        }

        try {
            const salt = generateSalt();
            const passwordHash = await hashPassword(password, salt);

            // Only the salted hash is stored, never the original password.
            const newUser = {
                username,
                email,
                salt,
                passwordHash
            };

            users.push(newUser);
            localStorage.setItem(USERS_KEY, JSON.stringify(users));

            registerForm.reset();

            showMessage(
                message,
                "Account created successfully! Redirecting to sign in...",
                "success"
            );

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1200);

        } catch (error) {
            showMessage(
                message,
                error.message || "Registration failed. Please try again."
            );
        }
    });
}


const loginForm = document.getElementById("loginForm");

if (loginForm) {
    // If already signed in, go to the dashboard.
    if (sessionStorage.getItem(SESSION_KEY)) {
        window.location.replace("dashboard.html");
    }

    loginForm.addEventListener("submit", async event => {
        event.preventDefault();

        const message = document.getElementById("loginMessage");
        const identity = document.getElementById("loginIdentity")
            .value.trim().toLowerCase();
        const password = document.getElementById("loginPassword").value;

        showMessage(message, "");

        if (!identity || !password) {
            showMessage(message, "Please enter your username/email and password.");
            return;
        }

        const users = getUsers();

        const user = users.find(account =>
            account.username.toLowerCase() === identity ||
            account.email.toLowerCase() === identity
        );

        try {
            // Use the same generic error regardless of which field is wrong.
            if (!user) {
                showMessage(message, "Invalid username/email or password.");
                return;
            }

            const enteredHash = await hashPassword(password, user.salt);

            if (enteredHash !== user.passwordHash) {
                showMessage(message, "Invalid username/email or password.");
                return;
            }

            // Store session details, not the user's password.
            sessionStorage.setItem(SESSION_KEY, JSON.stringify({
                username: user.username,
                email: user.email
            }));

            window.location.href = "dashboard.html";

        } catch (error) {
            showMessage(
                message,
                error.message || "Unable to sign in. Please try again."
            );
        }
    });
}

if (window.location.pathname.endsWith("/dashboard.html") ||
    window.location.pathname === "dashboard.html") {

    let session = null;

    try {
        session = JSON.parse(sessionStorage.getItem(SESSION_KEY));
    } catch (error) {
        session = null;
    }

    if (!session || !session.username || !session.email) {
        sessionStorage.removeItem(SESSION_KEY);
        window.location.replace("login.html");
    } else {
        const welcomeUsername = document.getElementById("welcomeUsername");
        const profileUsername = document.getElementById("profileUsername");
        const profileEmail = document.getElementById("profileEmail");

        if (welcomeUsername) {
            welcomeUsername.textContent = session.username;
        }

        if (profileUsername) {
            profileUsername.textContent = session.username;
        }

        if (profileEmail) {
            profileEmail.textContent = session.email;
        }
    }
}



const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {
    logoutButton.addEventListener("click", () => {
        sessionStorage.removeItem(SESSION_KEY);
        window.location.replace("login.html");
    });
}
