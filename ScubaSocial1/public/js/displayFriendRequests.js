// Call the displayFriendRequests function when the authentication state changes
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        displayFriendRequests();
    } else {
        // No user is signed in.
        console.log("No user is currently signed in.");
    }
});


function approveFriend(userId, friendId) {
    // Disable accept and decline buttons
    disableButtons();

    // Add friend to the current user's Friends list
    firestore.collection("users").doc(userId).update({
        Friends: firebase.firestore.FieldValue.arrayUnion(friendId)
    })
    .then(() => {
        console.log("Friend approved successfully!");
        alert("Friend approved successfully!");

        // Add the current user to the friend's Friends list
        firestore.collection("users").doc(friendId).update({
            Friends: firebase.firestore.FieldValue.arrayUnion(userId)
        })
        .then(() => {
            console.log("Current user added to friend's Friends list successfully!");
            // Reload Firebase data
            displayFriendRequests();
        })
        .catch((error) => {
            console.error("Error adding current user to friend's Friends list:", error);
        });

        // Remove friend request from the current user's Friend_Requests list
        firestore.collection("users").doc(userId).update({
            Friend_Requests: firebase.firestore.FieldValue.arrayRemove(friendId)
        })
        .then(() => {
            console.log("Friend request removed successfully!");
            // Reload Firebase data
            displayFriendRequests();
        })
        .catch((error) => {
            console.error("Error removing friend request:", error);
        });
    })
    .catch((error) => {
        console.error("Error approving friend:", error);
        alert("Error approving friend: " + error.message);
        // Re-enable buttons on error
        enableButtons();
    });
}

function declineFriendRequest(userId, friendId) {
    // Disable accept and decline buttons
    disableButtons();

    // Remove friend request from the current user's Friend_Requests list
    firestore.collection("users").doc(userId).update({
        Friend_Requests: firebase.firestore.FieldValue.arrayRemove(friendId)
    })
    .then(() => {
        console.log("Friend request declined successfully!");
        alert("Friend request declined successfully!");
        // Reload Firebase data
        displayFriendRequests();
    })
    .catch((error) => {
        console.error("Error declining friend request:", error);
        alert("Error declining friend request: " + error.message);
        // Re-enable buttons on error
        enableButtons();
    });
}

function disableButtons() {
    const acceptButtons = document.querySelectorAll(".accept-button");
    const declineButtons = document.querySelectorAll(".decline-button");
    acceptButtons.forEach(button => button.disabled = true);
    declineButtons.forEach(button => button.disabled = true);
}

function enableButtons() {
    const acceptButtons = document.querySelectorAll(".accept-button");
    const declineButtons = document.querySelectorAll(".decline-button");
    acceptButtons.forEach(button => button.disabled = false);
    declineButtons.forEach(button => button.disabled = false);
}


function declineFriendRequest(userId, friendId) {
    // Remove friend request from the current user's Friend_Requests list
    firestore.collection("users").doc(userId).update({
        Friend_Requests: firebase.firestore.FieldValue.arrayRemove(friendId)
    })
    .then(() => {
        console.log("Friend request declined successfully!");
        alert("Friend request declined successfully!");
    })
    .catch((error) => {
        console.error("Error declining friend request:", error);
        alert("Error declining friend request: " + error.message);
    });
}

// Continue with the definition of displayFriendRequests function...


function displayFriendRequests() {
    const currentUser = firebase.auth().currentUser;
    if (currentUser) {
        const currentUserUid = currentUser.uid;
        const friendRequestsList = document.getElementById("friendRequestsList");
        friendRequestsList.innerHTML = ""; // Clear previous list

        // Get the current user's document
        const currentUserRef = firebase.firestore().collection("users").doc(currentUserUid);

        // Fetch friend requests from the current user's document
        currentUserRef.get()
            .then((doc) => {
                if (doc.exists) {
                    const friendRequests = doc.data().Friend_Requests || [];

                    // Display each friend request
                    friendRequests.forEach((requestUid) => {
                        // Fetch user data based on the user ID
                        firebase.firestore().collection("users").doc(requestUid).get()
                            .then((userDoc) => {
                                if (userDoc.exists) {
                                    const userData = userDoc.data();
                                    const username = userData.username;

                                    // Create list item for the friend request
                                    const requestItem = document.createElement("li");
                                    requestItem.textContent = username;

                                    // Create accept and decline buttons
                                    const acceptButton = document.createElement("button");
                                    acceptButton.textContent = "Accept";
                                    acceptButton.onclick = function() {
                                        approveFriend(currentUserUid, requestUid);
                                    };
                                    const declineButton = document.createElement("button");
                                    declineButton.textContent = "Decline";
                                    declineButton.onclick = function() {
                                        declineFriendRequest(currentUserUid, requestUid);
                                    };

                                    // Append buttons to request item
                                    requestItem.appendChild(acceptButton);
                                    requestItem.appendChild(declineButton);

                                    // Append request item to list
                                    friendRequestsList.appendChild(requestItem);
                                } else {
                                    console.log("User document does not exist for UID:", requestUid);
                                }
                            })
                            .catch((error) => {
                                console.error("Error fetching user document:", error);
                            });
                    });
                } else {
                    console.log("No such document!");
                }
            })
            .catch((error) => {
                console.log("Error getting document:", error);
            });
    } else {
        //console.log("No user is currently signed in.");
    }
}
