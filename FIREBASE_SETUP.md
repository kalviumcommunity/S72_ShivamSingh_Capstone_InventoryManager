# Firebase Setup Instructions

## Prerequisites
1. A Firebase project created at [Firebase Console](https://console.firebase.google.com/)
2. A web app added to your Firebase project

## Step 1: Get Firebase Configuration
1. Go to your Firebase Console
2. Select your project
3. Click on the gear icon (⚙️) next to "Project Overview" to open Project Settings
4. Scroll down to the "Your apps" section
5. If you don't have a web app, click "Add app" and select the web icon (</>)
6. Register your app with a nickname
7. Copy the configuration object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX"
};
```

## Step 2: Create Environment File
1. Create a `.env` file in the root directory of your project
2. Add the following variables with your Firebase configuration values:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id_here
```

## Step 3: Enable Authentication (Optional)
If you want to use Firebase Authentication:
1. In Firebase Console, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable the authentication providers you want to use (Google, Email/Password, etc.)

## Step 4: Enable Analytics (Optional)
If you want to use Firebase Analytics:
1. In Firebase Console, go to "Analytics" in the left sidebar
2. Click "Get started"
3. Follow the setup instructions

## Step 5: Restart Development Server
After creating the `.env` file, restart your development server:
```bash
npm run dev
```

## Troubleshooting
- Make sure the `.env` file is in the root directory (same level as `package.json`)
- Ensure all environment variable names start with `VITE_`
- Check that there are no spaces around the `=` sign in the `.env` file
- Verify that your Firebase project is properly configured
- Make sure you're using the correct configuration for your Firebase project

## Security Notes
- Never commit your `.env` file to version control
- The `.env` file should already be in your `.gitignore`
- Keep your Firebase API keys secure and don't share them publicly 