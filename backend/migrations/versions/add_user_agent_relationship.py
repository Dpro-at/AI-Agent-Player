"""add user agent relationship

Revision ID: add_user_agent_relationship
Revises: add_local_model_support
Create Date: 2024-01-16 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'add_user_agent_relationship'
down_revision = 'add_local_model_support'
branch_labels = None
depends_on = None

def upgrade():
    # Add foreign key constraint to agents table
    op.create_foreign_key(
        'fk_agents_user_id',
        'agents', 'users',
        ['user_id'], ['id'],
        ondelete='CASCADE'
    )

def downgrade():
    # Remove foreign key constraint
    op.drop_constraint('fk_agents_user_id', 'agents', type_='foreignkey') 