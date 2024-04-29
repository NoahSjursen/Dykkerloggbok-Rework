// Include login and registration logic from existing files
// For example, if register.js contains the registerUser() function and login.js contains the loginUser() function, you would include them here.

// Include register.js
document.addEventListener("DOMContentLoaded", function () {
    const registerButton = document.getElementById("registerButton");
    if (registerButton) {
        registerButton.addEventListener("click", registerUser);
    }
});

// Include login.js
document.addEventListener("DOMContentLoaded", function () {
    const loginButton = document.getElementById("loginButton");
    if (loginButton) {
        loginButton.addEventListener("click", loginUser);
    }
});
