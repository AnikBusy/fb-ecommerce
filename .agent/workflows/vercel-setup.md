---
description: detailed guide for deploying to Vercel
---

# 🚀 Vercel Deployment Guide

Deploying your Next.js application to Vercel is the most efficient and recommended way to go live.

## Step 1: Prepare Your Project
1. **GitHub/GitLab/Bitbucket**: Ensure your code is pushed to a remote repository.
2. **Environment Variables**: Collect the values for:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - (Optional) `NEXT_PUBLIC_FACEBOOK_PIXEL_ID`

## Step 2: Import to Vercel
1. Log in to [Vercel](https://vercel.com).
2. Click **"Add New..."** → **"Project"**.
3. Select your repository from the list (you may need to install the Vercel GitHub app if you haven't).

## Step 3: Configure Project
Once selected, you will see the configuration screen:

- **Framework Preset**: Should be automatically detected as **Next.js**.
- **Root Directory**: Keep as `./` (default).
- **Build & Output Settings**: Usually, no changes are needed.

### 🔑 Critical: Environment Variables
Click the **"Environment Variables"** dropdown and add the following:

| Key | Value Example | Why it's needed |
| :--- | :--- | :--- |
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster...` | To connect to your database. |
| `JWT_SECRET` | `any-random-long-string-123` | For user authentication cookies. |
| `NEXT_PUBLIC_FACEBOOK_PIXEL_ID` | `1234567890` | (Optional) For FB tracking. |

## Step 4: Deploy
1. Click **"Deploy"**.
2. Wait 1-2 minutes for the build process to finish.
3. Once done, you will get a production URL (e.g., `ai-anik.vercel.app`).

## Troubleshooting
- **Build Errors**: Check the deployment logs in Vercel to see if any dependencies are missing.
- **Database Connection**: Ensure your MongoDB Atlas cluster has "Allow Access from Anywhere" (IP: `0.0.0.0/0`) OR use a dedicated Vercel IP integration.
