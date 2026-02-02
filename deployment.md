# 🚀 Deployment Guide: Netlify + Koyeb + Neon

This guide will help you deploy your **OpenERP Cafe** application to the cloud for free.

## Prerequisites
-   GitHub Account (to host your code).
-   Accounts on [Neon](https://neon.tech), [Koyeb](https://koyeb.com), and [Netlify](https://netlify.com).
-   Your code pushed to a GitHub repository.

---

## Part 1: Database (Neon)
1.  Log in to **Neon Console**.
2.  Create a **New Project**.
3.  Choose the latest **PostgreSQL** version.
4.  Once created, look for the **Connection String** (e.g., `postgres://user:pass@ep-xyz.us-east-1.aws.neon.tech/neondb?sslmode=require`).
5.  **Copy this string**. You will need it for Koyeb.

---

## Part 2: Backend (Koyeb)
1.  Log in to **Koyeb Dashboard**.
2.  Click **Create Service**.
3.  Select **GitHub** as the source.
4.  Choose your repository (`opn-erp`).
5.  **Configure Service**:
    -   **Builder**: Dockerfile
    -   **Docker Work Directory**: `backend` (Important! This tells Koyeb where the Dockerfile is)
    -   **Privileged**: Unchecked (default is fine).
6.  **Environment Variables**:
    -   Click "Add Variable".
    -   `DATABASE_URL` -> (Paste your Neon Connection String).
    -   `JWT_SECRET` -> (Your random key).
    -   `PORT` -> `3000`.
7.  **Exposed Ports**:
    -   Port `3000`, Protocol `HTTP`, Path `/`.
8.  Click **Deploy**.
    -   Wait for it to build.
    -   Once healthy, copy the **Public URL** (e.g., `https://opn-erp-xyz.koyeb.app`).

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
    -   Value: Your Koyeb Backend URL (e.g., `https://opn-erp-xyz.koyeb.app` - **without trailing slash**).
6.  Click **Deploy site**.

---

## 🎉 Verification
1.  Open your Netlify URL.
2.  Try to **Log In** (Super Admin default credentials won't exist in the new DB!).
    -   **Tip**: You'll need to seed the production DB or register a new user manually initially via the backend if registration is locked.
    -   *Or*, use the `/register` page if you enabled it.
3.  If everything works, you are live!
