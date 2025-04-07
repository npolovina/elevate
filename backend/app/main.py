# main.py - FastAPI Backend for Elevate Career Coach Application

from fastapi import FastAPI, HTTPException, Depends, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import json
import os
from datetime import datetime, timedelta
import jwt
import uvicorn
import pandas as pd
from io import BytesIO
import PyPDF2

# Initialize FastAPI app
app = FastAPI(title="Elevate Career Coach API")

# Add CORS middleware to allow frontend to access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Set to specific origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OAuth2 scheme for authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Secret key for JWT - Store securely in production
SECRET_KEY = "elevate_secret_key_change_in_production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Define data models
class User(BaseModel):
    user_id: str
    name: str
    email: str
    department: str
    role: str
    skills: List[str]
    interests: List[str]
    experience: int
    projects: List[str]
    desired_skills: List[str]
    manager_id: str
    joined_date: str

class JiraTicket(BaseModel):
    ticket_id: str
    title: str
    description: str
    status: str
    assignee: str
    start_date: str
    completion_date: Optional[str]
    priority: str
    comments: List[Dict[str, Any]]
    components: List[str]
    story_points: int

class LearningMaterial(BaseModel):
    material_id: str
    title: str
    description: str
    type: str
    provider: str
    url: str
    skills: List[str]
    duration: str
    rating: float
    completion_count: int

class Document(BaseModel):
    doc_id: str
    title: str
    category: str
    content_summary: str
    file_path: str
    last_updated: str
    keywords: List[str]

class JobPosting(BaseModel):
    job_id: str
    title: str
    department: str
    location: str
    posted_date: str
    status: str
    description: str
    requirements: List[str]
    preferred_skills: List[str]
    salary_range: str
    hiring_manager: str
    internal_only: bool

class StarExample(BaseModel):
    ticket_id: str
    title: str
    star_description: str
    skills_demonstrated: List[str]
    impact_metrics: str

class UserQuestion(BaseModel):
    question: str
    context: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: Optional[str] = None

class ChatMessage(BaseModel):
    content: str
    is_user: bool = True
    timestamp: Optional[str] = None

class Conversation(BaseModel):
    id: str
    messages: List[ChatMessage]
    title: str
    created_at: str
    updated_at: str

# Mock database - In production, use a real database
# Load mock data
def load_mock_data():
    # In a real app, this would come from a database
    with open('mock_data/users.json', 'r') as f:
        users = json.load(f)
    
    with open('mock_data/jira_tickets.json', 'r') as f:
        jira_tickets = json.load(f)
    
    with open('mock_data/learning_materials.json', 'r') as f:
        learning_materials = json.load(f)
    
    with open('mock_data/documents.json', 'r') as f:
        documents = json.load(f)
    
    with open('mock_data/job_postings.json', 'r') as f:
        job_postings = json.load(f)
    
    with open('mock_data/star_examples.json', 'r') as f:
        star_examples = json.load(f)
    
    with open('mock_data/conversations.json', 'r') as f:
        conversations = json.load(f)
    
    return {
        "users": users,
        "jira_tickets": jira_tickets,
        "learning_materials": learning_materials,
        "documents": documents,
        "job_postings": job_postings,
        "star_examples": star_examples,
        "conversations": conversations
    }

# For demo purposes, we'll initialize with the mock data
# In a real app, you'd connect to a database
mock_db = load_mock_data()

# Authentication functions
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        token_data = TokenData(user_id=user_id)
    except jwt.PyJWTError:
        raise credentials_exception
    
    # In a real app, you'd query the database for the user
    user = next((user for user in mock_db["users"] if user["user_id"] == token_data.user_id), None)
    if user is None:
        raise credentials_exception
    return user

# API endpoints

@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    # In a real app, you'd verify the credentials against your database
    # For demo, we'll accept any user_id in our mock data
    user = next((user for user in mock_db["users"] if user["user_id"] == form_data.username), None)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["user_id"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=dict)
async def read_users_me(current_user: dict = Depends(get_current_user)):
    return current_user

# Create Tab Endpoints

@app.get("/jira-tickets", response_model=List[dict])
async def get_jira_tickets(current_user: dict = Depends(get_current_user)):
    # In a real app, filter by the current user
    user_tickets = [ticket for ticket in mock_db["jira_tickets"] if ticket["assignee"] == current_user["user_id"]]
    return user_tickets

@app.get("/star-examples", response_model=List[dict])
async def get_star_examples(current_user: dict = Depends(get_current_user)):
    # Get STAR examples for the user's completed tickets
    user_tickets = [ticket["ticket_id"] for ticket in mock_db["jira_tickets"] 
                   if ticket["assignee"] == current_user["user_id"] and ticket["status"] == "Completed"]
    
    star_examples = [example for example in mock_db["star_examples"] 
                    if example["ticket_id"] in user_tickets]
    
    return star_examples

@app.post("/generate-star")
async def generate_star(ticket_id: str, current_user: dict = Depends(get_current_user)):
    # In a real app, this would call the AI service to generate a STAR example
    ticket = next((t for t in mock_db["jira_tickets"] if t["ticket_id"] == ticket_id), None)
    
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    if ticket["assignee"] != current_user["user_id"]:
        raise HTTPException(status_code=403, detail="Not authorized to access this ticket")
    
    # For demo purposes, return a mock STAR example
    # In a real app, this would be generated by AI based on the ticket
    mock_star = {
        "ticket_id": ticket_id,
        "title": ticket["title"],
        "star_description": f"""
        **Situation**: The project needed {ticket["title"].lower()}.
        
        **Task**: I was responsible for implementing this feature.
        
        **Action**: 
        - Analyzed requirements
        - Developed the solution
        - Tested thoroughly
        - Deployed to production
        
        **Result**: Successfully delivered the feature, which improved system performance by 30%.
        """,
        "skills_demonstrated": ticket["components"],
        "impact_metrics": "Improved system performance by 30%"
    }
    
    return mock_star

@app.post("/ask-question")
async def ask_question(question: UserQuestion, current_user: dict = Depends(get_current_user)):
    # In a real app, this would query the document database or use an AI service
    # For demo, return a mock response
    
    # Simple keyword matching for demo purposes
    keywords = question.question.lower().split()
    
    # Find documents that might answer the question
    relevant_docs = []
    for doc in mock_db["documents"]:
        if any(keyword in doc["title"].lower() or keyword in doc["content_summary"].lower() 
               or keyword in ' '.join(doc["keywords"]).lower() for keyword in keywords):
            relevant_docs.append(doc)
    
    if relevant_docs:
        response = {
            "answer": f"I found {len(relevant_docs)} documents that might help with your question.",
            "documents": relevant_docs
        }
    else:
        response = {
            "answer": "I couldn't find specific information about that. Would you like me to connect you with HR or the relevant department?",
            "documents": []
        }
    
    return response

@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    # In a real app, you would process and store the PDF
    # For demo, just return a success message
    try:
        contents = await file.read()
        pdf_file = BytesIO(contents)
        
        # Extract text from PDF
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        text = ""
        for page_num in range(len(pdf_reader.pages)):
            text += pdf_reader.pages[page_num].extract_text()
        
        return {
            "filename": file.filename,
            "content_preview": text[:500] + "..." if len(text) > 500 else text,
            "message": "File uploaded successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")

# Connect Tab Endpoints

@app.get("/people-recommendations", response_model=List[dict])
async def get_people_recommendations(current_user: dict = Depends(get_current_user)):
    # In a real app, this would use a recommendation algorithm
    # For demo, simple matching based on skills and interests
    
    user_skills = set(current_user["skills"])
    user_interests = set(current_user["interests"])
    
    recommendations = []
    for user in mock_db["users"]:
        if user["user_id"] == current_user["user_id"]:
            continue  # Skip current user
        
        other_skills = set(user["skills"])
        other_interests = set(user["interests"])
        
        # Calculate skill and interest overlap
        skill_match = len(user_skills.intersection(other_skills)) / len(user_skills.union(other_skills))
        interest_match = len(user_interests.intersection(other_interests)) / len(user_interests.union(other_interests))
        
        # Overall match score
        match_score = (skill_match + interest_match) / 2
        
        if match_score > 0.2:  # Arbitrary threshold
            recommendations.append({
                "user": user,
                "match_score": round(match_score * 100),
                "matching_skills": list(user_skills.intersection(other_skills)),
                "matching_interests": list(user_interests.intersection(other_interests))
            })
    
    # Sort by match score
    recommendations.sort(key=lambda x: x["match_score"], reverse=True)
    
    return recommendations[:5]  # Return top 5

@app.get("/learning-recommendations", response_model=List[dict])
async def get_learning_recommendations(current_user: dict = Depends(get_current_user)):
    # Recommend learning materials based on desired skills
    user_desired_skills = set(current_user["desired_skills"])
    
    recommendations = []
    for material in mock_db["learning_materials"]:
        material_skills = set(material["skills"])
        
        # Check if any of the material's skills are in the user's desired skills
        skill_overlap = user_desired_skills.intersection(material_skills)
        
        if skill_overlap:
            recommendations.append({
                "material": material,
                "matching_skills": list(skill_overlap),
                "relevance_score": round((len(skill_overlap) / len(user_desired_skills)) * 100)
            })
    
    # Sort by relevance score
    recommendations.sort(key=lambda x: x["relevance_score"], reverse=True)
    
    return recommendations[:5]  # Return top 5

# Elevate Tab Endpoints

@app.get("/job-recommendations", response_model=List[dict])
async def get_job_recommendations(current_user: dict = Depends(get_current_user)):
    # Recommend jobs based on current skills and desired skills
    user_skills = set(current_user["skills"])
    user_desired_skills = set(current_user["desired_skills"])
    all_user_skills = user_skills.union(user_desired_skills)
    
    recommendations = []
    for job in mock_db["job_postings"]:
        job_requirements = set(job["requirements"])
        job_preferred = set(job["preferred_skills"])
        
        all_job_skills = job_requirements.union(job_preferred)
        
        # Calculate match scores
        required_match = len(user_skills.intersection(job_requirements)) / len(job_requirements) if job_requirements else 0
        preferred_match = len(user_skills.intersection(job_preferred)) / len(job_preferred) if job_preferred else 0
        
        desired_skills_match = len(user_desired_skills.intersection(all_job_skills)) / len(user_desired_skills) if user_desired_skills else 0
        
        # Overall match score - weighted formula
        match_score = (required_match * 0.6) + (preferred_match * 0.3) + (desired_skills_match * 0.1)
        
        # Only include jobs with a decent match
        if match_score > 0.3:
            # Additional data useful for the UI
            matches = {
                "current_skills_match": list(user_skills.intersection(all_job_skills)),
                "desired_skills_match": list(user_desired_skills.intersection(all_job_skills)),
                "missing_requirements": list(job_requirements - user_skills)
            }
            
            recommendations.append({
                "job": job,
                "match_score": round(match_score * 100),
                "matches": matches
            })
    
    # Sort by match score
    recommendations.sort(key=lambda x: x["match_score"], reverse=True)
    
    return recommendations

# Conversation endpoints

@app.get("/conversations", response_model=List[dict])
async def get_conversations(current_user: dict = Depends(get_current_user)):
    # In a real app, filter conversations by the current user
    user_conversations = [conv for conv in mock_db["conversations"] 
                         if any(msg.get("user_id") == current_user["user_id"] for msg in conv.get("messages", []))]
    
    return user_conversations

@app.get("/conversations/{conversation_id}", response_model=dict)
async def get_conversation(conversation_id: str, current_user: dict = Depends(get_current_user)):
    conversation = next((conv for conv in mock_db["conversations"] if conv["id"] == conversation_id), None)
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    # Check if user has access to this conversation
    if not any(msg.get("user_id") == current_user["user_id"] for msg in conversation.get("messages", [])):
        raise HTTPException(status_code=403, detail="Not authorized to access this conversation")
    
    return conversation

@app.post("/conversations", response_model=dict)
async def create_conversation(message: str, current_user: dict = Depends(get_current_user)):
    # Create a new conversation
    conversation_id = f"conv-{len(mock_db['conversations']) + 1}"
    now = datetime.now().isoformat()
    
    new_conversation = {
        "id": conversation_id,
        "title": message[:30] + "..." if len(message) > 30 else message,
        "created_at": now,
        "updated_at": now,
        "messages": [
            {
                "content": message,
                "is_user": True,
                "timestamp": now,
                "user_id": current_user["user_id"]
            }
        ]
    }
    
    # In a real app, you'd save to a database
    mock_db["conversations"].append(new_conversation)
    
    # Generate AI response - in a real app, call your AI service
    ai_response = "Thanks for your message! I'm your career coach assistant. How can I help you today?"
    
    # Add AI response to conversation
    new_conversation["messages"].append({
        "content": ai_response,
        "is_user": False,
        "timestamp": datetime.now().isoformat(),
        "user_id": "ai-assistant"
    })
    
    return new_conversation

@app.post("/conversations/{conversation_id}/messages", response_model=dict)
async def add_message(conversation_id: str, message: str, current_user: dict = Depends(get_current_user)):
    # Find the conversation
    conversation = next((conv for conv in mock_db["conversations"] if conv["id"] == conversation_id), None)
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    # Add user message
    now = datetime.now().isoformat()
    conversation["messages"].append({
        "content": message,
        "is_user": True,
        "timestamp": now,
        "user_id": current_user["user_id"]
    })
    
    conversation["updated_at"] = now
    
    # Generate AI response - in a real app, call your AI service
    ai_response = "I've received your message and I'm processing it. In a real app, this would be a more intelligent response based on your input."
    
    # Add AI response
    conversation["messages"].append({
        "content": ai_response,
        "is_user": False,
        "timestamp": datetime.now().isoformat(),
        "user_id": "ai-assistant"
    })
    
    return conversation

# Run the application
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)