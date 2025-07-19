# Database Migrations

This directory contains all database migration files for the Agent Player project. Each table has its own migration file for better organization and control.

## Migration Files Structure

### Core User Management Tables
- `001_create_users_table.py` - Main users table
- `002_create_user_profiles_table.py` - User profile information
- `003_create_user_sessions_table.py` - User session management
- `004_create_activity_logs_table.py` - User activity tracking

### AI Agents System Tables
- `005_create_agents_table.py` - Main agents table
- `006_create_agent_capabilities_table.py` - Agent capabilities and skills
- `007_create_agent_performance_table.py` - Agent performance metrics

### Communication System Tables
- `008_create_conversations_table.py` - Chat conversations
- `009_create_messages_table.py` - Individual messages
- `011_create_chat_session_history_table.py` - Chat session tracking

### Task Management Tables
- `010_create_tasks_table.py` - Task management

### Board System Tables (Workflow Management)
- `012_create_boards_table.py` - Visual workflow boards
- `013_create_board_nodes_table.py` - Board elements/nodes
- `014_create_board_connections_table.py` - Connections between nodes
- `015_create_board_executions_table.py` - Workflow execution tracking
- `016_create_board_templates_table.py` - Predefined board templates

### System Tables
- `017_create_notifications_table.py` - System notifications
- `018_create_user_analytics_table.py` - User behavior analytics
- `019_create_system_analytics_table.py` - System performance analytics
- `020_create_system_settings_table.py` - Application configuration

## How to Run Migrations

### 1. Install Alembic (if not already installed)
```bash
cd backend
pip install alembic==1.13.1
```

### 2. Initialize Alembic (if not already done)
```bash
alembic init migrations
```

### 3. Run all migrations
```bash
alembic upgrade head
```

### 4. Run specific migration
```bash
alembic upgrade 010  # Run up to migration 010
```

### 5. Rollback migrations
```bash
alembic downgrade -1  # Rollback one migration
alembic downgrade base  # Rollback all migrations
```

## Migration Order

The migrations are designed to run in sequence:
1. Users table first (001)
2. User-related tables (002-004)
3. Agents tables (005-007)
4. Communication tables (008-009, 011)
5. Tasks table (010)
6. Board system tables (012-016)
7. System tables (017-020)

## Database Schema Overview

### Total Tables: 20
- **User Management**: 4 tables
- **AI Agents**: 3 tables
- **Communication**: 3 tables
- **Task Management**: 1 table
- **Board System**: 5 tables
- **System**: 4 tables

## Benefits of Separate Migration Files

1. **Better Organization**: Each table has its own migration file
2. **Easier Debugging**: Can identify which table creation failed
3. **Selective Rollback**: Can rollback specific tables if needed
4. **Version Control**: Each table change is tracked separately
5. **Team Collaboration**: Multiple developers can work on different tables
6. **Testing**: Can test individual table creation

## Migration Best Practices

1. **Always backup database** before running migrations
2. **Test migrations** in development environment first
3. **Review migration files** before running in production
4. **Use descriptive names** for migration files
5. **Include proper foreign key constraints**
6. **Add appropriate indexes** for performance
7. **Handle data types correctly** (especially JSON fields)

## Troubleshooting

### Common Issues:
1. **Foreign Key Errors**: Make sure referenced tables exist
2. **Column Type Mismatches**: Check data types match model definitions
3. **Index Conflicts**: Ensure unique constraints are properly defined
4. **SQLite JSON Support**: Use `sqlite.JSON` for JSON columns

### Solutions:
1. **Check migration order**: Ensure dependencies are created first
2. **Verify model definitions**: Match column types exactly
3. **Test migrations**: Run in test environment first
4. **Review error messages**: Check Alembic output for specific issues

## Next Steps

After running all migrations:
1. Verify all tables were created correctly
2. Test database connections
3. Run application tests
4. Check API endpoints work with new schema
5. Update documentation if needed

## Migration Status

- ✅ All migration files created
- ✅ Proper foreign key relationships defined
- ✅ Indexes and constraints included
- ✅ SQLite JSON support configured
- ✅ Sequential migration order established 