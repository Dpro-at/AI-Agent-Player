#!/usr/bin/env python3
"""
Final fix for messages table - work with current structure
"""
import sqlite3
import os

def fix_messages_final():
    """Fix messages table to work with current structure"""
    db_path = "./data/database.db"
    
    print("🔧 Final Messages Table Fix:")
    
    if not os.path.exists(db_path):
        print("❌ Database not found!")
        return
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Check current structure
        cursor.execute("PRAGMA table_info(messages)")
        columns = cursor.fetchall()
        column_names = [col[1] for col in columns]
        
        print("Current columns:", column_names)
        
        # Check if we need to add message_type column
        if 'message_type' not in column_names:
            print("🔄 Adding message_type column...")
            
            # Add message_type column with default 'text'
            cursor.execute("""
                ALTER TABLE messages 
                ADD COLUMN message_type VARCHAR(50) DEFAULT 'text'
            """)
            
            # Update existing rows to have message_type = 'text'
            cursor.execute("""
                UPDATE messages 
                SET message_type = 'text' 
                WHERE message_type IS NULL
            """)
            
            conn.commit()
            print("✅ Added message_type column successfully!")
        else:
            print("✅ message_type column already exists!")
        
        # Test insert with current structure
        print("\n🧪 Testing message insert:")
        test_conversation_id = 1
        test_content = "Test message - final fix"
        test_role = "user"
        
        try:
            cursor.execute("""
                INSERT INTO messages (
                    conversation_id, 
                    content, 
                    message_role, 
                    message_type,
                    content_type,
                    created_at
                ) VALUES (?, ?, ?, ?, ?, datetime('now'))
            """, (test_conversation_id, test_content, test_role, "text", "text"))
            
            conn.commit()
            print("✅ Test insert successful!")
            
            # Get the new message ID
            cursor.execute("SELECT id FROM messages WHERE content = ?", (test_content,))
            new_id = cursor.fetchone()
            if new_id:
                print(f"✅ New message ID: {new_id[0]}")
                
                # Clean up
                cursor.execute("DELETE FROM messages WHERE id = ?", (new_id[0],))
                conn.commit()
                print("🧹 Test message cleaned up")
            
        except Exception as e:
            print(f"❌ Test insert failed: {e}")
            conn.rollback()
        
        # Show final structure
        print("\n📋 Final messages table structure:")
        cursor.execute("PRAGMA table_info(messages)")
        final_columns = cursor.fetchall()
        for col in final_columns:
            if col[1] in ['id', 'conversation_id', 'content', 'message_role', 'message_type', 'content_type', 'created_at']:
                print(f"  {col[1]:15} {col[2]:15} NotNull:{col[3]} Default:{col[4]}")
        
    except Exception as e:
        print(f"❌ Final fix failed: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    fix_messages_final() 