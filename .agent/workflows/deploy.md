---
description: how to deploy the application
---

# Deploying the Application

This guide covers the two most common ways to deploy this Next.js + MongoDB application.

## Prerequisites: Environment Variables

Before deploying, ensure you have the following variables ready for your production environment:

- `MONGODB_URI`: Your MongoDB connection string (e.g., from MongoDB Atlas).
- `JWT_SECRET`: A long, random string used for secure authentication.
- `NEXT_PUBLIC_FACEBOOK_PIXEL_ID`: (Optional) Your Facebook Pixel ID.

---

## Option 1: Vercel (Recommended)

Vercel is the creators of Next.js and provides the easiest deployment experience.

1. **Push your code** to a GitHub, GitLab, or Bitbucket repository.
2. **Import onto Vercel**:
   - Go to [Vercel](https://vercel.com/new).
   - Select your repository.
3. **Configure Settings**:
   - In the "Environment Variables" section, add:
     - `MONGODB_URI`
     - `JWT_SECRET`
     - `NEXT_PUBLIC_FACEBOOK_PIXEL_ID`
4. **Deploy**:
   - Click "Deploy". Vercel will automatically build and serve your app.

---

## Option 2: Self-Hosting (VPS/Docker)

If you are using a VPS (like DigitalOcean, Linode, or AWS EC2), follow these steps:

1. **Install Node.js** (v18 or later).
2. **Clone and Install**:
```bash
git clone <your-repo-url>
cd ai
npm install
```
3. **Build the Project**:
```bash
# Set your production env vars first
export MONGODB_URI="your_mongodb_uri"
export JWT_SECRET="your_very_long_secret"
npm run build
```
4. **Run using PM2** (Recommended for keeping the app alive):
```bash
npm install -g pm2
pm2 start npm --name "anikbusy-ai" -- start
```

---

## Option 3: Build & Start (Manual)

To test a production build locally:

1. Build the application:
// turbo
```bash
npm run build
```

2. Start the production server:
```bash
npm run start
```
