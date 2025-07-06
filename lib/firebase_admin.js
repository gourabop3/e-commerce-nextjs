export const admin = require("firebase-admin");

// Initialize Firebase Admin with proper error handling
let adminDB = null;

try {
  // Ensure the Firebase service account credentials are provided via environment variables
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEYS;

  if (!serviceAccountJson) {
    console.warn("FIREBASE_SERVICE_ACCOUNT_KEYS is missing. Firebase admin will not be initialized.");
  } else {
    let serviceAccount;
    try {
      serviceAccount = JSON.parse(serviceAccountJson);
      // Replace escaped newlines in the private key with actual newlines so Firebase can parse the PEM correctly
      if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
      }
    } catch (err) {
      console.error("FIREBASE_SERVICE_ACCOUNT_KEYS contains invalid JSON:", err.message);
      serviceAccount = null;
    }

    if (admin.apps.length === 0 && serviceAccount) {
      try {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
        adminDB = admin.firestore();
      } catch (err) {
        console.error("Failed to initialize Firebase admin:", err.message);
      }
    } else if (admin.apps.length > 0) {
      adminDB = admin.firestore();
    }
  }
} catch (err) {
  console.error("Error initializing Firebase admin:", err.message);
}

export { adminDB };
