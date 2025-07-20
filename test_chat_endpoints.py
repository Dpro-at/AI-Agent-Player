#!/usr/bin/env python3
"""
Chat API Endpoints Test Script
Tests all Chat API endpoints to ensure they work after fixes
"""

import asyncio
import aiohttp
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"
TEST_EMAIL = "me@alarade.at"
TEST_PASSWORD = "password123"

class ChatAPITester:
    def __init__(self):
        self.access_token = None
        self.conversation_id = None
        self.session = None
        self.results = {
            "total": 0,
            "passed": 0,
            "failed": 0,
            "endpoints": {}
        }

    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()

    def log(self, message, level="INFO"):
        timestamp = datetime.now().strftime("%H:%M:%S")
        emoji = "✅" if level == "SUCCESS" else "❌" if level == "ERROR" else "🔍"
        print(f"[{timestamp}] {emoji} {message}")

    async def authenticate(self):
        """Test authentication and get access token"""
        self.log("Testing authentication...")
        
        try:
            async with self.session.post(f"{BASE_URL}/auth/login", json={
                "email": TEST_EMAIL,
                "password": TEST_PASSWORD
            }) as response:
                data = await response.json()
                
                if response.status == 200 and data.get("success"):
                    self.access_token = data["data"]["access_token"]
                    self.log(f"Authentication successful - User: {data['data']['user']['email']}", "SUCCESS")
                    return True
                else:
                    self.log(f"Authentication failed: {data.get('message', 'Unknown error')}", "ERROR")
                    return False
        except Exception as e:
            self.log(f"Authentication error: {str(e)}", "ERROR")
            return False

    async def api_call(self, method, endpoint, data=None):
        """Make API call with authentication"""
        headers = {}
        if self.access_token:
            headers["Authorization"] = f"Bearer {self.access_token}"

        url = f"{BASE_URL}{endpoint}"
        
        try:
            if method.upper() == "GET":
                async with self.session.get(url, headers=headers) as response:
                    return await self._process_response(response, method, endpoint)
            elif method.upper() == "POST":
                async with self.session.post(url, headers=headers, json=data) as response:
                    return await self._process_response(response, method, endpoint)
            elif method.upper() == "PUT":
                async with self.session.put(url, headers=headers, json=data) as response:
                    return await self._process_response(response, method, endpoint)
            elif method.upper() == "DELETE":
                async with self.session.delete(url, headers=headers) as response:
                    return await self._process_response(response, method, endpoint)
        except Exception as e:
            return {
                "success": False,
                "status": 0,
                "error": str(e),
                "data": None
            }

    async def _process_response(self, response, method, endpoint):
        """Process HTTP response"""
        try:
            data = await response.json()
            return {
                "success": response.status < 400,
                "status": response.status,
                "data": data,
                "error": None
            }
        except Exception as e:
            return {
                "success": False,
                "status": response.status,
                "error": f"JSON decode error: {str(e)}",
                "data": None
            }

    def update_results(self, test_name, success):
        """Update test results"""
        self.results["total"] += 1
        if success:
            self.results["passed"] += 1
        else:
            self.results["failed"] += 1
        self.results["endpoints"][test_name] = success

    async def test_get_conversations(self):
        """Test GET /chat/conversations"""
        self.log("Testing GET /chat/conversations...")
        
        result = await self.api_call("GET", "/chat/conversations")
        
        if result["success"]:
            count = len(result["data"]["data"]["conversations"]) if result["data"]["data"]["conversations"] else 0
            self.log(f"GET conversations: {result['status']} - Found {count} conversations", "SUCCESS")
            self.update_results("get_conversations", True)
            return True
        else:
            self.log(f"GET conversations failed: {result['status']} - {result.get('error', 'Unknown error')}", "ERROR")
            self.update_results("get_conversations", False)
            return False

    async def test_create_conversation(self):
        """Test POST /chat/conversations"""
        self.log("Testing POST /chat/conversations...")
        
        data = {
            "title": f"Test Conversation {datetime.now().strftime('%H:%M:%S')}",
            "agent_id": 1,
            "context_data": {
                "test": True,
                "created_at": datetime.now().isoformat()
            }
        }
        
        result = await self.api_call("POST", "/chat/conversations", data)
        
        if result["success"]:
            self.conversation_id = result["data"]["data"]["conversation_id"]
            self.log(f"CREATE conversation: {result['status']} - Created ID: {self.conversation_id}", "SUCCESS")
            self.update_results("create_conversation", True)
            return True
        else:
            self.log(f"CREATE conversation failed: {result['status']} - {result.get('error', 'Unknown error')}", "ERROR")
            if result["data"]:
                self.log(f"Response data: {json.dumps(result['data'], indent=2)}")
            self.update_results("create_conversation", False)
            return False

    async def test_get_conversation(self):
        """Test GET /chat/conversations/{id}"""
        if not self.conversation_id:
            # Try to get any conversation
            conversations_result = await self.api_call("GET", "/chat/conversations")
            if conversations_result["success"] and conversations_result["data"]["data"]["conversations"]:
                self.conversation_id = conversations_result["data"]["data"]["conversations"][0]["id"]

        if not self.conversation_id:
            self.log("No conversation ID available for testing", "ERROR")
            self.update_results("get_conversation", False)
            return False

        self.log(f"Testing GET /chat/conversations/{self.conversation_id}...")
        
        result = await self.api_call("GET", f"/chat/conversations/{self.conversation_id}")
        
        if result["success"]:
            self.log(f"GET conversation: {result['status']} - Retrieved conversation {self.conversation_id}", "SUCCESS")
            self.update_results("get_conversation", True)
            return True
        else:
            self.log(f"GET conversation failed: {result['status']} - {result.get('error', 'Unknown error')}", "ERROR")
            self.update_results("get_conversation", False)
            return False

    async def test_update_conversation(self):
        """Test PUT /chat/conversations/{id}"""
        if not self.conversation_id:
            self.log("No conversation ID available for testing", "ERROR")
            self.update_results("update_conversation", False)
            return False

        self.log(f"Testing PUT /chat/conversations/{self.conversation_id}...")
        
        data = {
            "title": f"Updated Test Conversation {datetime.now().strftime('%H:%M:%S')}",
            "context_data": {
                "updated": True,
                "updated_at": datetime.now().isoformat()
            }
        }
        
        result = await self.api_call("PUT", f"/chat/conversations/{self.conversation_id}", data)
        
        if result["success"]:
            self.log(f"UPDATE conversation: {result['status']} - Updated conversation {self.conversation_id}", "SUCCESS")
            self.update_results("update_conversation", True)
            return True
        else:
            self.log(f"UPDATE conversation failed: {result['status']} - {result.get('error', 'Unknown error')}", "ERROR")
            if result["data"]:
                self.log(f"Response data: {json.dumps(result['data'], indent=2)}")
            self.update_results("update_conversation", False)
            return False

    async def test_get_messages(self):
        """Test GET /chat/conversations/{id}/messages"""
        if not self.conversation_id:
            self.log("No conversation ID available for testing", "ERROR")
            self.update_results("get_messages", False)
            return False

        self.log(f"Testing GET /chat/conversations/{self.conversation_id}/messages...")
        
        result = await self.api_call("GET", f"/chat/conversations/{self.conversation_id}/messages")
        
        if result["success"]:
            count = len(result["data"]["data"]["messages"]) if result["data"]["data"]["messages"] else 0
            self.log(f"GET messages: {result['status']} - Found {count} messages", "SUCCESS")
            self.update_results("get_messages", True)
            return True
        else:
            self.log(f"GET messages failed: {result['status']} - {result.get('error', 'Unknown error')}", "ERROR")
            self.update_results("get_messages", False)
            return False

    async def test_send_message(self):
        """Test POST /chat/conversations/{id}/messages"""
        if not self.conversation_id:
            self.log("No conversation ID available for testing", "ERROR")
            self.update_results("send_message", False)
            return False

        self.log(f"Testing POST /chat/conversations/{self.conversation_id}/messages...")
        
        data = {
            "content": f"Test message sent at {datetime.now().strftime('%H:%M:%S')}",
            "sender_type": "user"
        }
        
        result = await self.api_call("POST", f"/chat/conversations/{self.conversation_id}/messages", data)
        
        if result["success"]:
            self.log(f"SEND message: {result['status']} - Message sent successfully", "SUCCESS")
            self.update_results("send_message", True)
            return True
        else:
            self.log(f"SEND message failed: {result['status']} - {result.get('error', 'Unknown error')}", "ERROR")
            if result["data"]:
                self.log(f"Response data: {json.dumps(result['data'], indent=2)}")
            self.update_results("send_message", False)
            return False

    async def test_delete_conversation(self):
        """Test DELETE /chat/conversations/{id}"""
        if not self.conversation_id:
            self.log("No conversation ID available for testing", "ERROR")
            self.update_results("delete_conversation", False)
            return False

        self.log(f"Testing DELETE /chat/conversations/{self.conversation_id}...")
        
        result = await self.api_call("DELETE", f"/chat/conversations/{self.conversation_id}")
        
        if result["success"]:
            self.log(f"DELETE conversation: {result['status']} - Conversation deleted successfully", "SUCCESS")
            self.update_results("delete_conversation", True)
            self.conversation_id = None  # Clear the ID
            return True
        else:
            self.log(f"DELETE conversation failed: {result['status']} - {result.get('error', 'Unknown error')}", "ERROR")
            self.update_results("delete_conversation", False)
            return False

    async def run_all_tests(self):
        """Run all Chat API tests"""
        self.log("🚀 Starting Chat API comprehensive test suite...")
        self.log("=" * 60)
        
        # Authenticate first
        if not await self.authenticate():
            self.log("❌ Authentication failed - cannot proceed with tests", "ERROR")
            return False

        # Run tests in sequence
        tests = [
            self.test_get_conversations,
            self.test_create_conversation,
            self.test_get_conversation,
            self.test_update_conversation,
            self.test_get_messages,
            self.test_send_message,
            self.test_delete_conversation
        ]

        for test in tests:
            await test()
            await asyncio.sleep(0.5)  # Small delay between tests

        # Print summary
        self.log("=" * 60)
        self.log("🎉 Chat API test suite completed!")
        self.log(f"📊 Results: {self.results['passed']}/{self.results['total']} tests passed")
        success_rate = (self.results['passed'] / self.results['total']) * 100 if self.results['total'] > 0 else 0
        self.log(f"📈 Success Rate: {success_rate:.1f}%")
        
        if self.results['failed'] > 0:
            self.log("❌ Failed endpoints:")
            for endpoint, success in self.results['endpoints'].items():
                if not success:
                    self.log(f"   - {endpoint}")
        
        return self.results['failed'] == 0

async def main():
    """Main test function"""
    print("🔧 AI Agent Player - Chat API Test Suite")
    print("=" * 60)
    
    async with ChatAPITester() as tester:
        success = await tester.run_all_tests()
        
        if success:
            print("\n✅ All tests passed! Chat API is working correctly.")
        else:
            print("\n❌ Some tests failed. Check the output above for details.")
        
        return success

if __name__ == "__main__":
    asyncio.run(main()) 