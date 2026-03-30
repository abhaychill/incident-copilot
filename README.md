# ⚡ Incident Copilot

An AI-powered incident response tool built for financial services and enterprise resilience teams. Combines real-time runbook guidance and multi-audience stakeholder communication generation into a single interface — activated by logging a single incident.

Built with React and the Claude API (Anthropic).

---

## 🎯 The Problem

When a SEV1 incident hits, two things need to happen simultaneously:
- Engineers need **step-by-step guidance** on how to respond and recover
- Stakeholders need **clear, audience-appropriate communications** immediately

Today these happen in silos, manually, under pressure. Incident Copilot unifies both into one AI-driven workflow.

---

## ✨ Features

- **Incident Intake Form** — Log an incident with title, severity, affected system, and description
- **Runbook Assistant** — AI chat that immediately surfaces structured first steps and guides responders interactively through resolution
- **Communications Generator** — Auto-drafts three tailored communications simultaneously:
  - 🛠 Technical Team — engineering detail and action items
  - 👔 Senior Leadership — business impact, no jargon
  - 🌐 External Clients — professional, calm, customer-facing language
- **Live Incident Status Bar** — Tracks active incident metadata throughout the session

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React |
| AI | Claude API (Anthropic) — claude-opus-4-5 |
| Styling | Custom CSS |
| Markdown rendering | react-markdown |

---

## 🚀 Running Locally

### Prerequisites
- Node.js
- An Anthropic API key (get one at console.anthropic.com)

### Setup
```bash
git clone https://github.com/abhaychill/incident-copilot.git
cd incident-copilot
npm install
```

Create a `.env` file in the root directory:
```
REACT_APP_ANTHROPIC_KEY=your_api_key_here
```

Start the app:
```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 💡 Use Case Context

This project was built to demonstrate how AI can augment **Technology Resilience** workflows in financial services — specifically targeting the gap between incident detection and coordinated response. Potential enterprise extensions include:

- RAG-based retrieval from real internal runbook libraries
- Integration with PagerDuty, ServiceNow, or Jira for incident ingestion
- Automated post-incident report generation
- Slack/Teams notification delivery
- RTO/RPO breach prediction during active incidents

---

## 📁 Project Structure
```
src/
├── App.js           # Main layout and incident state management
├── RunbookPanel.js  # AI runbook chat assistant
├── CommsPanel.js    # AI communications generator
├── api.js           # Anthropic API calls
└── index.css        # Styling
```

---

*Built as a portfolio project exploring AI applications in enterprise technology resilience.*