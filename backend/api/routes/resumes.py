import os
import json
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session

from api.deps import get_db, get_current_user
from models.models import User, Resume
from schemas.schemas import ResumeResponse
from services.parser_service import extract_text_from_file
from services.ai_service import analyze_resume

router = APIRouter()

@router.post("/upload", response_model=ResumeResponse)
async def upload_resume(
    file: UploadFile = File(...),
    job_role: str = Form("Software Engineer"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Endpoint for uploading a resume (PDF/DOCX).
    Parses the file, sends extracted text to OpenAI for analysis against the target job role.
    """
    # 1. Validate file extension
    allowed_extensions = [".pdf", ".docx"]
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in allowed_extensions:
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported.")
    
    # 2. Extract Text
    try:
        content = await file.read()
        extracted_text = extract_text_from_file(content, ext)
        if not extracted_text.strip():
            raise ValueError("No extractable text found in document.")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse document: {str(e)}")

    # 3. Analyze with AI (OpenAI)
    try:
        analysis_result = analyze_resume(extracted_text, job_role)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Analysis failed: {str(e)}")

    # 4. Save to Database
    resume_record = Resume(
        filename=file.filename,
        parsed_text=extracted_text,
        ats_score=analysis_result.get("ats_score", 0),
        ai_feedback=json.dumps(analysis_result),
        owner_id=current_user.id
    )
    db.add(resume_record)
    db.commit()
    db.refresh(resume_record)

    return resume_record

@router.get("/", response_model=list[ResumeResponse])
def get_user_resumes(
    skip: int = 0, limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all resumes uploaded by the current user.
    """
    resumes = db.query(Resume).filter(Resume.owner_id == current_user.id).offset(skip).limit(limit).all()
    return resumes
