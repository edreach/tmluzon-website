// This is your client-side Firebase configuration.
// These values are sourced from your environment variables.

// This logic handles how Firebase configuration is loaded.
// It prioritizes the `FIREBASE_WEBAPP_CONFIG` environment variable,
// which is automatically provided by Firebase App Hosting.
// For local development, it falls back to the individual `NEXT_PUBLIC_` variables.

let config;

if (process.env.FIREBASE_WEBAPP_CONFIG) {
  try {
    // In the production/build environment, FIREBASE_WEBAPP_CONFIG is a JSON string.
    config = JSON.parse(process.env.FIREBASE_WEBAPP_CONFIG);
  } catch (e) {
    console.error("Failed to parse FIREBASE_WEBAPP_CONFIG. Please check the environment variable.", e);
  }
}

// If the above fails or is not present (as in local dev), use the individual variables.
if (!config) {
  config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
}

export const firebaseConfig = config;
