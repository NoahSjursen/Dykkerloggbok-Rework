// Function to handle form submission
function submitLogForm() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.style.display = 'flex'; // Show the loading spinner overlay

    const user = firebase.auth().currentUser;

    if (user) {
        const userId = user.uid;
        const db = firebase.firestore();
        const userRef = db.collection("users").doc(userId);

        userRef.get().then((doc) => {
            if (doc.exists) {
                const username = doc.data().username;
                const profilePhoto = doc.data().profilePhoto;

                // Get form data
                const logData = {
                    Date: new Date(), // Current date and time
                    DiverName: username, // Username
                    profilePhoto: profilePhoto || "images/default-profile-photo.png",
                    StartTime: document.getElementById("startTime").value.toString(),
                    EndTime: document.getElementById("endTime").value.toString(),
                    DiverBuddiesName: document.getElementById("diverBuddiesName").value.toString(),
                    DiverCertifications: document.getElementById("diverCertifications").value.toString(),
                    DiveLocation: document.getElementById("diveLocation").value.toString(),
                    WaterTemperature: document.getElementById("waterTemperature").value.toString(),
                    MaxDepth: document.getElementById("maxDepth").value.toString(),
                    BottomTime: document.getElementById("bottomTime").value.toString(),
                    GasType: document.getElementById("gasType").value.toString(),
                    StartPressure: document.getElementById("startPressure").value.toString(),
                    EndPressure: document.getElementById("endPressure").value.toString(),
                    WeatherConditions: document.getElementById("weatherConditions").value.toString(),
                    Visibility: document.getElementById("visibility").value.toString(),
                    EquipmentList: document.getElementById("equipmentList").value.toString(),
                    Observations: document.getElementById("observations").value.toString(),
                    Incidents: document.getElementById("incidents").value.toString(),
                    MainTextContent: document.getElementById("mainTextContent").value.toString(), // Main text content
                    ImageLinks: [], // Array to store image links
                    MediaLinks: [],  // Array to store media links
                    Comments: [] // Empty array for comments
                };

                // Reference to the user's "Dives" collection
                const userDivesRef = db.collection("users").doc(userId).collection("Dives");

                // Add the log data to the "Dives" collection
                userDivesRef.add(logData)
                    .then((docRef) => {
                        console.log("Log data added successfully with ID: ", docRef.id);

                        // Upload media files if present
                        const mediaFiles = document.getElementById("mediaUpload").files;
                        if (mediaFiles.length > 0) {
                            uploadMedia(docRef.id, mediaFiles, logData.Visibility);
                        } else {
                            // If no media files attached, directly add to Public_Posts only if visibility is public
                            if (logData.Visibility === "public") {
                                addToPublicPosts(db, docRef.id, logData);
                            }
                        }
                    })
                    .catch((error) => {
                        console.error("Error adding log data: ", error);
                        loadingOverlay.style.display = 'none'; // Hide the spinner on error
                    });
            } else {
                console.log("User document not found");
                loadingOverlay.style.display = 'none';
            }
        }).catch((error) => {
            console.error("Error getting user document:", error);
            loadingOverlay.style.display = 'none';
        });
    } else {
        // No user is signed in
        console.log("No user signed in");
        alert("You need to be signed in to create a log.");
        loadingOverlay.style.display = 'none';
    }
}

function completeSubmission() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.style.display = 'none'; // Hide the loading spinner
    window.history.back();
}

// Function to upload media files to Firebase Storage and update the log document with the media links
async function uploadMedia(logId, mediaFiles, visibility) {
    const storageRef = firebase.storage().ref();
    const mediaURLs = []; // Local array to store media URLs

    try {
        // Upload each media file and store the URLs in the local array
        for (const file of mediaFiles) {
            const fileType = file.type.startsWith('image/') ? 'images' : 'videos';
            const fileName = `${logId}_${Date.now()}_${file.name}`;
            const fileRef = storageRef.child(`${fileType}/${fileName}`);

            const snapshot = await fileRef.put(file);
            console.log("Uploaded a file:", snapshot.metadata.name);

            const mediaURL = await snapshot.ref.getDownloadURL(); // Get download URL
            mediaURLs.push(mediaURL); // Store media URL in local array
        }

        // Once all files are uploaded, update the Firestore document with the media links
        updateLogWithMedia(logId, mediaURLs, visibility);
    } catch (error) {
        console.error("Error uploading media files:", error);
    }
}

// Function to update the log document with the media links
function updateLogWithMedia(logId, mediaURLs, visibility) {
    const db = firebase.firestore();
    const user = firebase.auth().currentUser;

    if (user) {
        const userId = user.uid;
        const logRef = db.collection("users").doc(userId).collection("Dives").doc(logId);

        logRef.update({
            MediaLinks: mediaURLs
        })
        .then(() => {
            console.log("Log document updated with media links successfully");

            // If visibility is set to "public", add to Public_Posts
            if (visibility === "public") {
                addToPublicPosts(db, logId);
            }
        })
        .catch((error) => {
            console.error("Error updating log document with media links:", error);
        });
    }
}

// Function to add log data to Public_Posts
function addToPublicPosts(db, logId) {
    const user = firebase.auth().currentUser;

    if (user) {
        const userId = user.uid;
        const logRef = db.collection("users").doc(userId).collection("Dives").doc(logId);
        const publicPostsRef = db.collection("Default").doc("Public_Posts").collection("Posts").doc(logId);

        logRef.get()
            .then((doc) => {
                if (doc.exists) {
                    const logData = doc.data();

                    // Add the log data to Public_Posts
                    publicPostsRef.set({
                        ...logData // Assuming you want to copy all log data to Public_Posts
                    })
                    .then(() => {
                        console.log("Log data added to Public_Posts successfully");
                        completeSubmission();
                    })
                    .catch((error) => {
                        console.error("Error adding log data to Public_Posts: ", error);
                    });
                } else {
                    console.log("Log document not found");
                }
            })
            .catch((error) => {
                console.error("Error getting log document:", error);
            });
    }
}









