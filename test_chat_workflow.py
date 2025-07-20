#!/usr/bin/env python3
"""
🧪 CHAT WORKFLOW TEST
Tests: Login → Create Conversation → Send Message → AI Response
Uses known Agent ID (26) - qwen2.5vl:7b
"""

import requests
import json
import time

# Configuration
BASE_URL = "http://localhost:8000"
ADMIN_EMAIL = "me@alarade.at"
ADMIN_PASSWORD = "admin123456"
TEST_AGENT_ID = 26  # qwen2.5vl:7b from the previous test

class ChatWorkflowTester:
    def __init__(self):
        self.base_url = BASE_URL
        self.token = None
        self.user_id = None
        self.test_conversation_id = None
        
    def login_admin(self):
        """Login as admin user"""
        print("🔐 Logging in as admin...")
        
        login_data = {
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        }
        
        response = requests.post(f"{self.base_url}/auth/login", json=login_data)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success") and data.get("data"):
                self.token = data["data"]["access_token"]
                self.user_id = data["data"]["user"]["id"]
                print(f"✅ Login successful! User ID: {self.user_id}")
                return True
            else:
                print(f"❌ Login failed: {data}")
                return False
        else:
            print(f"❌ Login failed with status {response.status_code}: {response.text}")
            return False
    
    def get_auth_headers(self):
        """Get authentication headers"""
        return {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }
    
    def test_create_conversation(self):
        """Test creating a new conversation with Agent 26"""
        print(f"\n💬 Testing Create Conversation with Agent {TEST_AGENT_ID}...")
        
        conversation_data = {
            "title": "Chat Workflow Test",
            "description": "Testing chat with qwen2.5vl:7b",
            "agent_id": TEST_AGENT_ID
        }
        
        response = requests.post(
            f"{self.base_url}/chat/conversations", 
            json=conversation_data,
            headers=self.get_auth_headers()
        )
        
        print(f"🔍 Response Status: {response.status_code}")
        print(f"🔍 Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success") and data.get("data"):
                conversation_data = data["data"]
                
                # Handle different response formats
                if "conversation_id" in conversation_data:
                    # Backend returns {"conversation_id": 33}
                    self.test_conversation_id = conversation_data["conversation_id"]
                    print(f"✅ Conversation created successfully!")
                    print(f"📋 Conversation ID: {self.test_conversation_id}")
                    return True
                elif "id" in conversation_data:
                    # Backend returns full conversation object
                    self.test_conversation_id = conversation_data["id"]
                    print(f"✅ Conversation created successfully!")
                    print(f"📋 Conversation ID: {self.test_conversation_id}")
                    print(f"📝 Title: {conversation_data.get('title', 'N/A')}")
                    print(f"🤖 Agent ID: {conversation_data.get('agent_id', 'None')}")
                    return True
                else:
                    print(f"❌ Unexpected conversation data format: {conversation_data}")
                    return False
            else:
                print(f"❌ Failed to create conversation: {data}")
                return False
        else:
            print(f"❌ Create conversation failed with status {response.status_code}: {response.text}")
            return False
    
    def test_send_message_and_get_ai_response(self):
        """Test sending a message and getting AI response"""
        print("\n📨 Testing Send Message + AI Response...")
        
        message_data = {
            "content": "Hello! This is a test message for the chat workflow. Please respond with a simple greeting.",
            "sender_type": "user",
            "agent_id": TEST_AGENT_ID
        }
        
        response = requests.post(
            f"{self.base_url}/chat/conversations/{self.test_conversation_id}/messages",
            json=message_data,
            headers=self.get_auth_headers()
        )
        
        print(f"🔍 Response Status: {response.status_code}")
        print(f"🔍 Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success") and data.get("data"):
                result = data["data"]
                
                # Check user message
                if "user_message" in result:
                    user_msg = result["user_message"]
                    print(f"✅ User message sent successfully!")
                    print(f"📝 Content: {user_msg['content'][:50]}...")
                    print(f"🆔 Message ID: {user_msg['id']}")
                
                # Check AI response
                if "ai_response" in result:
                    ai_msg = result["ai_response"]
                    print(f"✅ AI response received!")
                    print(f"🤖 AI Response: {ai_msg['content'][:100]}...")
                    print(f"🆔 Response ID: {ai_msg['id']}")
                    
                    # Check response metadata
                    if "tokens_used" in ai_msg:
                        print(f"🎯 Tokens used: {ai_msg['tokens_used']}")
                    if "response_time_ms" in ai_msg:
                        print(f"⏱️ Response time: {ai_msg['response_time_ms']}ms")
                
                return True
            else:
                print(f"❌ Failed to send message: {data}")
                return False
        else:
            print(f"❌ Send message failed with status {response.status_code}: {response.text}")
            return False
    
    def test_get_conversation_messages(self):
        """Test retrieving conversation messages"""
        print("\n📜 Testing Get Conversation Messages...")
        
        response = requests.get(
            f"{self.base_url}/chat/conversations/{self.test_conversation_id}/messages",
            headers=self.get_auth_headers()
        )
        
        print(f"🔍 Response Status: {response.status_code}")
        print(f"🔍 Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success") and data.get("data"):
                messages = data["data"]
                print(f"✅ Retrieved {len(messages)} messages")
                
                for i, message in enumerate(messages):
                    print(f"📨 Message {i+1}: {message['sender']} - {message['content'][:50]}...")
                
                return True
            else:
                print(f"❌ Failed to get messages: {data}")
                return False
        else:
            print(f"❌ Get messages failed with status {response.status_code}: {response.text}")
            return False
    
    def cleanup_test_data(self):
        """Clean up test conversation"""
        print("\n🧹 Cleaning up test data...")
        
        if self.test_conversation_id:
            response = requests.delete(
                f"{self.base_url}/chat/conversations/{self.test_conversation_id}",
                headers=self.get_auth_headers()
            )
            
            if response.status_code == 200:
                print("✅ Test conversation deleted successfully")
            else:
                print(f"⚠️ Could not delete test conversation: {response.status_code}")
    
    def run_complete_test(self):
        """Run the complete chat workflow test"""
        print("🚀 CHAT WORKFLOW TEST")
        print("=" * 50)
        
        success_count = 0
        total_tests = 4
        
        # Test sequence
        tests = [
            ("Login", self.login_admin),
            ("Create Conversation", self.test_create_conversation),
            ("Send Message + AI Response", self.test_send_message_and_get_ai_response),
            ("Get Messages", self.test_get_conversation_messages)
        ]
        
        for test_name, test_func in tests:
            try:
                print(f"\n--- Running {test_name} ---")
                if test_func():
                    success_count += 1
                    print(f"✅ {test_name}: PASSED")
                else:
                    print(f"❌ {test_name}: FAILED")
                    break  # Stop on first failure
            except Exception as e:
                print(f"❌ {test_name}: ERROR - {str(e)}")
                import traceback
                print(f"📋 Full traceback: {traceback.format_exc()}")
                break
            
            time.sleep(1)  # Brief pause between tests
        
        # Cleanup
        try:
            self.cleanup_test_data()
        except:
            pass
        
        # Results
        print("\n" + "=" * 50)
        print(f"🎯 FINAL RESULTS: {success_count}/{total_tests} tests passed")
        
        if success_count == total_tests:
            print("🎉 ALL TESTS PASSED! Chat workflow is fully functional!")
            print(f"✅ Agent 26 (qwen2.5vl:7b) works perfectly with chat system!")
            return True
        else:
            print(f"⚠️ {total_tests - success_count} test(s) failed")
            return False

if __name__ == "__main__":
    tester = ChatWorkflowTester()
    success = tester.run_complete_test()
    print(f"\n🏁 Final Result: {'SUCCESS' if success else 'FAILED'}") 