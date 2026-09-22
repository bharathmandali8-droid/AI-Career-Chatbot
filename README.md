# 🌟 AI Career Chatbot & ATS Optimization Engine

A full-stack, enterprise-grade AI Career Coach, Resume Scorer, ATS Auditor, and Skill Roadmap Assistant powered by **Google Gemini 2.5 Flash**, **Node.js Express**, **TypeScript**, **React 18**, **Tailwind CSS**, and **Supabase**.

![AI Career Chatbot](preview.html)

---

## ✨ Features

- **🤖 Real-Time Streaming AI Coach**: Grounded SSE (Server-Sent Events) streaming responses using Google's `@google/genai` SDK (`gemini-2.5-flash`).
- **📊 Interactive ATS Match & Audit Diagnostic**: Dial-gauge compatibility scoring, key matched strengths, missing keyword analysis, and high-impact action bullet rewrites.
- **🗺️ Tailored Technical Skill Roadmaps**: Milestone phase step-by-step career transition plans with timeline durations, topics to master, and recommended capstone projects.
- **📁 Career Context Drawer**: Attach resume text and target job descriptions for grounded, context-aware AI guidance.
- **🎨 Glassmorphism & Liquid Motion UI**: Spatial glass surface tokens, smooth dark/light theme toggle, liquid canvas background, and code block syntax highlighting.
- **🔒 Flexible Backend & Supabase Auth**: Full Supabase authentication with memory fallback for demo execution.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React, React Markdown, Framer Motion
- **Backend**: Node.js, Express, TSX, Zod, Express Rate Limit
- **AI & ML**: Google Gemini SDK (`@google/genai`), Gemini 2.5 Flash
- **Database & Auth**: Supabase PostgreSQL & Row Level Security (RLS)

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- npm or yarn

### 2. Installation
```bash
git clone https://github.com/bharathmandali8-droid/AI-Career-Chatbot.git
cd AI-Career-Chatbot
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase Configuration
SUPABASE_URL=https://your-supabase-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=http://localhost:5000/api
```

### 4. Running Development Server
```bash
npm run dev
```

---

## 📦 Build & Production

```bash
# Build client and server
npm run build
npm run build:server

# Start server
npm run dev:server
```

---

## 📄 License
[MIT](LICENSE)
