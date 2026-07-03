from fastapi import FastAPI
from transformers import AutoModelForSequenceClassification, AutoTokenizer
from sklearn.preprocessing import LabelEncoder
import pandas as pd
from pydantic import BaseModel

app=FastAPI()
class ComplaintRequest(BaseModel):
    complaint: str

df=pd.read_csv("dataset/combined_data.csv")
le=LabelEncoder()
le.fit(df["department"])

MODEL_NAME = "AjeetMishra01/civicfix-ai-model"

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)

model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)

model.eval()

@app.get("/")
def home():
    return {"message": "CivicFix AI Service is running."}

import torch

@app.post("/predict")
def predict(request: ComplaintRequest):

    inputs = tokenizer(
        request.complaint,
        return_tensors="pt",
        truncation=True,
        padding=True
    )

    with torch.no_grad():
        outputs = model(**inputs)

    predicted_label = outputs.logits.argmax(dim=1).item()

    predicted_department = le.inverse_transform([predicted_label])[0]

    return {
        "department": predicted_department
    }
    

