const firebaseConfig = {
    apiKey: "AIzaSyCeA8SRf-7F2Bd3uMuDc1Px-lXX3l2H1fQ",
    authDomain: "divingsocialmedia-487eb.firebaseapp.com",
    projectId: "divingsocialmedia-487eb",
    storageBucket: "divingsocialmedia-487eb.appspot.com",
    messagingSenderId: "372632777971",
    appId: "1:372632777971:web:727e6da4ca1a9b28a7b386"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const firestore = firebase.firestore();

// Initialize Firebase Storage only when needed
let storage;
function getStorage() {
    if (!storage) {
        storage = firebase.storage();
    }
    return storage;
}
