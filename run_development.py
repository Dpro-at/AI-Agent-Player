#!/usr/bin/env python3
"""
AI Agent Player - Development Runner
Main entry point for development tasks and testing

Location: /run_development.py (project root)
Compliance: Following project rules - organized testing structure
Usage: python run_development.py [command]
"""

import os
import sys
import subprocess
import argparse
from pathlib import Path

class DevelopmentRunner:
    def __init__(self):
        """Initialize development runner"""
        self.project_root = Path(__file__).parent
        self.backend_path = self.project_root / "backend"
        self.test_path = self.backend_path / "test"
        
    def activate_venv(self):
        """Check if virtual environment is activated"""
        venv_path = self.backend_path / ".venv" / "Scripts" / "activate"
        if not venv_path.exists():
            print("❌ Virtual environment not found!")
            print(f"Expected: {venv_path}")
            return False
        return True
    
    def run_server(self):
        """Run the main backend server"""
        print("🚀 Starting AI Agent Player Backend Server")
        print("=" * 50)
        
        if not self.activate_venv():
            return
        
        try:
            os.chdir(self.backend_path)
            print(f"📁 Working directory: {self.backend_path}")
            print("🌐 Server will start at: http://localhost:8000")
            print("📚 API Docs will be at: http://localhost:8000/docs")
            print("🔄 Starting server...")
            
            # Run the server
            result = subprocess.run([
                str(self.backend_path / ".venv" / "Scripts" / "python.exe"),
                "main.py"
            ], cwd=self.backend_path)
            
        except KeyboardInterrupt:
            print("\n⏹️  Server stopped by user")
        except Exception as e:
            print(f"❌ Error starting server: {e}")
    
    def run_tests(self, category=None, test=None):
        """Run organized tests following project rules"""
        print("🧪 Running Organized Tests")
        print("=" * 40)
        print("✅ Following project rules: All tests in /backend/test/")
        
        if not self.activate_venv():
            return
        
        try:
            os.chdir(self.test_path)
            
            if category and test:
                cmd = [
                    str(self.backend_path / ".venv" / "Scripts" / "python.exe"),
                    "run_tests.py", "--category", category, "--test", test
                ]
            elif category:
                cmd = [
                    str(self.backend_path / ".venv" / "Scripts" / "python.exe"),
                    "run_tests.py", "--category", category, "--run-all"
                ]
            else:
                cmd = [
                    str(self.backend_path / ".venv" / "Scripts" / "python.exe"),
                    "quick_test.py", "suite"
                ]
            
            print(f"💾 Command: {' '.join(cmd)}")
            result = subprocess.run(cmd, cwd=self.test_path)
            
        except Exception as e:
            print(f"❌ Error running tests: {e}")
    
    def quick_health_check(self):
        """Quick development health check"""
        print("🔍 Quick Development Health Check")
        print("=" * 40)
        
        if not self.activate_venv():
            return
        
        try:
            os.chdir(self.test_path)
            result = subprocess.run([
                str(self.backend_path / ".venv" / "Scripts" / "python.exe"),
                "quick_test.py", "health"
            ], cwd=self.test_path)
            
        except Exception as e:
            print(f"❌ Error running health check: {e}")
    
    def show_project_structure(self):
        """Show organized project structure"""
        print("\n📁 AI Agent Player Project Structure")
        print("=" * 50)
        print("✅ Following project rules and standards")
        print()
        print("📂 Project Root")
        print("├── backend/")
        print("│   ├── main.py                    # ✅ Main application")
        print("│   ├── api/                       # ✅ API endpoints")
        print("│   ├── models/                    # ✅ Database models")
        print("│   ├── services/                  # ✅ Business logic")
        print("│   ├── data/database.db           # ✅ Database file")
        print("│   ├── migrations/                # ✅ Database migrations")
        print("│   └── test/                      # ✅ ALL TESTS HERE")
        print("│       ├── database/              # ✅ Database testing")
        print("│       ├── api/                   # ✅ API testing")
        print("│       ├── integration/           # ✅ Integration testing")
        print("│       ├── performance/           # ✅ Performance testing")
        print("│       ├── run_tests.py           # ✅ Main test runner")
        print("│       └── quick_test.py          # ✅ Quick testing")
        print("├── frontend/")
        print("│   └── [React frontend files]")
        print("├── .cursor/rules/")
        print("│   └── [Project rules and standards]")
        print("└── run_development.py             # ✅ This file")
        print()
        print("🚨 CRITICAL COMPLIANCE:")
        print("   ✅ All test files in /backend/test/ subdirectories")
        print("   ✅ No test files in project root")
        print("   ✅ English-only documentation")
        print("   ✅ Organized by functionality")
    
    def interactive_menu(self):
        """Interactive development menu"""
        while True:
            print("\n🚀 AI Agent Player Development Menu")
            print("=" * 50)
            print("1. Start backend server")
            print("2. Quick health check")
            print("3. Run database tests")
            print("4. Run API tests")
            print("5. Run all tests")
            print("6. Show project structure")
            print("7. Show test categories")
            print("0. Exit")
            
            try:
                choice = input("\n🎯 Select option (0-7): ").strip()
                
                if choice == '0':
                    print("👋 Goodbye!")
                    break
                elif choice == '1':
                    self.run_server()
                elif choice == '2':
                    self.quick_health_check()
                elif choice == '3':
                    self.run_tests("database")
                elif choice == '4':
                    self.run_tests("api")
                elif choice == '5':
                    self.run_tests()
                elif choice == '6':
                    self.show_project_structure()
                elif choice == '7':
                    self.show_test_categories()
                else:
                    print("❌ Invalid choice!")
                    
            except KeyboardInterrupt:
                print("\n👋 Goodbye!")
                break
            except Exception as e:
                print(f"❌ Error: {e}")
    
    def show_test_categories(self):
        """Show available test categories"""
        print("\n🧪 Available Test Categories")
        print("=" * 40)
        print("📁 Database Testing (/backend/test/database/)")
        print("   ├── database_validator.py     # Complete DB health validation")
        print("   ├── migration_tracker.py      # Migration monitoring")
        print("   └── db_test_manager.py        # Combined test interface")
        print()
        print("📁 API Testing (/backend/test/api/)")
        print("   ├── test_chat_workflow.py     # Chat system testing")
        print("   ├── test_chat_system_complete.py # Complete chat tests")
        print("   └── simple_agents_test.py     # Agent functionality")
        print()
        print("📁 Integration Testing (/backend/test/integration/)")
        print("   └── (Future integration tests)")
        print()
        print("📁 Performance Testing (/backend/test/performance/)")
        print("   └── (Future performance tests)")
        print()
        print("🎯 Quick Commands:")
        print("   python run_development.py health")
        print("   python run_development.py test database")
        print("   python run_development.py test api")
        print("   python run_development.py server")

def main():
    """Main function with command line interface"""
    parser = argparse.ArgumentParser(
        description="AI Agent Player Development Runner",
        epilog="Examples:\n"
               "  python run_development.py server\n"
               "  python run_development.py health\n"
               "  python run_development.py test database\n"
               "  python run_development.py test api\n"
               "  python run_development.py structure",
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    
    parser.add_argument("command", nargs='?', 
                       choices=['server', 'health', 'test', 'structure', 'menu'],
                       help="Development command to run")
    parser.add_argument("category", nargs='?',
                       choices=['database', 'api', 'integration', 'performance'],
                       help="Test category (use with 'test' command)")
    parser.add_argument("test_name", nargs='?',
                       help="Specific test name (use with 'test' command)")
    
    args = parser.parse_args()
    
    runner = DevelopmentRunner()
    
    if args.command == 'server':
        runner.run_server()
    elif args.command == 'health':
        runner.quick_health_check()
    elif args.command == 'test':
        runner.run_tests(args.category, args.test_name)
    elif args.command == 'structure':
        runner.show_project_structure()
    elif args.command == 'menu':
        runner.interactive_menu()
    else:
        # Default to interactive menu
        print("🚀 AI Agent Player Development Runner")
        print("✅ Following project rules and standards")
        print("📁 All tests organized in /backend/test/ subdirectories")
        runner.interactive_menu()

if __name__ == "__main__":
    main() 