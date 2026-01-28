# 🚀 Deployment Guide: Netlify + Render + Neon

This guide will help you deploy your **OpenERP Cafe** application to the cloud for free.

## Prerequisites
-   GitHub Account (to host your code).
-   Accounts on [Neon](https://neon.tech), [Render](https://render.com), and [Netlify](https://netlify.com).
-   Your code pushed to a GitHub repository.

---

## Part 1: Database (Neon)
1.  Log in to **Neon Console**.
2.  Create a **New Project**.
3.  Choose the latest **PostgreSQL** version.
4.  Once created, look for the **Connection String** (e.g., `postgres://user:pass@ep-xyz.us-east-1.aws.neon.tech/neondb?sslmode=require`).
5.  **Copy this string**. You will need it for Render.

---

## Part 2: Backend (Render)
1.  Log in to **Render Dashboard**.
2.  Click **New +** -> **Web Service**.
3.  Connect your **GitHub Repository**.
4.  **Settings**:
    -   **Name**: `open-erp-backend` (or similar)
    -   **Region**: Singapore (or nearest to you)
    -   **Branch**: `main`
    -   **Root Directory**: `backend` (Important! Your NestJS app is in this subfolder)
    -   **Runtime**: Node
    -   **Build Command**: `npm install && npm run build`
    -   **Start Command**: `npm run start:prod`
5.  **Environment Variables** (Click "Advanced"):
    -   Add `DATABASE_URL` -> Paste your Neon Connection String.
    -   Add `JWT_SECRET` -> `your_secure_secret_key_here`.
6.  Click **Create Web Service**.
7.  Wait for deployment to finish. Render will give you a URL (e.g., `https://open-erp-backend.onrender.com`). **Copy this URL**.

---

## Part 3: Frontend (Netlify)
1.  Log in to **Netlify**.
2.  Click **Add new site** -> **Import from Git**.
3.  Choose **GitHub** and select your repository.
4.  **Build Settings**:
    -   **Base directory**: `web`
    -   **Build command**: `npm run build`
    -   **Publish directory**: `web/dist`
5.  **Environment Variables**:
    -   Click "Add environment variable".
    -   Key: `VITE_API_URL`
    -   Value: Your Render Backend URL (e.g., `https://open-erp-backend.onrender.com` - **without trailing slash**).
6.  Click **Deploy site**.

---

## 🎉 Verification
1.  Open your Netlify URL.
2.  Try to **Log In** (Super Admin default credentials won't exist in the new DB!).
    -   **Tip**: You'll need to seed the production DB or register a new user manually initially via the backend if registration is locked.
    -   *Or*, use the `/register` page if you enabled it.
3.  If everything works, you are live!
