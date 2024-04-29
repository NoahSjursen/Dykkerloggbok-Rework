// Function to fetch tank data from Firestore and populate the choice box
function fetchTanks() {
    const user = firebase.auth().currentUser;
    if (user) {
        const userId = user.uid;
        const equipmentRef = firestore.collection("users").doc(userId).collection("Equipment").doc("Equipment_Info");

        equipmentRef.get().then((doc) => {
            if (doc.exists) {
                const equipmentData = doc.data();
                const tanksArray = equipmentData.Tanks;
                const tankChoice = document.getElementById("tankChoice");

                // Clear previous options
                tankChoice.innerHTML = "";

                // Populate the choice box with tank options
                tanksArray.forEach((tankString) => {
                    const tankComponents = tankString.split(", ");
                    const option = document.createElement("option");
                    option.text = tankComponents[0] + " Liters, " + tankComponents[1] + ", " + tankComponents[2];
                    tankChoice.add(option);
                });
            } else {
                console.log("No equipment data found.");
            }
        }).catch((error) => {
            console.error("Error retrieving equipment data:", error);
        });
    } else {
        console.log("No user signed in.");
    }
}

// Call fetchTanks function when the page loads
document.addEventListener("DOMContentLoaded", fetchTanks);




// Add a listener to check the authentication state
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log("User is signed in:", user);
        fetchTanks(user.uid); // Fetch tank data if user is signed in
    } else {
        console.log("No user signed in.");
    }
});

// Call fetchTanks function when the page loads
document.addEventListener("DOMContentLoaded", fetchTanks);
