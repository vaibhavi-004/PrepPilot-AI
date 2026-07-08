# PrepPilot AI 🚀
### AI-Powered Interview Preparation Platform
PrepPilot AI is an AI-powered full-stack interview preparation platform designed to streamline coding preparation and help software developers ace their technical interviews.

---

## 📖 Table of Contents
1. [Project Overview](#-project-overview)
2. [Key Features](#-key-features)
3. [Tech Stack](#-tech-stack)
4. [Folder Structure](#-folder-structure)
5. [API Reference Routes](#-api-reference-routes)
6. [Local Installation Guide](#-local-installation-guide)
7. [Environment Variables Configuration](#-environment-variables-configuration)
8. [Deployment Instructions](#-deployment-instructions)
9. [Future Roadmap & Improvements](#-future-roadmap--improvements)

---

## 🌟 Project Overview
Preparing for software engineering interviews often requires managing multiple fragmented utilities: LeetCode trackers, text document revision notes, and random mock interview websites. PrepPilot AI solves this by introducing a unified candidate dashboard where users can track DSA progress, compile cheat sheets, and generate AI-powered interview questions based on standard industry questions.

---

## 🌐 Live Demo

Deployed Application:
https://preppilot-ai-3i8u.onrender.com

GitHub Repository:
https://github.com/vaibhavi-004/PrepPilot-AI

---

## ✨ Key Features
- **Dark Mode Landing Page**: Stunning modern marketing page with glassmorphism layout, blue/purple gradient accents, and fully responsive layouts.
- **DSA Progress Tracker**: Full CRUD operations for coding problems with status tags (Solved, Attempted, Not Started) and difficulty ratings (Easy, Medium, Hard).
- **Concept Notes Manager**: Dynamic note board for quick-reference summaries (e.g. system design cheat sheets, time complexity metrics) rendered as cards.
- **AI Interview Assistant**: Generates contextual interview questions across Technical Coding, CS Fundamentals, and HR Behavioral areas. Supports one-click regenerations.
- **Secure Authentication**: User authentication using password hashing with bcryptjs and JWT-based authorization for protected routes.
- **API Portability & Fail-safe Mock Engine**: Automatically falls back to pre-crafted mock questions if the OpenAI API key is unavailable, ensuring the AI interview feature remains functional without an API key.

---

## 🛠️ Tech Stack
- **Frontend**: HTML5, Vanilla CSS3 (Custom Grid/Flex system, glassmorphism), Vanilla ES6 JavaScript.
- **Backend**: Node.js, Express.js REST APIs.
- **Database**: MongoDB Atlas, Mongoose ODM.
- **Authentication**: JSON Web Tokens (JWT) stored in `localStorage`, bcryptjs password hashing.
- **AI Integration**: OpenAI Chat Completions API (`gpt-3.5-turbo`).

---

## ✅ Project Status

Completed and deployed full-stack application.

Current features:
- User authentication
- DSA tracking system
- Personal notes management
- AI-powered interview question generation
- Cloud database integration

---

## 📁 Folder Structure
The codebase utilizes a simple, beginner-friendly MVC (Model-View-Controller) structure optimized for study and customization:
```text
PrepPilot-AI/
├── backend/
│   ├── config/
│   │   └── db.js            # Mongoose MongoDB connection establishment
│   ├── controllers/
│   │   ├── authController.js     # Signup/Login logic & JWT generation
│   │   ├── problemController.js  # DSA CRUD logic & owner validation
│   │   ├── noteController.js     # Notes CRUD logic
│   │   └── aiController.js       # OpenAI API caller & Mock fallback library
│   ├── middleware/
│   │   └── authMiddleware.js     # Protected routes JWT gatekeeper
│   ├── models/
│   │   ├── User.js          # User details schema
│   │   ├── Problem.js       # DSA Problems tracker schema
│   │   └── Note.js          # Personal notes schema
│   ├── routes/
│   │   ├── authRoutes.js    # Authentication API endpoints mapping
│   │   ├── problemRoutes.js # Problems tracker API endpoints mapping
│   │   ├── noteRoutes.js    # Notes API endpoints mapping
│   │   └── aiRoutes.js      # AI Interview API endpoints mapping
│   ├── .env.example         # Template for environment configurations
│   ├── package.json         # Node dependencies and execution scripts
│   └── server.js            # Main Express entrypoint (database, CORS, routing)
├── frontend/
│   ├── css/
│   │   ├── landing.css      # Dark theme landing page styles
│   │   ├── auth.css         # Cremé/Purple login and signup styles
│   │   └── dashboard.css    # Core workspace application layout styles
│   ├── js/
│   │   ├── config.js        # Dynamic backend API Base URL resolver
│   │   ├── auth.js          # Auth submit handling, token caching & route guards
│   │   ├── dashboard.js     # Dashboard interactions, user greeting, and progress display
│   │   ├── dsa.js           # DSA problem CRUD handler
│   │   ├── notes.js         # Notes CRUD card builder
│   │   └── ai.js            # AI generator trigger and loader
│   ├── assets/              # Static assets and images
│   ├── index.html           # Landing page HTML
│   ├── login.html           # Login screen HTML
│   ├── signup.html          # Registration screen HTML
│   └── dashboard.html       # Main user dashboard page
└── README.md
```

---

## 🔌 API Reference Routes

| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Register a new user profile | No |
| **POST** | `/api/auth/login` | Authenticate credentials and return JWT | No |
| **GET** | `/api/problems` | Retrieve all tracked problems for the user | **Yes** |
| **POST** | `/api/problems` | Track a new DSA problem | **Yes** |
| **PUT** | `/api/problems/:id` | Update status, difficulty, or title | **Yes** |
| **DELETE** | `/api/problems/:id` | Delete a tracked problem | **Yes** |
| **GET** | `/api/notes` | Fetch all saved concept notes | **Yes** |
| **POST** | `/api/notes` | Create a new study note card | **Yes** |
| **DELETE** | `/api/notes/:id` | Delete a concept note card | **Yes** |
| **POST** | `/api/ai/questions` | Generate a fresh set of mock questions | **Yes** |

---

## 💻 Local Installation Guide

### Prerequisites
- Node.js installed (v18.0.0+ recommended)
- A local MongoDB instance or a free MongoDB Atlas Cloud database cluster.

### Step 1: Clone or copy the project files to your system
Ensure the directory structure matches the standard folder layout defined above.

### Step 2: Configure Environment Variables
Navigate into the `backend/` directory and rename `.env.example` to `.env`. Configure your variables:
```bash
cd backend
copy .env.example .env
```
Fill in your database connection string and desired JWT secret:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/preppilot
JWT_SECRET=your_super_jwt_secret_key_123456
OPENAI_API_KEY=your_optional_openai_api_key_goes_here
```

### Step 3: Install Backend Dependencies
Run the install command inside the `backend/` folder:
```bash
npm install
```

### Step 4: Run the Application
Start the development server:
```bash
npm run dev
```
The server will boot up and:
- Connect successfully to MongoDB.
- Serve the REST APIs on port `5000`.
- Serve the static frontend pages on `http://localhost:5000` automatically! 

Open `http://localhost:5000` in your web browser.

---

## ⚡ Environment Variables Configuration
- `PORT`: The port number the Express server runs on (defaults to `5000`).
- `MONGODB_URI`: The connection URL for MongoDB. If running locally, you can use `mongodb://127.0.0.1:27017/preppilot`.
- `JWT_SECRET`: A secret string used to sign JSON Web Tokens. Choose a secure, random string.
- `OPENAI_API_KEY`: *(Optional)* Your OpenAI API Secret. If empty, the system automatically triggers an offline mock questions engine.

---

## 🚀 Deployment Instructions

### Option A: Unified Deployment to Render (Recommended & Easiest)
Since the Express server is configured to serve the static frontend directory, you can deploy the entire application under a single Render Web Service:
1. Initialize a Git repository in the root `PrepPilot-AI` folder:
   ```bash
   git init
   git add .
   git commit -m "Initial PrepPilot Release"
   ```
2. Push your code to GitHub.
3. Log in to [Render](https://render.com) and click **New > Web Service**.
4. Link your GitHub repository.
5. Configure the following settings:
   - **Root Directory**: `backend` (or leave blank and set Build Command to `cd backend && npm install`)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add your Environment Variables in the Render dashboard (`MONGODB_URI`, `JWT_SECRET`, `OPENAI_API_KEY`).
7. Click **Deploy**. Your app will compile and be online!

## 📈 Future Roadmap & Improvements
- **Interactive Coding Console**: Integrate an online code editor (e.g. Monaco Editor) with sandboxed JavaScript execution to let candidates run test cases directly.
- **Mock Video/Audio Recorder**: Use WebRTC to let candidates record their video responses to HR questions, allowing self-evaluation of body language and delivery.
- **Revision Reminders**: Send automated daily email notifications via SendGrid/Nodemailer for flagged problems due for review (spaced repetition).
- **Streak Trackers**: Add a visual calendar element tracking user activity, encouraging consecutive coding sessions.

---

<!-- ## 📸 Screenshots (Placeholders)
*Feel free to attach real application screenshots here to boost visual appeal on GitHub!*
- **Landing Page**: `assets/landing_preview.png`
- **Dashboard Workspace**: `assets/dashboard_preview.png`
- **AI Interview Assistant Panel**: `assets/ai_prep_preview.png` -->
