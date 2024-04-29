// fetchPersonalPosts.js

// Function to fetch dive posts from Firestore
async function fetchDivePosts() {
    try {
        const user = firebase.auth().currentUser;
        if (user) {
            const userId = user.uid;
            const divesSnapshot = await firebase.firestore()
                .collection("users")
                .doc(userId)
                .collection("Dives")
                .get();
            
            const divePosts = [];
            divesSnapshot.forEach((doc) => {
                // Include the postId along with the diveData
                divePosts.push({ postId: doc.id, ...doc.data() });
            });
            
            return divePosts;
        } else {
            console.log("No user signed in.");
            return [];
        }
    } catch (error) {
        console.error("Error fetching dives:", error);
        return [];
    }
}


// Function to display dive posts in the personal-posts-container
async function displayDivePosts() {
    const personalPostsContainer = document.getElementById("personalPostsContainer");
    
    // Clear previous content
    personalPostsContainer.innerHTML = "";
    
    // Create and append the heading div
    const headingDiv = document.createElement("div");
    headingDiv.classList.add("posts-heading");
    headingDiv.innerHTML = "<h2>Your Posts</h2>";
    
    // Insert the heading div before any dive posts
    personalPostsContainer.before(headingDiv); // This will place the heading above the personalPostsContainer

    const divePosts = await fetchDivePosts();
    
    // Display dive posts
    divePosts.forEach((diveData) => {
        displayDivePost(diveData, diveData.postId); // Pass postId to displayDivePost function
    });
}




// Function to display a single dive post
function displayDivePost(diveData, postId) { // Receive postId as an argument
    const postContainer = document.getElementById("personalPostsContainer");
    const postDiv = document.createElement("div");
    postDiv.classList.add("post");
    postDiv.id = postId; // Set postId as the id of the postDiv

    // Create and append elements to the postDiv based on diveData
    // For example:
    postDiv.innerHTML = `
        <img class="profile-photo" src="${diveData.profilePhoto || "images/default-profile-photo.png"}" alt="Profile Picture">
        <div class="username">@${diveData.DiverName} (${diveData.Visibility})</div>
        <div class="time">${formatTime(diveData.Date)}</div>
        <div class="main-text">${diveData.MainTextContent}</div>
        <div class="additional-info">
            <p><strong>Observations:</strong> ${diveData.Observations || '-'}</p>
            <p><strong>Incidents:</strong> ${diveData.Incidents || '-'}</p>
            <p><strong>Diver Certifications:</strong> ${diveData.DiverCertifications || '-'}</p>
            <p><strong>Dive Location:</strong> ${diveData.DiveLocation || '-'}</p>
            <p><strong>Diver Buddies Name:</strong> ${diveData.DiverBuddiesName || '-'}</p>
        </div>
        <div class="delete-icon" onclick="deletePost('${postId}')" title="Delete Post">&#128465;</div>
        <!-- Add media content here -->
        <div class="info-icon" onclick="openPostInfo('${postId}')" title="View Post Info">&#8505;</div>
    `;
    
    postContainer.appendChild(postDiv);
}

// Function to open post info page with postId in URL
function openPostInfo(postId) {
    // Construct URL for post info page
    const postInfoUrl = `postInfo.html?postId=${postId}`;
    // Open post info page in a new tab
    window.open(postInfoUrl, "_blank");
}


// Function to delete a post
async function deletePost(postId) {
    const user = firebase.auth().currentUser;
    if (!user) {
        console.log("No user signed in.");
        return;
    }

    const userId = user.uid;
    const db = firebase.firestore();
    const batch = db.batch();

    try {
        // Delete the post from the user's collection
        const userPostRef = db.collection("users").doc(userId).collection("Dives").doc(postId);
        batch.delete(userPostRef);

        // Check if it's a public post and delete from there as well
        const publicPostRef = db.collection("Default").doc("Public_Posts").collection("Posts").doc(postId);
        const publicPostDoc = await publicPostRef.get();
        if (publicPostDoc.exists) {
            batch.delete(publicPostRef);
        }

        // Confirm deletion
        const confirmDelete = confirm("Are you sure you want to delete this post?");
        if (confirmDelete) {
            await batch.commit();
            alert("Post deleted successfully!");
            // Remove the deleted post from the UI
            const deletedPostDiv = document.getElementById(postId);
            if (deletedPostDiv) {
                deletedPostDiv.remove();
            } else {
                console.log("Deleted post not found in UI.");
            }
        } else {
            alert("Deletion cancelled.");
        }
    } catch (error) {
        console.error("Error deleting post:", error);
        alert("Error deleting post. Please try again.");
    }
}



// Function to format time
function formatTime(timestamp) {
    if (!timestamp) {
        return "Timestamp not available";
    }
    const date = timestamp.toDate(); // Convert Firestore timestamp to JavaScript Date object
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}


// Call the displayDivePosts function when the user is signed in
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        displayDivePosts();
    } else {
        console.log("No user signed in.");
    }
});
