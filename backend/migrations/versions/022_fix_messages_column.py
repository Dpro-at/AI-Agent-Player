"""Fix messages table column name

Revision ID: 022_fix_messages_column
Revises: 021_add_conversation_uuid
Create Date: 2025-07-21 19:45:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import text

# revision identifiers
revision = '022_fix_messages_column'
down_revision = '021_add_conversation_uuid'
branch_labels = None
depends_on = None


def upgrade():
    """Rename sender column to message_role in messages table"""
    connection = op.get_bind()
    
    try:
        # Check if messages table exists and has sender column
        result = connection.execute(text("PRAGMA table_info(messages)"))
        columns = result.fetchall()
        
        has_sender = any(col[1] == 'sender' for col in columns)
        has_message_role = any(col[1] == 'message_role' for col in columns)
        
        print(f"📋 Messages table analysis:")
        print(f"  Has 'sender' column: {has_sender}")
        print(f"  Has 'message_role' column: {has_message_role}")
        
        if has_sender and not has_message_role:
            print("🔄 Renaming 'sender' to 'message_role'...")
            
            # For SQLite, we need to recreate the table
            # 1. Create new table with correct schema
            connection.execute(text("""
                CREATE TABLE messages_new (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    conversation_id INTEGER NOT NULL,
                    content TEXT NOT NULL,
                    message_role VARCHAR(50) NOT NULL,
                    message_type VARCHAR(50) DEFAULT 'text',
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (conversation_id) REFERENCES conversations(id)
                );
            """))
            
            # 2. Copy data from old table to new table
            connection.execute(text("""
                INSERT INTO messages_new (id, conversation_id, content, message_role, message_type, created_at)
                SELECT id, conversation_id, content, sender, message_type, created_at
                FROM messages;
            """))
            
            # 3. Drop old table
            connection.execute(text("DROP TABLE messages;"))
            
            # 4. Rename new table
            connection.execute(text("ALTER TABLE messages_new RENAME TO messages;"))
            
            print("✅ Successfully renamed 'sender' to 'message_role'")
            
        elif has_message_role and not has_sender:
            print("✅ Table already has correct schema")
        elif has_sender and has_message_role:
            print("⚠️ Table has both columns - removing 'sender' column")
            # This shouldn't happen, but handle it
            connection.execute(text("ALTER TABLE messages DROP COLUMN sender;"))
        else:
            print("❌ Messages table has unexpected schema")
            
        # Commit the changes
        connection.commit()
        
    except Exception as e:
        print(f"❌ Error during messages table migration: {e}")
        connection.rollback()
        raise


def downgrade():
    """Rename message_role column back to sender"""
    connection = op.get_bind()
    
    try:
        # Create table with old schema
        connection.execute(text("""
            CREATE TABLE messages_old (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                conversation_id INTEGER NOT NULL,
                content TEXT NOT NULL,
                sender VARCHAR(50) NOT NULL,
                message_type VARCHAR(50) DEFAULT 'text',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (conversation_id) REFERENCES conversations(id)
            );
        """))
        
        # Copy data back
        connection.execute(text("""
            INSERT INTO messages_old (id, conversation_id, content, sender, message_type, created_at)
            SELECT id, conversation_id, content, message_role, message_type, created_at
            FROM messages;
        """))
        
        # Replace table
        connection.execute(text("DROP TABLE messages;"))
        connection.execute(text("ALTER TABLE messages_old RENAME TO messages;"))
        
        connection.commit()
        
    except Exception as e:
        print(f"❌ Error during downgrade: {e}")
        connection.rollback()
        raise 