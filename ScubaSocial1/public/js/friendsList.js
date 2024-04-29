// Function to populate the friends list
function populateFriendsList() {
    const currentUser = firebase.auth().currentUser;
    if (currentUser) {
        const userId = currentUser.uid;
        const userRef = firestore.collection("users").doc(userId);

        userRef.get().then((doc) => {
            if (doc.exists) {
                const friendsArray = doc.data().Friends || []; // Get the Friends array from user data

                const friendsList = document.getElementById("friendsList");

                // Clear previous list items
                friendsList.innerHTML = "";

                // Iterate over each friend ID in the Friends array
                friendsArray.forEach((friendId) => {
                    // Get the username of the friend using their ID
                    firestore.collection("users").doc(friendId).get().then((friendDoc) => {
                        if (friendDoc.exists) {
                            const friendData = friendDoc.data();
                            const friendUsername = friendData.username || "Unknown"; // Default to "Unknown" if username is not found
                            // Append the friend username to the friends list
                            const listItem = document.createElement("li");
                            listItem.textContent = "@" + friendUsername;
                            friendsList.appendChild(listItem);
                        } else {
                            console.log("Friend data not found for ID:", friendId);
                        }
                    }).catch((error) => {
                        console.error("Error getting friend data:", error);
                    });
                });
            } else {
                console.log("User data not found for ID:", userId);
            }
        }).catch((error) => {
            console.error("Error getting user data:", error);
        });
    } else {
        console.log("No user is signed in.");
    }
}
