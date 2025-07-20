"""Add conversation UUID column

Revision ID: 021_add_conversation_uuid
Revises: 020
Create Date: 2025-01-21 11:42:00.000000

"""

from alembic import op
import sqlalchemy as sa
import uuid
from sqlalchemy import text

# revision identifiers
revision = '021_add_conversation_uuid'
down_revision = '020'
branch_labels = None
depends_on = None

def upgrade():
    """Add UUID column to conversations table and populate existing records"""
    
    connection = op.get_bind()
    
    # Check if UUID column already exists
    try:
        result = connection.execute(text("PRAGMA table_info(conversations)"))
        columns = result.fetchall()
        uuid_exists = any(col[1] == 'uuid' for col in columns)
        
        if not uuid_exists:
            # Add UUID column only if it doesn't exist
            op.add_column('conversations', sa.Column('uuid', sa.String(36), nullable=True))
            print("✅ Added UUID column to conversations table")
            
            # Create unique index on UUID column
            op.create_index('ix_conversations_uuid', 'conversations', ['uuid'], unique=True)
            print("✅ Created unique index on UUID column")
        else:
            print("ℹ️ UUID column already exists, skipping column creation")
            
            # Check if index exists, create if not
            try:
                op.create_index('ix_conversations_uuid', 'conversations', ['uuid'], unique=True)
                print("✅ Created unique index on UUID column")
            except:
                print("ℹ️ Index already exists, skipping index creation")
        
        # Populate existing conversations with UUIDs if they don't have them
        result = connection.execute(text("SELECT id FROM conversations WHERE uuid IS NULL"))
        conversations = result.fetchall()
        
        if conversations:
            print(f"🔧 Found {len(conversations)} conversations without UUIDs, adding them...")
            
            # Add UUID to each conversation
            for conversation in conversations:
                new_uuid = str(uuid.uuid4())
                connection.execute(
                    text("UPDATE conversations SET uuid = :uuid WHERE id = :id"),
                    {"uuid": new_uuid, "id": conversation[0]}
                )
            
            print(f"✅ Added UUIDs to {len(conversations)} conversations")
        else:
            print("ℹ️ All conversations already have UUIDs")
            
    except Exception as e:
        print(f"❌ Error during migration: {e}")
        raise

def downgrade():
    """Remove UUID column from conversations table"""
    
    try:
        # Drop index first
        op.drop_index('ix_conversations_uuid', table_name='conversations')
        print("✅ Dropped UUID index")
    except:
        print("ℹ️ UUID index doesn't exist or already dropped")
    
    try:
        # Drop UUID column
        op.drop_column('conversations', 'uuid')
        print("✅ Removed UUID column from conversations table")
    except:
        print("ℹ️ UUID column doesn't exist or already removed") 