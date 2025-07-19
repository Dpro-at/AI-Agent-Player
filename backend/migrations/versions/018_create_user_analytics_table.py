"""Create user_analytics table

Revision ID: 018
Revises: 017
Create Date: 2024-01-16 10:17:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import sqlite

# revision identifiers, used by Alembic.
revision = '018'
down_revision = '017'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create user_analytics table
    op.create_table('user_analytics',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('event_type', sa.String(length=50), nullable=False),
        sa.Column('event_category', sa.String(length=50), nullable=False),
        sa.Column('event_data', sqlite.JSON, nullable=True),
        sa.Column('session_id', sa.String(length=50), nullable=True),
        sa.Column('page_url', sa.String(length=500), nullable=True),
        sa.Column('referrer', sa.String(length=500), nullable=True),
        sa.Column('user_agent', sa.String(length=1000), nullable=True),
        sa.Column('ip_address', sa.String(length=45), nullable=True),
        sa.Column('location_data', sqlite.JSON, nullable=True),
        sa.Column('device_info', sqlite.JSON, nullable=True),
        sa.Column('timestamp', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create indexes
    op.create_index(op.f('ix_user_analytics_id'), 'user_analytics', ['id'], unique=False)


def downgrade() -> None:
    # Drop indexes
    op.drop_index(op.f('ix_user_analytics_id'), table_name='user_analytics')
    
    # Drop user_analytics table
    op.drop_table('user_analytics') 