export const admin = require("firebase-admin");

// Ensure the Firebase service account credentials are provided via environment variables
const serviceAccountJson = process.env.NEXT_PUBLIC_FIREBASE_SERVICE_ACCOUNT_KEYS;

if (!serviceAccountJson) {
  throw new Error(
    "Environment variable NEXT_PUBLIC_FIREBASE_SERVICE_ACCOUNT_KEYS is missing. " +
      "Please add your Firebase service account JSON string in your Vercel project settings."
  );
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(serviceAccountJson);
} catch (err) {
  throw new Error(
    "NEXT_PUBLIC_FIREBASE_SERVICE_ACCOUNT_KEYS contains invalid JSON. " +
      "Ensure the value is a properly stringified Firebase service account object."
  );
}

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const adminDB = admin.firestore();
