# backend/app/services/ai_service.py
import os
import requests
import json

DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "your-api-key")
DEEPSEEK_API_URL = "https://api.deepseek.com/v1"

class DeepseekAIService:
    def __init__(self):
        self.headers = {
            "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
            "Content-Type": "application/json"
        }
    
    def generate_star_example(self, ticket, user_skills):
        """Generate a STAR format example from a JIRA ticket"""
        prompt = f"""
        Create a professional STAR format example based on the following completed work:
        
        Title: {ticket.title}
        Description: {ticket.description}
        Components/Skills: {', '.join(ticket.components)}
        
        Format the response with clear Situation, Task, Action, and Result sections.
        Include specific details and metrics where possible.
        Focus on demonstrating these skills: {', '.join(user_skills)}
        
        Output only the STAR example text, nothing else.
        """
        
        response = requests.post(
            f"{DEEPSEEK_API_URL}/completions",
            headers=self.headers,
            json={
                "model": "deepseek-chat",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.7,
                "max_tokens": 500
            }
        )
        
        if response.status_code == 200:
            result = response.json()
            return result["choices"][0]["message"]["content"]
        else:
            raise Exception(f"Deepseek API error: {response.text}")
    
    def answer_policy_question(self, question, policy_text):
        """Answer questions based on policy documentation"""
        prompt = f"""
        Answer the following question based ONLY on the provided policy documentation:
        
        Question: {question}
        
        Policy Documentation:
        {policy_text}
        
        If the answer is not found in the documentation, say so clearly.
        """
        
        response = requests.post(
            f"{DEEPSEEK_API_URL}/completions",
            headers=self.headers,
            json={
                "model": "deepseek-chat",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.3,
                "max_tokens": 350
            }
        )
        
        if response.status_code == 200:
            result = response.json()
            return result["choices"][0]["message"]["content"]
        else:
            raise Exception(f"Deepseek API error: {response.text}")
    
    def chat_response(self, conversation_history):
        """Generate response for the chat interface"""
        messages = []
        
        for msg in conversation_history:
            role = "user" if msg.is_user else "assistant"
            messages.append({"role": role, "content": msg.content})
        
        response = requests.post(
            f"{DEEPSEEK_API_URL}/chat/completions",
            headers=self.headers,
            json={
                "model": "deepseek-chat",
                "messages": messages,
                "temperature": 0.7,
                "max_tokens": 500
            }
        )
        
        if response.status_code == 200:
            result = response.json()
            return result["choices"][0]["message"]["content"]
        else:
            raise Exception(f"Deepseek API error: {response.text}")