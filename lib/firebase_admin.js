export const admin = require("firebase-admin");

// Ensure the Firebase service account credentials are provided via environment variables
const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEYS;

if (!serviceAccountJson) {
  throw new Error(
    "Environment variable FIREBASE_SERVICE_ACCOUNT_KEYS is missing. " +
      "Please add your Firebase service account JSON string in your Vercel project settings."
  );
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(serviceAccountJson);
  
  // Fix private key formatting if needed
  if (serviceAccount.private_key) {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
  }
} catch (err) {
  throw new Error(
    "FIREBASE_SERVICE_ACCOUNT_KEYS contains invalid JSON. " +
      "Ensure the value is a properly stringified Firebase service account object."
  );
}

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const adminDB = admin.firestore();
