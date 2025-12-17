# Deploying K-Progress to Netlify

K-Progress is now a **client-only application** (Single Page App). It is easy to deploy on Netlify.

## Prerequisites

1.  **GitHub Repository**: Ensure your project is pushed to GitHub.
    - Repo Link: [Your Repository URL]

## Method 1: Netlify Dashboard (Recommended)

1.  Log in to [Netlify](https://app.netlify.com/).
2.  Click **"Add new site"** -> **"Import an existing project"**.
3.  Choose **GitHub**.
4.  Authorize Netlify and select your repository (`K-Progress`).
5.  **Configure Build Settings**:
    *   **Base directory**: `client`
    *   **Build command**: `npm run build`
    *   **Publish directory**: `dist`
6.  Click **"Deploy site"**.

## Method 2: Netlify CLI

1.  Install Netlify CLI:
    ```bash
    npm install netlify-cli -g
    ```
2.  Login:
    ```bash
    netlify login
    ```
3.  Deploy:
    ```bash
    cd client
    netlify deploy --prod
    ```
    *   **Publish directory**: `dist`

## Post-Deployment
- Your app will be live immediately.
- Netlify automatically handles redirects for Single Page Apps (SPA) if you add a `_redirects` file to the `public` folder (optional, but good practice if you have routing issues).

### (Optional) Fix Routing Issues
If refreshing pages gives a 404, create a file named `_redirects` in `client/public/` with:
```
/*  /index.html  200
```
