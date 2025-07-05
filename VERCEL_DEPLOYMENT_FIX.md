# Vercel Deployment Error Fix Guide

## Problem
Your e-commerce website is failing to deploy on Vercel with this specific error:
```
FirebaseAppError: Failed to parse private key: Error: Invalid PEM formatted message.
```

## Root Cause
The issue is with the `FIREBASE_SERVICE_ACCOUNT_KEYS` environment variable. The Firebase service account JSON contains a private key with newline characters that must be preserved exactly as they are.

## Solution: Fix Firebase Service Account Key Format

### Step 1: Get Your Firebase Service Account JSON
1. Go to Firebase Console > Project Settings > Service Accounts
2. Click "Generate new private key"
3. Download the JSON file

### Step 2: Format the JSON Correctly for Vercel

The private key in your JSON looks like this:
```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com",
  ...
}
```

### Step 3: Fix the Private Key Format

**Option A: Replace newlines with actual line breaks**
1. Copy your service account JSON
2. Find the `private_key` field
3. Replace `\n` with actual line breaks so it looks like:
```json
{
  "private_key": "-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...
-----END PRIVATE KEY-----
"
}
```

**Option B: Use the original JSON as-is (Recommended)**
1. Copy the entire JSON content exactly as downloaded
2. Minify it (remove spaces and line breaks) using an online JSON minifier
3. The `\n` characters should remain as literal `\n` in the string

### Step 4: Add Environment Variables to Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Click on **Settings** tab
4. Navigate to **Environment Variables** section

Add these environment variables:

#### Firebase Configuration (Client-side)
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

#### Firebase Admin Configuration (Server-side)
```
FIREBASE_SERVICE_ACCOUNT_KEYS={"type":"service_account","project_id":"your_project_id","private_key_id":"your_key_id","private_key":"-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com","client_id":"123456789","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40your-project-id.iam.gserviceaccount.com"}
```

**CRITICAL**: Make sure the `\n` characters in the private key are preserved as literal `\n` characters, not converted to actual line breaks.

#### Other Required Variables
```
NEXT_PUBLIC_ALGOLIA_APP_ID=your_algolia_app_id
NEXT_PUBLIC_ALGOLIA_APP_KEY=your_algolia_api_key
NEXT_PUBLIC_DOMAIN=your_vercel_domain_here
```

### Step 5: Set Environment for All Environments
Make sure to set these variables for:
- ✅ Production
- ✅ Preview  
- ✅ Development

### Step 6: Redeploy
After adding all environment variables:
1. Go to your Vercel project's **Deployments** tab
2. Click **Redeploy** on the latest deployment

## Alternative Solution: Update Firebase Admin Code

If you continue to have issues with the private key format, you can modify the `lib/firebase_admin.js` file to handle the newlines properly:

```javascript
export const admin = require("firebase-admin");

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
```

## Verification Steps

1. After deployment, check the Vercel deployment logs for any remaining errors
2. Test the Firebase authentication functionality
3. Verify the checkout-cod page loads without errors
4. Check that admin panel access works correctly

## Demo Reference
Your working demo is available at: https://docs-reader-store.vercel.app

The key issue was that the Firebase service account's private key contains newline characters that must be preserved exactly as `\n` in the JSON string when stored as an environment variable in Vercel.