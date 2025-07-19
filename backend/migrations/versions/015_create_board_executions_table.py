"""Create board_executions table

Revision ID: 015
Revises: 014
Create Date: 2024-01-16 10:14:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import sqlite

# revision identifiers, used by Alembic.
revision = '015'
down_revision = '014'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create board_executions table
    op.create_table('board_executions',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('board_id', sa.String(length=36), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('status', sa.String(length=20), nullable=False),
        sa.Column('execution_type', sa.String(length=50), nullable=False),
        sa.Column('trigger_data', sqlite.JSON, nullable=True),
        sa.Column('total_nodes', sa.Integer(), nullable=False),
        sa.Column('completed_nodes', sa.Integer(), nullable=False),
        sa.Column('failed_nodes', sa.Integer(), nullable=False),
        sa.Column('execution_time_ms', sa.Integer(), nullable=True),
        sa.Column('result_data', sqlite.JSON, nullable=True),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('execution_log', sqlite.JSON, nullable=True),
        sa.Column('started_at', sa.DateTime(), nullable=False),
        sa.Column('completed_at', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['board_id'], ['boards.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    # Drop board_executions table
    op.drop_table('board_executions') 