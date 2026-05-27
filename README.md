# ResumeX ⚡

An AI-powered resume analyzer that gives brutally honest feedback, a score out of 100, and actionable improvements — built with Next.js, FastAPI, and Google Gemini.

---

## Screenshot

![ResumeX Demo](screenshot.png)

---

## Features

- Upload any resume in PDF format
- AI-generated score out of 100
- Honest roast of your resume's weaknesses
- Highlighted strengths
- Specific, actionable improvement suggestions
- Final recruiter-style verdict

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Backend | Python, FastAPI |
| AI Model | Google Gemini 2.5 Flash |
| PDF Parsing | pdfplumber |

---

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.9+
- Google Gemini API key (free at [aistudio.google.com](https://aistudio.google.com))

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file inside `/backend`:
GEMINI_API_KEY=your_api_key_here

Start the backend:
```bash
uvicorn main:app --reload
```

Backend runs on `http://localhost:8000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

---

## Project Structure
resumex/
├── backend/
│   ├── main.py           # FastAPI app + Gemini integration
│   ├── requirements.txt
│   └── .env              # API key (not committed)
└── frontend/
└── app/
├── page.tsx      # Main UI
└── layout.tsx    # Metadata + fonts

---

## Environment Variables

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Your Google Gemini API key |

---

## Author

**Lakshay Gupta**
[LinkedIn](https://www.linkedin.com/in/lakshaygupta-17b7ba244) · [GitHub](https://github.com/LoG1604)

---

> Built as part of a personal AI portfolio project.
