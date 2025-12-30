# Manual Deployment - Simple & Fast

## Problem
Cloud Run failed because it expects port 8080, but app uses port 3001.

## Simple Solution - Deploy Manually (5 minutes)

### Step 1: Build and Push Docker Image
```bash
cd c:\D\ai-placement-coach

# Build the image locally
docker build -t gcr.io/lunar-box-423609-r8/ai-placement-coach:latest .

# Push to Google Container Registry
docker push gcr.io/lunar-box-423609-r8/ai-placement-coach:latest
```

### Step 2: Deploy to Cloud Run with PORT Fix
```bash
gcloud run deploy ai-placement-coach \
  --image gcr.io/lunar-box-423609-r8/ai-placement-coach:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3001 \
  --set-env-vars "NODE_ENV=production,GOOGLE_CLOUD_PROJECT_ID=lunar-box-423609-r8" \
  --memory 1Gi \
  --timeout 300
```

### Step 3: Get Your Backend URL
```bash
gcloud run services describe ai-placement-coach \
  --platform managed \
  --region us-central1 \
  --format 'value(status.url)'
```

**Save this URL - you'll need it for the frontend!**

---

## Deploy Frontend to Firebase

### Step 1: Install Firebase CLI (if not installed)
```bash
npm install -g firebase-tools
firebase login
```

### Step 2: Initialize Firebase (first time only)
```bash
cd c:\D\ai-placement-coach\client
firebase init hosting
```

When prompted:
- Project: lunar-box-423609-r8
- Public directory: **dist**
- Single-page app: **Yes**
- Overwrite index.html: **No**

### Step 3: Configure API URL
Create file: `c:\D\ai-placement-coach\client\.env.production`

```
VITE_API_URL=YOUR_BACKEND_URL_FROM_STEP_3
```

Replace `YOUR_BACKEND_URL_FROM_STEP_3` with the actual URL!

### Step 4: Build and Deploy
```bash
# Build production bundle
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

You'll get a URL like: `https://lunar-box-423609-r8.web.app`

---

## Test Your Deployment

1. Open your Firebase URL in browser
2. Try searching for "array"
3. Select a question
4. Write some code and record audio
5. Submit and verify you get feedback

---

## Update Submission Docs

Once deployed, update these files:
- `README.md` - Add your live URLs
- `TECHSPRINT_SUBMISSION.md` - Add MVP link

**Your URLs:**
- Backend: (from Step 3 above)
- Frontend: https://lunar-box-423609-r8.web.app

---

## If Docker Command Fails

If you don't have Docker installed, use this even simpler approach:

```bash
# Build directly on GCP (no Docker needed locally)
gcloud builds submit --tag gcr.io/lunar-box-423609-r8/ai-placement-coach

# Then deploy with port fix
gcloud run deploy ai-placement-coach \
  --image gcr.io/lunar-box-423609-r8/ai-placement-coach:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3001 \
  --set-env-vars "NODE_ENV=production,GOOGLE_CLOUD_PROJECT_ID=lunar-box-423609-r8" \
  --memory 1Gi \
  --timeout 300
```

This will work and should take ~5 minutes total!
