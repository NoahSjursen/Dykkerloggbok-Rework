// JavaScript
document.addEventListener("DOMContentLoaded", function () {
    const gasTypes = [
        { name: "Air (Nitrox)", oxygenPercentage: 21, nitrogenPercentage: 79 },
        { name: "Enriched Air Nitrox (EANx32)", oxygenPercentage: 32, nitrogenPercentage: 68 },
        { name: "Trimix (21/35)", oxygenPercentage: 21, heliumPercentage: 35, nitrogenPercentage: 44 },
        { name: "Trimix (18/45)", oxygenPercentage: 18, heliumPercentage: 45, nitrogenPercentage: 37 },
        { name: "Heliox (HeO2 80/20)", heliumPercentage: 80, oxygenPercentage: 20 },
        { name: "Oxygen (O2)", oxygenPercentage: 100 }
    ];

    const gasTypeChoice = document.getElementById("gasType");

    // Populate gas type options
    gasTypes.forEach((gas) => {
        const option = document.createElement("option");
        option.text = gas.name;
        gasTypeChoice.add(option);
    });

    // Function to show/hide mix percentage fields based on selected gas type
    function populateGasMixes() {
        const selectedGas = gasTypes.find(gas => gas.name === gasTypeChoice.value);

        // Clear previous mix percentage fields
        const gasMixesContainer = document.getElementById("gasMixes");
        gasMixesContainer.innerHTML = ""; // Clear previous fields

        // Show mix percentage fields based on selected gas type
        if (selectedGas) {
            if (selectedGas.oxygenPercentage !== undefined) {
                addMixPercentageField("Oxygen", selectedGas.oxygenPercentage, gasMixesContainer);
            }
            if (selectedGas.nitrogenPercentage !== undefined) {
                addMixPercentageField("Nitrogen", selectedGas.nitrogenPercentage, gasMixesContainer);
            }
            if (selectedGas.heliumPercentage !== undefined) {
                addMixPercentageField("Helium", selectedGas.heliumPercentage, gasMixesContainer);
            }
            if (selectedGas.hydrogenPercentage !== undefined) {
                addMixPercentageField("Hydrogen", selectedGas.hydrogenPercentage, gasMixesContainer);
            }
        }
    }

    // Function to add mix percentage field
    function addMixPercentageField(gasName, percentage, container) {
        const label = document.createElement("label");
        label.for = gasName.toLowerCase() + "Percentage";
        label.textContent = gasName + " Percentage:";
        
        const input = document.createElement("input");
        input.type = "number";
        input.id = gasName.toLowerCase() + "Percentage";
        input.name = gasName.toLowerCase() + "Percentage";
        input.value = percentage;
        input.classList.add("mix-percentage-field");
        
        container.appendChild(label);
        container.appendChild(input);
    }

    // Add event listener to gas type choice box
    gasTypeChoice.addEventListener("change", populateGasMixes);
});
