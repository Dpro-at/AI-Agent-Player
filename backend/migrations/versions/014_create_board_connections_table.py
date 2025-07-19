"""Create board_connections table

Revision ID: 014
Revises: 013
Create Date: 2024-01-16 10:13:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import sqlite

# revision identifiers, used by Alembic.
revision = '014'
down_revision = '013'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create board_connections table
    op.create_table('board_connections',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('board_id', sa.String(length=36), nullable=False),
        sa.Column('source_node_id', sa.String(length=36), nullable=False),
        sa.Column('target_node_id', sa.String(length=36), nullable=False),
        sa.Column('source_port', sa.String(length=50), nullable=True),
        sa.Column('target_port', sa.String(length=50), nullable=True),
        sa.Column('connection_type', sa.String(length=50), nullable=False),
        sa.Column('color', sa.String(length=7), nullable=False),
        sa.Column('style', sa.String(length=20), nullable=False),
        sa.Column('condition', sa.String(length=500), nullable=True),
        sa.Column('condition_config', sqlite.JSON, nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('execution_order', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['board_id'], ['boards.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['source_node_id'], ['board_nodes.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['target_node_id'], ['board_nodes.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    # Drop board_connections table
    op.drop_table('board_connections') 