// Function to fetch and display previous dives
function fetchPreviousDives() {
    const user = auth.currentUser;
            const userId = user.uid;

            // Reference to the user's dives collection
            const divesRef = firestore.collection("users").doc(userId).collection("Dives");

            // Clear previous dive data
            document.getElementById("previousDivesList").innerHTML = "";

            // Retrieve dives from Firestore for the current user from the subcollection
            divesRef.get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        const diveData = doc.data();
                        console.log(diveData); // Log dive data

                        // Create a list item
                        const diveItem = document.createElement("li");

                        // Create an anchor element
                        const diveLink = document.createElement("a");
                        diveLink.textContent = `Date: ${diveData.Date}, Location: ${diveData.DiveLocation}`;

                        // Set the href attribute with the Dive ID as a query parameter
                        diveLink.href = `log.html?diveId=${doc.id}`;

                        // Append the anchor element to the list item
                        diveItem.appendChild(diveLink);

                        // Append the list item to the unordered list
                        document.getElementById("previousDivesList").appendChild(diveItem);
                    });
                })
                .catch((error) => {
                    console.error("Error fetching dives:", error);
                });
}

// Function to fetch and display public posts
function fetchPublicPosts() {
    // Reference to the "Public_Posts" collection
    const publicPostsRef = firestore.collection("Public_Posts");

    // Clear previous public posts
    const publicPostsList = document.getElementById("publicPostsList");
    publicPostsList.innerHTML = "";

    // Retrieve public posts from Firestore
    publicPostsRef.get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const postData = doc.data();

                // Create a list item for each public post
                const postListItem = document.createElement("li");
                postListItem.classList.add("post");

                // Add content to the post list item
                postListItem.innerHTML = `
                    <h3>Date: ${postData.Date}</h3>
                    <p>Dive Location: ${postData.DiveLocation}</p>
                    <p>Main Text Content: ${postData.MainTextContent}</p>
                    <p>Posted By: ${postData.Username}</p>
                `;

                // Append the post list item to the public posts list
                publicPostsList.appendChild(postListItem);
            });
        })
        .catch((error) => {
            console.error("Error fetching public posts:", error);
        });
}
