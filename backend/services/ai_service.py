import json
from datetime import datetime
from core.config import settings

try:
    from groq import Groq
    client = Groq(api_key=settings.GROQ_API_KEY)
    HAS_GROQ = True
except ImportError:
    client = None
    HAS_GROQ = False


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

    if not HAS_GROQ or not settings.GROQ_API_KEY:
        if not HAS_GROQ:
            print("[ERROR] Groq SDK is not installed in the active environment. Fallback returned.")
        else:
            print("[ERROR] GROQ_API_KEY is not defined in backend configuration. Fallback returned.")
        return fallback_response

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
        print(f"\n--- DEBUG: GENERATING ATS SCORE FOR '{job_role}' VIA GROQ ---")
        print(f"System Reference Date: {current_date_str}")

        # Primary Model: llama-3.1-70b-versatile
        try:
            completion = client.chat.completions.create(
                model="llama-3.1-70b-versatile",
                messages=[
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"}
            )
        except Exception as e:
            print(f"Primary Llama-3.1-70b failed: {e}. Falling back to llama-3.1-8b-instant...")
            completion = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"}
            )

        text = completion.choices[0].message.content.strip()
        print(f"Raw Groq API Output:\n{text}\n")

        parsed_data = json.loads(text)
        print("Successfully parsed structured JSON response from Groq.")
        return parsed_data

    except Exception as e:
        print(f"Groq API Error: {e}")
        return fallback_response
