// fetchCombinedPosts.js
async function fetchCombinedPosts() {
    const db = firebase.firestore();
    const combinedPostsDiv = document.getElementById("combinedPostsList");

    try {
        // Fetch public posts
        const publicSnapshot = await db.collection("Default").doc("Public_Posts").collection("Posts").get();
        publicSnapshot.forEach((publicDoc) => {
            const postData = publicDoc.data();
            displayPost(postData, "Public");
        });

        // Fetch friends' posts
        const user = firebase.auth().currentUser;
        if (user) {
            const userId = user.uid;
            const userDoc = await db.collection("users").doc(userId).get();
            const userFriends = userDoc.data().Friends;
            
            for (const friendUID of userFriends) {
                const friendPostsSnapshot = await db.collection("users").doc(friendUID)
                                                    .collection("Dives").where("Visibility", "==", "friends").get();
                friendPostsSnapshot.forEach((friendPostDoc) => {
                    const friendPostData = friendPostDoc.data();
                    displayPost(friendPostData, "Friend");
                });
            }
        }
    } catch (error) {
        console.error("Error fetching posts:", error);
    }
}


// Global variables to keep track of the last visible post and the batch size
let lastVisiblePost = null;
const batchSize = 3;

// Global array to store post IDs
let allPostIDs = [];

// Function to fetch the next batch of posts
function fetchNextPosts() {
    const db = firebase.firestore();
    const postsCollection = db.collection('posts');

    let query = postsCollection.orderBy('timestamp', 'desc');

    // If lastVisiblePost is not null, start the query after the last visible post
    if (lastVisiblePost) {
        query = query.startAfter(lastVisiblePost);
    }

    // Limit the query to the batch size
    query = query.limit(batchSize);

    // Execute the query
    query.get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const postData = doc.data();
                // Log the post ID
                console.log("Post ID:", doc.id);
                // Store the post ID in the array
                allPostIDs.push(doc.id);
                // Process each post data here
                console.log(postData);
                // Update lastVisiblePost for the next query
                lastVisiblePost = doc;
            });

            // Log the current amount of loaded items
            console.log("Current amount of loaded items:", allPostIDs.length);

            // If there are fewer posts than the batch size, it means no more posts to fetch
            if (querySnapshot.size < batchSize) {
                console.log("No more posts to fetch");
                // Hide or disable the "See More" button
                // document.getElementById("seeMoreButton").style.display = "none";
            }
        })
        .catch((error) => {
            console.error('Error fetching posts:', error);
        });
}


// Function to handle clicking the "See More" button
function seeMore() {
    fetchNextPosts();
}

// Initial fetch of the first batch of posts
fetchNextPosts();

