# Quick GitHub Authentication Guide

## Option 1: Personal Access Token (Recommended - 2 minutes)

### Step 1: Create a Personal Access Token
1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Give it a name: "Website Deployment"
4. Select expiration: **90 days** (or No expiration if you prefer)
5. Check the **"repo"** scope (this gives full repository access)
6. Click **"Generate token"** at the bottom
7. **COPY THE TOKEN IMMEDIATELY** (you won't see it again!)

### Step 2: Use the Token
When you run the push command, use your token as the password:
- Username: Your GitHub username (Ismaans)
- Password: Paste the token you just copied

---

## Option 2: GitHub Desktop (Easiest - No Command Line)

1. Download [GitHub Desktop](https://desktop.github.com)
2. Sign in with your GitHub account
3. In GitHub Desktop:
   - Click "File" → "Add Local Repository"
   - Select your website folder
   - Click "Publish repository"
   - Make sure "Keep this code private" is UNCHECKED
   - Click "Publish repository"

Done! Your code will be pushed automatically.

---

## Option 3: Use SSH (More Secure - One-time Setup)

If you want to set up SSH keys (recommended for future use):

1. Generate SSH key:
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```
   (Press Enter to accept defaults)

2. Add to SSH agent:
   ```bash
   eval "$(ssh-agent -s)"
   ssh-add ~/.ssh/id_ed25519
   ```

3. Copy your public key:
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```

4. Add to GitHub:
   - Go to: https://github.com/settings/keys
   - Click "New SSH key"
   - Paste your key and save

5. Change remote to SSH:
   ```bash
   git remote set-url origin git@github.com:Ismaans/aliyah-photography-website.git
   ```

6. Push:
   ```bash
   git push -u origin main
   ```

---

**Which option do you prefer?** I recommend Option 1 (Personal Access Token) for the quickest setup!



