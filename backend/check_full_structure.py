#!/usr/bin/env python3
"""
Check complete database structure
"""
import sqlite3
import os

def check_full_structure():
    """Check complete database structure"""
    db_path = "./data/database.db"
    
    print("🔍 Complete Database Structure Analysis:")
    
    if not os.path.exists(db_path):
        print("❌ Database not found!")
        return
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Get all tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = cursor.fetchall()
        
        print(f"\n📋 Found {len(tables)} tables:")
        for table in tables:
            print(f"  - {table[0]}")
        
        # Check messages table specifically
        print("\n🔍 MESSAGES Table Structure:")
        cursor.execute("PRAGMA table_info(messages)")
        columns = cursor.fetchall()
        
        if columns:
            print("Current columns:")
            for col in columns:
                print(f"  {col[1]:15} {col[2]:15} NotNull:{col[3]} Default:{col[4]}")
        else:
            print("❌ Messages table not found or empty!")
        
        # Show what the correct structure should be
        print("\n✅ Expected Messages Table Structure:")
        expected_columns = [
            ("id", "INTEGER", "PRIMARY KEY"),
            ("conversation_id", "INTEGER", "NOT NULL"),
            ("content", "TEXT", "NOT NULL"), 
            ("message_role", "VARCHAR(50)", "NOT NULL"),
            ("message_type", "VARCHAR(50)", "DEFAULT 'text'"),
            ("created_at", "DATETIME", "DEFAULT CURRENT_TIMESTAMP")
        ]
        
        for col in expected_columns:
            print(f"  {col[0]:15} {col[1]:15} {col[2]}")
        
        # Check which columns are missing
        current_column_names = [col[1] for col in columns]
        expected_column_names = [col[0] for col in expected_columns]
        
        missing_columns = []
        for expected in expected_column_names:
            if expected not in current_column_names:
                missing_columns.append(expected)
        
        if missing_columns:
            print(f"\n❌ Missing columns: {', '.join(missing_columns)}")
        else:
            print("\n✅ All expected columns present!")
            
    except Exception as e:
        print(f"❌ Database check failed: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    check_full_structure() 