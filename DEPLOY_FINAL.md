# Final Deployment Steps - Frontend to Firebase

## ✅ Completed So Far

1. ✅ Backend deployed to Cloud Run: https://ai-placement-coach-352457456398.us-central1.run.app
2. ✅ Firebase CLI installed
3. ✅ Production environment configured (.env.production created)
4. ✅ Frontend built successfully (dist folder ready)

---

## 🎯 Next: Deploy Frontend (5 minutes)

### Step 1: Login to Firebase
```bash
cd c:\D\ai-placement-coach\client
firebase login
```
This will open your browser - log in with your Google account.

### Step 2: Initialize Firebase Hosting
```bash
firebase init hosting
```

When prompted:
- **Select a Firebase project**: Choose `lunar-box-423609-r8`
- **What do you want to use as your public directory?**: `dist`
- **Configure as a single-page app (rewrite all urls to /index.html)?**: `Yes`
- **Set up automatic builds and deploys with GitHub?**: `No`
- **File dist/index.html already exists. Overwrite?**: `No`

### Step 3: Deploy to Firebase
```bash
firebase deploy --only hosting
```

You'll get a URL like: `https://lunar-box-423609-r8.web.app`

---

## 🧪 Test Your Deployment

1. Open the Firebase URL in your browser
2. Try searching for "array"
3. Select a question
4. Write some code
5. Record audio
6. Submit and verify you get AI feedback

---

## 📝 Update Submission Docs

Once deployed, update these files with your URLs:

### README.md
Replace these lines:
```markdown
- **Live MVP**: _[Deployment URL]_
```

With:
```markdown
- **Live MVP**: https://lunar-box-423609-r8.web.app
- **Backend API**: https://ai-placement-coach-352457456398.us-central1.run.app
```

### TECHSPRINT_SUBMISSION.md
Update section 12 (Links):
```markdown
- **Live MVP**: https://lunar-box-423609-r8.web.app
- **Demo Video (3 min)**: _[To be uploaded to YouTube]_
```

---

## ✅ Deployment Complete Checklist

After Firebase deployment:
- [ ] Frontend accessible via Firebase URL
- [ ] Search functionality works
- [ ] Can select and view questions
- [ ] Code editor works
- [ ] Audio recording works  
- [ ] Can submit and get AI feedback
- [ ] Updated README.md with live URLs
- [ ] Updated TECHSPRINT_SUBMISSION.md with MVP link

---

## 🎉 What's Next?

Once deployed:
1. **Test thoroughly** - Run through full user flow
2. **Take screenshots** - Capture for docs/screenshots/
3. **Create diagrams** - Architecture, process flow, use-case
4. **Record demo video** - 3-minute walkthrough
5. **Final submission** - Make GitHub repo public
