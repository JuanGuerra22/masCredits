
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
  import { getAuth } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js"
  import { getFirestore } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js"
  

  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDNDPqrz9WmFMXHxxFfbWjsX1GJFIuCrK8",
    authDomain: "mascreditos-469ff.firebaseapp.com",
    projectId: "mascreditos-469ff",
    storageBucket: "mascreditos-469ff.firebasestorage.app",
    messagingSenderId: "456476112954",
    appId: "1:456476112954:web:bc9039e66931208a449d03"
  };

  // Initialize Firebase
  export const app = initializeApp(firebaseConfig);
  export const auth = getAuth(app)
  export const db = getFirestore(app);
