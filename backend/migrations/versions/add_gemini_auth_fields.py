"""add gemini auth fields

Revision ID: add_gemini_auth_fields
Revises: previous_revision
Create Date: 2024-01-16 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'add_gemini_auth_fields'
down_revision = 'previous_revision'
branch_labels = None
depends_on = None

def upgrade() -> None:
    # Add Gemini authentication fields
    op.add_column('users', sa.Column('gemini_auth', sa.JSON(), nullable=True))
    op.add_column('users', sa.Column('gemini_api_key', sa.String(), nullable=True))
    op.add_column('users', sa.Column('gemini_auth_type', sa.String(), nullable=True))

def downgrade() -> None:
    # Remove Gemini authentication fields
    op.drop_column('users', 'gemini_auth')
    op.drop_column('users', 'gemini_api_key')
    op.drop_column('users', 'gemini_auth_type') 