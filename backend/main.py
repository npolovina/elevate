# backend/main.py
import os
import sys
import logging
from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import time

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

# Import configuration, cache, and improved DeepSeek client
from config import settings
from cache import response_cache
from deepseek import DeepSeek, DeepSeekAPIError

# Configure logging
logger = logging.getLogger("main")
logger.setLevel(getattr(logging, settings.LOG_LEVEL))

app = FastAPI(title="Elevate Career Coach")

# CORS middleware to allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

class CacheStatsResponse(BaseModel):
    total_entries: int
    active_entries: int
    expired_entries: int
    max_size: int
    ttl: int
    enabled: bool

# AI Chatbot dependency injection
def get_ai_client():
    """Dependency for getting the AI client instance."""
    try:
        client = DeepSeek(api_key=settings.DEEPSEEK_API_KEY)
        return client
    except Exception as e:
        logger.error(f"Failed to initialize DeepSeek client: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to initialize AI service")

# Helper function to find a user profile
def find_user_profile(user_id: str) -> Dict[str, Any]:
    """Find a user profile by user_id"""
    return next((user for user in user_profiles if user['user_id'] == user_id), None)

# Middleware for request timing and logging
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    logger.info(f"Request to {request.url.path} processed in {process_time:.4f} seconds")
    return response

# Error handler for DeepSeekAPIError
@app.exception_handler(DeepSeekAPIError)
async def deepseek_error_handler(request: Request, exc: DeepSeekAPIError):
    status_code = exc.status_code if exc.status_code else 503
    logger.error(f"DeepSeek API error: {exc.message}")
    return JSONResponse(
        status_code=status_code,
        content={"detail": f"AI service error: {exc.message}"}
    )

# Updated STAR summary generation endpoint with better error handling

@app.post("/api/create/star-summary")
async def generate_star_summary(
    request: STARRequest, 
    ai_client: DeepSeek = Depends(get_ai_client)
):
    """Generate STAR format summary for a completed JIRA ticket"""
    logger.info(f"STAR summary requested for ticket: {request.ticket_id}")
    
    # Find the ticket
    ticket = next((t for t in jira_tickets if t['ticket_id'] == request.ticket_id), None)
    if not ticket:
        logger.error(f"Ticket not found: {request.ticket_id}")
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    # Check if ticket is completed
    if ticket.get('status') != 'Completed':
        logger.warning(f"Attempt to generate STAR summary for incomplete ticket: {request.ticket_id}")
        raise HTTPException(status_code=400, detail="STAR summaries can only be generated for completed tickets")
    
    # Prepare prompt for STAR summary
    prompt = f"""Generate a professional STAR (Situation, Task, Action, Result) format summary for this completed work ticket:

TICKET INFORMATION:
- ID: {ticket['ticket_id']}
- Title: {ticket['title']}
- Description: {ticket['description']}
- Priority: {ticket['priority']}
- Started: {ticket['start_date']}
- Completed: {ticket['completion_date']}

COMMENTS:
{' '.join([f"- {c['user']}: {c['text']}" for c in ticket.get('comments', [])])}

ADDITIONAL CONTEXT PROVIDED BY USER:
{request.additional_context or 'No additional context provided.'}

Format your response in clear STAR format with these sections:
1. Situation: Describe the context and background
2. Task: Explain what needed to be accomplished and why
3. Action: Detail the specific steps you took to complete the task
4. Result: Highlight the outcomes, focusing on measurable impacts and what was learned

Keep your summary professional, focused on achievements, and suitable for use in performance reviews or job interviews.
"""
    
    try:
        # Set a system prompt specific to STAR format
        system_prompt = """You are a professional career coach specializing in creating STAR format summaries. 
        You transform work accomplishments into compelling, achievement-focused narratives that highlight skills and impact.
        Your summaries are well-structured, concise, and emphasize measurable results and valuable skills demonstrated."""
        
        # Use the improved client with better error handling and caching
        star_summary = ai_client.get_response(
            user_input=prompt,
            system_prompt=system_prompt,
            temperature=0.4,  # Lower temperature for more focused/professional responses
            use_cache=True    # Enable caching for STAR summaries
        )
        
        # Log successful generation
        logger.info(f"Successfully generated STAR summary for ticket {request.ticket_id}")
        
        return {"star_summary": star_summary}
    except Exception as e:
        logger.error(f"Error generating STAR summary for ticket {request.ticket_id}: {str(e)}")
        # Provide a more specific error message based on the exception type
        if isinstance(e, DeepSeekAPIError):
            raise HTTPException(status_code=503, detail=f"AI service error: {str(e)}")
        else:
            raise HTTPException(status_code=500, detail=f"Failed to generate STAR summary: {str(e)}")
        

@app.post("/api/create/documentation")
async def get_documentation(
    request: DocumentationRequest, 
    ai_client: DeepSeek = Depends(get_ai_client)
):
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
            ai_explanation = ai_client.get_response(
                user_input=prompt,
                system_prompt="You are a helpful documentation assistant who provides clear and accurate explanations.",
                temperature=0.3  # Lower temperature for factual responses
            )
            return {
                "documents": relevant_docs,
                "ai_explanation": ai_explanation
            }
        except Exception as e:
            logger.error(f"Error generating AI explanation: {str(e)}")
            ai_explanation = "Unable to generate AI explanation due to an error."
    
    return {"documents": relevant_docs, "ai_explanation": "No directly relevant documentation found."}

@app.post("/api/connect/recommendations")
async def get_connection_recommendations(request: ConnectionRecommendationRequest):
    """Provide connection and learning recommendations"""
    # Find the user
    user = find_user_profile(request.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Find potential connections with similar skills/interests
    # Improved algorithm to find better matches
    potential_connections = []
    
    for profile in user_profiles:
        if profile['user_id'] != user['user_id']:
            # Calculate skill overlap
            skill_overlap = set(profile['skills']) & set(user.get('skills', []))
            # Calculate interest overlap
            interest_overlap_1 = set(profile['skills']) & set(user.get('interests', []))
            interest_overlap_2 = set(profile['interests']) & set(user['skills'])
            # Calculate desired skills overlap (for learning from others)
            desired_skills_overlap = set(profile['skills']) & set(user.get('desired_skills', []))
            
            # Calculate a match score
            match_score = (
                len(skill_overlap) * 2 +      # Weight skill matches higher
                len(interest_overlap_1) +
                len(interest_overlap_2) +
                len(desired_skills_overlap) * 1.5  # Weight desired skills matches
            )
            
            # Only include if there's at least some overlap
            if match_score > 0:
                potential_connections.append({
                    **profile,
                    "match_score": match_score,
                    "match_reason": _generate_match_reason(
                        skill_overlap, 
                        interest_overlap_1 | interest_overlap_2,
                        desired_skills_overlap
                    )
                })
    
    # Sort by match score (highest first) and take top results
    potential_connections.sort(key=lambda x: x.get('match_score', 0), reverse=True)
    
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

def _generate_match_reason(skill_overlap, interest_overlap, desired_skills_overlap):
    """Generate a human-readable reason for the match"""
    reasons = []
    
    if skill_overlap:
        if len(skill_overlap) == 1:
            reasons.append(f"Both know {list(skill_overlap)[0]}")
        else:
            reasons.append(f"Both know {len(skill_overlap)} common skills")
    
    if interest_overlap:
        if len(interest_overlap) == 1:
            reasons.append(f"Shares your interest in {list(interest_overlap)[0]}")
        else:
            reasons.append(f"Shares {len(interest_overlap)} of your interests")
    
    if desired_skills_overlap:
        if len(desired_skills_overlap) == 1:
            reasons.append(f"Can help you learn {list(desired_skills_overlap)[0]}")
        else:
            reasons.append(f"Has {len(desired_skills_overlap)} skills you want to learn")
    
    return ", ".join(reasons)

@app.post("/api/elevate/job-recommendations")
async def get_job_recommendations(
    request: ConnectionRecommendationRequest, 
    ai_client: DeepSeek = Depends(get_ai_client)
):
    """Provide job recommendations based on user profile with DeepSeek AI insights"""
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
    
    # Use DeepSeek AI to refine recommendations
    if matched_jobs:
        # Build detailed context for the AI
        user_context = f"""
        User: {user['name']}
        Current Role: {user['role']}
        Department: {user['department']}
        Experience: {user['experience']} years
        Current Skills: {', '.join(user['skills'])}
        Desired Skills: {', '.join(user.get('desired_skills', []))}
        Interests: {', '.join(user.get('interests', []))}
        """
        
        jobs_context = "\n".join([
            f"Job {i+1}: {job['title']} in {job['department']} - {job['location']}\n" +
            f"Requirements: {', '.join(job['requirements'])}\n" +
            f"Preferred Skills: {', '.join(job.get('preferred_skills', []))}\n" +
            f"Description: {job['description']}\n" +
            f"Salary Range: {job.get('salary_range', 'Not specified')}"
            for i, job in enumerate(matched_jobs[:5])  # Limit to 5 jobs for context length
        ])
        
        prompt = f"""As a career coach, analyze these job recommendations for {user['name']}.

USER PROFILE:
{user_context}

JOB MATCHES:
{jobs_context}

Provide personalized career insights about these job opportunities. Focus on:
1. How well each role aligns with the user's current skills
2. How these opportunities could help develop their desired skills
3. Which roles are the best match and why
4. Any specific career growth opportunities these roles present

Keep your analysis concise, practical, and focused on the user's career development.
"""
        
        try:
            # Call DeepSeek API for personalized insights
            ai_recommendations = ai_client.get_response(
                user_input=prompt,
                system_prompt="You are a career coach specializing in job recommendations and career development.",
                temperature=0.7
            )
            
            return {
                "recommended_jobs": matched_jobs,
                "ai_recommendations": ai_recommendations
            }
        except Exception as e:
            logger.error(f"Error generating job recommendations: {str(e)}")
            ai_recommendations = "Unable to generate personalized job recommendations due to an error."
            
            # Still return the matched jobs even if AI insights fail
            return {
                "recommended_jobs": matched_jobs,
                "ai_recommendations": "Unable to generate personalized insights at this time. Please try again later."
            }
    
    # Handle case with no matching jobs
    return {"recommended_jobs": matched_jobs, "ai_recommendations": "No suitable job matches found based on your profile."}
@app.post("/api/create/mood-check")
async def submit_mood_check(
    request: MoodCheckRequest, 
    ai_client: DeepSeek = Depends(get_ai_client)
):
    """Submit mood check and feedback"""
    # Validate mood input
    valid_moods = ["great", "good", "okay", "stressed", "overwhelmed"]
    if request.mood.lower() not in valid_moods:
        raise HTTPException(status_code=400, detail=f"Invalid mood. Valid options are: {', '.join(valid_moods)}")
    
    # Here you would typically save to a database
    # For now, we'll use AI to provide some insights
    prompt = f"""User's mood: {request.mood}
    Feedback: {request.feedback or 'No additional feedback'}
    
    Provide a supportive and constructive response that acknowledges the user's feelings and offers positive guidance."""
    
    try:
        ai_insight = ai_client.get_response(
            user_input=prompt,
            system_prompt="You are an empathetic career coach who provides supportive guidance.",
            temperature=0.7
        )
        
        return {
            "mood": request.mood,
            "feedback": request.feedback,
            "ai_insight": ai_insight
        }
    except Exception as e:
        logger.error(f"Error generating mood insights: {str(e)}")
        return {
            "mood": request.mood,
            "feedback": request.feedback,
            "ai_insight": "Thank you for sharing. Your feelings are valid, and it's great that you're taking time for self-reflection."
        }

# Endpoint to get cache statistics
@app.get("/api/admin/cache-stats", response_model=CacheStatsResponse)
async def get_cache_stats():
    """Get cache statistics for monitoring"""
    stats = response_cache.get_stats()
    return stats

# Endpoint to clear the cache
@app.post("/api/admin/clear-cache")
async def clear_cache():
    """Clear the response cache"""
    response_cache.clear()
    return {"message": "Cache cleared successfully"}

# Root endpoint for health check
@app.get("/")
async def root():
    return {
        "message": "Welcome to Elevate Career Coach API",
        "status": "operational",
        "version": "1.0.0"
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring"""
    return {
        "status": "healthy",
        "api_version": "1.0.0",
        "environment": settings.APP_ENV,
        "cache_enabled": response_cache.enabled,
        "deepseek_configured": bool(settings.DEEPSEEK_API_KEY)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)