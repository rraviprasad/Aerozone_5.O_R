# Aerozone 5.O - Full Stack Netlify Deployment

**Live Application**: [https://aerozone.netlify.app/](https://aerozone.netlify.app/)

A powerful, unified Full Stack application built with React, Vite, Node.js (Express), and Firebase. This project is optimized to run entirely on **Netlify** using **Netlify Functions** for the backend logic.

---

## 🚀 Key Features

- **Frontend**: Modern React UI built with Vite for lightning-fast development and optimized production builds.
- **Backend**: Express-based Node.js API converted to a Serverless Function via `serverless-http`.
- **Database**: Integrated with Firebase (Firestore) for real-time data management.
- **Styling**: Tailored with Vanilla CSS and modern design tokens.
- **Asset Handling**: Support for Excel and PDF parsing with `xlsx` and `multer`.

---

## 📁 Project Structure

```text
Aerozone_5.O/
├── backend/            # Express Business Logic
├── netlify/
│   └── functions/
│       └── api.js      # Serverless Entry Point
├── src/                # Frontend React Components & Logic
├── components/         # Shared UI Components
├── pages/              # Application Routes/Views
├── public/             # Static Assets & Icons
├── netlify.toml        # Netlify Deployment Config
├── .env                # Project Environment Variables (Ignored)
└── package.json        # Unified Dependency Management
```

---

## 🛠️ Setup & Deployment

### 1. Prerequisites

- **Node.js**: Ensure you have a recent version of Node installed.
- **Firebase Account**: You need a Firebase project and a Service Account JSON.

### 2. Environment Variables

Create a root `.env` and a `backend/.env` file. For production, add these to your **Netlify Dashboard**:

| Variable                                          | Description                                         |
| :------------------------------------------------ | :-------------------------------------------------- |
| **`VITE_API_URL`**                        | Set to `/api` for unified routing.                |
| **`GOOGLE_APPLICATION_CREDENTIALS_JSON`** | Your complete Firebase Service Account JSON string. |

### 3. Running Locally

```bash
# Install dependencies
npm install

# Run frontend (with API proxy)
npm run dev

# Run backend (optional local dev)
node server.js
```

### 4. Deploying to Netlify

Push your code to GitHub and connect your repository to Netlify using these settings:

- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Functions Directory**: `netlify/functions`

---

## 🔒 Security

Sensitive credentials (like Firebase keys) are protected by a master `.gitignore` and should never be committed directly to version control. Always use the deployment platform's Environment Variables for production secrets.
