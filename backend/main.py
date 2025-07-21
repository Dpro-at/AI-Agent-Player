"""
FastAPI Main Application
Agent Player Backend Server
"""

import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from sqlalchemy import text

# Import routers
from api.auth import endpoints as auth_endpoints
from api.users import endpoints as users_endpoints
from api.agents import endpoints as agents_endpoints
from api.chat import endpoints as chat_endpoints
from api.tasks import endpoints as task_endpoints
from api.licensing import endpoints as licensing_endpoints
from api.training_lab import endpoints as training_lab_endpoints
from api.marketplace import endpoints as marketplace_endpoints
from api.formbuilder import endpoints as formbuilder_endpoints
from api.boards import endpoints as boards_endpoints
from api.notifications import endpoints as notifications_endpoints
from api.activity_logs import endpoints as activity_logs_endpoints
from api.agent_capabilities import endpoints as agent_capabilities_endpoints
from api.agent_performance import endpoints as agent_performance_endpoints
from api.system_analytics import endpoints as system_analytics_endpoints
from api.system_health import endpoints as system_health_endpoints
from api.system_settings import endpoints as system_settings_endpoints
from api.user_analytics import endpoints as user_analytics_endpoints

# Import database
from models.database import Base
from config.database import async_engine, AsyncSessionLocal  # FIXED: Import AsyncSessionLocal from config.database too

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ADDED: Database initialization function
async def initialize_database():
    """Initialize database and ensure all tables exist"""
    try:
        logger.info("🔧 Initializing database...")
        
        async with async_engine.begin() as conn:
            # Create all tables
            await conn.run_sync(Base.metadata.create_all)
            
            # Ensure messages table exists with correct schema
            await conn.execute(text("""
                CREATE TABLE IF NOT EXISTS messages (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    conversation_id INTEGER NOT NULL,
                    content TEXT NOT NULL,
                    message_role VARCHAR(50) NOT NULL,
                    message_type VARCHAR(50) DEFAULT 'text',
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (conversation_id) REFERENCES conversations(id)
                );
            """))
            
            await conn.commit()
            logger.info("✅ Database schema initialized")
            
    except Exception as schema_error:
        logger.warning(f"Database schema warning: {schema_error}")

    try:
        async with async_engine.begin() as conn:
            await conn.commit()
            logger.info("✅ Database initialized successfully")
            
    except Exception as e:
        logger.error(f"❌ Database initialization error: {e}")

# Application lifespan manager
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("🚀 Starting AI Agent Player Backend...")
    await initialize_database()
    yield
    # Shutdown
    logger.info("🛑 Shutting down AI Agent Player Backend...")

# Create FastAPI application with lifespan
app = FastAPI(
    title="AI Agent Player API",
    description="Advanced AI Agent Management Platform",
    version="2.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(auth_endpoints.router, prefix="/auth", tags=["Authentication"])
app.include_router(users_endpoints.router, prefix="/users", tags=["Users"])
app.include_router(agents_endpoints.router, prefix="/agents", tags=["Agents"])
app.include_router(chat_endpoints.router, prefix="/chat", tags=["Chat"])
app.include_router(task_endpoints.router, prefix="/task/tasks", tags=["Tasks"])
app.include_router(licensing_endpoints.router, prefix="/license/licensing", tags=["Licensing"])
app.include_router(training_lab_endpoints.router, prefix="/training/training-lab", tags=["Training Lab"])
app.include_router(marketplace_endpoints.router, prefix="/market/marketplace", tags=["Marketplace"])
app.include_router(formbuilder_endpoints.router, prefix="/api/formbuilder", tags=["Form Builder"])
app.include_router(boards_endpoints.router, prefix="/api/boards", tags=["Boards"])
app.include_router(notifications_endpoints.router, prefix="/api/notifications", tags=["Notifications"])
app.include_router(activity_logs_endpoints.router, prefix="/api/activity-logs", tags=["Activity Logs"])
app.include_router(agent_capabilities_endpoints.router, prefix="/api/agent-capabilities", tags=["Agent Capabilities"])
app.include_router(agent_performance_endpoints.router, prefix="/api/agent-performance", tags=["Agent Performance"])
app.include_router(system_analytics_endpoints.router, prefix="/api/system-analytics", tags=["System Analytics"])
app.include_router(system_health_endpoints.router, prefix="/api/system-health", tags=["System Health"])
app.include_router(system_settings_endpoints.router, prefix="/api/system-settings", tags=["System Settings"])
app.include_router(user_analytics_endpoints.router, prefix="/api/user-analytics", tags=["User Analytics"])

# Health check endpoint
@app.get("/health")
async def health_check():
    """System health check"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat()
    }

# System status endpoint
@app.get("/system/status")
async def system_status():
    """Detailed system status"""
    return {
        "status": "operational",
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "debug_mode": settings.DEBUG,
        "timestamp": datetime.utcnow().isoformat()
    }

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "AI Agent Player API",
        "version": "2.0.0",
        "status": "running",
        "docs": "/docs"
    }

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler"""
    logger.error(f"Global exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"message": "Internal server error", "detail": str(exc)}
    )

# Run server
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    ) 