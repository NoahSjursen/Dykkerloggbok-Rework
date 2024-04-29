// equipment.js

// Include certifications.js script
document.write('<script src="js/certifications.js"></script>');

// Function to toggle the Equipment and Certifications div
function toggleEquipment() {
    var equipmentDiv = document.getElementById("equipmentDiv");
    if (equipmentDiv.style.display === "none") {
        equipmentDiv.style.display = "block";
        // Fetch equipment and certifications data
        fetchEquipmentAndCertifications();
    } else {
        equipmentDiv.style.display = "none";
    }
}

// Function to fetch and display equipment and certifications data
async function fetchEquipmentAndCertifications() {
    const userId = firebase.auth().currentUser.uid;
    const equipmentRef = firestore.collection("users").doc(userId).collection("Equipment").doc("Equipment_Info");

    try {
        const doc = await equipmentRef.get();

        if (doc.exists) {
            const equipmentData = doc.data();
            console.log("Equipment data:", equipmentData);
            // Display equipment data
            displayEquipmentAndCertifications(equipmentData);
            // Display certifications data
            displayCertifications(equipmentData);
        } else {
            console.log("No equipment data found.");
            // Create default equipment data
            const defaultEquipmentData = {
                Tanks: []
                // Add more default fields if needed
            };
            // Save default equipment data to Firestore
            await equipmentRef.set(defaultEquipmentData);
            console.log("Default equipment data created and saved:", defaultEquipmentData);
            // Display default equipment data
            displayEquipmentAndCertifications(defaultEquipmentData);
            // Display certifications data (if any)
            displayCertifications(defaultEquipmentData);
        }
    } catch (error) {
        console.error("Error retrieving equipment data:", error);
    }
}


// Function to display equipment and certifications data
function displayEquipmentAndCertifications(equipmentData) {
    // Get the equipment div
    var equipmentDiv = document.getElementById("equipmentDiv");
    // Clear previous content
    equipmentDiv.innerHTML = "";

    // Check if Tanks array exists in the equipment data
    if (!equipmentData.Tanks || !Array.isArray(equipmentData.Tanks)) {
        // Initialize Tanks array if it doesn't exist
        equipmentData.Tanks = [];
    }

    // Loop through each tank in the Tanks array
    equipmentData.Tanks.forEach(function (tank) {
        // Create div to hold input fields for each tank
        var tankDiv = document.createElement("div");

        // Split tank data into parts
        var tankParts = tank.split(", ");

        // Create input fields for tank type, size (liters), and max air pressure
        var typeInput = document.createElement("input");
        typeInput.type = "text";
        typeInput.placeholder = "Type";
        typeInput.value = tankParts[1];

        var sizeInput = document.createElement("input");
        sizeInput.type = "text";
        sizeInput.placeholder = "Size (Liters)";
        sizeInput.value = tankParts[0];

        var maxPressureInput = document.createElement("input");
        maxPressureInput.type = "text";
        maxPressureInput.placeholder = "Max Air Pressure (bar)";
        maxPressureInput.value = tankParts[2];

        // Create button to save the tank (this button will not be displayed)
        var saveTankButton = document.createElement("button");
        saveTankButton.textContent = "Save Tank";
        saveTankButton.style.display = "none";

        // Create button to remove the tank
        var removeTankButton = document.createElement("button");
        removeTankButton.textContent = "Remove Tank";
        removeTankButton.onclick = function () {
            // Remove the tank div
            tankDiv.remove();

            // Get the index of the tank div
            var index = Array.from(equipmentDiv.children).indexOf(tankDiv);

            // Remove the tank from the Tanks array
            equipmentData.Tanks.splice(index, 1);

            // Save updated equipment data to Firestore
            saveEquipmentData(equipmentData);
        };

        // Append input fields, save button, and remove button to the tank div
        tankDiv.appendChild(typeInput);
        tankDiv.appendChild(sizeInput);
        tankDiv.appendChild(maxPressureInput);
        tankDiv.appendChild(saveTankButton);
        tankDiv.appendChild(removeTankButton);

        // Append the tank div to the equipment div
        equipmentDiv.appendChild(tankDiv);
    });

    // Create a button to add a new tank
    var addTankButton = document.createElement("button");
    addTankButton.textContent = "Add Tank";
    addTankButton.onclick = function () {
        // Create div to hold input fields for a new tank
        var tankDiv = document.createElement("div");

        // Create input fields for tank type, size (liters), and max air pressure
        var typeInput = document.createElement("input");
        typeInput.type = "text";
        typeInput.placeholder = "Type";

        var sizeInput = document.createElement("input");
        sizeInput.type = "text";
        sizeInput.placeholder = "Size (Liters)";

        var maxPressureInput = document.createElement("input");
        maxPressureInput.type = "text";
        maxPressureInput.placeholder = "Max Air Pressure (bar)";

        // Create button to save the tank
        var saveTankButton = document.createElement("button");
        saveTankButton.textContent = "Save Tank";
        saveTankButton.onclick = function () {
            // Get tank data from input fields
            var type = typeInput.value;
            var size = sizeInput.value;
            var maxPressure = maxPressureInput.value;

            // Format tank data
            var tankData = size + " Liters, " + type + ", " + maxPressure + " bar";

            // Add tank data to the Tanks array
            equipmentData.Tanks.push(tankData);

            // Save updated equipment data to Firestore
            saveEquipmentData(equipmentData);
        };

        // Create button to remove the tank
        var removeTankButton = document.createElement("button");
        removeTankButton.textContent = "Remove Tank";
        removeTankButton.onclick = function () {
            // Remove the tank div
            tankDiv.remove();
        };

        // Append input fields, save button, and remove button to the tank div
        tankDiv.appendChild(typeInput);
        tankDiv.appendChild(sizeInput);
        tankDiv.appendChild(maxPressureInput);
        tankDiv.appendChild(saveTankButton);
        tankDiv.appendChild(removeTankButton);

        // Append the tank div to the equipment div
        equipmentDiv.appendChild(tankDiv);
    };

    // Append the add tank button to the equipment div
    equipmentDiv.appendChild(addTankButton);
}


// Function to save equipment data to Firestore
function saveEquipmentData(equipmentData) {
    const userId = firebase.auth().currentUser.uid;
    const equipmentRef = firestore.collection("users").doc(userId).collection("Equipment").doc("Equipment_Info");
    
    // Update equipment data in Firestore
    equipmentRef.update({
        Tanks: equipmentData.Tanks
    })
    .then(() => {
        console.log("Equipment data updated successfully:", equipmentData);
        location.reload();
    })
    .catch((error) => {
        console.error("Error updating equipment data:", error);
    });
}
