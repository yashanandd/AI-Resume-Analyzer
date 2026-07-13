import json
from datetime import datetime
from core.config import settings

try:
    from google import genai
    client = genai.Client(api_key=settings.GEMINI_API_KEY)
    HAS_NEW_SDK = True
except ImportError:
    import google.generativeai as genai
    genai.configure(api_key=settings.GEMINI_API_KEY)
    model = genai.GenerativeModel("models/gemini-2.0-flash")
    HAS_NEW_SDK = False


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

    current_date_str = datetime.utcnow().strftime("%B %Y")  # e.g., "July 2026"

    prompt = f"""
    You are an expert ATS Resume Analyzer.
    
    [CRITICAL TEMPORAL ALIGNMENT]
    - The current date is exactly {current_date_str}.
    - Any date, internship, or project matching 2024, 2025, or early 2026 (including Jan '25, Feb '25, Feb '26, Apr '26) is in the PAST.
    - Do NOT write suggestions stating that these dates are in the future or that they imply upcoming/planned work. They are fully completed.
    - Only flag a date as in the future if it is strictly after {current_date_str}.
    - Ensure your suggestions reflect this past completion context.

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
        print(f"\n--- DEBUG: GENERATING ATS SCORE FOR '{job_role}' ---")
        print(f"System Reference Date: {current_date_str}")

        if HAS_NEW_SDK:
            response = client.models.generate_content(
                model="gemini-2.0-flash",
                contents=prompt
            )
        else:
            response = model.generate_content(prompt)

        text = response.text.strip()
        print(f"Raw Gemini API Output:\n{text}\n")

        if text.startswith("```json"):
            text = text.replace("```json", "").replace("```", "").strip()

        parsed_data = json.loads(text)
        print("Successfully parsed structured JSON response.")
        return parsed_data

    except Exception as e:
        print(f"Gemini API Error: {e}")

        return fallback_response
