#!/usr/bin/env python3
import sqlite3
import os

def fix_ollama_agents():
    print("🔧 Fixing Model Names for Ollama Agents")
    
    # Database path
    db_path = "data/database.db"
    if not os.path.exists(db_path):
        print(f"❌ Database not found at: {db_path}")
        return
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Find all Ollama agents with gpt-4 model
        cursor.execute("""
            SELECT id, name, model_provider, model_name 
            FROM agents 
            WHERE model_provider = 'ollama' 
            AND model_name = 'gpt-4'
        """)
        
        ollama_agents = cursor.fetchall()
        print(f"📊 Found {len(ollama_agents)} Ollama agents with wrong model name:")
        
        for agent in ollama_agents:
            agent_id, name, provider, model = agent
            print(f"  - ID {agent_id}: '{name}' (Provider: {provider}, Model: {model})")
        
        if ollama_agents:
            # Update all Ollama agents to use correct model
            cursor.execute("""
                UPDATE agents 
                SET model_name = 'qwen2.5vl:7b' 
                WHERE model_provider = 'ollama' 
                AND model_name = 'gpt-4'
            """)
            
            updated_count = cursor.rowcount
            conn.commit()
            
            print(f"✅ Updated {updated_count} Ollama agents to use 'qwen2.5vl:7b'")
            
            # Verify the changes
            cursor.execute("""
                SELECT id, name, model_provider, model_name 
                FROM agents 
                WHERE model_provider = 'ollama'
            """)
            
            updated_agents = cursor.fetchall()
            print(f"📋 Current Ollama agents after update:")
            for agent in updated_agents:
                agent_id, name, provider, model = agent
                print(f"  ✅ ID {agent_id}: '{name}' (Provider: {provider}, Model: {model})")
        else:
            print("✅ No Ollama agents found with incorrect model names!")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    fix_ollama_agents() 