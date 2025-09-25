**Assessment Management System**
A full-stack web application for user authentication and configuration-driven PDF report generation from assessment data. The system supports multiple assessment types (Health & Fitness, Cardiac) with flexible, no-code configuration for new types, field mappings, and classification ranges.

🎯 **Features**

User Authentication: Secure signup/login with JWT tokens, form validation, and session management

PDF Report Generation: Backend API generates formatted PDFs using Puppeteer from HTML templates, saved locally

Configuration-Driven Flexibility: Add new assessment types, modify field mappings, and update classification ranges via JSON config—no code changes required

Modern Frontend: React + TypeScript + TailwindCSS with dark/light mode toggle, responsive design, and clean UI components

Data Storage: In-memory data.js for sample assessments (no external DB needed)

API Endpoints: Protected routes for auth and report generation

**Project Structure:**

```
Assessment Management System/
├── backend/
│   ├── package.json
│   ├── data.js
│   ├── config.js
│   ├── server.js
│   └── reports/
├── frontend/
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthForm.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── ReportGenerationForm.tsx
│   │   │   ├── ReportCard.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── ui/
│   │   │       ├── Button.tsx
│   │   │       └── Card.tsx
│   │   ├── context/
│   │   │   └── ThemeContext.tsx
│   │   ├── hooks/
│   │   │   └── useTheme.ts
│   │   ├── utils/
│   │   │   └── cn.ts
│   │   ├── App.tsx
│   │   ├── index.tsx
│   │   └── index.css
│   └── tsconfig.json
└── README.md
```





🚀 **Quick Start**

**_Prerequisites_**

Node.js (v18+)

npm or yarn

**Backend Setup**

**Navigate to backend directory:**


cd backend

_**Install dependencies:**_


npm install

**_Start the server:_**


npm run dev

Server runs on http://localhost:5000

Health check: GET /api/health

**Frontend Setup**

**_Navigate to frontend directory:_**


cd frontend

**_Install dependencies:_**


npm install

_**Start the development server:**_

npm start

App runs on http://localhost:3000

Running the Full Stack

Start backend first (npm run dev in backend/)

Then start frontend (npm start in frontend/)

Access the app at http://localhost:3000

🔐 **Authentication**

_**API Endpoints**_

Register: POST /api/auth/signup

Body: { "email": "user@example.com", "password": "password123", "name": "User Name" }

Response: 201 with JWT token and user data

Login: POST /api/auth/login

Body: { "email": "user@example.com", "password": "password123" }

Response: 200 with JWT token and user data

**Frontend Flow**

Visit /login or /signup for forms

After successful auth, redirects to dashboard (/)

Token stored in localStorage for session persistence

Protected routes require valid JWT in Authorization: Bearer <token>
