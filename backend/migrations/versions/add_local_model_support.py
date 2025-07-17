"""add local model support

Revision ID: add_local_model_support
Revises: previous_revision
Create Date: 2024-01-16 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'add_local_model_support'
down_revision = 'previous_revision'
branch_labels = None
depends_on = None

def upgrade():
    # Add new columns for local model support
    op.add_column('agents', sa.Column('is_local_model', sa.Boolean(), nullable=False, server_default='false'))
    op.add_column('agents', sa.Column('local_config', sa.JSON(), nullable=True))

def downgrade():
    # Remove columns added for local model support
    op.drop_column('agents', 'local_config')
    op.drop_column('agents', 'is_local_model') 