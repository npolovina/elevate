# backend/app/db/init_db.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from ..models import Base, User, JiraTicket, PolicyDocument, LearningMaterial, JobPosting, StarExample, Conversation, Message
import datetime
import json
import os

# Create database directory if it doesn't exist
os.makedirs("data", exist_ok=True)

# Define database URL
SQLALCHEMY_DATABASE_URL = "sqlite:///./data/elevate.db"

# Create engine and tables
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
Base.metadata.create_all(bind=engine)

# Create session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

# Check if data already exists
if db.query(User).first() is not None:
    print("Database already contains data. Skipping initialization.")
    db.close()
    exit()

# Create sample user
default_user = User(
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
jira_tickets_data = [
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
    },
    {
        "ticket_id": "PROJ-104",
        "title": "Mobile Responsive Design",
        "description": "Update the customer portal to be fully responsive on mobile devices",
        "status": "Completed",
        "priority": "Medium",
        "start_date": datetime.datetime(2025, 2, 15),
        "completion_date": datetime.datetime(2025, 2, 25),
        "components": ["frontend", "ui", "mobile"],
        "user_id": default_user.id
    },
    {
        "ticket_id": "PROJ-105",
        "title": "API Rate Limiting Implementation",
        "description": "Implement rate limiting for public APIs to prevent abuse",
        "status": "Completed",
        "priority": "High",
        "start_date": datetime.datetime(2025, 1, 5),
        "completion_date": datetime.datetime(2025, 1, 12),
        "components": ["backend", "api", "security"],
        "user_id": default_user.id
    }
]

for ticket_data in jira_tickets_data:
    ticket = JiraTicket(**ticket_data)
    db.add(ticket)

db.commit()

# Create STAR examples for completed tickets
completed_tickets = db.query(JiraTicket).filter(JiraTicket.status == "Completed").all()

star_examples_data = [
    {
        "ticket_id": completed_tickets[0].id,  # Authentication Service
        "user_id": default_user.id,
        "content": """
**Situation**: Our customer portal needed a secure authentication system to protect user data and ensure compliance with security standards.

**Task**: I was assigned to implement a complete authentication service with JWT tokens, including secure login, token management, and role-based access control.

**Action**: 
- Designed and implemented a JWT-based authentication system with refresh token functionality
- Incorporated best security practices including password hashing, rate limiting, and token expiration
- Created comprehensive API documentation for the auth endpoints
- Collaborated with the security team to pass all required audits

**Result**: The authentication service passed security audit with no issues and has maintained zero security incidents since deployment. The implementation of refresh tokens improved user experience by reducing the need for frequent logins while maintaining security.
        """,
        "skills_demonstrated": ["security", "backend", "api"],
        "impact_metrics": "Reduced authentication-related support tickets by 45%, passed all security compliance requirements"
    },
    {
        "ticket_id": completed_tickets[1].id,  # Dashboard Analytics
        "user_id": default_user.id,
        "content": """
**Situation**: Executives and team leads needed better visibility into key performance indicators but were struggling to interpret raw data.

**Task**: Create intuitive, interactive data visualizations for the main dashboard to help stakeholders quickly understand performance trends.

**Action**: 
- Analyzed user needs across different departments to identify key metrics
- Selected D3.js as the visualization library for its flexibility and interactivity
- Developed custom charts including time-series, comparative, and distribution visualizations
- Implemented user controls for filtering and customizing the view

**Result**: The executive team reported significant improvements in their ability to make data-driven decisions. Time spent analyzing reports decreased by 30%, while the frequency of data-informed decisions increased. The visualizations are now used in weekly executive meetings and have become a critical decision-making tool.
        """,
        "skills_demonstrated": ["frontend", "data-visualization", "ui"],
        "impact_metrics": "30% reduction in report analysis time, adopted by executive team for weekly decision-making"
    }
]

for star_data in star_examples_data:
    star = StarExample(**star_data)
    db.add(star)

db.commit()

# Create policy documents
policy_docs_data = [
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
    },
    {
        "title": "Code of Conduct",
        "category": "HR",
        "summary": "Company code of conduct and ethical guidelines for all employees",
        "file_path": "code_of_conduct.pdf",
        "keywords": ["conduct", "ethics", "behavior", "guidelines"]
    },
    {
        "title": "Data Privacy Guidelines",
        "category": "Legal",
        "summary": "Guidelines for handling customer and employee data in compliance with regulations",
        "file_path": "data_privacy_guidelines.pdf",
        "keywords": ["privacy", "gdpr", "data handling", "compliance"]
    }
]

for doc_data in policy_docs_data:
    doc = PolicyDocument(**doc_data)
    db.add(doc)

db.commit()

# Create learning materials
learning_materials_data = [
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
    },
    {
        "title": "Cloud Security Best Practices",
        "description": "Security best practices for cloud environments",
        "type": "Webinar",
        "skills": ["Cloud Security", "AWS", "Security"],
        "url": "https://learning.company.com/webinars/cloud-security",
        "duration": "2 hours",
        "rating": 4.5
    },
    {
        "title": "Leadership for Technical Professionals",
        "description": "Develop leadership skills for technical roles",
        "type": "Mentorship Program",
        "skills": ["Leadership", "Communication", "Team Management"],
        "url": "https://learning.company.com/programs/tech-leadership",
        "duration": "12 weeks",
        "rating": 4.9
    }
]

for material_data in learning_materials_data:
    material = LearningMaterial(**material_data)
    db.add(material)

db.commit()

# Create job postings
job_postings_data = [
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
    },
    {
        "title": "Data Scientist",
        "department": "Data Science",
        "description": "Develop machine learning models to optimize business processes and drive insights",
        "location": "Boston, MA (Hybrid)",
        "requirements": ["3+ years of data science experience", "Python", "Statistical analysis", "Machine learning"],
        "preferred_skills": ["Deep learning", "NLP", "Data visualization", "A/B testing"],
        "salary_range": "$130,000 - $170,000",
        "posted_date": datetime.datetime(2025, 2, 25),
        "internal_only": False
    },
    {
        "title": "Security Engineer",
        "department": "Security",
        "description": "Help secure our applications, infrastructure, and customer data",
        "location": "Remote",
        "requirements": ["4+ years of security engineering", "Application security experience", "Security assessment skills"],
        "preferred_skills": ["Cloud security", "Threat modeling", "Penetration testing", "Security automation"],
        "salary_range": "$140,000 - $180,000",
        "posted_date": datetime.datetime(2025, 3, 8),
        "internal_only": False
    }
]

for job_data in job_postings_data:
    job = JobPosting(**job_data)
    db.add(job)

db.commit()

# Create sample conversation
conversation = Conversation(
    title="Career growth questions"
)
db.add(conversation)
db.commit()
db.refresh(conversation)

messages_data = [
    {
        "conversation_id": conversation.id,
        "content": "What skills should I focus on to move into a leadership role?",
        "is_user": True,
        "timestamp": datetime.datetime(2025, 3, 10, 14, 30)
    },
    {
        "conversation_id": conversation.id,
        "content": """Based on your profile and current role as a Senior Software Engineer, to move into a leadership role, I recommend focusing on these key areas:

1. **People Management Skills**: Start by mentoring junior team members or leading small project teams to develop your ability to guide and support others.

2. **Communication Skills**: Work on clearly articulating technical concepts to non-technical stakeholders and improving your presentation skills.

3. **Strategic Thinking**: Practice thinking beyond immediate technical problems to understand how your work aligns with broader business goals.

4. **Project Management**: Gain experience managing project timelines, resources, and deliverables.

The "Leadership for Technical Professionals" mentorship program would be an excellent resource for you. Would you like specific recommendations for developing any of these particular skills?""",
        "is_user": False,
        "timestamp": datetime.datetime(2025, 3, 10, 14, 32)
    }
]

for message_data in messages_data:
    message = Message(**message_data)
    db.add(message)

db.commit()

print("Database successfully initialized with sample data.")
db.close()