"""
CRUD operations for User model.
"""
from datetime import datetime
from typing import List, Optional
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.db.models.user import User
from app.models.auth import UserCreate, UserUpdate, UserUpdateAdmin
from app.core.security import get_password_hash, verify_password


class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):
    """CRUD operations for User model."""
    
    def get_by_email(self, db: Session, email: str) -> Optional[User]:
        """Get user by email."""
        return db.query(User).filter(User.email == email).first()
    
    def create(self, db: Session, *, obj_in: UserCreate) -> User:
        """Create a new user with hashed password."""
        db_user = User(
            email=obj_in.email,
            hashed_password=get_password_hash(obj_in.password),
            full_name=obj_in.full_name,
            phone=obj_in.phone,
            role="user",
            is_active=True,
            is_verified=False,
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    
    def create_admin(
        self,
        db: Session,
        *,
        email: str,
        password: str,
        full_name: str,
        role: str = "admin"
    ) -> User:
        """Create an admin user."""
        db_user = User(
            email=email,
            hashed_password=get_password_hash(password),
            full_name=full_name,
            role=role,
            is_active=True,
            is_verified=True,
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    
    def authenticate(
        self,
        db: Session,
        *,
        email: str,
        password: str
    ) -> Optional[User]:
        """Authenticate a user by email and password."""
        user = self.get_by_email(db, email=email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user
    
    def update_last_login(self, db: Session, *, user: User) -> User:
        """Update user's last login timestamp."""
        user.last_login = datetime.utcnow()
        db.commit()
        db.refresh(user)
        return user
    
    def change_password(
        self,
        db: Session,
        *,
        user: User,
        new_password: str
    ) -> User:
        """Change user's password."""
        user.hashed_password = get_password_hash(new_password)
        db.commit()
        db.refresh(user)
        return user
    
    def update_profile(
        self,
        db: Session,
        *,
        user: User,
        obj_in: UserUpdate
    ) -> User:
        """Update user's profile."""
        update_data = obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(user, field, value)
        db.commit()
        db.refresh(user)
        return user
    
    def update_by_admin(
        self,
        db: Session,
        *,
        user: User,
        obj_in: UserUpdateAdmin
    ) -> User:
        """Update user by admin."""
        update_data = obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(user, field, value)
        db.commit()
        db.refresh(user)
        return user
    
    def get_users(
        self,
        db: Session,
        *,
        skip: int = 0,
        limit: int = 100,
        role: Optional[str] = None,
        is_active: Optional[bool] = None
    ) -> List[User]:
        """Get list of users with optional filters."""
        query = db.query(User)
        
        if role:
            query = query.filter(User.role == role)
        if is_active is not None:
            query = query.filter(User.is_active == is_active)
        
        return query.offset(skip).limit(limit).all()
    
    def get_users_count(
        self,
        db: Session,
        *,
        role: Optional[str] = None,
        is_active: Optional[bool] = None
    ) -> int:
        """Get count of users with optional filters."""
        from sqlalchemy import func
        query = db.query(func.count(User.id))
        
        if role:
            query = query.filter(User.role == role)
        if is_active is not None:
            query = query.filter(User.is_active == is_active)
        
        return query.scalar() or 0
    
    def deactivate(self, db: Session, *, user: User) -> User:
        """Deactivate a user."""
        user.is_active = False
        db.commit()
        db.refresh(user)
        return user
    
    def activate(self, db: Session, *, user: User) -> User:
        """Activate a user."""
        user.is_active = True
        db.commit()
        db.refresh(user)
        return user


user_crud = CRUDUser(User)


