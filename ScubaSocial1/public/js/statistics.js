// statistics.js

// Function to open the statistics modal
function openModal() {
    var modal = document.getElementById("statisticsModal");
    modal.style.display = "block";
}

// Function to close the statistics modal
function closeModal() {
    var modal = document.getElementById("statisticsModal");
    modal.style.display = "none";
}

// Function to fetch dive posts from Firestore
async function fetchPosts(uid) {
    try {
        if (uid) {
            const divesSnapshot = await firebase.firestore()
                .collection("users")
                .doc(uid)
                .collection("Dives")
                .get();
            
            const divePosts = divesSnapshot.docs.map(doc => doc.data());
            
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

// Function to populate the statistics modal with user statistics data
function populateStatisticsModal(divePosts) {
    const totalDives = divePosts.length;
    const averageDepth = divePosts.reduce((acc, dive) => acc + parseInt(dive.MaxDepth), 0) / totalDives;
    const totalTimeUnderwater = divePosts.reduce((acc, dive) => acc + parseInt(dive.BottomTime), 0);

    // Calculate most common diver buddy name
    const buddyNames = divePosts.map(dive => dive.DiverBuddiesName);
    const buddyNameCounts = {};
    buddyNames.forEach(name => {
        buddyNameCounts[name] = (buddyNameCounts[name] || 0) + 1;
    });
    const mostCommonBuddy = Object.keys(buddyNameCounts).reduce((a, b) => buddyNameCounts[a] > buddyNameCounts[b] ? a : b);

    // Calculate additional statistics
    const averageBottomTime = totalTimeUnderwater / totalDives;
    const diveLocations = divePosts.map(dive => dive.DiveLocation);
    const diveLocationCounts = {};
    diveLocations.forEach(location => {
        diveLocationCounts[location] = (diveLocationCounts[location] || 0) + 1;
    });
    const mostCommonDiveLocation = Object.keys(diveLocationCounts).reduce((a, b) => diveLocationCounts[a] > diveLocationCounts[b] ? a : b);
    const gasTypes = divePosts.map(dive => dive.GasType);
    const gasTypeCounts = {};
    gasTypes.forEach(type => {
        gasTypeCounts[type] = (gasTypeCounts[type] || 0) + 1;
    });
    const mostUsedGasType = Object.keys(gasTypeCounts).reduce((a, b) => gasTypeCounts[a] > gasTypeCounts[b] ? a : b);
    const weatherConditions = divePosts.map(dive => dive.WeatherConditions);
    const weatherConditionSummary = Array.from(new Set(weatherConditions)).join(", ");
    const waterTemperatures = divePosts.map(dive => parseInt(dive.WaterTemperature));
    const averageWaterTemperature = waterTemperatures.reduce((acc, temp) => acc + temp, 0) / totalDives;

    // Update the modal content with statistics data
    document.getElementById("dives").innerText = totalDives;
    document.getElementById("averageDepth").innerText = averageDepth.toFixed(2);
    document.getElementById("totalTimeUnderwater").innerText = totalTimeUnderwater + " minutes";
    document.getElementById("mostCommonBuddy").innerText = mostCommonBuddy || "N/A";
    document.getElementById("averageBottomTime").innerText = averageBottomTime.toFixed(2) + " minutes";
    document.getElementById("mostCommonDiveLocation").innerText = mostCommonDiveLocation || "N/A";
    document.getElementById("mostUsedGasType").innerText = mostUsedGasType || "N/A";
    document.getElementById("weatherConditionsSummary").innerText = weatherConditionSummary || "N/A";
    document.getElementById("averageWaterTemperature").innerText = averageWaterTemperature.toFixed(2) + " °C";
}




// Function to format time underwater
function formatTimeUnderwater(totalMinutes) {
    const minutesPerHour = 60;
    const minutesPerDay = 1440; // Number of minutes in a day
    const minutesPerMonth = 43800; // Number of minutes in a month (assuming 30 days)

    if (totalMinutes >= minutesPerMonth) {
        const months = Math.floor(totalMinutes / minutesPerMonth);
        const remainingDays = totalMinutes % minutesPerMonth;
        const days = Math.floor(remainingDays / minutesPerDay);
        return `${months} month(s), ${days} day(s)`;
    } else if (totalMinutes >= minutesPerDay) {
        const days = Math.floor(totalMinutes / minutesPerDay);
        const remainingHours = (totalMinutes % minutesPerDay) / minutesPerHour;
        return `${days} day(s), ${remainingHours} hour(s)`;
    } else if (totalMinutes >= minutesPerHour) {
        const hours = Math.floor(totalMinutes / minutesPerHour);
        const remainingMinutes = totalMinutes % minutesPerHour;
        return `${hours} hour(s), ${remainingMinutes} minute(s)`;
    } else {
        return `${totalMinutes} minute(s)`;
    }
}


// Call the fetchPosts function when the user is signed in
firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
        console.log("User signed in:", user.uid);
        const divePosts = await fetchPosts(user.uid);
        populateStatisticsModal(divePosts);
    } else {
        console.log("No user signed in.");
    }
});

