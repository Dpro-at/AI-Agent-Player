"""Create system_analytics table

Revision ID: 019
Revises: 018
Create Date: 2024-01-16 10:18:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import sqlite

# revision identifiers, used by Alembic.
revision = '019'
down_revision = '018'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create system_analytics table
    op.create_table('system_analytics',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('metric_name', sa.String(length=100), nullable=False),
        sa.Column('metric_value', sa.Float(), nullable=False),
        sa.Column('metric_type', sa.String(length=50), nullable=False),
        sa.Column('metric_unit', sa.String(length=20), nullable=True),
        sa.Column('component', sa.String(length=50), nullable=False),
        sa.Column('environment', sa.String(length=20), nullable=False),
        sa.Column('extra_data', sqlite.JSON, nullable=True),
        sa.Column('tags', sqlite.JSON, nullable=True),
        sa.Column('timestamp', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create indexes
    op.create_index(op.f('ix_system_analytics_id'), 'system_analytics', ['id'], unique=False)


def downgrade() -> None:
    # Drop indexes
    op.drop_index(op.f('ix_system_analytics_id'), table_name='system_analytics')
    
    # Drop system_analytics table
    op.drop_table('system_analytics') 