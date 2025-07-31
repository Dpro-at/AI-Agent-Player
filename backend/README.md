# Backend Directory - DPRO AI Agent

This directory contains all backend code for the DPRO AI Agent Player system.

## Structure

- `api/`         - FastAPI endpoints (organized by module)
- `core/`        - Core framework and dependencies
- `models/`      - Database models (SQLAlchemy)
- `schemas/`     - Pydantic schemas for validation
- `services/`    - Business logic and service layer
- `config/`      - Configuration and database settings
- `test/`        - All backend tests (unit, integration, database)
- `migrations/`  - Database migration scripts (Alembic)
- `logs/`        - Log files (runtime logs)
- `files/`       - File uploads and static files
- `data/`        - (Optional) Data files for initialization or import

## How to Run Backend

1. Change to the backend directory:
   ```bash
   pip install -r requirements.txt
   ```
2. Run the FastAPI server:
   ```bash
   ./env/scripts/activate

   or 

   .\.venv\Scripts\Activate.ps1
   
   ```
3. Run the FastAPI server:
   ```bash
   python main.py
   ```

   
3. API docs available at: `http://localhost:8000/docs`

## Rules & Conventions
- All code, comments, and file names must be in English only.
- All test files must be in `/backend/test/` only.
- No temporary or experimental files allowed in this directory.
- Official documentation is in the `/docs/` directory.

---
For more details, see the main project README.md and `/docs/`. 