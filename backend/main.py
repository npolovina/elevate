import os
import sys
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

# Add the directory containing mock data to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
mock_data_dir = os.path.join(current_dir, 'mock_data')
sys.path.insert(0, mock_data_dir)

# Import mock datasets
from company_documentation import company_documentation
from jira_tickets import jira_tickets
from job_postings import job_postings
from learning_materials_dataset import learning_materials
from user_profiles import user_profiles

# Import DeepSeek for AI interactions
from deepseek import DeepSeek

app = FastAPI(title="Elevate Career Coach")

# CORS middleware to allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# AI Chatbot initialization
AI_API_KEY = os.getenv("DEEPSEEK_API_KEY", "sk-c03808cf0b4544d7ae15e4bed8d5fddc")
ai_chatbot = DeepSeek(AI_API_KEY)

# Pydantic models for request/response validation
class STARRequest(BaseModel):
    ticket_id: str
    additional_context: Optional[str] = None

class DocumentationRequest(BaseModel):
    query: str

class ConnectionRecommendationRequest(BaseModel):
    user_id: str

class MoodCheckRequest(BaseModel):
    mood: str
    feedback: Optional[str] = None

# Helper function to find a user profile
def find_user_profile(user_id: str) -> Dict[str, Any]:
    """Find a user profile by user_id"""
    return next((user for user in user_profiles if user['user_id'] == user_id), None)

# Endpoints for different features
@app.post("/api/create/star-summary")
async def generate_star_summary(request: STARRequest):
    """Generate STAR format summary for a completed JIRA ticket"""
    # Find the ticket
    ticket = next((t for t in jira_tickets if t['ticket_id'] == request.ticket_id), None)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    # Prepare prompt for STAR summary
    prompt = f"""Generate a STAR (Situation, Task, Action, Result) format summary for this completed JIRA ticket:
    Title: {ticket['title']}
    Description: {ticket['description']}
    Comments: {' '.join([c['text'] for c in ticket.get('comments', [])])}
    Additional Context: {request.additional_context or ''}
    
    Format the response as a clear STAR format summary highlighting the impact and achievements."""
    
    try:
        star_summary = ai_chatbot.get_response(prompt)
        return {"star_summary": star_summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")

@app.post("/api/create/documentation")
async def get_documentation(request: DocumentationRequest):
    """Retrieve relevant documentation based on query"""
    # Search through company documentation
    relevant_docs = [
        doc for doc in company_documentation 
        if any(
            keyword.lower() in request.query.lower() 
            for keyword in doc.get('keywords', [])
        )
    ]
    
    # Use AI to provide context
    if relevant_docs:
        doc_context = " ".join([
            f"Document {doc['doc_id']}: {doc['title']} - {doc['content_summary']}" 
            for doc in relevant_docs
        ])
        
        prompt = f"""Help interpret the following documentation relevant to the query: '{request.query}'
        
        Relevant Documents:
        {doc_context}
        
        Provide a clear, concise explanation and guidance."""
        
        try:
            ai_explanation = ai_chatbot.get_response(prompt)
            return {
                "documents": relevant_docs,
                "ai_explanation": ai_explanation
            }
        except Exception as e:
            ai_explanation = "Unable to generate AI explanation due to an error."
    
    return {"documents": [], "ai_explanation": "No directly relevant documentation found."}

@app.post("/api/connect/recommendations")
async def get_connection_recommendations(request: ConnectionRecommendationRequest):
    """Provide connection and learning recommendations"""
    # Find the user
    user = find_user_profile(request.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Find potential connections with similar skills/interests
    potential_connections = [
        profile for profile in user_profiles 
        if (profile['user_id'] != user['user_id'] and 
            (set(profile['skills']) & set(user.get('interests', [])) or 
             set(profile['interests']) & set(user['skills'])))
    ][:5]  # Limit to top 5
    
    # Find learning materials to close skill gaps
    desired_skills = user.get('desired_skills', [])
    recommended_learning = [
        material for material in learning_materials
        if any(skill.lower() in [m.lower() for m in material['skills']] 
               for skill in desired_skills)
    ]
    
    return {
        "potential_connections": potential_connections,
        "recommended_learning": recommended_learning
    }

@app.post("/api/elevate/job-recommendations")
async def get_job_recommendations(request: ConnectionRecommendationRequest):
    """Provide job recommendations based on user profile"""
    # Find the user
    user = find_user_profile(request.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # AI-powered job recommendation matching
    matched_jobs = [
        job for job in job_postings
        if (not job.get('internal_only', False) and 
            any(skill.lower() in ' '.join(job['requirements']).lower() 
                for skill in user['skills']))
    ]
    
    # Use AI to refine recommendations
    if matched_jobs:
        jobs_context = " ".join([
            f"Job {job['job_id']}: {job['title']} in {job['department']} - Requirements: {', '.join(job['requirements'])}" 
            for job in matched_jobs
        ])
        
        prompt = f"""Analyze these job recommendations for user {user['name']} with skills {', '.join(user['skills'])} and desired skills {', '.join(user.get('desired_skills', []))}.
        
        Job Matches:
        {jobs_context}
        
        Provide personalized commentary on how these roles align with the user's career aspirations and skill development."""
        
        try:
            ai_recommendations = ai_chatbot.get_response(prompt)
            
            return {
                "recommended_jobs": matched_jobs,
                "ai_recommendations": ai_recommendations
            }
        except Exception as e:
            ai_recommendations = "Unable to generate personalized job recommendations due to an error."
    
    return {"recommended_jobs": [], "ai_recommendations": "No suitable job matches found at this time."}

@app.post("/api/create/mood-check")
async def submit_mood_check(request: MoodCheckRequest):
    """Submit mood check and feedback"""
    # Here you would typically save to a database
    # For now, we'll use AI to provide some insights
    prompt = f"""User's mood: {request.mood}
    Feedback: {request.feedback or 'No additional feedback'}
    
    Provide a supportive and constructive response that acknowledges the user's feelings and offers positive guidance."""
    
    try:
        ai_insight = ai_chatbot.get_response(prompt)
        
        return {
            "mood": request.mood,
            "feedback": request.feedback,
            "ai_insight": ai_insight
        }
    except Exception as e:
        return {
            "mood": request.mood,
            "feedback": request.feedback,
            "ai_insight": "Thank you for sharing. Your feelings are valid, and it's great that you're taking time for self-reflection."
        }

# Optional: Root endpoint for health check
@app.get("/")
async def root():
    return {"message": "Welcome to Elevate Career Coach API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)