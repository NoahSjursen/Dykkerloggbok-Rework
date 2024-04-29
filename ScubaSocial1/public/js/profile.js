// Add a listener to check the authentication state
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log("User is signed in:", user);
        fetchProfileData(user.uid); // Fetch profile data if user is signed in
    } else {
        console.log("No user is signed in.");
    }
});

// Function to fetch and display user profile data
function fetchProfileData(userId) {
    const userRef = firestore.collection("users").doc(userId);

    userRef.get()
        .then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                console.log("User data:", userData);

                // Pass the userData object to the displayProfileData function
                displayProfileData(userData);

                // Enable edit button after loading profile data
                document.getElementById("editButton").disabled = false;
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

        // Display diverName (editable)
        const diverNameInput = document.getElementById("diverName");
        const diverName = userData.diverName || "Default Diver Name";
        diverNameInput.value = diverName;

        // Display bio
        const bio = userData.bio || "Default Bio";
        document.getElementById("bio").value = bio;

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


// Function to handle editing of profile data
function handleEditProfile() {
    const diverNameInput = document.getElementById("diverName");
    const bioTextarea = document.getElementById("bio");
    const saveButton = document.getElementById("saveButton");
    const uploadPictureButton = document.getElementById("uploadPictureButton");
    const profileTextBoxes = document.getElementById("profileTextBoxes");

    // Make diverName input always editable
    diverNameInput.removeAttribute("readonly");

    // Toggle readOnly attribute for bio textarea
    bioTextarea.readOnly = !bioTextarea.readOnly;

    // Toggle the display of the profile text boxes
    profileTextBoxes.style.display = profileTextBoxes.style.display === "none" ? "block" : "none";

    // Show/hide the upload profile picture button
    uploadPictureButton.style.display = uploadPictureButton.style.display === "none" ? "block" : "none";

    // Show/hide the save button
    saveButton.style.display = saveButton.style.display === "none" ? "block" : "none";

    // Display profile data
    const userId = firebase.auth().currentUser.uid;
    fetchProfileData(userId);
}


function saveProfileData() {
    // Retrieve the diverName value from the input field

    // Update profile data in Firestore
    const userId = firebase.auth().currentUser.uid;
    const userRef = firestore.collection("users").doc(userId);

    // Create the updated profile data object
    const updatedProfileData = {
        bio: document.getElementById("bio").value,
        diverName : document.getElementById("diverName").value
    };

    // Check if a profile picture file has been selected
    const fileInput = document.getElementById("profilePictureInput");
    const file = fileInput.files[0];

    let profilePictureUploadPromise = Promise.resolve(); // Default to a resolved Promise

    if (file) {
        // If a file is selected, upload the profile picture
        profilePictureUploadPromise = uploadProfilePicture(file);
    }

    // Save profile data after profile picture upload, if applicable
    profilePictureUploadPromise.then((downloadURL) => {
        // If a download URL is provided (indicating successful upload), include it in the updated profile data
        if (downloadURL) {
            updatedProfileData.profilePhoto = downloadURL;
        }

        // Save updated profile data
        return userRef.set(updatedProfileData, { merge: true });
    })
    .then(() => {
        console.log("Profile data updated successfully:", updatedProfileData);
        // Reload the page after saving profile data
        location.reload();
    })
    .catch((error) => {
        console.error("Error updating profile data:", error);
        alert("Failed to save profile data. Please try again.");
    });
}

// Function to upload profile picture
function uploadProfilePicture(file) {
    return new Promise((resolve, reject) => {
        const userId = firebase.auth().currentUser.uid;
        const storageRef = firebase.storage().ref(`users/${userId}/profilePicture/${file.name}`);

        // Upload the file to Firebase Storage
        storageRef.put(file)
            .then((snapshot) => {
                console.log("Profile picture uploaded successfully");
                // Get the download URL of the uploaded file
                return snapshot.ref.getDownloadURL();
            })
            .then((downloadURL) => {
                console.log("Profile photo URL:", downloadURL);
                resolve(downloadURL); // Resolve the Promise with the download URL
            })
            .catch((error) => {
                console.error("Error uploading profile picture:", error);
                reject(error); // Reject the Promise with the error
            });
    });
}
