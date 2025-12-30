# Vercel Deployment Commands
# Run these in PowerShell

# Make sure you're in the client directory
cd c:\D\ai-placement-coach\client

# Deploy to Vercel (will open browser for login)
vercel --prod

# When prompted, answer:
# - Set up and deploy? → Yes
# - Which scope? → Select your account
# - Link to existing project? → No
# - Project name? → ai-placement-coach (or any name you want)
# - Directory? → Press Enter (use current directory)
# - Override settings? → No

# Vercel will automatically detect Vite, build, and deploy!
# You'll get a URL like: https://ai-placement-coach-xxxx.vercel.app
