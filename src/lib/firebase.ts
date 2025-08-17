import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, browserLocalPersistence, setPersistence } from "firebase/auth";

// Validate required environment variables
const requiredEnvVars = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Check for missing environment variables
const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.error('Missing Firebase environment variables:', missingVars);
  console.error('Please create a .env file in the root directory with the following variables:');
  console.error('VITE_FIREBASE_API_KEY=your_api_key_here');
  console.error('VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com');
  console.error('VITE_FIREBASE_PROJECT_ID=your_project_id_here');
  console.error('VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com');
  console.error('VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here');
  console.error('VITE_FIREBASE_APP_ID=your_app_id_here');
  console.error('VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id_here');
  
  // Don't initialize Firebase if required variables are missing
  throw new Error(`Missing Firebase configuration. Please check the console for required environment variables.`);
}

const firebaseConfig = {
  apiKey: requiredEnvVars.apiKey,
  authDomain: requiredEnvVars.authDomain,
  projectId: requiredEnvVars.projectId,
  storageBucket: requiredEnvVars.storageBucket,
  messagingSenderId: requiredEnvVars.messagingSenderId,
  appId: requiredEnvVars.appId,
  measurementId: requiredEnvVars.measurementId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// Configure Google provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Set persistence to LOCAL
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error('Error setting auth persistence:', error);
  });

export { auth, googleProvider }; 