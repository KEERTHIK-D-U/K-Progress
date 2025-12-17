# Deployment Guide (Vercel)

This application is configured for deployment on Vercel as a monorepo.

## Prerequisites

- [Vercel Account](https://vercel.com/)
- [Vercel CLI](https://vercel.com/docs/cli) (Optional, but recommended)

## Environment Variables

You must configure the following environment variables in your Vercel Project Settings.

### Server Variables
| Variable | Description |
| :--- | :--- |
| `MONGO_URI` | Connection string for your MongoDB database (e.g., MongoDB Atlas). |
| `JWT_SECRET` | Secret key for signing JSON Web Tokens. |
| `GEMINI_API_KEY` | API Key for Google Gemini AI. |
| `EMAIL_USER` | Email address for sending notifications (used by Nodemailer). |
| `EMAIL_PASS` | Password or App Password for the email account. |

### Client Variables
| Variable | Description |
| :--- | :--- |
| `VITE_API_URL` | URL of your deployed backend. On Vercel, this is usually just `/api` since client and server are on the same domain. **Set this to `/api`**. |

## How to Deploy (Vercel Web Application)

Since you have pushed your code to GitHub, you will use the Vercel Dashboard to import and deploy.

### Step 1: Import Project
1.  Log in to your [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **"Add New..."** and select **"Project"**.
3.  In the "Import Git Repository" list, find your repo `ai-todo-tracker` and click **Import**.

### Step 2: Configure Project
Vercel will show the "Configure Project" screen.
1.  **Project Name**: Leave as is or change it.
2.  **Framework Preset**: It should auto-detect **Vite**. If not, select **Vite**.
3.  **Root Directory**: Leave it as `./` (the default).
4.  **Build and Output Settings**:
    - The `vercel.json` file in your project already handles the build commands.
    - **Crucial**: You usually **do not** need to override these settings because of `vercel.json`.
    - *Verification*: Ensure the build command looks like `cd client && npm install && npm run build` (or relies on the default). The Output Directory should be `client/dist`.

### Step 3: Environment Variables (Required)
Expand the **Environment Variables** section. You **MUST** add the following variables one by one.

**Server Keys:**
- `MONGO_URI`: Your MongoDB connection string.
- `JWT_SECRET`: A secure random string.
- `GEMINI_API_KEY`: Your Google Gemini API key.
- `EMAIL_USER`: Your email for notifications.
- `EMAIL_PASS`: Your email password/app password.

**Client Keys:**
- `VITE_API_URL`: Set this value to exactly `/api` (This ensures the frontend talks to the backend function correctly).

### Step 4: Deploy
1.  Click **Deploy**.
2.  Wait for the build to complete.
    - Vercel will install dependencies for both client and server (defined in root `package.json`).
    - It will run the build script.
3.  Once finished, you will see a success screen with your new domain.

## Troubleshooting

### Cron Jobs
The internal scheduler (`server/src/scheduler.ts`) uses `node-cron` which **does not work** in Vercel Serverless Functions.
**Workaround:**
1.  Create a standard API endpoint (e.g., `/api/cron/check-goals`) that triggers the checking logic.
2.  Use [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs) to call this endpoint daily.

### Cold Starts
Serverless functions may have a delay on the first request if they haven't been used recently. This is normal.
