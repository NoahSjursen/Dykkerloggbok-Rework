// Get a reference to the Firestore database service
var db = firebase.firestore();

// Function to fetch profile information and display the profile photo
function displayProfile(user) {
    if (user) {
        // Current user is signed in
        var userId = user.uid;

        // Reference to the document in Firestore
        var docRef = db.collection("users").doc(userId);

        docRef.get().then(function(doc) {
            if (doc.exists) {
                // Retrieve username and diverName
                var username = doc.data().username;
                var diverName = doc.data().diverName;

                // Populate username and diverName
                document.getElementById("username").innerText = "@" + username;
                document.getElementById("diverName").innerText = diverName;

                // Retrieve profile photo URL
                var profilePhotoURL = doc.data().profilePhoto;

                // Get a reference to the image element
                var profilePicture = document.getElementById("profilePicture");

                // Check if profile photo URL is empty
                if (profilePhotoURL.trim() === "") {
                    // If profile photo URL is empty, use the placeholder image
                    profilePhotoURL = "images/default-profile-photo.png";
                }

                // Update the src attribute with the profile photo URL
                profilePicture.src = profilePhotoURL;

            } else {
                // Document doesn't exist
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });

    } else {
        // No user signed in
        console.log("No user signed in!");
    }
}

// Listen for authentication state changes
firebase.auth().onAuthStateChanged(function(user) {
    // Call displayProfile function with the user object
    displayProfile(user);
});
