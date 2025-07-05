# Vercel Deployment Error Fix Guide

## Problem
Your e-commerce website is failing to deploy on Vercel because it's missing required environment variables for Firebase, Algolia, and other services.

## Root Cause
The main issue is in `lib/firebase_admin.js` which throws an error when `FIREBASE_SERVICE_ACCOUNT_KEYS` is missing:

```javascript
if (!serviceAccountJson) {
  throw new Error(
    "Environment variable FIREBASE_SERVICE_ACCOUNT_KEYS is missing. " +
      "Please add your Firebase service account JSON string in your Vercel project settings."
  );
}
```

## Solution: Configure Environment Variables in Vercel

### Step 1: Access Vercel Project Settings
1. Go to your Vercel dashboard
2. Select your project
3. Click on **Settings** tab
4. Navigate to **Environment Variables** section

### Step 2: Add Required Environment Variables

#### Firebase Configuration (Client-side)
Add these environment variables with your Firebase project values:

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
FIREBASE_SERVICE_ACCOUNT_KEYS={"type":"service_account","project_id":"your_project_id",...}
```

**Important**: For `FIREBASE_SERVICE_ACCOUNT_KEYS`, you need to:
1. Go to Firebase Console > Project Settings > Service Accounts
2. Generate a new private key (JSON file)
3. Copy the entire JSON content as a string (minified, no line breaks)
4. Paste it as the value for this environment variable

#### Algolia Configuration
```
NEXT_PUBLIC_ALGOLIA_APP_ID=your_algolia_app_id
NEXT_PUBLIC_ALGOLIA_APP_KEY=your_algolia_api_key
```

#### Domain Configuration
```
NEXT_PUBLIC_DOMAIN=your_vercel_domain_here
```

### Step 3: Environment Variable Locations

**Where to find these values:**

1. **Firebase Config**: 
   - Go to Firebase Console > Project Settings > General tab
   - Find "Your apps" section and copy the config object values

2. **Firebase Service Account**: 
   - Go to Firebase Console > Project Settings > Service Accounts tab
   - Click "Generate new private key"
   - Download the JSON file and copy its content as a string

3. **Algolia Config**:
   - Go to Algolia Dashboard > API Keys
   - Copy Application ID and Search-Only API Key

4. **Domain**:
   - Use your Vercel deployment URL (e.g., `https://your-app.vercel.app`)

### Step 4: Set Environment for All Environments
Make sure to set these variables for:
- ✅ Production
- ✅ Preview  
- ✅ Development

### Step 5: Redeploy
After adding all environment variables:
1. Go to your Vercel project's **Deployments** tab
2. Click **Redeploy** on the latest deployment
3. Or push a new commit to trigger a fresh deployment

## Additional Notes

### Firebase Security Rules
Make sure your Firestore security rules are properly configured (already present in your project).

### Algolia Setup
Ensure your Algolia index is set up and populated with your product data.

### Build Command
Your project uses standard Next.js build commands:
- Build: `npm run build`
- Start: `npm run start`

### Common Issues

1. **JSON Parsing Error for Service Account**:
   - Ensure the JSON is properly formatted as a single line
   - Remove any line breaks or extra spaces
   - The JSON should start with `{` and end with `}`

2. **Missing Firebase Project Setup**:
   - Make sure Firebase project is created and configured
   - Enable Authentication and Firestore in Firebase Console

3. **Algolia Index Not Found**:
   - Create the necessary indexes in Algolia
   - Populate with your product data

## Verification Steps

1. After deployment, check the Vercel deployment logs for any remaining errors
2. Test the Firebase authentication functionality
3. Verify product search with Algolia is working
4. Check that admin panel access works correctly

## Demo Reference
Your working demo is available at: https://docs-reader-store.vercel.app

If you continue to have issues after following these steps, check the Vercel deployment logs for specific error messages and ensure all services (Firebase, Algolia) are properly configured and accessible.