from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from llama_cpp import Llama
import asyncio
from concurrent.futures import ThreadPoolExecutor
import os
import uuid

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

llm = None
executor = ThreadPoolExecutor(max_workers=2)
session_store = {}

@app.on_event("startup")
async def load_model():
    global llm
    print("⏳ Loading GPT4All Falcon model...")

    model_path = "./gpt4all-falcon-newbpe-q4_0.gguf"

    llm = await asyncio.to_thread(
        Llama,
        model_path=model_path,
        n_threads=2,
        use_metal=True
    )

    print("✅ Model loaded successfully.")

async def generate_response(prompt: str, max_tokens: int = 50, temperature: float = 0):
    global llm
    if llm is None:
        raise HTTPException(status_code=503, detail="Model not ready.")

    try:
        response = await asyncio.wait_for(
            asyncio.to_thread(
                llm,
                prompt,
                max_tokens=max_tokens,
                temperature=temperature
            ),
            timeout=30  # Prevent hanging indefinitely
        )

        text = ""
        if "choices" in response:
            for choice in response["choices"]:
                text += choice.get("text", "").strip()
        return text

    except asyncio.TimeoutError:
        raise HTTPException(status_code=504, detail="Model inference timed out.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")

@app.post("/chat")
async def chat_endpoint(request: Request):
    try:
        data = await request.json()
        session_id = data.get("session_id")
        user_prompt = data.get("prompt", "").strip()
        max_tokens = min(int(data.get("max_tokens", 50)), 50)

        if not user_prompt:
            raise HTTPException(status_code=400, detail="Prompt is required.")

        if not session_id or session_id not in session_store:
            session_id = str(uuid.uuid4())
            session_store[session_id] = []

        session_store[session_id].append({"sender": "User", "text": user_prompt})

        # Limit history to last 3 exchanges (6 entries: 3 user + 3 assistant)
        session_store[session_id] = session_store[session_id][-6:]

        instruction = "You are a helpful AI assistant. Answer clearly and concisely."
        full_prompt = instruction + "\n"
        for msg in session_store[session_id]:
            full_prompt += f"{msg['sender']}: {msg['text']}\n"
        full_prompt += "Assistant:"

        text = await generate_response(prompt=full_prompt, max_tokens=max_tokens)

        session_store[session_id].append({"sender": "Assistant", "text": text})

        return JSONResponse(content={"session_id": session_id, "response": text})

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
