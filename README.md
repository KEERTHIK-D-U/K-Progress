# K Progress - AI-Powered Personal Growth Tracker

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Stack: MERN](https://img.shields.io/badge/Stack-MERN-success.svg)
![Status: Active](https://img.shields.io/badge/Status-Active-green.svg)

**K Progress** is a modern productivity application designed to bridge the gap between long-term ambitions and daily actions. Unlike traditional to-do lists that only track *what* you need to do, K Progress helps you understand *why* you are doing it, using AI to break down massive goals into manageable daily steps.

## 🚀 Key Features

### 🧠 Modern Goals (AI-Powered)
-   **Intelligent Breakdown**: Input a vague or ambitious goal (e.g., "Learn Machine Learning"), and our AI integration (Gemini/OpenAI) generates a structured, step-by-step roadmap for you.
-   **Meaningful Milestones**: Tracks progress not just by checkboxes, but by "Learning Logs" where you commit what you accomplished or learned that day.
-   **Archival System**: Completed goals are archived with your key learnings, building a "Knowledge Bank" of your achievements.

### 📅 Traditional Tasks
-   **Daily Focus**: A clean, distraction-free interface for your immediate daily to-dos.
-   **Quick Capture**: Add, complete, and delete tasks instantly to keep your day organized.

### 📊 Analytics & Insights
-   **Activity Heatmap**: A GitHub-style contribution graph that visualizes your consistency over the year.
-   **Consistency Score**: A dynamic metric that motivates you to show up every day.
-   **Visual Progress**: Beautiful UI that emphasizes streaks and long-term commitment.

---

## 🛠️ Tech Stack

This project is built as a robust Monorepo using the **MERN** stack:

*   **Frontend**:
    *   React (Vite)
    *   TypeScript
    *   TailwindCSS (Styling & Animations)
    *   Lucide React (Icons)
    *   Axios (API Communication)
*   **Backend**:
    *   Node.js & Express
    *   MongoDB (Data Persistence)
    *   Mongoose (ODM)
    *   JWT (Authentication)
    *   Google Gemini API (AI Logic)

---

## 📂 Project Structure

```bash
ai-todo-tracker/
├── client/                 # React Frontend Application
│   ├── src/
│   │   ├── components/     # Reusable UI Components (Dashboard, Layout, etc.)
│   │   ├── context/        # React Context (Auth, Todo, Theme)
│   │   ├── pages/          # Main Route Pages (Dashboard, Login, Landing)
│   │   └── index.css       # Global Styles & Tailwind Directives
│   ├── index.html
│   └── vite.config.ts
│
├── server/                 # Express Backend API
│   ├── src/
│   │   ├── config/         # Database & Envs configuration
│   │   ├── controllers/    # Route Logic (Auth, Todos, AI)
│   │   ├── models/         # Mongoose Schemas (User, Todo, Analytics)
│   │   ├── routes/         # API Endpoints
│   │   └── middleware/     # Auth Protection
│   └── .env.example
│
└── README.md
```

---

## ⚡ Getting Started

### Prerequisites
*   Node.js (v14 or higher)
*   MongoDB (Local or Atlas URI)
*   Google Gemini API Key

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/k-progress.git
    cd k-progress
    ```

2.  **Setup Server**
    ```bash
    cd server
    npm install
    # Create a .env file with:
    # MONGO_URI=your_mongodb_uri
    # JWT_SECRET=your_secret
    # GEMINI_API_KEY=your_api_key
    # PORT=5000
    npm run dev
    ```

3.  **Setup Client**
    ```bash
    cd ../client
    npm install
    npm run dev
    ```

4.  **Access the App**
    Open your browser to `http://localhost:5173`.

---

## 🛡️ Best Practices
*   **Secure**: JWT-based authentication protects user data.
*   **Clean Code**: Fully typed with TypeScript for reliability.
*   **Responsive**: Mobile-first design ensures productivity on any device.

---

Made by Keerthik
