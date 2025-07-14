# AI Agent Player

> **Enterprise-Grade Platform for Building, Training, and Managing AI Agents**

---

## 👐 Open Source
AI Agent Player is released as an **open source project** under the MIT License. You are free to use, modify, and contribute to the codebase for personal, academic, or commercial purposes.

- **License:** MIT (see [LICENSE](./LICENSE))
- **Contributions:** Pull requests and issues are welcome! See the contributing guide in `docs/`.

---

## 🚀 Overview
AI Agent Player is a modern, full-stack platform designed to empower businesses and developers to create, deploy, and manage advanced AI agents for automation, chat, training, and workflow orchestration. Built with scalability, security, and extensibility in mind, it provides a robust foundation for next-generation AI solutions.

---

## 🏗️ Architecture
- **Backend:** FastAPI (Python), async, modular, clean architecture
- **Frontend:** React 18+ (TypeScript), component-based, real-time UI
- **Database:** PostgreSQL (prod) / SQLite (dev), SQLAlchemy ORM
- **API:** 130+ REST endpoints, JWT authentication, OpenAPI docs
- **Testing:** Comprehensive suite, all tests in `backend/test/`
---

## ✨ Key Features
- **AI Agent Management:** Create, configure, and deploy custom agents
- **Real-Time Chat:** Multi-agent chat, WebSocket support, analytics
- **Training Lab:** Agent training, evaluation, and performance tracking
- **Licensing System:** Feature control, device binding, compliance
- **Marketplace:** Buy/sell agent templates, tools, and workflows
- **Custom Field Builder:** Advanced form and data customization
- **Security:** RBAC, audit logging, encrypted data, compliance-ready
- **Extensible:** Modular codebase, easy integration, API-first design

---

## 📁 Project Structure
```
├── backend/    # FastAPI backend, business logic, database, tests
├── frontend/   # React + TypeScript frontend, UI, services
├── docs/       # Official documentation (API, database, guides)
├── test/       # Backend test scripts (organized)
├── .cursor/rules/ # Project rules & standards (enforced)
└── README.md   # Project overview (this file)
```

---

## ⚡ Quick Start

### 1. Backend (API Server)
```bash
cd backend
pip install -r requirements.txt
uvicorn api:app --reload
```

### 2. Frontend (Web App)
```bash
cd frontend
npm install
npm run dev
```

- Backend: http://localhost:8000
- Frontend: http://localhost:5173

---

## 📚 Documentation
- **Full Docs:** [`docs/`](./docs/)
- **API Reference:** [`docs/02-api/`](./docs/02-api/)
- **Database Schema:** [`docs/01-database/`](./docs/01-database/)
- **Rules & Standards:** [`.cursor/rules/`](.cursor/rules/)

---

## 🛡️ Project Standards
- **English only** in all code, comments, and commits
- All backend tests in `backend/test/` only
- No temporary/demo/test files in root or production folders
- One `README.md` per main directory
- See `.cursor/rules/` for full standards

---

## 🤝 Contact & Support
- **Commercial:** [support@dpro.at](mailto:support@dpro.at)
- **Privacy:** [privacy@dpro.dev](mailto:privacy@dpro.dev)
- **Enterprise:** [enterprise@dpro.dev](mailto:enterprise@dpro.dev)

---

> For detailed guides, API usage, and advanced configuration, see the `docs/` folder. 