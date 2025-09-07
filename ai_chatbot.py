from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from llama_cpp import Llama
import asyncio
import traceback

app = FastAPI()

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model variable
llm = None

@app.on_event("startup")
async def load_model():
    global llm
    loop = asyncio.get_event_loop()
    print("⏳ Loading Qwen Reasoner model, please wait...")
    llm = await loop.run_in_executor(
        None,
        lambda: Llama(model_path="./DeepSeek-R1-Distill-Qwen-7B-Q4_0.gguf")
    )
    print("✅ Qwen 2.5 Reasoner V1 model loaded successfully.")

@app.post("/chat")
async def chat_endpoint(request: Request):
    global llm

    if llm is None:
        raise HTTPException(status_code=503, detail="Model is not loaded yet. Please try again later.")

    try:
        data = await request.json()
        user_prompt = data.get("prompt", "").strip()
        max_tokens = data.get("max_tokens", 2048)

        if not user_prompt:
            raise HTTPException(status_code=400, detail="Prompt is required.")

        # Pass user-provided prompt directly
        prompt = f"{user_prompt}\n"

        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            None,
            lambda: llm(
                prompt=prompt,
                max_tokens=max_tokens,
                temperature=0.7
            )
        )

        print("🔍 Full Raw Response:", response)

        text = ""
        if "choices" in response:
            for choice in response["choices"]:
                text += choice.get("text", "").strip()

        return JSONResponse(content={"response": text})

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
