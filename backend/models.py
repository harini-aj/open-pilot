from pydantic import BaseModel

class TrainRequest(BaseModel):
    mode: str  # "git" or "local"
    value: str # repo URL or local path