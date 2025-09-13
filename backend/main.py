
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import requests
from models import TrainRequest
from services.dataset_generator import generate_dataset

app = FastAPI()

#app.include_router(router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PromptRequest(BaseModel):
    prompt: str

OLLAMA_API_URL = "http://localhost:11434/api/generate"
CODEGEN_MODEL = "codegemma:2b"

@app.post("/generate")
def generate_code(data: PromptRequest):
    print("End point hit!")
    payload = {
        "model": CODEGEN_MODEL,
        "prompt": data.prompt,
        "stream": False
    }

    try:
        response = requests.post(OLLAMA_API_URL, json=payload)
        print(response.content)
        response.raise_for_status()
        output = response.json().get("response", "")
        return {"generated_code": output}
    except requests.RequestException as e:
        return {"error": str(e)}
    
@app.post("/train")
async def train(req: TrainRequest):
    print(req)
    if req.mode == "local":
        generate_dataset(req.value)

    # Step 2: Train CodeGemma
    # TODO: call your CodeGemma training script here

    return {"status": "success", "message": "Dataset generated and CodeGemma training started"}

