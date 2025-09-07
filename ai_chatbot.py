# Tip: Run the app with:
# uvicorn ai_chatbot:app --host 0.0.0.0 --port 8000 --reload

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from llama_cpp import Llama
import asyncio
from concurrent.futures import ThreadPoolExecutor
import os

app = FastAPI()

# -----------------------
# CORS Configuration
# -----------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Your frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------
# Global variables
# -----------------------
llm = None
executor = ThreadPoolExecutor(max_workers=2)  # Use 2 threads for stability

# -----------------------
# Load model at startup
# -----------------------
@app.on_event("startup")
async def load_model():
    global llm
    print("⏳ Loading GPT4All Falcon model...")

    model_path = "./gpt4all-falcon-newbpe-q4_0.gguf"  # Your lightweight model

    # Initialize model using Metal GPU for Mac M1
    llm = await asyncio.to_thread(
        Llama,
        model_path=model_path,
        n_threads=2,
        use_metal=True
    )

    print("✅ Model loaded successfully.")

# -----------------------
# Async inference helper
# -----------------------
async def generate_response(prompt: str, max_tokens: int = 150, temperature: float = 0):
    global llm
    if llm is None:
        raise HTTPException(status_code=503, detail="Model not ready.")

    response = await asyncio.to_thread(
        llm,
        prompt,
        max_tokens=max_tokens,
        temperature=temperature
    )

    text = ""
    if "choices" in response:
        for choice in response["choices"]:
            text += choice.get("text", "").strip()
    return text

# -----------------------
# Chat endpoint
# -----------------------
@app.post("/chat")
async def chat_endpoint(request: Request):
    try:
        data = await request.json()
        user_prompt = data.get("prompt", "").strip()
        if not user_prompt:
            raise HTTPException(status_code=400, detail="Prompt is required.")

        max_tokens = min(int(data.get("max_tokens", 150)), 150)

        # Clear, single-turn prompt for precise answers
        instruction = "You are a helpful AI assistant. Provide the direct answer to the following math expression or question."
        full_prompt = f"{instruction}\n{user_prompt}\nAnswer:"

        text = await generate_response(prompt=full_prompt, max_tokens=max_tokens)
        return JSONResponse(content={"response": text})

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
