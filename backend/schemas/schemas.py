from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Resume Schemas
class ResumeBase(BaseModel):
    filename: str

class ResumeResponse(ResumeBase):
    id: int
    parsed_text: Optional[str] = None
    ats_score: Optional[int] = None
    ai_feedback: Optional[str] = None
    created_at: datetime
    owner_id: int

    class Config:
        from_attributes = True

class AnalysisRequest(BaseModel):
    job_role: str
