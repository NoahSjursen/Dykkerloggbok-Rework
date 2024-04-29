// Add a listener to check the authentication state
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log("User is signed in:", user);
        const urlParams = new URLSearchParams(window.location.search);
        const uid = urlParams.get('uid');
        fetchProfileData(uid); // Fetch profile data using UID if user is signed in
    } else {
        console.log("No user is signed in.");
    }
});

// Function to fetch and display user profile data using UID
function fetchProfileData(uid) {
    const userRef = firestore.collection("users").doc(uid);

    userRef.get()
        .then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                console.log("User data:", userData);

                // Pass the userData object to the displayProfileData function
                displayProfileData(userData);
            } else {
                console.log("No user data found.");
                // Handle this case as needed
            }
        })
        .catch((error) => {
            console.error("Error retrieving profile data:", error);
            // Handle the error here
        });
}

function displayProfileData(userData) {
    // Check if userData exists
    if (userData) {
        // Display username (not editable)
        const username = userData.username || "Default Username";
        document.getElementById("username").textContent = "@" + username;

        // Display diverName
        const diverName = userData.diverName || "Default Diver Name";
        document.getElementById("diverName").textContent = diverName;

        // Display bio
        const bio = userData.bio || "Default Bio";
        document.getElementById("bio").textContent = bio;

        console.log("Profile data:", userData);

        // Display profile photo
        const profilePhoto = userData.profilePhoto;
        if (profilePhoto) {
            document.getElementById("profilePicture").src = profilePhoto;
            console.log("PROFILE PHOTO LOADED");
        } else {
            console.log("PROFILE PHOTO NOT LOADED");
            document.getElementById("profilePicture").src = "images/default-profile-photo.png";
        }
    } else {
        console.log("No user data found.");
    }
}


