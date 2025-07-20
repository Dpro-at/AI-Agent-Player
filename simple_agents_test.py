#!/usr/bin/env python3
"""
Simple Agents API Test
"""

import requests
import json

# Login first
login_data = {
    "email": "me@alarade.at",
    "password": "admin123456"
}

print("🔐 Logging in...")
response = requests.post("http://localhost:8000/auth/login", json=login_data)
print(f"Login response: {response.status_code}")

if response.status_code == 200:
    data = response.json()
    print(f"Login success: {data.get('success')}")
    
    if data.get("success"):
        token = data["data"]["access_token"]
        print(f"✅ Got token: {token[:50]}...")
        
        # Test agents API
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        
        print("\n🤖 Testing /agents endpoint...")
        try:
            agents_response = requests.get("http://localhost:8000/agents", headers=headers)
            print(f"Agents API Status: {agents_response.status_code}")
            print(f"Response: {agents_response.text}")
            
            if agents_response.status_code == 200:
                agents_data = agents_response.json()
                print(f"✅ Agents data type: {type(agents_data)}")
                print(f"✅ Agents data: {json.dumps(agents_data, indent=2)}")
            else:
                print(f"❌ Agents API failed: {agents_response.text}")
                
        except Exception as e:
            print(f"❌ Exception: {e}")
    else:
        print(f"❌ Login failed: {data}")
else:
    print(f"❌ Login failed with status {response.status_code}: {response.text}") 