from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
import jwt
from dependence  import (
    get_db, 
    verify_password, 
    create_access_token, 
    ACCESS_TOKEN_EXPIRE_MINUTES,
    get_current_user,
    get_password_hash,
    SECRET_KEY,
    ALGORITHM
)
from crud import get_user_by_email, create_user, update_user_password
from schemas import (
    Token, 
    User, 
    UserCreate, 
    PasswordReset,
    PasswordResetConfirm
)
import models
from email_service import send_reset_password_email
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/login", response_model=Token)  #API đăng nhập
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    # Kiểm tra email có tồn tại trong database không
    user = get_user_by_email(db, form_data.username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Email chưa được đăng ký. Vui lòng đăng ký trước",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Kiểm tra mật khẩu
    if not verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Sai mật khẩu",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Tạo token nếu đăng nhập thành công
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model= User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/register", response_model=User)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Email đã được đăng ký"
        )
    
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Tên tài khoản đã được sử dụng"
        )
    
    return create_user(db=db, user=user)

@router.post("/forgot-password")
async def forgot_password(request: PasswordReset, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    logger.info(f"Received password reset request for email: {request.email}")
    user = get_user_by_email(db, request.email)
    if not user:
        logger.warning(f"Email không tồn tại: {request.email}")
        raise HTTPException(status_code=404, detail="Email không tồn tại")
    
    logger.info(f"Generating reset token for user: {user.id}")
    reset_token = create_access_token(
        data={"sub": str(user.id), "type": "password_reset"},
        expires_delta=timedelta(minutes=30)
    )
    
    logger.info(f"Adding email task to background tasks for email: {request.email}")
    background_tasks.add_task(
        send_reset_password_email,
        email=request.email,
        token=reset_token
    )
    
    logger.info("Password reset request processed successfully")
    return {"message": "Password reset email sent"}

@router.post("/reset-password")
async def reset_password(
    request: PasswordResetConfirm,
    db: Session = Depends(get_db)
):
    try:
        # Verify token
        payload = jwt.decode(
            request.token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
        user_id = int(payload.get("sub"))
        token_type = payload.get("type")
        
        if token_type != "password_reset":
            raise HTTPException(
                status_code=400,
                detail="Invalid token type"
            )
        
        # Update password
        if update_user_password(db, user_id, request.new_password):
            return {"message": "Password updated successfully"}
        else:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )
            
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=400,
            detail="Token has expired"
        )
    except jwt.JWTError:
        raise HTTPException(
            status_code=400,
            detail="Invalid token"
        )