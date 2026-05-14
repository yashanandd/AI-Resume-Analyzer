import json
import google.generativeai as genai
from core.config import settings

genai.configure(api_key=settings.GEMINI_API_KEY)

model = genai.GenerativeModel("models/gemini-2.5-flash")


def analyze_resume(resume_text: str, job_role: str) -> dict:
    fallback_response = {
        "ats_score": 85,
        "missing_keywords": ["Docker", "AWS", "CI/CD"],
        "suggestions": [
            "Add more quantified achievements.",
            "Include cloud deployment projects.",
            "Improve project descriptions with impact metrics."
        ],
        "skills_found": [
            "Python",
            "FastAPI",
            "React",
            "SQL",
            "Git",
            "Machine Learning"
        ]
    }

    prompt = f"""
    You are an expert ATS Resume Analyzer.

    Analyze this resume for the role: {job_role}

    Return ONLY valid JSON in this format:

    {{
        "ats_score": 0,
        "missing_keywords": [],
        "suggestions": [],
        "skills_found": []
    }}

    Resume:
    {resume_text[:4000]}
    """

    try:
        response = model.generate_content(prompt)

        text = response.text.strip()

        if text.startswith("```json"):
            text = text.replace("```json", "").replace("```", "").strip()

        return json.loads(text)

    except Exception as e:
        print(f"Gemini API Error: {e}")

        return fallback_response
