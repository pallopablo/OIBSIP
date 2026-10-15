# Login Authentication System

A simple login authentication web application built with HTML, CSS, and JavaScript for the OIBSIP Web Development Internship.

## Features

- User registration with username/email and password
- Password validation (minimum 8 characters and at least 1 number)
- Checks for duplicate registered accounts
- Login form with credential validation
- Generic error message for incorrect login details
- Protected dashboard that requires a logged-in session
- Logout functionality
- Responsive user interface

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript
- Browser `localStorage` for demo account storage
- Browser `sessionStorage` for login-session state

## Project Structure

```text
WebDev-L2-Login Authentication System/
├── register.html
├── login.html
├── dashboard.html
├── styles.css
├── script.js
└── README.md
```

> The filenames above are an example. Adjust this list to match the files in your project folder.

## How to Run

1. Download or clone the repository.
2. Open the project folder in Visual Studio Code.
3. Open `login.html` or `register.html` in a browser.
4. Alternatively, use the VS Code Live Server extension and choose **Open with Live Server**.
5. Register a demo account, then sign in and test the dashboard and logout features.

## Validation Rules

- Passwords must contain at least 8 characters.
- Passwords must contain at least one number.
- Login errors should not reveal whether the username/email or password was incorrect.
- Unauthenticated users should be redirected away from the dashboard.

## Security Note

This project is intended for learning and demonstration. If it uses `localStorage` to store accounts, it is **not suitable for real users or production authentication**. Browser storage and client-side checks can be inspected or modified, and passwords must not be stored as plain text. A production system should use a server-side authentication system, secure password hashing, HTTPS, and appropriately configured sessions or tokens.

## Internship Task

**Program:** OIBSIP Web Development Internship  
**Project:** Login Authentication System  
**Purpose:** Demonstrate registration, login validation, and access control for a protected page.

## Author
Pallo Mohoaladi
