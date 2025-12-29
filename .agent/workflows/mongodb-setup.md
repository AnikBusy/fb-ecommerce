---
description: how to get a MongoDB connection URI from Atlas
---

# 🍃 How to get your MongoDB URI

To connect your app to a database, you need a **connection string**. Here is how to get it using MongoDB Atlas (Free Tier).

## 1. Create an Account & Cluster
1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and sign up.
2.  Create a new **Project** (e.g., "AnikBusy").
3.  Click **"Create a Deployment"** and choose the **M0 (Free)** tier.
4.  Pick a provider (e.g., AWS) and a region near you. Click **"Create"**.

## 2. Set Up Security (CRUDENTIALS)
Before you can connect, you must set up who can access the database.

### A. Database Access
1.  In the left sidebar, go to **Security** → **Database Access**.
2.  Click **"+ Add New Database User"**.
3.  Choose **Password** as the auth method.
4.  **Important**: Save the **Username** and **Password** somewhere safe.
5.  Set "Database User Privileges" to **Read and write to any database**.

### B. Network Access
1.  In the left sidebar, go to **Security** → **Network Access**.
2.  Click **"+ Add IP Address"**.
3.  Click **"Allow Access from Anywhere"** (this adds `0.0.0.0/0`).
    *   *Note: This is required for Vercel, as Vercel uses many different IP addresses.*
4.  Click **Confirm**.

## 3. Get the Connection String
1.  Go to **Database** in the sidebar.
2.  Click the **"Connect"** button on your Cluster.
3.  Choose **"Drivers"**.
4.  Select **Node.js** as the driver.
5.  Copy the connection string. It will look like this:
    `mongodb+srv://<db_username>:<db_password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

## 4. Final Step: Replace the Password
When you use this string in your `MONGODB_URI` environment variable, remember to replace `<db_password>` with the actual password you created in Step 2.

**Example:**
`mongodb+srv://anik:MyPassword123@cluster0.abcde.mongodb.net/anikbusy_db`
*(Note: You can add `/anikbusy_db` after the `.net/` to name your database)*
