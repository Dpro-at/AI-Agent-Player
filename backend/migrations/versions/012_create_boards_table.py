"""Create boards table

Revision ID: 012
Revises: 011
Create Date: 2024-01-16 10:11:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import sqlite

# revision identifiers, used by Alembic.
revision = '012'
down_revision = '011'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create boards table
    op.create_table('boards',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('name', sa.String(length=200), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('agent_id', sa.Integer(), nullable=True),
        sa.Column('board_type', sa.String(length=50), nullable=False),
        sa.Column('status', sa.String(length=20), nullable=False),
        sa.Column('visibility', sa.String(length=20), nullable=False),
        sa.Column('zoom_level', sa.Float(), nullable=False),
        sa.Column('pan_x', sa.Float(), nullable=False),
        sa.Column('pan_y', sa.Float(), nullable=False),
        sa.Column('connection_type', sa.String(length=20), nullable=False),
        sa.Column('theme', sa.String(length=20), nullable=False),
        sa.Column('board_data', sqlite.JSON, nullable=True),
        sa.Column('settings', sqlite.JSON, nullable=True),
        sa.Column('is_executable', sa.Boolean(), nullable=False),
        sa.Column('execution_count', sa.Integer(), nullable=False),
        sa.Column('last_execution', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['agent_id'], ['agents.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    # Drop boards table
    op.drop_table('boards') 