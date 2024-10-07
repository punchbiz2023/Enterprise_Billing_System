import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDmbf_UlT0pCbsBdTH9cGVtxP80zEK8jaM",
  authDomain: "enterprise-110b9.firebaseapp.com",
  projectId: "enterprise-110b9",
  storageBucket: "enterprise-110b9.appspot.com",
  messagingSenderId: "1082874448844",
  appId: "1:1082874448844:web:6dbe9e7e05be213d42eb69",
  measurementId: "G-T9LEWJVD1T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
