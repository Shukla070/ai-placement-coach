# Firebase Deployment Commands
# Copy and paste these into PowerShell in order

# Navigate to client directory
cd c:\D\ai-placement-coach\client

# Step 1: Login to Firebase (will open browser)
firebase login

# Step 2: Initialize Firebase Hosting
# When prompted, answer:
#   - Select project: lunar-box-423609-r8
#   - Public directory: dist
#   - Single-page app: Yes
#   - GitHub deploys: No
#   - Overwrite index.html: No
firebase init hosting

# Step 3: Deploy to Firebase
firebase deploy --only hosting

# You should get a URL like: https://lunar-box-423609-r8.web.app
# Copy that URL - you'll need it for the submission docs!
