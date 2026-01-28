import * as admin from 'firebase-admin';

// Check if the app is already initialized to prevent errors in hot-reloading environments.
if (!admin.apps.length) {
  // initializeApp() with no parameters uses Application Default Credentials (ADC).
  // This is the recommended approach for server-side environments like Cloud Functions or Cloud Run.
  // Make sure the service account running this code has the necessary Firebase permissions.
  admin.initializeApp();
}

/**
 * A server-side admin instance of Firestore.
 */
export const adminDb = admin.firestore();
