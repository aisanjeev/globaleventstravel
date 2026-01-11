"""
Authentication API endpoints.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.deps import get_db
from app.core.security import (
    create_access_token,
    get_token_expiry_seconds,
    verify_password,
)
from app.core.auth import get_current_user, get_current_admin_user
from app.crud.user import user_crud
from app.db.models.user import User
from app.models.auth import (
    UserCreate,
    UserLogin,
    UserRegister,
    UserUpdate,
    UserResponse,
    UserListResponse,
    UserUpdateAdmin,
    PasswordChange,
    LoginResponse,
    RegisterResponse,
    Token,
)
from app.models.common import PaginatedResponse, MessageResponse

router = APIRouter()


# ============================================
# Public Auth Endpoints
# ============================================

@router.post("/login", response_model=LoginResponse)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    """
    Login with email and password.
    Returns JWT access token.
    """
    user = user_crud.authenticate(
        db, email=form_data.username, password=form_data.password
    )
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated"
        )
    
    # Update last login
    user_crud.update_last_login(db, user=user)
    
    # Create access token
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email, "role": user.role}
    )
    
    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in=get_token_expiry_seconds(),
        user=UserResponse.model_validate(user),
    )


@router.post("/login/json", response_model=LoginResponse)
def login_json(
    credentials: UserLogin,
    db: Session = Depends(get_db),
):
    """
    Login with JSON body (email and password).
    Alternative to form-based login.
    """
    user = user_crud.authenticate(
        db, email=credentials.email, password=credentials.password
    )
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated"
        )
    
    # Update last login
    user_crud.update_last_login(db, user=user)
    
    # Create access token
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email, "role": user.role}
    )
    
    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in=get_token_expiry_seconds(),
        user=UserResponse.model_validate(user),
    )


@router.post("/register", response_model=RegisterResponse, status_code=201)
def register(
    user_in: UserRegister,
    db: Session = Depends(get_db),
):
    """
    Register a new user account.
    """
    # Check if email already exists
    existing_user = user_crud.get_by_email(db, email=user_in.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create user
    user = user_crud.create(db, obj_in=UserCreate(**user_in.model_dump()))
    
    return RegisterResponse(
        message="Registration successful. Please verify your email.",
        user=UserResponse.model_validate(user),
    )


# ============================================
# Protected User Endpoints
# ============================================

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(
    current_user: User = Depends(get_current_user),
):
    """Get current user's profile."""
    return UserResponse.model_validate(current_user)


@router.put("/me", response_model=UserResponse)
def update_current_user_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update current user's profile."""
    user = user_crud.update_profile(db, user=current_user, obj_in=user_update)
    return UserResponse.model_validate(user)


@router.post("/me/change-password", response_model=MessageResponse)
def change_password(
    password_data: PasswordChange,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Change current user's password."""
    # Verify current password
    if not verify_password(password_data.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    # Update password
    user_crud.change_password(db, user=current_user, new_password=password_data.new_password)
    
    return MessageResponse(message="Password changed successfully")


@router.post("/refresh", response_model=Token)
def refresh_token(
    current_user: User = Depends(get_current_user),
):
    """
    Refresh access token.
    Use this to get a new token before the current one expires.
    """
    access_token = create_access_token(
        data={"sub": str(current_user.id), "email": current_user.email, "role": current_user.role}
    )
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        expires_in=get_token_expiry_seconds(),
    )


# ============================================
# Admin User Management Endpoints
# ============================================

@router.get("/users", response_model=PaginatedResponse[UserListResponse])
def list_users(
    skip: int = 0,
    limit: int = 20,
    role: str = None,
    is_active: bool = None,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
):
    """List all users (admin only)."""
    users = user_crud.get_users(
        db, skip=skip, limit=limit, role=role, is_active=is_active
    )
    total = user_crud.get_users_count(db, role=role, is_active=is_active)
    
    return PaginatedResponse(
        items=[UserListResponse.model_validate(u) for u in users],
        total=total,
        skip=skip,
        limit=limit,
    )


@router.get("/users/{user_id}", response_model=UserResponse)
def get_user(
    user_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
):
    """Get a specific user (admin only)."""
    user = user_crud.get(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return UserResponse.model_validate(user)


@router.put("/users/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    user_update: UserUpdateAdmin,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
):
    """Update a user (admin only)."""
    user = user_crud.get(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Prevent changing superadmin role unless current user is superadmin
    if user.role == "superadmin" and current_user.role != "superadmin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot modify superadmin user"
        )
    
    # Prevent demoting yourself
    if user.id == current_user.id and user_update.role and user_update.role != current_user.role:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot change your own role"
        )
    
    user = user_crud.update_by_admin(db, user=user, obj_in=user_update)
    return UserResponse.model_validate(user)


@router.post("/users/{user_id}/deactivate", response_model=UserResponse)
def deactivate_user(
    user_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
):
    """Deactivate a user (admin only)."""
    user = user_crud.get(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if user.id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot deactivate yourself"
        )
    
    if user.role == "superadmin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot deactivate superadmin"
        )
    
    user = user_crud.deactivate(db, user=user)
    return UserResponse.model_validate(user)


@router.post("/users/{user_id}/activate", response_model=UserResponse)
def activate_user(
    user_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
):
    """Activate a user (admin only)."""
    user = user_crud.get(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user = user_crud.activate(db, user=user)
    return UserResponse.model_validate(user)


@router.post("/users", response_model=UserResponse, status_code=201)
def create_user_by_admin(
    user_in: UserCreate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
):
    """Create a new user (admin only)."""
    existing_user = user_crud.get_by_email(db, email=user_in.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    user = user_crud.create(db, obj_in=user_in)
    return UserResponse.model_validate(user)


