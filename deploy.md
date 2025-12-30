# Deployment Guide

## Prerequisites

1. **Google Cloud Account** with billing enabled
2. **gcloud CLI** installed ([Install](https://cloud.google.com/sdk/docs/install))
3. **Docker** installed (optional, for local testing)

## Backend Deployment to Google Cloud Run

### Step 1: Set up Google Cloud Project

```bash
# Login to Google Cloud
gcloud auth login

# Set your project ID
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable aiplatform.googleapis.com
gcloud services enable speech.googleapis.com
```

### Step 2: Create Service Account for Vertex AI

```bash
# Create service account
gcloud iam service-accounts create ai-placement-coach \
    --display-name="AI Placement Coach Service Account"

# Grant necessary permissions
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:ai-placement-coach@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/aiplatform.user"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:ai-placement-coach@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/speech.client"
```

### Step 3: Build and Deploy

#### Option A: Using Cloud Build (Recommended)

```bash
# Submit build and deploy in one command
gcloud builds submit --config cloudbuild.yaml

# Note: This will automatically build, push to GCR, and deploy to Cloud Run
```

#### Option B: Manual Deployment

```bash
# Build the Docker image
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/ai-placement-coach

# Deploy to Cloud Run
gcloud run deploy ai-placement-coach \
  --image gcr.io/YOUR_PROJECT_ID/ai-placement-coach \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --service-account ai-placement-coach@YOUR_PROJECT_ID.iam.gserviceaccount.com \
  --set-env-vars GOOGLE_CLOUD_PROJECT_ID=YOUR_PROJECT_ID,NODE_ENV=production \
  --memory 1Gi \
  --cpu 1 \
  --timeout 300 \
  --max-instances 10
```

### Step 4: Get Deployment URL

```bash
# Get the service URL
gcloud run services describe ai-placement-coach \
  --platform managed \
  --region us-central1 \
  --format 'value(status.url)'
```

Your backend will be available at: `https://ai-placement-coach-XXXX-uc.a.run.app`

---

## Frontend Deployment to Vercel

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Configure Frontend

```bash
cd client

# Create production .env file
echo "VITE_API_URL=https://YOUR-CLOUD-RUN-URL" > .env.production

# Build the frontend
npm run build
```

### Step 3: Deploy to Vercel

```bash
# Login to Vercel
vercel login

# Deploy (first time)
vercel --prod

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name? ai-placement-coach
# - Directory? ./
# - Build command? npm run build
# - Output directory? dist
```

### Step 4: Update Environment Variable

```bash
# Set API URL in Vercel dashboard or via CLI
vercel env add VITE_API_URL production
# Enter your Cloud Run URL when prompted
```

---

## Alternative: Firebase Hosting (All Google Cloud)

### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
firebase login
```

### Step 2: Initialize Firebase

```bash
cd client
firebase init hosting

# Select:
# - Use existing project (or create new)
# - Public directory: dist
# - Single-page app: Yes
# - Automatic builds: No
```

### Step 3: Build and Deploy

```bash
# Build with production API URL
VITE_API_URL=https://YOUR-CLOUD-RUN-URL npm run build

# Deploy
firebase deploy --only hosting
```

Your frontend will be available at: `https://YOUR-PROJECT.web.app`

---

## Testing Deployment

### Test Backend Health

```bash
curl https://YOUR-CLOUD-RUN-URL/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-12-29T...",
  "questionsLoaded": 35
}
```

### Test Search Endpoint

```bash
curl -X POST https://YOUR-CLOUD-RUN-URL/api/search \
  -H "Content-Type: application/json" \
  -d '{"query":"array problems","topK":5}'
```

### Test Full Flow

1. Open your frontend URL in browser
2. Search for "two sum"
3. Select question
4. Write code
5. Record audio
6. Submit and verify feedback appears

---

## Cost Optimization

### Cloud Run
- **Free tier**: 2 million requests/month
- **Pricing**: $0.00002400/request after free tier
- Set `--max-instances 10` to limit costs

### Vercel/Firebase
- **Free tier**: Generous for personal projects
- No credit card required for demo

### Vertex AI
- **Gemini 1.5 Flash**: $0.075 per 1M input tokens
- **Speech-to-Text**: First 60 minutes free/month
- **Budget alert**: Set up billing alerts in GCP console

---

## Troubleshooting

### Cloud Run Build Fails
```bash
# Check build logs
gcloud builds list
gcloud builds log BUILD_ID
```

### Service Account Permissions
```bash
# Verify service account has correct roles
gcloud projects get-iam-policy YOUR_PROJECT_ID \
  --flatten="bindings[].members" \
  --filter="bindings.members:ai-placement-coach@"
```

### CORS Issues
The backend already has CORS enabled. If issues persist, update `server/index.js`:
```javascript
app.use(cors({
  origin: ['https://your-frontend-url.vercel.app'],
  credentials: true
}));
```

---

## Update Submission Documents

After successful deployment:

1. Update `README.md` with live URLs
2. Update `TECHSPRINT_SUBMISSION.md` with:
   - **MVP Link**: Your frontend URL
   - **Demo Video**: YouTube link (create next)
3. Commit and push to GitHub

```bash
git add .
git commit -m "Add deployment configuration and update URLs"
git push origin main
```

---

## Next Steps

✅ Backend deployed to Cloud Run  
✅ Frontend deployed to Vercel/Firebase  
⬜ Create diagrams  
⬜ Capture screenshots  
⬜ Record demo video  
⬜ Final submission
