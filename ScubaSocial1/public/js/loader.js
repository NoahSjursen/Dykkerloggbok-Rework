document.addEventListener("DOMContentLoaded", function() {
    var loaderShown = false;
    var loaderTimeout;

    // Function to show the loader
    function showLoader() {
        document.querySelector(".loader").style.display = "block";
        loaderShown = true;
    }

    // Function to hide the loader
    function hideLoader() {
        clearTimeout(loaderTimeout); // Clear previous timeout
        document.querySelector(".loader").style.display = "none";
        loaderShown = false;
    }

    // Show loader when navigating between pages
    window.addEventListener("beforeunload", function() {
        showLoader();
    });

    // Hide loader when page is fully loaded, but only if it has been shown for at least 450ms
    window.addEventListener("load", function() {
        loaderTimeout = setTimeout(function() {
            hideLoader();
        }, 1200);
    });

    // Ensure loader is hidden if back button is used
    window.addEventListener("pageshow", function(event) {
        // Check if the page is being shown from the bfcache (back-forward cache)
        if (event.persisted) {
            hideLoader();
        }
    });
});
