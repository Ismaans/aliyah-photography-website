# Complete Setup Guide: Netlify CMS for Easy Photo Management

## 🎯 What This Does

Your cousin can now add photos to the website **without any coding**! She'll use a simple admin panel that looks like a blog editor. Just upload photos, add titles, and save - that's it!

---

## 📋 Step-by-Step Setup Instructions

### Step 1: Create a GitHub Account (If You Don't Have One)

1. Go to [github.com](https://github.com)
2. Sign up for a free account
3. Verify your email

### Step 2: Create a New Repository

1. Click the "+" icon in the top right → "New repository"
2. Name it: `aliyah-photography-website` (or any name you like)
3. Make it **Public** (required for free Netlify hosting)
4. Check "Add a README file"
5. Click "Create repository"

### Step 3: Upload Your Website Files

**Option A: Using GitHub Web Interface (Easiest)**
1. In your new repository, click "uploading an existing file"
2. Drag and drop ALL files from your website folder:
   - `index.html`
   - `about.html`
   - `work.html`
   - `contact.html`
   - `styles.css`
   - `script.js`
   - `admin/` folder (with `index.html` and `config.yml`)
   - `_data/` folder (with the JSON files)
   - `images/` folder (with your photos)
3. Scroll down and click "Commit changes"

**Option B: Using GitHub Desktop (Recommended)**
1. Download [GitHub Desktop](https://desktop.github.com)
2. Install and sign in
3. Click "Add" → "Add Existing Repository"
4. Select your website folder
5. Click "Publish repository"
6. Make sure it's set to "Public"

### Step 4: Deploy to Netlify

1. Go to [netlify.com](https://netlify.com)
2. Sign up with your GitHub account (click "Sign up with GitHub")
3. Click "Add new site" → "Import an existing project"
4. Choose "GitHub" and authorize Netlify
5. Select your repository (`aliyah-photography-website`)
6. Click "Deploy site"
7. Wait 1-2 minutes for deployment
8. Your site is now live! 🎉

### Step 5: Enable Netlify Identity & Git Gateway

1. In Netlify, go to your site dashboard
2. Click "Site settings" → "Identity"
3. Click "Enable Identity"
4. Scroll down to "Registration preferences"
   - Set to "Invite only" (recommended) or "Open"
5. Scroll to "Services" → "Git Gateway"
6. Click "Enable Git Gateway"
7. Click "Save"

### Step 6: Invite Your Cousin

1. Still in "Identity" settings, click "Invite users"
2. Enter your cousin's email address
3. Click "Send invite"
4. She'll receive an email to create her account

### Step 7: Access the Admin Panel

1. Go to: `https://your-site-name.netlify.app/admin`
2. Click "Log in with Netlify Identity"
3. Sign in with the account you created
4. You'll see the admin panel! 🎨

---

## 📸 How Your Cousin Adds Photos (Super Easy!)

### Adding a New Project:

1. Go to `your-site.netlify.app/admin`
2. Log in
3. Click "Photo Gallery" → "Projects"
4. Click "New Projects"
5. Fill in:
   - **Project ID**: `project7` (or any unique name)
   - **Title**: "My New Photo Series"
   - **Description**: "Description of the project"
   - **Thumbnail Image**: Click to upload (this shows on Work page)
   - **Project Images**: Click "Add Projects" to add multiple photos
6. Click "Save"
7. Done! The photo appears on the website instantly! ✨

### Adding to Homepage Gallery:

1. In admin panel, click "Photo Gallery" → "Homepage Gallery"
2. Click "New Homepage Gallery"
3. Fill in:
   - **Image**: Upload photo
   - **Title**: "Gallery Title"
   - **Description**: Optional
   - **Project ID**: Link to a project (e.g., `project1`)
4. Click "Save"

### Editing Existing Photos:

1. Go to admin panel
2. Click on the item you want to edit
3. Make changes
4. Click "Save"

---

## 🔒 Security Notes

- Only people you invite can access the admin panel
- All changes are saved to GitHub automatically
- You can see a history of all changes
- You can revert changes if needed

---

## 🆘 Troubleshooting

### "Git Gateway not enabled"
- Go to Site settings → Identity → Services → Enable Git Gateway

### "Can't log in"
- Make sure you accepted the invite email
- Check spam folder
- Try resetting password in Netlify Identity

### "Photos not showing"
- Make sure images are uploaded to the `images/` folder
- Check that image paths in JSON files are correct
- Clear browser cache (Ctrl+F5 or Cmd+Shift+R)

### "Changes not appearing"
- Wait 1-2 minutes for Netlify to rebuild
- Check the "Deploys" tab in Netlify to see build status
- Make sure you clicked "Save" in the admin panel

---

## 📱 Your Live Website URL

After deployment, your website will be at:
- `https://your-site-name.netlify.app`
- You can also set up a custom domain later!

---

## ✅ Checklist

- [ ] Created GitHub account
- [ ] Created repository and uploaded files
- [ ] Deployed to Netlify
- [ ] Enabled Identity
- [ ] Enabled Git Gateway
- [ ] Invited your cousin
- [ ] Tested admin panel
- [ ] Added a test photo
- [ ] Shared admin URL with cousin

---

## 🎉 You're All Set!

Your cousin can now add photos whenever she wants, completely independently, with zero coding required!

Need help? Check the Netlify documentation or contact support.

