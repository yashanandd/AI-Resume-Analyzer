# Nexus AI - Resume Analyzer

Nexus AI is a modern, full-stack AI Resume Analyzer. Built for AI/ML engineers and technical recruiters, it parses uploaded resumes, evaluates their ATS score against specific job roles, extracts skills, and uses OpenAI to provide actionable feedback.

## Tech Stack
- **Frontend**: React (Vite), TypeScript, Tailwind CSS, Framer Motion
- **Backend**: FastAPI (Python), SQLAlchemy, SQLite (Development) / PostgreSQL (Production)
- **AI Integration**: OpenAI (`gpt-3.5-turbo`)
- **Document Parsing**: `pdfplumber`, `python-docx`

## Directory Structure
- `/frontend`: Vite + React frontend application
- `/backend`: FastAPI backend application

## Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- OpenAI API Key

---

## 🚀 Running the Project Locally

### 1. Backend Setup

Open a terminal and navigate to the backend directory:
```bash
cd backend
```

Create and activate a virtual environment:
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS / Linux
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Create a `.env` file in the `backend` directory:
```env
SECRET_KEY=your_super_secret_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

Run the FastAPI server:
```bash
uvicorn main:app --reload
```
The backend API will be available at: http://localhost:8000

---

### 2. Frontend Setup

Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```
The frontend will be available at: http://localhost:5173

---

## 📦 Deployment Instructions

### Backend (Render / Heroku)
1. Set the Database to **PostgreSQL** by updating the `SQLALCHEMY_DATABASE_URI` in `backend/core/config.py` using an environment variable in production.
2. Define the start command as: `uvicorn main:app --host 0.0.0.0 --port $PORT`
3. Add `SECRET_KEY` and `OPENAI_API_KEY` to the environment variables on the hosting platform.

### Frontend (Vercel / Netlify)
1. Connect your repository to Vercel/Netlify.
2. Set the build command to: `npm run build`
3. Set the output directory to: `dist`
4. Make sure to update the backend API URL in the frontend (if deployed).
