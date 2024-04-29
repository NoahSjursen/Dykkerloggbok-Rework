// Function to add a user as a friend and send a friend request
function addFriend(friendId) {
    const user = auth.currentUser;
            const userId = user.uid;

            // Get the email of the user associated with the friendId
            firestore.collection("users").doc(friendId).get()
                .then((friendDoc) => {
                    if (friendDoc.exists) {
                        const friendData = friendDoc.data();
                        const friendEmail = friendData.email;

                        // Send a friend request to the receiving user
                        sendFriendRequest(userId, friendEmail);
                    } else {
                        console.log("No such user with the provided ID.");
                        alert("No such user with the provided ID.");
                    }
                })
                .catch((error) => {
                    console.error("Error fetching user data:", error);
                    alert("Error fetching user data: " + error.message);
                });
}

// Function to approve friend request
function approveFriend(userId, friendId) {
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
        })
        .catch((error) => {
            console.error("Error removing friend request:", error);
        });
    })
    .catch((error) => {
        console.error("Error approving friend:", error);
        alert("Error approving friend: " + error.message);
    });
}

// Function to decline friend request
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
