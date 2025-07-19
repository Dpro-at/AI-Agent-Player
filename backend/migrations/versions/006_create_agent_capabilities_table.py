"""Create agent_capabilities table

Revision ID: 006
Revises: 005
Create Date: 2024-01-16 10:05:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import sqlite

# revision identifiers, used by Alembic.
revision = '006'
down_revision = '005'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create agent_capabilities table
    op.create_table('agent_capabilities',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('agent_id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=200), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('capability_type', sa.String(length=50), nullable=False),
        sa.Column('proficiency_level', sa.Float(), nullable=False),
        sa.Column('configuration', sqlite.JSON, nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['agent_id'], ['agents.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create indexes
    op.create_index(op.f('ix_agent_capabilities_id'), 'agent_capabilities', ['id'], unique=False)


def downgrade() -> None:
    # Drop indexes
    op.drop_index(op.f('ix_agent_capabilities_id'), table_name='agent_capabilities')
    
    # Drop agent_capabilities table
    op.drop_table('agent_capabilities') 