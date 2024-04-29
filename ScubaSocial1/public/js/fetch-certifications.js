// Add a listener to check the authentication state
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log("User is signed in:", user);
        fetchCertifications(user.uid); // Fetch certifications data if user is signed in
    } else {
        console.log("No user is signed in.");
    }
});

// Function to fetch certifications data from Firestore
function fetchCertifications(userId) {
    const equipmentRef = firestore.collection("users").doc(userId).collection("Equipment").doc("Equipment_Info");
    
    equipmentRef.get()
        .then((doc) => {
            if (doc.exists) {
                const certificationsData = doc.data().certifications;
                console.log("Certifications data:", certificationsData);
                // Fill in certifications data into the form
                fillCertifications(certificationsData);
            } else {
                console.log("No certifications data found.");
            }
        })
        .catch((error) => {
            console.error("Error retrieving certifications data:", error);
        });
}

// Function to fill certifications data into the form
function fillCertifications(certificationsData) {
    const certificationsInput = document.getElementById("diverCertifications");
    certificationsInput.value = certificationsData.join(", ");
}
