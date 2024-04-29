// certifications.js

// Function to display certifications
function displayCertifications(equipmentData) {
    // Get the equipment div
    var equipmentDiv = document.getElementById("equipmentDiv");

    // Initialize certifications array if it doesn't exist
    if (!equipmentData.hasOwnProperty("certifications") || !Array.isArray(equipmentData.certifications)) {
        equipmentData.certifications = [];
    }

    // Loop through each certification in the certifications array
    equipmentData.certifications.forEach(function (certification) {
        // Create div to hold input field for each certification
        var certificationDiv = document.createElement("div");

        // Create input field for certification name
        var certificationInput = document.createElement("input");
        certificationInput.type = "text";
        certificationInput.placeholder = "Certification Name";
        certificationInput.value = certification;

        // Create button to save the certification
        var saveCertificationButton = document.createElement("button");
        saveCertificationButton.textContent = "Save Certification";
        saveCertificationButton.onclick = function () {
            // Get certification name from input field
            var certificationName = certificationInput.value;

            // Update certification in the certifications array
            var index = equipmentData.certifications.indexOf(certification);
            if (index !== -1) {
                equipmentData.certifications[index] = certificationName;

                // Save updated equipment data to Firestore
                saveCertificationData(equipmentData);
            }
        };

        // Create button to remove the certification
        var removeCertificationButton = document.createElement("button");
        removeCertificationButton.textContent = "Remove Certification";
        removeCertificationButton.onclick = function () {
            // Remove the certification div
            certificationDiv.remove();

            // Get the index of the certification in the array
            var index = equipmentData.certifications.indexOf(certification);
            if (index !== -1) {
                // Remove the certification from the certifications array
                equipmentData.certifications.splice(index, 1);

                // Save updated equipment data to Firestore
                saveCertificationData(equipmentData);
            }
        };

        // Append input field, save button, and remove button to the certification div
        certificationDiv.appendChild(certificationInput);
        certificationDiv.appendChild(saveCertificationButton);
        certificationDiv.appendChild(removeCertificationButton);

        // Append the certification div to the equipment div
        equipmentDiv.appendChild(certificationDiv);
    });

    // Create a button to add a new certification
    var addCertificationButton = document.createElement("button");
    addCertificationButton.textContent = "Add Certification";
    addCertificationButton.onclick = function () {
        // Create div to hold input fields for a new certification
        var certificationDiv = document.createElement("div");

        // Create input field for certification name
        var certificationInput = document.createElement("input");
        certificationInput.type = "text";
        certificationInput.placeholder = "Certification Name";

        // Create button to save the certification
        var saveCertificationButton = document.createElement("button");
        saveCertificationButton.textContent = "Save Certification";
        saveCertificationButton.onclick = function () {
            // Get certification name from input field
            var certificationName = certificationInput.value;

            // Push the new certification name to the certifications array
            equipmentData.certifications.push(certificationName);

            // Save updated equipment data to Firestore
            saveCertificationData(equipmentData);
        };

        // Create button to remove the certification
        var removeCertificationButton = document.createElement("button");
        removeCertificationButton.textContent = "Remove Certification";
        removeCertificationButton.onclick = function () {
            // Remove the certification div
            certificationDiv.remove();
        };

        // Append input field, save button, and remove button to the certification div
        certificationDiv.appendChild(certificationInput);
        certificationDiv.appendChild(saveCertificationButton);
        certificationDiv.appendChild(removeCertificationButton);

        // Append the certification div to the equipment div
        equipmentDiv.appendChild(certificationDiv);
    };

    // Append the add certification button to the equipment div
    equipmentDiv.appendChild(addCertificationButton);
}


// Function to save certification data to Firestore
function saveCertificationData(equipmentData) {
    const userId = firebase.auth().currentUser.uid;
    const equipmentRef = firestore.collection("users").doc(userId).collection("Equipment").doc("Equipment_Info");
    
    // Update equipment data in Firestore
    equipmentRef.set(equipmentData)
    .then(() => {
        console.log("Certification data updated successfully:", equipmentData);
        location.reload();
    })
    .catch((error) => {
        console.error("Error updating certification data:", error);
    });
}



