# Google Cloud Deployment - Step by Step

## Prerequisites Check ✅
- [x] gcloud CLI installed
- [x] Google Cloud project created
- [ ] Project has billing enabled (required for Cloud Run)
- [ ] Firebase CLI installed

---

## Step 1: Verify and Configure GCP Project

```bash
# Check current project
gcloud config get-value project

# If you need to switch projects
gcloud config set project YOUR_PROJECT_ID

# Check if billing is enabled
gcloud beta billing projects describe YOUR_PROJECT_ID
```

---

## Step 2: Enable Required APIs

```bash
# Enable all required APIs at once (takes ~2 minutes)
gcloud services enable \
  run.googleapis.com \
  containerregistry.googleapis.com \
  cloudbuild.googleapis.com \
  aiplatform.googleapis.com \
  speech.googleapis.com
```

---

## Step 3: Deploy Backend to Cloud Run

```bash
# Navigate to project root
cd c:\D\ai-placement-coach

# Deploy using Cloud Build (this handles build + deploy automatically)
gcloud builds submit --config cloudbuild.yaml

# This will:
# 1. Build Docker container
# 2. Push to Google Container Registry
# 3. Deploy to Cloud Run
# Takes ~5-8 minutes
```

**Wait for deployment to complete, then get your backend URL:**

```bash
gcloud run services describe ai-placement-coach \
  --platform managed \
  --region us-central1 \
  --format 'value(status.url)'
```

**Save this URL** - you'll need it for frontend configuration!

---

## Step 4: Install Firebase CLI

```bash
# Install Firebase tools globally
npm install -g firebase-tools

# Login to Firebase (will open browser)
firebase login
```

---

## Step 5: Initialize Firebase Project

```bash
cd c:\D\ai-placement-coach\client

# Initialize Firebase
firebase init hosting

# When prompted:
# ? Select your Google Cloud project → Choose your project
# ? What do you want to use as your public directory? → dist
# ? Configure as a single-page app? → Yes
# ? Set up automatic builds with GitHub? → No
# ? Overwrite index.html? → No
```

---

## Step 6: Configure Frontend API URL

**Create production environment file:**

```bash
# In client directory, create .env.production
echo VITE_API_URL=YOUR_CLOUD_RUN_URL > .env.production
```

Replace `YOUR_CLOUD_RUN_URL` with the URL from Step 3!

---

## Step 7: Build and Deploy Frontend

```bash
# Still in client directory

# Build for production (uses .env.production)
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

**Deployment takes ~2 minutes**

You'll get a URL like: `https://YOUR-PROJECT.web.app`

---

## Step 8: Test Your Deployment

```bash
# Test backend health
curl YOUR_CLOUD_RUN_URL/health

# Should return:
# {"status":"ok","timestamp":"...","questionsLoaded":35}
```

**Open your frontend URL in browser and test:**
1. Search for "array"
2. Select a question
3. Write some code
4. Record audio
5. Submit

---

## Step 9: Update Submission Documents

**Update these files with your live URLs:**

1. **README.md** - Replace placeholder links
2. **TECHSPRINT_SUBMISSION.md** - Add MVP link

```bash
# Example URLs to add:
- Backend: https://ai-placement-coach-xxx-uc.a.run.app
- Frontend: https://your-project.web.app
```

---

## Cost Estimate (Very Low!)

**Cloud Run:**
- First 2M requests/month: FREE
- Demo traffic: Virtually $0

**Firebase Hosting:**
- 10GB storage: FREE
- 360MB/day transfer: FREE
- Demo traffic: $0

**Vertex AI:**
- Gemini 1.5 Flash: ~$0.01 per submission
- 100 demo submissions: ~$1

**Total for competition demo: <$2** 🎉

---

## Troubleshooting

**If Cloud Run deploy fails:**
```bash
# Check build logs
gcloud builds list
gcloud builds log BUILD_ID
```

**If you need to update environment variables later:**
```bash
gcloud run services update ai-placement-coach \
  --set-env-vars GOOGLE_CLOUD_PROJECT_ID=YOUR_PROJECT_ID \
  --region us-central1
```

**If frontend doesn't connect to backend:**
- Check CORS settings in server/index.js
- Verify .env.production has correct backend URL
- Rebuild frontend: `npm run build && firebase deploy`

---

## After Features Added - Redeploy

**Backend:**
```bash
gcloud builds submit --config cloudbuild.yaml
# ~5 minutes
```

**Frontend:**
```bash
cd client
npm run build
firebase deploy --only hosting
# ~2 minutes
```

✅ **You can redeploy unlimited times - it's free!**
