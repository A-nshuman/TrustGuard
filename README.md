# TrustGuard

Healthcare Fraud Detection System

## Team
- Anshuman Bhardwaj
- Sukhjot Singh
- Sritiz Sahu

## Tech Stack
- React (Vite)
- Firebase
- FastAPI
- Scikit-learn

## Structure
frontend/ → UI  
backend/ → API  
ml/ → ML  
docs/ → Docs

## Run Locally

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### ML API
```bash
cd ml
pip install -r requirements.txt
uvicorn api:app
```

### Backend
```bash
cd backend/functions
npm install
firebase emulators:start
```