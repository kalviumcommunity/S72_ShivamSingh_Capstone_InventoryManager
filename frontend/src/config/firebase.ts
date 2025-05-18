import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJFrp0O-iwlJfTu9dh4yogtO-bBY_7PNQ",
  authDomain: "inventory-mangement-5d3e0.firebaseapp.com",
  projectId: "inventory-mangement-5d3e0",
  storageBucket: "inventory-mangement-5d3e0.firebasestorage.app",
  messagingSenderId: "789975006252",
  appId: "1:789975006252:web:d60ac5eac7c32e20cda589",
  measurementId: "G-DBZ2EPC9WM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const analytics = getAnalytics(app);

export default app; 