# PhishGuard MVP

**PhishGuard** is a proven MVP project: an intelligent multi-agent system for recognizing phishing messages and online fraud, based on OWL ontology and ACL communication between agents.

## What the project covers

- Web graphical part with React/Vite.
- Backend API with Node.js/Express.
- OWL ontology in `server/ontology/phishguard.owl`.
- Ontology manipulation via API and UI.
- At least 2 types of agents — 5 have been implemented.
- ACL communication between agents in FIPA-style JSON format.
- SQLite database for analytics, history and ACL messages.
- Documentation in `docs/PhishGuard_Documentation.md` and `docs/PhishGuard_Documentation.docx`.

## Architecture in brief

```text
React Web App
↓ HTTP
Express Backend API
↓
CoordinatorAgent
↓ ACL messages
MessageAnalysisAgent
LinkAnalysisAgent
RiskAssessmentAgent
RecommendationAgent
↓
OWL Ontology + SQLite Database
```

## Installation

Requirements:

- Node.js 20+ recommended.
- npm.

Steps:

```bash
npm install
npm run dev
```

After launch:

- Frontend: http://localhost:5173
- Backend: http://localhost:4000
- Health check: http://localhost:4000/api/health

## How to demonstrate

1. Open the web application.
2. Paste a sample phishing SMS/email.
3. Click **Analyze message**.
4. Show:
- risk level;
- detected signs;
- recommendations;
- ACL communication between agents;
- recorded history;
- ontology management page.

Sample test message:

```text
Your bank account will be blocked. Urgently confirm your password and data here: http://secure-bank-login.example.com
```

## Important directories

```text
client/ React/Vite graphical part
server/ Express API + agents + database + ontology
server/src/agents/ Multi-agent system
server/src/services/ Ontology and database services
server/ontology/ OWL file
server/data/ SQLite DB and JSON model of the ontology
docs/ Exam documentation
```

## Note

This is a protective cybersecurity system. It does not create phishing messages, but analyzes already received messages and gives recommendations for protection.
