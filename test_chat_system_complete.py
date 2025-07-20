#!/usr/bin/env python3
"""
🧪 COMPREHENSIVE CHAT SYSTEM TEST
Tests the complete chat workflow: Agent Selection → Create Conversation → Send Message → AI Response
"""

import requests
import json
import sys
import time

# Configuration
BASE_URL = "http://localhost:8000"
ADMIN_EMAIL = "me@alarade.at"
ADMIN_PASSWORD = "admin123456"

class ChatSystemTester:
    def __init__(self):
        self.base_url = BASE_URL
        self.token = None
        self.user_id = None
        self.test_agent_id = None
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
    
    def test_agents_api(self):
        """Test agents API and get an agent for testing"""
        print("\n🤖 Testing Agents API...")
        
        try:
            response = requests.get(f"{self.base_url}/agents", headers=self.get_auth_headers())
            
            print(f"🔍 Response status: {response.status_code}")
            print(f"🔍 Response content: {response.text[:500]}...")
        except Exception as e:
            print(f"❌ Request failed with exception: {e}")
            return False
        
        if response.status_code == 200:
            data = response.json()
            print(f"🔍 JSON response: {data}")
            
            # Check for different response formats
            agents = None
            if data.get("success") and data.get("data"):
                # Check if agents are in data.data.agents (new format)
                if data["data"].get("agents"):
                    agents = data["data"]["agents"]
                else:
                    agents = data["data"]
            elif isinstance(data, list):
                agents = data
            elif data.get("agents"):
                agents = data["agents"]
            
            if agents:
                # Use the first available agent
                test_agent = agents[0]
                self.test_agent_id = test_agent["id"]
                print(f"✅ Found {len(agents)} agents")
                print(f"📋 Using test agent: {test_agent['name']} (ID: {self.test_agent_id})")
                print(f"🔧 Agent provider: {test_agent.get('model_provider', 'unknown')}")
                print(f"🧠 Agent model: {test_agent.get('model_name', 'unknown')}")
                return True
            else:
                print("❌ No agents found!")
                print(f"🔍 Data structure: {data}")
                return False
        else:
            print(f"❌ Agents API failed with status {response.status_code}: {response.text}")
            return False
    
    def test_create_conversation(self):
        """Test creating a new conversation"""
        print("\n💬 Testing Create Conversation...")
        
        conversation_data = {
            "title": "Chat System Test",
            "description": "Testing complete chat integration",
            "agent_id": self.test_agent_id,
            "conversation_type": "chat"
        }
        
        response = requests.post(
            f"{self.base_url}/chat/conversations", 
            json=conversation_data,
            headers=self.get_auth_headers()
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success") and data.get("data"):
                conversation = data["data"]
                self.test_conversation_id = conversation["id"]
                print(f"✅ Conversation created successfully!")
                print(f"📋 Conversation ID: {self.test_conversation_id}")
                print(f"📝 Title: {conversation['title']}")
                print(f"🤖 Agent ID: {conversation.get('agent_id', 'None')}")
                return True
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
            "content": "Hello! Can you help me test the chat system? Please respond with a simple greeting.",
            "sender_type": "user",
            "agent_id": self.test_agent_id
        }
        
        response = requests.post(
            f"{self.base_url}/chat/conversations/{self.test_conversation_id}/messages",
            json=message_data,
            headers=self.get_auth_headers()
        )
        
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
    
    def test_get_conversations(self):
        """Test getting user conversations"""
        print("\n📋 Testing Get Conversations...")
        
        response = requests.get(f"{self.base_url}/chat/conversations", headers=self.get_auth_headers())
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success") and data.get("data"):
                conversations = data["data"]
                print(f"✅ Retrieved {len(conversations)} conversations")
                
                # Find our test conversation
                test_conv = None
                for conv in conversations:
                    if conv["id"] == self.test_conversation_id:
                        test_conv = conv
                        break
                
                if test_conv:
                    print(f"✅ Found our test conversation: {test_conv['title']}")
                    print(f"📈 Message count: {test_conv.get('message_count', 0)}")
                    print(f"🕒 Last message: {test_conv.get('last_message_at', 'N/A')}")
                
                return True
            else:
                print(f"❌ Failed to get conversations: {data}")
                return False
        else:
            print(f"❌ Get conversations failed with status {response.status_code}: {response.text}")
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
        """Run the complete chat system test"""
        print("🚀 COMPREHENSIVE CHAT SYSTEM TEST")
        print("=" * 50)
        
        success_count = 0
        total_tests = 6
        
        # Test sequence
        tests = [
            ("Login", self.login_admin),
            ("Agents API", self.test_agents_api),
            ("Create Conversation", self.test_create_conversation),
            ("Send Message + AI Response", self.test_send_message_and_get_ai_response),
            ("Get Messages", self.test_get_conversation_messages),
            ("Get Conversations", self.test_get_conversations)
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
            print("🎉 ALL TESTS PASSED! Chat system is fully functional!")
            return True
        else:
            print(f"⚠️ {total_tests - success_count} test(s) failed")
            return False

if __name__ == "__main__":
    tester = ChatSystemTester()
    success = tester.run_complete_test()
    sys.exit(0 if success else 1) 