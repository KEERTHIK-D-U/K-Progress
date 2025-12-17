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

## How to Deploy

### Option 1: Vercel CLI
1.  Open your terminal at the project root (`ai-todo-tracker`).
2.  Run `vercel login` if you haven't already.
3.  Run `vercel`.
4.  Follow the prompts:
    - **Set up and deploy?** [Y/n] `Y`
    - **Which scope?** [Select your account]
    - **Link to existing project?** [N/y] `N`
    - **Project Name?** [ai-todo-tracker]
    - **In which directory is your code located?** `./` (Press Enter)
    - **Want to modify these settings?** [N/y] `N`
5.  After deployment, go to the Vercel Dashboard for your new project.
6.  Navigate to **Settings > Environment Variables** and add the variables listed above.
7.  Redeploy by running `vercel --prod` locally or triggering a deployment in the dashboard.

### Option 2: Git Integration (GitHub/GitLab/Bitbucket)
1.  Push your code to a Git repository.
2.  Import the repository in Vercel.
3.  Vercel will detect the framework as "Vite".
4.  Adding Environment Variables:
    - During import, you can expand the "Environment Variables" section and add them.
    - Or add them later in Project Settings and redeploy.

## Troubleshooting

### Cron Jobs
The internal scheduler (`server/src/scheduler.ts`) uses `node-cron` which **does not work** in Vercel Serverless Functions.
**Workaround:**
1.  Create a standard API endpoint (e.g., `/api/cron/check-goals`) that triggers the checking logic.
2.  Use [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs) to call this endpoint daily.

### Cold Starts
Serverless functions may have a delay on the first request if they haven't been used recently. This is normal.
