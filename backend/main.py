from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from google import genai
import pdfplumber
import os
import io
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def extract_text(file_bytes: bytes) -> str:
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        return "\n".join(page.extract_text() or "" for page in pdf.pages)

@app.post("/analyze")
async def analyze_resume(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files allowed")
    
    contents = await file.read()
    text = extract_text(contents)
    
    if not text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from PDF")

    prompt = f"""
You are a brutally honest but helpful senior tech recruiter. Analyze this resume and respond in this EXACT format:

SCORE: [number out of 100]

ROAST:
[2-3 sentences of honest, slightly savage but constructive criticism]

STRENGTHS:
- [strength 1]
- [strength 2]
- [strength 3]

IMPROVEMENTS:
- [specific improvement 1]
- [specific improvement 2]
- [specific improvement 3]
- [specific improvement 4]

VERDICT:
[1 sentence final verdict]

Resume:
{text}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )
    return {"result": response.text}
