import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from sklearn.preprocessing import LabelEncoder
import pandas as pd

df=pd.read_csv("dataset/combined_data.csv")

le= LabelEncoder()
le.fit(df["department"])

tokenizer = AutoTokenizer.from_pretrained(
    "models/civicfix_department_model"
)

model = AutoModelForSequenceClassification.from_pretrained(
    "models/civicfix_department_model"
)

model.eval()

complaint = "There is no water supply in our locality since yesterday."

inputs = tokenizer(
    complaint,
    return_tensors="pt",
    truncation=True,
    padding=True
)

with torch.no_grad():
    outputs = model(**inputs)

print(outputs.logits)

predicted_label = outputs.logits.argmax(dim=1).item()

print("Predicted Label:", predicted_label)

predicted_department = le.inverse_transform([predicted_label])[0]

print("Predicted Department:", predicted_department)

