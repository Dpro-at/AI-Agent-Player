#!/usr/bin/env python3
"""
Fix Database Messages Table
Check and fix database schema for messages table
"""

import asyncio
import sys
import logging
from pathlib import Path

# Add backend directory to path
backend_dir = Path(__file__).resolve().parent
sys.path.append(str(backend_dir))

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, text, inspect
from config.database import AsyncSessionLocal, async_engine
from models.database import Base, Message, Conversation, User
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def check_database_schema():
    """Check database schema and tables"""
    async with async_engine.begin() as conn:
        try:
            # Check if messages table exists
            result = await conn.execute(text("""
                SELECT name FROM sqlite_master 
                WHERE type='table' AND name='messages';
            """))
            
            messages_table = result.fetchone()
            
            if messages_table:
                logger.info("✅ Messages table exists")
                
                # Check table structure
                result = await conn.execute(text("PRAGMA table_info(messages);"))
                columns = result.fetchall()
                
                logger.info("📋 Messages table structure:")
                for col in columns:
                    logger.info(f"   - {col[1]} ({col[2]}) {'NOT NULL' if col[3] else 'NULL'}")
                    
                return True
            else:
                logger.error("❌ Messages table does not exist!")
                return False
                
        except Exception as e:
            logger.error(f"❌ Error checking database schema: {e}")
            return False

async def create_tables():
    """Create all database tables"""
    try:
        logger.info("🔧 Creating database tables...")
        
        async with async_engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
            
        logger.info("✅ Database tables created successfully!")
        return True
        
    except Exception as e:
        logger.error(f"❌ Error creating tables: {e}")
        return False

async def test_message_creation():
    """Test creating a message"""
    async with AsyncSessionLocal() as db:
        try:
            # Get or create a conversation
            conv_query = select(Conversation).limit(1)
            result = await db.execute(conv_query)
            conversation = result.scalar_one_or_none()
            
            if not conversation:
                # Get first user
                user_query = select(User).limit(1)
                user_result = await db.execute(user_query)
                user = user_result.scalar_one_or_none()
                
                if not user:
                    logger.error("❌ No users found!")
                    return False
                
                # Create conversation
                conversation = Conversation(
                    user_id=user.id,
                    title="Test Conversation for Messages",
                    agent_id=1
                )
                db.add(conversation)
                await db.commit()
                await db.refresh(conversation)
                logger.info(f"✅ Created test conversation: {conversation.id}")
            
            # Create test message
            test_message = Message(
                conversation_id=conversation.id,
                content="Test message from database fix script",
                sender="user",
                message_type="text"
            )
            
            db.add(test_message)
            await db.commit()
            await db.refresh(test_message)
            
            logger.info(f"✅ Message created successfully! ID: {test_message.id}")
            logger.info(f"   Content: {test_message.content}")
            logger.info(f"   Sender: {test_message.sender}")
            logger.info(f"   Conversation ID: {test_message.conversation_id}")
            
            return True
            
        except Exception as e:
            await db.rollback()
            logger.error(f"❌ Error creating message: {e}")
            import traceback
            logger.error(f"   Traceback: {traceback.format_exc()}")
            return False

async def fix_database():
    """Fix database issues"""
    logger.info("🔧 Starting database diagnosis and fix...")
    logger.info("=" * 60)
    
    # Step 1: Check schema
    logger.info("1️⃣ Checking database schema...")
    schema_ok = await check_database_schema()
    
    if not schema_ok:
        # Step 2: Create tables
        logger.info("2️⃣ Creating missing tables...")
        tables_created = await create_tables()
        
        if not tables_created:
            logger.error("❌ Failed to create tables!")
            return False
        
        # Check again
        schema_ok = await check_database_schema()
    
    if schema_ok:
        # Step 3: Test message creation
        logger.info("3️⃣ Testing message creation...")
        test_ok = await test_message_creation()
        
        if test_ok:
            logger.info("\n✅ Database fix completed successfully!")
            logger.info("💡 Messages API should work now.")
            return True
        else:
            logger.error("\n❌ Message creation test failed!")
            return False
    else:
        logger.error("\n❌ Database schema issues not resolved!")
        return False

async def main():
    """Main function"""
    print("🔧 Database Messages Fix - AI Agent Player")
    print("=" * 60)
    
    success = await fix_database()
    
    if success:
        print("\n🎉 Database fix completed successfully!")
        print("💡 You can now test POST /chat/conversations/{id}/messages API")
    else:
        print("\n❌ Database fix failed!")
        print("💡 Manual intervention may be required")
    
    return success

if __name__ == "__main__":
    asyncio.run(main()) 