// displayPost.js

function displayPost(postData, type) {
    const combinedPostsDiv = document.getElementById("combinedPostsList");

    // Create the post div
    const postDiv = document.createElement("div");
    postDiv.classList.add("post");

    // Display profile photo
    const profilePhotoElement = document.createElement("img");
    profilePhotoElement.classList.add("profile-photo");
    // Assuming postData includes the profile photo URL under 'profilePhoto'
    profilePhotoElement.src = postData.profilePhoto || "images/default-profile-photo.png"; // Use default photo if no profile photo available
    postDiv.appendChild(profilePhotoElement);
    

    // Display username and visibility flag
    const usernameElement = document.createElement("div");
    usernameElement.classList.add("username");
    usernameElement.innerHTML = `@${postData.DiverName} <span style="font-style: italic; font-weight: lighter; font-size: 15px;">(${postData.Visibility})</span>`; // Displaying username and visibility with visibility in italic
    postDiv.appendChild(usernameElement);

    // Extract username
    const username = postData.DiverName;

    // Query Firestore to find the user document with the corresponding username
    const userRef = db.collection("users").where("username", "==", username).limit(1);

    userRef.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const uid = doc.id;
            // Add event listener to profile photo and username to redirect to profile page
            profilePhotoElement.addEventListener("click", () => redirectToProfilePage(uid));
            usernameElement.addEventListener("click", () => redirectToProfilePage(uid));
        });
    }).catch((error) => {
        console.error("Error getting user document:", error);
    });

    // Display time posted
    const timeElement = document.createElement("div");
    timeElement.classList.add("time");
    timeElement.textContent = formatTime(postData.Date); // Using Date field as the timestamp
    postDiv.appendChild(timeElement);

    // Display main text content
    const mainTextElement = document.createElement("div");
    mainTextElement.classList.add("main-text");
    mainTextElement.textContent = postData.MainTextContent;
    postDiv.appendChild(mainTextElement);

    // Additional information
    const additionalInfoDiv = document.createElement("div");
    additionalInfoDiv.classList.add("additional-info");
    additionalInfoDiv.innerHTML = `
        <p><strong>Observations:</strong> ${postData.Observations || '-'}</p>
        <p><strong>Incidents:</strong> ${postData.Incidents || '-'}</p>
        <p><strong>Diver Certifications:</strong> ${postData.DiverCertifications || '-'}</p>
        <p><strong>Dive Location:</strong> ${postData.DiveLocation || '-'}</p>
        <p><strong>Diver Buddies Name:</strong> ${postData.DiverBuddiesName || '-'}</p>
        <p><strong>Max Depth:</strong> ${postData.MaxDepth || '-'}</p>
    `;
    postDiv.appendChild(additionalInfoDiv);

// Create container for media content
const mediaContainer = document.createElement("div");
mediaContainer.classList.add("media-container");
postDiv.appendChild(mediaContainer); // Append the media container to the post div

// Display the first media item initially
if (postData.MediaLinks && postData.MediaLinks.length > 0) {
    const firstMediaUrl = postData.MediaLinks[0];
    const firstMediaType = getMediaType(firstMediaUrl);
    addMediaToContainer(firstMediaUrl, firstMediaType, mediaContainer);

    // Check if there are more than one media items
    if (postData.MediaLinks.length > 1) {
        const showMoreButton = document.createElement("button");
        showMoreButton.textContent = "Show More";
        showMoreButton.classList.add("show-more-button");
        showMoreButton.addEventListener("click", function() {
            // Display the rest of the media items
            for (let i = 1; i < postData.MediaLinks.length; i++) {
                const mediaUrl = postData.MediaLinks[i];
                const mediaType = getMediaType(mediaUrl);
                addMediaToContainer(mediaUrl, mediaType, mediaContainer);
            }
            // Hide the "Show More" button after displaying all media items
            showMoreButton.style.display = 'none';
            // Ensure "Hide" button is displayed to allow toggling
            hideButton.style.display = 'inline';
        });
        postDiv.appendChild(showMoreButton);

        // Add a "Hide" button, initially hidden
        const hideButton = document.createElement("button");
        hideButton.textContent = "Hide";
        hideButton.classList.add("hide-button");
        hideButton.style.display = 'none'; // Initially hidden
        hideButton.addEventListener("click", function() {
            // Hide all media items except the first one
            const mediaItems = mediaContainer.querySelectorAll(".media");
            for (let i = 1; i < mediaItems.length; i++) {
                mediaItems[i].style.display = 'none';
            }
            // Toggle button visibility
            hideButton.style.display = 'none';
            showMoreButton.style.display = 'inline';

            // Smooth scroll to the top of the post div
            postDiv.scrollIntoView({ behavior: 'smooth' });
        });
        postDiv.appendChild(hideButton);
    }

    
}

function addMediaToContainer(url, type, container) {
    let mediaElement;
    if (type === 'image') {
        mediaElement = document.createElement("img");
        mediaElement.src = url;
        mediaElement.classList.add("media");
    } else if (type === 'video') {
        mediaElement = document.createElement("video");
        mediaElement.src = url;
        mediaElement.controls = true;
        mediaElement.classList.add("media");
    }
    container.appendChild(mediaElement);
}



    // Append the post div to the container
    // Prepend instead of append to display newest posts first
    combinedPostsDiv.prepend(postDiv);
}


// Function to format time
function formatTime(timestamp) {
    if (!timestamp) {
        return "Timestamp not available";
    }
    const date = timestamp.toDate(); // Convert Firestore timestamp to JavaScript Date object
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}

function getMediaType(url) {
    const lowerCaseUrl = url.toLowerCase();
    if (lowerCaseUrl.includes('.mp4') || lowerCaseUrl.includes('.webm') || lowerCaseUrl.includes('.ogg')) {
        return 'video';
    } else if (lowerCaseUrl.includes('videos/')) {
        return 'video';
    } else {
        return 'image';
    }
}

function redirectToProfilePage(uid) {
    // Construct URL for profile page
    const profilePageUrl = `viewProfile.html?uid=${uid}`;
    // Redirect user to profile page
    window.location.href = profilePageUrl;
}

