
function toggleSearchUser() {
    var searchUserDiv = document.getElementById("searchUserDiv");
    if (searchUserDiv.style.display === "none") {
        searchUserDiv.style.display = "block";
    } else {
        searchUserDiv.style.display = "none";
    }
}



// Function to add a friend
function addFriend(userId) {
    const currentUserUid = firebase.auth().currentUser.uid;
    
    // Get reference to the recipient's user document
    const userRef = firebase.firestore().collection("users").doc(userId);

    // Update recipient's user document to add current user's UID to Friend_Requests array
    userRef.update({
        Friend_Requests: firebase.firestore.FieldValue.arrayUnion(currentUserUid)
    })
    .then(() => {
        alert("Friend request sent successfully.");
        location.reload();
    })
    .catch((error) => {
        console.error("Error sending friend request:", error);
        alert("An error occurred while sending friend request.");
    });
}
