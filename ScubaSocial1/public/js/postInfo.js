// Function to fetch dive information based on diveID
function fetchDiveInfo(diveID) {
    return new Promise((resolve, reject) => {
        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
            if (user) {
                const userID = user.uid;
                const diveRef = firebase.firestore().collection("users").doc(userID).collection("Dives").doc(diveID);

                diveRef.get().then((doc) => {
                    if (doc.exists) {
                        resolve(doc.data());
                    } else {
                        console.log("No such document!");
                        resolve(null);
                    }
                }).catch((error) => {
                    console.error("Error getting document:", error);
                    reject(error);
                });
            } else {
                console.log("No user signed in.");
                resolve(null);
            }
            unsubscribe(); // Stop listening to auth state changes
        });
    });
}

// Function to check if a file is a video
function isVideo(fileUrl) {
    return fileUrl.endsWith(".mp4");
}

// Function to display dive post information
function displayDivePostInfo(postInfo) {
    // Get the container element
    const container = document.getElementById("content");

    // Define the order of information to display
    const displayOrder = [
        "DiverName",
        "DiverBuddiesName",
        "DiverCertifications",
        "DiveLocation",
        "Date",
        "StartTime",
        "EndTime",
        "Visibility",
        "MaxDepth",
        "BottomTime",
        "StartPressure",
        "EndPressure",
        "WaterTemperature",
        "WeatherConditions",
        "Incidents",
        "Observations"
        // Add or remove fields as needed
    ];

    // Create a div to hold all the information
    const infoDiv = document.createElement("div");
    infoDiv.classList.add("post-info");

    // Iterate over each key in the display order
    displayOrder.forEach((key) => {
        // Skip the profilePhoto and MediaLinks keys
        if (key === "profilePhoto" || key === "MediaLinks") {
            return;
        }

        // Check if the key exists in the postInfo object
        if (key in postInfo) {
            // Create a paragraph element to display the key and value
            const p = document.createElement("p");
            if (key === "Date") {
                // Convert timestamp to Date object
                const date = new Date(postInfo[key].seconds * 1000); // Convert seconds to milliseconds
                // Format date as "MM/DD/YYYY"
                const formattedDate = date.toLocaleDateString();
                // Format time as "HH:MM:SS AM/PM"
                const formattedTime = date.toLocaleTimeString('en-US', { timeStyle: 'short' });
                p.innerHTML = `<strong>${key}:</strong> ${formattedDate}, ${formattedTime}`;
                
            } else {
                p.innerHTML = `<strong>${key}:</strong> ${postInfo[key]}`;
            }
            // Append the paragraph element to the infoDiv
            infoDiv.appendChild(p);
        }
    });

    // Append the infoDiv to the container
    container.appendChild(infoDiv);

    // Display media links if available
    if (postInfo.MediaLinks && postInfo.MediaLinks.length > 0) {
        const mediaContainer = document.createElement("div");
        mediaContainer.classList.add("media-container");

        // Iterate over each media link and create an image or video element
        postInfo.MediaLinks.forEach((link) => {
            if (isVideo(link)) {
                // If it's a video, create a video element
                addMediaToContainer(link, 'video', mediaContainer);
            } else {
                // If it's an image, create an image element
                addMediaToContainer(link, 'image', mediaContainer);
            }
        });

        // Append the mediaContainer to the infoDiv
        infoDiv.appendChild(mediaContainer);
    }
}
// Function to add media to container
function addMediaToContainer(url, type, container) {
    let mediaElement;
    if (type === 'image') {
        mediaElement = document.createElement("img");
        mediaElement.src = url;
        mediaElement.classList.add("media-item");
        container.appendChild(mediaElement);
    } else if (type === 'video') {
        mediaElement = document.createElement("video");
        mediaElement.src = url;
        mediaElement.controls = true; // Add controls to video
        mediaElement.classList.add("media-item");
        container.appendChild(mediaElement);
    } else {
        console.error("Unknown media type:", type);
    }
    console.log("Media element added to container:", mediaElement);
}

// Get diveID from URL query parameter
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const diveID = urlParams.get('postId');

// Fetch and display dive information
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        fetchDiveInfo(diveID).then((diveInfo) => {
            if (diveInfo) {
                displayDivePostInfo(diveInfo);
            } else {
                console.log("No dive information found.");
            }
        }).catch(error => {
            console.error("Error fetching dive information:", error);
        });
    } else {
        console.log("No user signed in.");
    }
});

// Function to format the data as readable text
function formatDataAsText(postInfo) {
    let formattedText = '';

    // Define the order of fields
    const fieldOrder = [
        "DiverName",
        "DiverBuddiesName",
        "DiverCertifications",
        "DiveLocation",
        "Date",
        "StartTime",
        "EndTime",
        "Visibility",
        "MaxDepth",
        "BottomTime",
        "StartPressure",
        "EndPressure",
        "WaterTemperature",
        "WeatherConditions",
        "Incidents",
        "Observations",
        "GasType",
        "EquipmentList",
        "MainTextContent"
        // Add or remove fields as needed
    ];

    // Exclude profilePhoto field
    const { profilePhoto, ...postData } = postInfo;

    // Iterate over each field in the specified order
    fieldOrder.forEach((key) => {
        // Check if the field exists in the post data
        if (key in postData) {
            // Convert Date object to readable date format
            if (key === 'Date') {
                const date = new Date(postData[key].seconds * 1000); // Convert seconds to milliseconds
                formattedText += `${key}: ${date.toLocaleString()}\n`;
            } else {
                formattedText += `${key}: ${postData[key]}\n`;
            }
        }
    });

    return formattedText;
}


// Function to handle export data to text file
function exportDataToTextFile(postInfo) {
    // Exclude profilePhoto, ImageLinks, and MediaLinks fields
    const { profilePhoto, ImageLinks, MediaLinks, ...postData } = postInfo;

    // Format the data as readable text
    const formattedData = formatDataAsText(postData);

    // Create a Blob object containing the formatted data
    const blob = new Blob([formattedData], { type: 'text/plain' });

    // Create a link element
    const link = document.createElement('a');

    // Set the link's attributes
    link.href = URL.createObjectURL(blob);
    link.download = 'post_data.txt'; // File name

    // Append the link to the document body
    document.body.appendChild(link);

    // Click the link to trigger the download
    link.click();

    // Remove the link from the document body
    document.body.removeChild(link);
}


// Event listener for download icon
const downloadIcon = document.getElementById('downloadIcon');
downloadIcon.addEventListener('click', () => {
    // Fetch dive information
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            fetchDiveInfo(diveID).then((diveInfo) => {
                if (diveInfo) {
                    // Exclude profilePhoto and ImageLinks before exporting
                    const { profilePhoto, ImageLinks, ...postData } = diveInfo;
                    exportDataToTextFile(postData);
                } else {
                    console.log("No dive information found.");
                }
            }).catch(error => {
                console.error("Error fetching dive information:", error);
            });
        } else {
            console.log("No user signed in.");
        }
    });
});


function navigateToPublicURL(docID) {
    const currentURL = window.location.href;
    const baseURL = currentURL.split('?')[0]; // Remove query parameters
    const urlParts = baseURL.split('/');
    const domain = urlParts[0] + '//' + urlParts[2]; // Extract domain
    const publicURL = `${domain}/publicURL.html?docID=${docID}`;
    window.location.href = publicURL;
}

function uploadDiveDetailsToFirebase(diveInfo) {
    firebase.firestore().collection("publicURL").add(diveInfo)
    .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
        const docID = docRef.id;
        navigateToPublicURL(docID); // After upload, navigate to the public URL
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });
}

const sendButton = document.getElementById('sendButton');
sendButton.addEventListener('click', () => {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            fetchDiveInfo(diveID).then((diveInfo) => {
                if (diveInfo) {
                    uploadDiveDetailsToFirebase(diveInfo);
                } else {
                    console.log("No dive information found.");
                }
            }).catch(error => {
                console.error("Error fetching dive information:", error);
            });
        } else {
            console.log("No user signed in.");
        }
    });
});


