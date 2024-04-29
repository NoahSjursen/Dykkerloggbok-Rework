// Function to search for users by username
function searchUsersByUsername() {
    const username = document.getElementById("searchUsername").value.trim();
    const searchResultsList = document.getElementById("searchResults");
    searchResultsList.innerHTML = "";

    // Query Firestore to find users with matching usernames
    firebase.firestore().collection("users").get()
        .then((querySnapshot) => {
            querySnapshot.forEach((userDoc) => {
                const userData = userDoc.data();
                const userId = userDoc.id;
                const userUsername = userData.username; // Retrieve username directly from the UID document

                if (userUsername === username) {
                    // Create a list item for the matching user
                    const userItem = document.createElement("li");
                    userItem.textContent = `@${userUsername}`;
                    
                    // Create a button to add the user as a friend
                    const addButton = document.createElement("button");
                    addButton.textContent = "Add Friend";
                    addButton.onclick = function() {
                        addFriend(userId);
                    };
                    userItem.appendChild(addButton);
                    
                    // Append the list item to the search results list
                    searchResultsList.appendChild(userItem);
                }
            });

            // Display a message if no results found
            if (searchResultsList.children.length === 0) {
                const noResultsItem = document.createElement("li");
                noResultsItem.textContent = "No users found with that username.";
                searchResultsList.appendChild(noResultsItem);
            }
        })
        .catch((error) => {
            console.error("Error searching for users:", error);
        });
}

// Function to remove a friend
function removeFriend(friendId) {
    const currentUser = firebase.auth().currentUser;
    if (currentUser) {
        const userId = currentUser.uid;
        const userRef = firestore.collection("users").doc(userId);
        const friendRef = firestore.collection("users").doc(friendId);

        // Remove friendId from current user's Friends array
        userRef.update({
            Friends: firebase.firestore.FieldValue.arrayRemove(friendId)
        })
        .then(() => {
            console.log("Friend removed from current user's Friends array");
            // Remove current user's UID from friend user's Friends array
            friendRef.update({
                Friends: firebase.firestore.FieldValue.arrayRemove(userId)
            })
            .then(() => {
                console.log("Current user removed from friend user's Friends array");
                // Refresh the friends list after removing the friend
                populateFriendsList();
            })
            .catch((error) => {
                console.error("Error removing current user from friend user's Friends array:", error);
            });
        })
        .catch((error) => {
            console.error("Error removing friend from current user's Friends array:", error);
        });
    } else {
        console.log("No user is signed in.");
    }
}

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
                            // Create a list item for the friend
                            const listItem = document.createElement("li");
                            listItem.textContent = "@" + friendUsername;
                            
                            // Create a button to remove the friend
                            const removeButton = document.createElement("button");
                            removeButton.textContent = "Remove Friend";
                            removeButton.onclick = function() {
                                removeFriend(friendId);
                            };
                            listItem.appendChild(removeButton);
                            
                            // Append the list item to the friends list
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

// Call the populateFriendsList function after the user logs in
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        populateFriendsList();
    }
});

