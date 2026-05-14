# AI Resume Analyzer

AI Resume Analyzer is a full-stack AI-powered application that analyzes uploaded resumes, evaluates ATS compatibility, extracts technical skills, and generates intelligent improvement suggestions using NLP and OpenAI API integration.

---

# 🚀 Features

- Resume PDF upload
- ATS score analysis
- Technical skill extraction
- AI-generated resume suggestions
- Job-role matching
- REST API integration
- Responsive modern UI
- Resume keyword analysis
- Interactive analytics dashboard

---

# 🛠️ Tech Stack

## **Frontend**
- React (Vite)
- TypeScript
- Tailwind CSS
- Framer Motion

## **Backend**
- FastAPI (Python)
- SQLAlchemy
- SQLite

## **AI Integration**
- OpenAI API
- NLP Techniques
- Prompt Engineering

## **Tools**
- Git
- GitHub
- Postman

---

# 📂 Directory Structure

```bash
frontend/
backend/
screenshots/
README.md
```

---

# ⚙️ Prerequisites

- Node.js (v18+)
- Python (v3.10+)
- OpenAI API Key

---

# 🚀 Running the Project Locally

# 1️⃣ Backend Setup

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

Create a `.env` file inside the backend directory:

```env
OPENAI_API_KEY=your_api_key
SECRET_KEY=your_secret_key
```

Run the FastAPI server:

```bash
uvicorn main:app --reload
```

The backend API will be available at:

```text
http://localhost:8000
```

---

# 2️⃣ Frontend Setup

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

The frontend will be available at:

```text
http://localhost:5173
```

---

# 📦 Deployment

## 🌐 Live Demo

Frontend: https://vercel.com/yashanandds-projects/ai-resume-analyzer

Backend API: https://ai-resume-analyzer-backend-i4ac.onrender.com

## **Environment Variables**

```env
OPENAI_API_KEY=your_api_key
SECRET_KEY=your_secret_key
```

---

# 📸 Screenshots

Add screenshots of:
- Home Page
- Resume Upload Section
- ATS Score Dashboard
- AI Suggestions Panel

---

# 🔮 Future Improvements

- Multi-role ATS analysis
- Resume template recommendations
- AI interview preparation suggestions
- Authentication system
- Resume history tracking

---

# 👨‍💻 Author

**Yash Anand**
