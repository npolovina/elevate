# backend/app/db/seed_data.py
from sqlalchemy.orm import Session
from .. import models
import datetime
import json

def seed_database(db: Session):
    # Check if data already exists
    if db.query(models.User).count() > 0:
        print("Database already seeded")
        return
    
    # Create default user
    default_user = models.User(
        name="Alex Johnson",
        role="Senior Software Engineer",
        department="Engineering",
        skills=["Python", "React", "FastAPI", "AWS", "Security"],
        interests=["Machine Learning", "Cloud Architecture", "Mobile Development"],
        desired_skills=["Kubernetes", "Machine Learning", "Leadership"],
        experience_years=5
    )
    db.add(default_user)
    db.commit()
    db.refresh(default_user)
    
    # Create JIRA tickets
    jira_tickets = [
        {
            "ticket_id": "PROJ-101",
            "title": "Implement Authentication Service",
            "description": "Create a secure authentication service with JWT tokens for the customer portal",
            "status": "Completed",
            "priority": "High",
            "start_date": datetime.datetime(2025, 1, 15),
            "completion_date": datetime.datetime(2025, 1, 28),
            "components": ["security", "backend", "api"],
            "user_id": default_user.id
        },
        {
            "ticket_id": "PROJ-102",
            "title": "Dashboard Analytics Visualization",
            "description": "Create data visualizations for the main dashboard to display key performance indicators",
            "status": "Completed",
            "priority": "Medium",
            "start_date": datetime.datetime(2025, 2, 1),
            "completion_date": datetime.datetime(2025, 2, 10),
            "components": ["frontend", "data-visualization", "ui"],
            "user_id": default_user.id
        },
        {
            "ticket_id": "PROJ-103",
            "title": "Database Performance Optimization",
            "description": "Improve query performance for customer transaction database",
            "status": "In Progress",
            "priority": "High",
            "start_date": datetime.datetime(2025, 3, 1),
            "components": ["database", "performance", "backend"],
            "user_id": default_user.id
        }
    ]
    
    for ticket_data in jira_tickets:
        ticket = models.JiraTicket(**ticket_data)
        db.add(ticket)
    
    db.commit()
    
    # Create policy documents
    policy_documents = [
        {
            "title": "Remote Work Policy",
            "category": "HR",
            "summary": "Guidelines for remote work arrangements including eligibility, expectations, and tools",
            "file_path": "remote_work_policy.pdf",
            "keywords": ["remote", "work from home", "wfh", "telecommute"]
        },
        {
            "title": "Security Compliance Standards",
            "category": "Security",
            "summary": "Information security standards that all employees must follow",
            "file_path": "security_compliance.pdf",
            "keywords": ["security", "compliance", "data protection", "information security"]
        },
        {
            "title": "Performance Review Process",
            "category": "HR",
            "summary": "Overview of the performance review cycle, expectations, and forms",
            "file_path": "performance_review_process.pdf",
            "keywords": ["performance", "review", "evaluation", "feedback"]
        }
    ]
    
    for doc_data in policy_documents:
        doc = models.PolicyDocument(**doc_data)
        db.add(doc)
    
    db.commit()
    
    # Create learning materials
    learning_materials = [
        {
            "title": "Advanced React Patterns",
            "description": "Learn advanced React patterns including hooks, context, and performance optimization",
            "type": "Course",
            "skills": ["React", "JavaScript", "Frontend Development"],
            "url": "https://learning.company.com/courses/advanced-react-patterns",
            "duration": "10 hours",
            "rating": 4.8
        },
        {
            "title": "Kubernetes for Developers",
            "description": "Practical guide to Kubernetes for software developers",
            "type": "Workshop",
            "skills": ["Kubernetes", "Docker", "DevOps"],
            "url": "https://learning.company.com/workshops/kubernetes-for-developers",
            "duration": "8 hours",
            "rating": 4.7
        },
        {
            "title": "Machine Learning Fundamentals",
            "description": "Introduction to machine learning concepts and techniques",
            "type": "Course",
            "skills": ["Machine Learning", "Python", "Data Science"],
            "url": "https://learning.company.com/courses/ml-fundamentals",
            "duration": "40 hours",
            "rating": 4.9
        }
    ]
    
    for material_data in learning_materials:
        material = models.LearningMaterial(**material_data)
        db.add(material)
    
    db.commit()
    
    # Create job postings
    job_postings = [
        {
            "title": "Senior Frontend Engineer",
            "department": "Engineering",
            "description": "Join our frontend team to build responsive and accessible user interfaces",
            "location": "San Francisco, CA (Hybrid)",
            "requirements": ["5+ years of React experience", "Strong TypeScript skills", "Experience with state management"],
            "preferred_skills": ["Design systems experience", "Performance optimization", "Testing methodologies"],
            "salary_range": "$140,000 - $180,000",
            "posted_date": datetime.datetime(2025, 3, 1),
            "internal_only": False
        },
        {
            "title": "Engineering Manager - Platform Team",
            "department": "Engineering",
            "description": "Lead a team of engineers building our core platform services",
            "location": "Seattle, WA (Hybrid)",
            "requirements": ["7+ years of engineering experience", "3+ years of management experience", "Strong technical leadership"],
            "preferred_skills": ["Distributed systems", "Mentorship", "Strategic planning"],
            "salary_range": "$180,000 - $220,000",
            "posted_date": datetime.datetime(2025, 3, 15),
            "internal_only": True
        },
        {
            "title": "DevOps Engineer",
            "department": "Infrastructure",
            "description": "Help us build and maintain our cloud infrastructure and CI/CD pipelines",
            "location": "Remote",
            "requirements": ["3+ years of cloud platform experience", "Kubernetes", "Infrastructure as Code"],
            "preferred_skills": ["AWS", "Terraform", "Monitoring systems"],
            "salary_range": "$130,000 - $160,000",
            "posted_date": datetime.datetime(2025, 3, 5),
            "internal_only": False
        }
    ]
    
    for job_data in job_postings:
        job = models.JobPosting(**job_data)
        db.add(job)
    
    db.commit()
    
    print("Database seeded successfully")

# Add to main.py
@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()