jira_tickets = [
    {
        "ticket_id": "PROJ-101",
        "title": "Implement Authentication Service",
        "description": "Create a secure authentication service with JWT tokens for the customer portal",
        "status": "Completed",
        "assignee": "user123",
        "start_date": "2025-01-15",
        "completion_date": "2025-01-28",
        "priority": "High",
        "comments": [
            {"user": "manager456", "text": "Great implementation! The security audit passed with no issues.", "date": "2025-01-29"},
            {"user": "user123", "text": "Overcame challenge with token expiration by implementing refresh tokens", "date": "2025-01-28"}
        ],
        "components": ["security", "backend", "api"],
        "story_points": 8
    },
    {
        "ticket_id": "PROJ-102",
        "title": "Dashboard Analytics Visualization",
        "description": "Create data visualizations for the main dashboard to display key performance indicators",
        "status": "Completed",
        "assignee": "user123",
        "start_date": "2025-02-01",
        "completion_date": "2025-02-10",
        "priority": "Medium",
        "comments": [
            {"user": "user123", "text": "Used D3.js to create interactive charts that improved data interpretation", "date": "2025-02-08"},
            {"user": "manager456", "text": "The executive team was impressed with the visualizations", "date": "2025-02-12"}
        ],
        "components": ["frontend", "data-visualization", "ui"],
        "story_points": 5
    },
    {
        "ticket_id": "PROJ-103",
        "title": "Database Performance Optimization",
        "description": "Improve query performance for customer transaction database",
        "status": "In Progress",
        "assignee": "user123",
        "start_date": "2025-03-01",
        "completion_date": None,
        "priority": "High",
        "comments": [
            {"user": "user123", "text": "Identified bottlenecks in transaction queries, implementing indexed views", "date": "2025-03-05"}
        ],
        "components": ["database", "performance", "backend"],
        "story_points": 13
    },
    {
        "ticket_id": "PROJ-104",
        "title": "Mobile Responsive Design",
        "description": "Update the customer portal to be fully responsive on mobile devices",
        "status": "Completed",
        "assignee": "user123",
        "start_date": "2025-02-15",
        "completion_date": "2025-02-25",
        "priority": "Medium",
        "comments": [
            {"user": "user123", "text": "Implemented responsive design patterns and conducted testing on multiple devices", "date": "2025-02-24"},
            {"user": "tester789", "text": "All test cases passed. Great attention to detail on small screens.", "date": "2025-02-26"}
        ],
        "components": ["frontend", "ui", "mobile"],
        "story_points": 5
    },
    {
        "ticket_id": "PROJ-105",
        "title": "API Rate Limiting Implementation",
        "description": "Implement rate limiting for public APIs to prevent abuse",
        "status": "Completed",
        "assignee": "user123",
        "start_date": "2025-01-05",
        "completion_date": "2025-01-12",
        "priority": "High",
        "comments": [
            {"user": "user123", "text": "Implemented token bucket algorithm with Redis for distributed rate limiting", "date": "2025-01-10"},
            {"user": "security999", "text": "This implementation resolves vulnerability CVE-2024-1234. Well done!", "date": "2025-01-14"}
        ],
        "components": ["backend", "api", "security"],
        "story_points": 5
    },
    {
        "ticket_id": "PROJ-106",
        "title": "Customer Data Export Feature",
        "description": "Create a feature allowing customers to export their data in compliance with GDPR",
        "status": "In Progress",
        "assignee": "user123",
        "start_date": "2025-03-10",
        "completion_date": None,
        "priority": "Medium",
        "comments": [
            {"user": "user123", "text": "Working on multiple export formats (CSV, JSON, PDF)", "date": "2025-03-12"}
        ],
        "components": ["backend", "compliance", "feature"],
        "story_points": 8
    },
    {
        "ticket_id": "PROJ-107",
        "title": "Automated Email Notification System",
        "description": "Create a system to send automated notifications for account activities",
        "status": "Completed",
        "assignee": "user123",
        "start_date": "2025-02-01",
        "completion_date": "2025-02-14",
        "priority": "Low",
        "comments": [
            {"user": "user123", "text": "Implemented template-based email system with queue management", "date": "2025-02-10"},
            {"user": "manager456", "text": "Customer feedback has been positive about the new notification system", "date": "2025-02-16"}
        ],
        "components": ["backend", "notification", "email"],
        "story_points": 5
    },
    {
        "ticket_id": "PROJ-108",
        "title": "Documentation Update for API v2",
        "description": "Update developer documentation for the v2 API release",
        "status": "Completed",
        "assignee": "user123",
        "start_date": "2025-01-20",
        "completion_date": "2025-01-25",
        "priority": "Medium",
        "comments": [
            {"user": "user123", "text": "Created interactive examples with Swagger UI integration", "date": "2025-01-24"},
            {"user": "dev555", "text": "Documentation is clear and easy to follow. Thank you!", "date": "2025-01-26"}
        ],
        "components": ["documentation", "api"],
        "story_points": 3
    },
    {
        "ticket_id": "PROJ-109",
        "title": "Payment Gateway Integration",
        "description": "Integrate new payment processor for international transactions",
        "status": "In Progress",
        "assignee": "user123",
        "start_date": "2025-03-05",
        "completion_date": None,
        "priority": "High",
        "comments": [
            {"user": "user123", "text": "Working through currency conversion challenges", "date": "2025-03-08"}
        ],
        "components": ["backend", "payment", "integration"],
        "story_points": 13
    },
    {
        "ticket_id": "PROJ-110",
        "title": "Accessibility Compliance Audit",
        "description": "Ensure all UI components meet WCAG 2.1 AA compliance",
        "status": "Completed",
        "assignee": "user123",
        "start_date": "2025-02-18",
        "completion_date": "2025-03-01",
        "priority": "High",
        "comments": [
            {"user": "user123", "text": "Fixed 27 accessibility issues across the application", "date": "2025-02-28"},
            {"user": "compliance777", "text": "All critical accessibility issues resolved. Application now complies with standards.", "date": "2025-03-02"}
        ],
        "components": ["frontend", "accessibility", "compliance"],
        "story_points": 8
    }
]
