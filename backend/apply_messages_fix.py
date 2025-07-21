#!/usr/bin/env python3
"""
Quick fix for messages table column issue
Apply migration 022 to fix sender -> message_role
"""

import sqlite3
import os
import sys
from pathlib import Path

def fix_messages_table():
    """Fix messages table sender column to message_role"""
    
    # Database path - FIXED: Correct path
    db_path = "./data/database.db"
    
    if not os.path.exists(db_path):
        print(f"❌ Database not found: {db_path}")
        # Try alternative paths
        alt_paths = ["./app_database.db", "../data/database.db", "./database.db"]
        for alt_path in alt_paths:
            if os.path.exists(alt_path):
                print(f"✅ Found database at: {alt_path}")
                db_path = alt_path
                break
        else:
            print("❌ No database file found in any expected location")
            return False
    
    try:
        # Connect to database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        print("🔍 Analyzing messages table...")
        
        # Check current table structure
        cursor.execute("PRAGMA table_info(messages)")
        columns = cursor.fetchall()
        
        print("📋 Current columns:")
        for col in columns:
            print(f"  {col[1]:15} {col[2]:12} NotNull: {col[3]} Default: {col[4]}")
        
        # Check for sender and message_role columns
        has_sender = any(col[1] == 'sender' for col in columns)
        has_message_role = any(col[1] == 'message_role' for col in columns)
        
        print(f"\n🔎 Column analysis:")
        print(f"  Has 'sender' column: {has_sender}")
        print(f"  Has 'message_role' column: {has_message_role}")
        
        if has_sender and not has_message_role:
            print("\n🔄 Fixing table structure...")
            
            # Get current data
            cursor.execute("SELECT id, conversation_id, content, sender, message_type, created_at FROM messages")
            messages_data = cursor.fetchall()
            print(f"📊 Found {len(messages_data)} existing messages")
            
            # Create new table with correct schema
            cursor.execute("""
                CREATE TABLE messages_new (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    conversation_id INTEGER NOT NULL,
                    content TEXT NOT NULL,
                    message_role VARCHAR(50) NOT NULL,
                    message_type VARCHAR(50) DEFAULT 'text',
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (conversation_id) REFERENCES conversations(id)
                );
            """)
            
            # Copy data to new table
            if messages_data:
                cursor.executemany("""
                    INSERT INTO messages_new (id, conversation_id, content, message_role, message_type, created_at)
                    VALUES (?, ?, ?, ?, ?, ?)
                """, messages_data)
                print(f"✅ Copied {len(messages_data)} messages to new table")
            
            # Replace old table
            cursor.execute("DROP TABLE messages")
            cursor.execute("ALTER TABLE messages_new RENAME TO messages")
            
            # Commit changes
            conn.commit()
            print("✅ Table structure fixed successfully!")
            
        elif has_message_role and not has_sender:
            print("✅ Table already has correct structure!")
            
        elif has_sender and has_message_role:
            print("⚠️ Table has both columns - this shouldn't happen!")
            print("   Manual intervention may be required")
            
        else:
            print("❌ Unexpected table structure!")
            return False
        
        # Verify final structure
        cursor.execute("PRAGMA table_info(messages)")
        final_columns = cursor.fetchall()
        
        print(f"\n✅ Final table structure:")
        for col in final_columns:
            print(f"  {col[1]:15} {col[2]:12} NotNull: {col[3]} Default: {col[4]}")
        
        # Check message count
        cursor.execute("SELECT COUNT(*) FROM messages")
        count = cursor.fetchone()[0]
        print(f"\n📊 Final message count: {count}")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Error fixing messages table: {e}")
        if 'conn' in locals():
            conn.rollback()
            conn.close()
        return False

if __name__ == "__main__":
    print("🚀 Starting messages table fix...")
    print("=" * 50)
    
    success = fix_messages_table()
    
    if success:
        print("\n🎉 Messages table fix completed successfully!")
        print("✅ You can now test POST /chat/conversations/1/messages")
    else:
        print("\n❌ Messages table fix failed!")
        print("   Please check the error messages above")
    
    print("=" * 50) 