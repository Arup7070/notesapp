import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration (keeps in sync with backend config)
const firebaseConfig = {
  apiKey: "AIzaSyDJa7rrsWedtzhV9vAoJZc0Fmy6gf5NCgs",
  authDomain: "notesapp-195f9.firebaseapp.com",
  projectId: "notesapp-195f9",
  storageBucket: "notesapp-195f9.firebasestorage.app",
  messagingSenderId: "376046033224",
  appId: "1:376046033224:web:ad2d3643b9c92d6270fb7d",
  measurementId: "G-VSYBM57H65"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const analytics = getAnalytics(app);

export { app, auth, googleProvider, analytics };