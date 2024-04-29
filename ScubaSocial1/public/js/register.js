function registerUser() {
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    const username = document.getElementById("registerUsername").value;
    const diverName = document.getElementById("fullname").value; // Get full name
    console.log(diverName);
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Registered successfully
            const user = userCredential.user;
            console.log("User registered:", user);

            // Add user to Firestore with email, username, full name, and bio
            const userData = {
                email: email,
                username: username,
                diverName: diverName, // Include full name
            };

            firestore.collection("users").doc(user.uid).set(userData)
            .then(() => {
                console.log("User added to Firestore");
                window.location.href = "main.html";
            })
            .catch((error) => {
                console.error("Error adding user to Firestore:", error);
                alert("Registration failed: " + error.message);
            });
        })
        .catch((error) => {
            // Handle errors
            console.error("Registration failed:", error.message);
            alert("Registration failed: " + error.message);
        });
}
