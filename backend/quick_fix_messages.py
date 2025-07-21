#!/usr/bin/env python3
"""
Quick and simple fix for messages table
"""
import sqlite3
import os

def quick_fix():
    """Quick fix for messages table"""
    db_path = "./data/database.db"
    
    print(f"🔧 Fixing database: {db_path}")
    
    if not os.path.exists(db_path):
        print("❌ Database not found!")
        return
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Check if column exists
        cursor.execute("PRAGMA table_info(messages)")
        columns = [col[1] for col in cursor.fetchall()]
        
        if 'sender' in columns and 'message_role' not in columns:
            print("🔄 Renaming sender to message_role...")
            
            # Get data
            cursor.execute("SELECT * FROM messages")
            data = cursor.fetchall()
            
            # Create new table
            cursor.execute("""
                CREATE TABLE messages_temp (
                    id INTEGER PRIMARY KEY,
                    conversation_id INTEGER NOT NULL,
                    content TEXT NOT NULL,
                    message_role VARCHAR(50) NOT NULL,
                    message_type VARCHAR(50) DEFAULT 'text',
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            # Copy data
            for row in data:
                cursor.execute("""
                    INSERT INTO messages_temp (id, conversation_id, content, message_role, message_type, created_at)
                    VALUES (?, ?, ?, ?, ?, ?)
                """, row)
            
            # Replace table
            cursor.execute("DROP TABLE messages")
            cursor.execute("ALTER TABLE messages_temp RENAME TO messages")
            
            conn.commit()
            print("✅ Fixed successfully!")
        else:
            print("✅ Already fixed or no fix needed!")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    quick_fix() 