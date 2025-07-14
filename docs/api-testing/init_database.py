"""
Database initialization script
Creates tables and admin user
"""

import os
import bcrypt
from datetime import datetime
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from models import Base
from models.user import User, UserSession
from models.agent import Agent, AgentType
from models.chat import Conversation, Message
from models.activity_log import ActivityLog

# Database path
db_path = "backend/data/database.db"

# Create the directory if it doesn't exist
os.makedirs("backend/data", exist_ok=True)

def hash_password_bcrypt(password: str) -> str:
    """Hash password using bcrypt"""
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')

try:
    # Create database URL
    database_url = f"sqlite:///{db_path}"
    
    # Create engine
    engine = create_engine(database_url)
    
    # Drop all tables first to ensure clean state
    Base.metadata.drop_all(bind=engine)
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    print("✅ All tables created successfully!")
    
    # Create session
    Session = sessionmaker(bind=engine)
    session = Session()
    
    # Check if admin user exists
    admin = session.query(User).filter_by(email="me@alarade.at").first()
    
    if not admin:
        # Create admin user
        password_hash = hash_password_bcrypt("admin123456")
        admin = User(
            email="me@alarade.at",
            username="admin",
            full_name="Admin User",
            password_hash=password_hash,
            role="admin",
            is_active=True,
            is_verified=True,
            email_verified=True,
            phone_verified=False,
            two_factor_enabled=False,
            last_login=datetime.utcnow(),
            failed_login_attempts=0,
            preferences={},
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        session.add(admin)
        session.commit()
        print("✅ Admin user created successfully!")
        print("Email: me@alarade.at")
        print("Password: admin123456")
    else:
        # Update admin password
        admin.password_hash = hash_password_bcrypt("admin123456")
        session.commit()
        print("✅ Admin user password updated!")
    
    # Print all users for debugging
    print("\nAll users in database:")
    users = session.query(User).all()
    for user in users:
        print(f"ID: {user.id}, Email: {user.email}, Role: {user.role}")
    
    session.close()
    print("✅ Database initialization completed!")
    
except Exception as e:
    print(f"❌ Database error: {e}") 