"""Create agent_performance table

Revision ID: 007
Revises: 006
Create Date: 2024-01-16 10:06:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import sqlite

# revision identifiers, used by Alembic.
revision = '007'
down_revision = '006'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create agent_performance table
    op.create_table('agent_performance',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('agent_id', sa.Integer(), nullable=False),
        sa.Column('metric_name', sa.String(length=100), nullable=False),
        sa.Column('metric_value', sa.Float(), nullable=False),
        sa.Column('metric_type', sa.String(length=50), nullable=False),
        sa.Column('measurement_date', sa.DateTime(), nullable=False),
        sa.Column('context_data', sqlite.JSON, nullable=True),
        sa.ForeignKeyConstraint(['agent_id'], ['agents.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create indexes
    op.create_index(op.f('ix_agent_performance_id'), 'agent_performance', ['id'], unique=False)


def downgrade() -> None:
    # Drop indexes
    op.drop_index(op.f('ix_agent_performance_id'), table_name='agent_performance')
    
    # Drop agent_performance table
    op.drop_table('agent_performance') 