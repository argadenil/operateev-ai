from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from llama_cpp import Llama
import asyncio
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
session_store = {}


@app.on_event("startup")
async def load_model():
    global llm
    print("⏳ Loading LLaMA model...")

    model_path = "./llama-2-7b-chat-hf-q4_k_m.gguf"

    llm = await asyncio.to_thread(
        Llama,
        model_path=model_path,
        n_threads=4,
        n_gpu_layers=20,
        use_mlock=True
    )

    print("✅ Model loaded.")


@app.post("/chat")
async def chat(request: dict):
    try:
        session_id = request.get("session_id") or str(uuid.uuid4())
        user_prompt = request.get("prompt", "").strip()
        max_tokens = min(int(request.get("max_tokens", 150)), 300)

        if not user_prompt:
            raise HTTPException(status_code=400, detail="Prompt is required.")

        # Maintain session history
        session_store.setdefault(session_id, [])
        session_store[session_id].append({"sender": "User", "text": user_prompt})
        session_store[session_id] = session_store[session_id][-6:]

        instruction = "You are a helpful AI assistant. Answer clearly and concisely."
        full_prompt = instruction + "\n"
        for msg in session_store[session_id]:
            full_prompt += f"{msg['sender']}: {msg['text']}\n"
        full_prompt += "Assistant:"

        # Run inference in background thread without blocking
        response = await asyncio.to_thread(
            llm,
            full_prompt,
            max_tokens=max_tokens,
            temperature=0.7
        )

        text = ""
        for choice in response.get("choices", []):
            text += choice.get("text", "").strip()

        session_store[session_id].append({"sender": "Assistant", "text": text})

        return JSONResponse(content={"session_id": session_id, "response": text})

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
