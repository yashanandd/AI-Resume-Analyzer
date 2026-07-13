import secrets
import smtplib
from datetime import datetime, timedelta
from email.mime.text import MIMEText
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from core.config import settings
from core.security import verify_password, get_password_hash, create_access_token
from api.deps import get_db, get_current_user
from models.models import User, OTP
from schemas.schemas import UserCreate, UserResponse, Token, ChangePasswordRequest, ForgotPasswordRequest, VerifyOTPRequest

router = APIRouter()

@router.post("/signup", response_model=UserResponse)
def signup(user_in: UserCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.post("/login", response_model=Token)
def login_access_token(
    db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()
):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password",
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": create_access_token(
            {"email": user.email}, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }

@router.get("/me", response_model=UserResponse)
def read_user_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/change-password")
def change_password(
    data: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not verify_password(data.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect current password"
        )
    if len(data.new_password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be at least 6 characters long"
        )
    current_user.hashed_password = get_password_hash(data.new_password)
    db.commit()
    return {"message": "Password changed successfully"}


def generate_numeric_otp() -> str:
    return "".join(secrets.choice("0123456789") for _ in range(6))


def send_otp_email(to_email: str, otp_code: str):
    subject = "Nexus AI - Security Access Verification Key"
    body = f"""
===================================================
NEXUS SECURE CORE - PASSWORD RECOVERY INITIATED
===================================================

An identity recovery token has been generated for this email.
Please use the following 6-digit numeric verification key:

VERIFICATION_KEY: {otp_code}

This key is valid for exactly 10 minutes from issuance.
If you did not request this recovery token, please ignore this transmission.

---------------------------------------------------
NEXUS_AI SECURITY CORE // SYSTEM STATUS: OPERATIONAL
===================================================
"""
    if settings.SMTP_HOST and settings.SMTP_USER:
        try:
            msg = MIMEText(body)
            msg["Subject"] = subject
            msg["From"] = settings.SMTP_FROM or settings.SMTP_USER
            msg["To"] = to_email
            
            with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
                if settings.SMTP_PASSWORD:
                    server.starttls()
                    server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                server.sendmail(msg["From"], [to_email], msg.as_string())
            print(f"[SMTP] Successfully sent OTP key to {to_email}")
        except Exception as e:
            print(f"[SMTP_ERROR] Failed to dispatch verification email: {e}")
            print(f"[MOCK_EMAIL_FALLBACK] Email output:\n{body}")
    else:
        print(f"[MOCK_EMAIL] SMTP unconfigured. Generated verification output:\n{body}")


@router.post("/forgot-password")
def forgot_password(data: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User with this email vector does not exist in the database."
        )
    
    otp_code = generate_numeric_otp()
    expires_at = datetime.utcnow() + timedelta(minutes=10)
    
    otp_record = OTP(
        email=data.email,
        code=otp_code,
        expires_at=expires_at
    )
    db.add(otp_record)
    db.commit()
    
    send_otp_email(data.email, otp_code)
    
    return {"message": "Verification key has been successfully generated and sent."}


@router.post("/verify-otp")
def verify_otp(data: VerifyOTPRequest, db: Session = Depends(get_db)):
    now = datetime.utcnow()
    otp_record = db.query(OTP).filter(
        OTP.email == data.email,
        OTP.code == data.code,
        OTP.is_used == False,
        OTP.expires_at > now
    ).order_by(OTP.created_at.desc()).first()
    
    if not otp_record:
        raise HTTPException(
            status_code=400,
            detail="The verification key is invalid or has expired."
        )
    
    if len(data.new_password) < 6:
        raise HTTPException(
            status_code=400,
            detail="New password must be at least 6 characters long."
        )
        
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User identity associated with this OTP was not found."
        )
        
    user.hashed_password = get_password_hash(data.new_password)
    otp_record.is_used = True
    db.commit()
    
    return {"message": "Password security parameters reset successfully."}
