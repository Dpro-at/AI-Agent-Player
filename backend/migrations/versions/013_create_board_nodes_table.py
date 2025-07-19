"""Create board_nodes table

Revision ID: 013
Revises: 012
Create Date: 2024-01-16 10:12:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import sqlite

# revision identifiers, used by Alembic.
revision = '013'
down_revision = '012'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create board_nodes table
    op.create_table('board_nodes',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('board_id', sa.String(length=36), nullable=False),
        sa.Column('node_type', sa.String(length=50), nullable=False),
        sa.Column('label', sa.String(length=200), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('position_x', sa.Float(), nullable=False),
        sa.Column('position_y', sa.Float(), nullable=False),
        sa.Column('width', sa.Integer(), nullable=False),
        sa.Column('height', sa.Integer(), nullable=False),
        sa.Column('color', sa.String(length=7), nullable=False),
        sa.Column('icon', sa.String(length=50), nullable=False),
        sa.Column('config', sqlite.JSON, nullable=True),
        sa.Column('input_schema', sqlite.JSON, nullable=True),
        sa.Column('output_schema', sqlite.JSON, nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('is_start_node', sa.Boolean(), nullable=False),
        sa.Column('is_end_node', sa.Boolean(), nullable=False),
        sa.Column('execution_order', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['board_id'], ['boards.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    # Drop board_nodes table
    op.drop_table('board_nodes') 