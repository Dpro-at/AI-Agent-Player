"""
System Health API Module
وحدة API فحص صحة النظام
"""

from .endpoints import router, setup_system_health_routes

__all__ = ["router", "setup_system_health_routes"] 