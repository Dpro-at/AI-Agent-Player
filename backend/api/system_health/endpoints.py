"""
System Health API Endpoints
System health monitoring API endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import Dict, Any, List
import asyncio
import os
import sys
from datetime import datetime
from pathlib import Path

from core.dependencies import get_db, get_current_user
from models import User
from test.system_health_monitor import SystemHealthMonitor
from test.logs_manager import LogsManager

router = APIRouter(prefix="/system", tags=["system-health"])

@router.post("/health-check", response_model=Dict[str, Any])
async def run_health_check(
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    auto_cleanup: bool = True
):
    """
    Run comprehensive system health check with automatic cleanup
    """
    try:
        # Create system health monitor
        monitor = SystemHealthMonitor()
        
        # Clean up old files if requested (default: True)
        if auto_cleanup:
            logs_manager = LogsManager()
            cleanup_results = logs_manager.cleanup_all_categories(keep_files=1)
            print(f"🗑️ Auto-cleanup completed: {cleanup_results}")
        
        # Run health check
        results = await monitor.run_comprehensive_health_check()
        
        return {
            "success": True,
            "message": "System health check completed successfully",
            "data": results,
            "cleanup_performed": auto_cleanup
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error running system health check: {str(e)}"
        )

@router.get("/health-status", response_model=Dict[str, Any])
async def get_health_status(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get latest system health status
    """
    try:
        # Use logs manager to get latest health report
        logs_manager = LogsManager()
        latest_data = logs_manager.get_latest_log("system_health")
        
        if latest_data:
            return {
                "success": True,
                "message": "Health status loaded successfully",
                "data": latest_data
            }
        else:
            return {
                "success": False,
                "message": "No health check results found. Please run a new health check.",
                "data": None
            }
            
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error loading health status: {str(e)}"
        )

@router.get("/test-history", response_model=Dict[str, Any])
async def get_test_history(
    limit: int = 10,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get system test history
    """
    try:
        logs_manager = LogsManager()
        
        # Get system health logs
        health_logs = logs_manager.get_logs("system_health", limit)
        
        # Format test history
        test_history = []
        for log in health_logs:
            test_history.append({
                "timestamp": log.get("timestamp"),
                "health_score": log.get("health_score", 0),
                "recommendations_count": len(log.get("recommendations", [])),
                "api_success_rate": log.get("api_status", {}).get("success_rate", 0),
                "database_status": "connected" if log.get("database_info", {}).get("connection_test") else "disconnected",
                "system_status": "excellent" if log.get("health_score", 0) >= 80 else "good" if log.get("health_score", 0) >= 60 else "needs_improvement"
            })
        
        return {
            "success": True,
            "message": f"Loaded {len(test_history)} test records",
            "data": {
                "tests": test_history,
                "total": len(test_history)
            }
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error loading test history: {str(e)}"
        )

@router.get("/system-info", response_model=Dict[str, Any])
async def get_system_info(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get basic system information
    """
    try:
        import platform
        import psutil
        import pkg_resources
        
        # System information
        system_info = {
            "os": {
                "name": platform.system(),
                "version": platform.version(),
                "release": platform.release(),
                "machine": platform.machine(),
                "processor": platform.processor(),
            },
            "python": {
                "version": sys.version,
                "version_info": {
                    "major": sys.version_info.major,
                    "minor": sys.version_info.minor,
                    "micro": sys.version_info.micro
                },
                "executable": sys.executable,
                "platform": sys.platform,
            },
            "resources": {
                "memory": {
                    "total_gb": round(psutil.virtual_memory().total / (1024**3), 2),
                    "available_gb": round(psutil.virtual_memory().available / (1024**3), 2),
                    "used_percent": psutil.virtual_memory().percent
                },
                "cpu": {
                    "cores": psutil.cpu_count(),
                    "usage_percent": psutil.cpu_percent(interval=1)
                },
                "disk": {
                    "total_gb": round(psutil.disk_usage('/').total / (1024**3), 2),
                    "free_gb": round(psutil.disk_usage('/').free / (1024**3), 2),
                    "used_percent": round((psutil.disk_usage('/').used / psutil.disk_usage('/').total) * 100, 2)
                }
            }
        }
        
        # Installed packages (important ones only)
        important_packages = [
            "fastapi", "sqlalchemy", "alembic", "uvicorn", 
            "pydantic", "python-jose", "passlib", "requests"
        ]
        
        installed_packages = []
        for package in pkg_resources.working_set:
            if package.project_name.lower() in important_packages:
                installed_packages.append({
                    "name": package.project_name,
                    "version": package.version
                })
        
        system_info["packages"] = installed_packages
        
        return {
            "success": True,
            "message": "System information loaded successfully",
            "data": system_info
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error loading system information: {str(e)}"
        )

@router.get("/quick-status", response_model=Dict[str, Any])
async def get_quick_status(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get quick system status
    """
    try:
        import requests
        import psutil
        import sqlite3
        from pathlib import Path
        
        status = {
            "timestamp": datetime.now().isoformat(),
            "server_status": "unknown",
            "database_status": "unknown",
            "memory_usage": psutil.virtual_memory().percent,
            "cpu_usage": psutil.cpu_percent(),
            "disk_usage": psutil.disk_usage('/').percent,
            "health_score": 0
        }
        
        # Check server
        try:
            response = requests.get("http://localhost:8000/docs", timeout=3)
            status["server_status"] = "running" if response.status_code == 200 else "error"
        except:
            status["server_status"] = "offline"
        
        # Check database
        try:
            db_path = Path(__file__).parent.parent.parent / "data" / "database.db"
            if db_path.exists():
                conn = sqlite3.connect(str(db_path))
                cursor = conn.cursor()
                cursor.execute("SELECT COUNT(*) FROM sqlite_master WHERE type='table'")
                tables_count = cursor.fetchone()[0]
                conn.close()
                status["database_status"] = "connected"
                status["tables_count"] = tables_count
            else:
                status["database_status"] = "not_found"
        except:
            status["database_status"] = "error"
        
        # Quick score calculation
        score = 0
        if status["server_status"] == "running":
            score += 30
        if status["database_status"] == "connected":
            score += 30
        if status["memory_usage"] < 80:
            score += 20
        if status["cpu_usage"] < 80:
            score += 20
        
        status["health_score"] = score
        
        return {
            "success": True,
            "message": "Quick status loaded successfully",
            "data": status
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error loading quick status: {str(e)}"
        )

@router.get("/logs-summary", response_model=Dict[str, Any])
async def get_logs_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get summary of all log files
    """
    try:
        logs_manager = LogsManager()
        summary = logs_manager.get_logs_summary()
        
        return {
            "success": True,
            "message": "Logs summary loaded successfully",
            "data": summary
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error loading logs summary: {str(e)}"
        )

@router.delete("/clear-old-logs", response_model=Dict[str, Any])
async def clear_old_logs(
    category: str = "system_health",
    keep_days: int = 7,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Clear old log files
    """
    try:
        logs_manager = LogsManager()
        deleted_count = logs_manager.cleanup_old_logs(category, keep_days)
        
        return {
            "success": True,
            "message": f"Cleaned up {deleted_count} old {category} log files",
            "data": {"deleted_count": deleted_count, "category": category}
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error clearing old logs: {str(e)}"
        )

@router.post("/auto-cleanup", response_model=Dict[str, Any])
async def auto_cleanup_logs(
    keep_files: int = 1,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Automatically cleanup old log files, keeping only the most recent ones
    """
    try:
        logs_manager = LogsManager()
        
        # Cleanup all categories
        cleanup_results = logs_manager.cleanup_all_categories(keep_files=keep_files)
        
        total_deleted = sum(cleanup_results.values())
        
        return {
            "success": True,
            "message": f"Auto-cleanup completed successfully. {total_deleted} files deleted.",
            "data": {
                "cleanup_results": cleanup_results,
                "total_deleted": total_deleted,
                "keep_files": keep_files,
                "categories_cleaned": len([cat for cat, count in cleanup_results.items() if count > 0])
            }
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error during auto-cleanup: {str(e)}"
        )

@router.get("/simple-health", response_model=Dict[str, Any])
async def get_simple_health_status(
    current_user: User = Depends(get_current_user)
):
    """
    Get simplified system health status for regular users (non-developers)
    Returns user-friendly information without technical details
    """
    try:
        import psutil
        import sqlite3
        from pathlib import Path
        
        # Quick system info
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('/')
        cpu_percent = psutil.cpu_percent(interval=1)
        
        # Check database
        db_path = Path(__file__).parent.parent.parent / "data" / "database.db"
        database_connected = False
        features_count = 0
        
        try:
            if db_path.exists():
                conn = sqlite3.connect(str(db_path))
                cursor = conn.cursor()
                cursor.execute("SELECT COUNT(*) FROM sqlite_master WHERE type='table'")
                features_count = cursor.fetchone()[0]
                conn.close()
                database_connected = True
        except:
            database_connected = False
        
        # Calculate overall score
        memory_score = 100 - memory.percent
        disk_score = 100 - (disk.used / disk.total * 100)
        cpu_score = 100 - cpu_percent
        db_score = 100 if database_connected else 0
        
        overall_score = (memory_score + disk_score + cpu_score + db_score) / 4
        
        # Determine status
        if overall_score >= 80:
            status = "excellent"
        elif overall_score >= 60:
            status = "good"
        elif overall_score >= 40:
            status = "needs_attention"
        else:
            status = "offline"
        
        # Generate simple issues based on metrics
        issues = []
        
        if memory.percent > 80:
            issues.append({
                "type": "warning",
                "message": "Your computer's memory is almost full",
                "solution": "Close some programs you're not using to free up memory"
            })
        
        if (disk.used / disk.total * 100) > 90:
            issues.append({
                "type": "error", 
                "message": "Your storage space is almost full",
                "solution": "Delete some files or move them to external storage"
            })
        
        if cpu_percent > 90:
            issues.append({
                "type": "warning",
                "message": "Your processor is working very hard",
                "solution": "Close some programs to reduce the load on your computer"
            })
        
        if not database_connected:
            issues.append({
                "type": "error",
                "message": "AI system database is not connected",
                "solution": "Restart the application or contact support"
            })
        
        # Mock working features (in real implementation, check actual APIs)
        working_features = 8 if database_connected else 0
        
        return {
            "success": True,
            "data": {
                "overall_score": round(overall_score, 1),
                "system_status": status,
                "features_working": working_features,
                "total_features": 8,
                "memory_usage": round(memory.percent, 1),
                "storage_usage": round((disk.used / disk.total * 100), 1),
                "connection_status": database_connected,
                "last_check": datetime.utcnow().isoformat(),
                "issues": issues,
                "features_count": features_count,
                "user_friendly": True
            }
        }
        
    except Exception as e:
        print(f"Simple health check failed: {str(e)}")
        return {
            "success": False,
            "message": "Could not check system health",
            "error": str(e)
        }

# Setup system health routes
def setup_system_health_routes(app):
    """Setup system health routes"""
    app.include_router(router) 