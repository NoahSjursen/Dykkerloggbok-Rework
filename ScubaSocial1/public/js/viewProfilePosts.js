// Function to fetch dive posts from Firestore
async function fetchDivePosts(uid) {
    try {
        if (uid) {
            const divesSnapshot = await firebase.firestore()
                .collection("users")
                .doc(uid)
                .collection("Dives")
                .get();
            
            const divePosts = [];
            divesSnapshot.forEach((doc) => {
                // Include the postId along with the diveData
                divePosts.push({ postId: doc.id, ...doc.data() });
            });
            
            return divePosts;
        } else {
            console.log("No UID provided.");
            return [];
        }
    } catch (error) {
        console.error("Error fetching dives:", error);
        return [];
    }
}

// Function to display dive posts in the personal-posts-container
async function displayDivePosts(uid) {
    const personalPostsContainer = document.getElementById("personalPostsContainer");
    
    // Clear previous content
    personalPostsContainer.innerHTML = "";
    
    // Create and append the heading div
    const headingDiv = document.createElement("div");
    headingDiv.classList.add("posts-heading");
    headingDiv.innerHTML = "<h2>Posts</h2>";
    
    // Insert the heading div before any dive posts
    personalPostsContainer.before(headingDiv); // This will place the heading above the personalPostsContainer

    const divePosts = await fetchDivePosts(uid);
    
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
    // Rearrange the order of elements to show media first
    postDiv.innerHTML = `
        <!-- Media content -->
        <div class="media-container">
            <img class="post-media" src="${diveData.MediaLinks.length > 0 ? diveData.MediaLinks[0] : "images/default-profile-photo.png"}" alt="Media">
        </div>
        <div class="info-container">
            <br>
            <div class="username">@${diveData.DiverName} (${diveData.Visibility})</div>
            <div class="time">${formatTime(diveData.Date)}</div>
            <div class="main-text">${diveData.MainTextContent}</div>
            <div class="additional-info">
                <p>Dive Location: ${diveData.DiveLocation || '-'}</p>
            </div>
        </div>
    `;
    
    postContainer.appendChild(postDiv);
}



// Function to format time
function formatTime(timestamp) {
    if (!timestamp) {
        return "Timestamp not available";
    }
    const date = timestamp.toDate(); // Convert Firestore timestamp to JavaScript Date object
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}


firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        const urlParams = new URLSearchParams(window.location.search);
        const uid = urlParams.get('uid');
        displayDivePosts(uid);
    } else {
        console.log("No user signed in.");
    }
});


