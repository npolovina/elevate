# backend/app/models.py
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Table, Text, JSON, Float
from sqlalchemy.orm import relationship
from .db.database import Base
import datetime

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    role = Column(String)
    department = Column(String)
    skills = Column(JSON)  # Store as JSON array
    interests = Column(JSON)  # Store as JSON array
    desired_skills = Column(JSON)  # Store as JSON array
    experience_years = Column(Integer)
    
    jira_tickets = relationship("JiraTicket", back_populates="assignee")
    star_examples = relationship("StarExample", back_populates="user")

class JiraTicket(Base):
    __tablename__ = "jira_tickets"
    
    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(String, unique=True, index=True)
    title = Column(String)
    description = Column(Text)
    status = Column(String)  # "In Progress", "Completed", etc.
    priority = Column(String)  # "High", "Medium", "Low"
    start_date = Column(DateTime, default=datetime.datetime.utcnow)
    completion_date = Column(DateTime, nullable=True)
    components = Column(JSON)  # Store as JSON array
    user_id = Column(Integer, ForeignKey("users.id"))
    
    assignee = relationship("User", back_populates="jira_tickets")
    star_example = relationship("StarExample", back_populates="ticket", uselist=False)

class StarExample(Base):
    __tablename__ = "star_examples"
    
    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(Integer, ForeignKey("jira_tickets.id"), unique=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    content = Column(Text)
    skills_demonstrated = Column(JSON)  # Store as JSON array
    impact_metrics = Column(String)
    
    ticket = relationship("JiraTicket", back_populates="star_example")
    user = relationship("User", back_populates="star_examples")

class PolicyDocument(Base):
    __tablename__ = "policy_documents"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    category = Column(String, index=True)
    summary = Column(Text)
    file_path = Column(String)  # Path to PDF file
    keywords = Column(JSON)  # Store as JSON array

class LearningMaterial(Base):
    __tablename__ = "learning_materials"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    type = Column(String)  # "Course", "Workshop", etc.
    skills = Column(JSON)  # Store as JSON array
    url = Column(String)
    duration = Column(String)
    rating = Column(Float)

class JobPosting(Base):
    __tablename__ = "job_postings"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    department = Column(String, index=True)
    description = Column(Text)
    location = Column(String)
    requirements = Column(JSON)  # Store as JSON array
    preferred_skills = Column(JSON)  # Store as JSON array
    salary_range = Column(String)
    posted_date = Column(DateTime, default=datetime.datetime.utcnow)
    internal_only = Column(Boolean, default=False)

class Conversation(Base):
    __tablename__ = "conversations"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    
    messages = relationship("Message", back_populates="conversation")

class Message(Base):
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"))
    content = Column(Text)
    is_user = Column(Boolean, default=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    
    conversation = relationship("Conversation", back_populates="messages")