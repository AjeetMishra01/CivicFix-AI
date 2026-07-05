import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from sklearn.preprocessing import LabelEncoder
import pandas as pd

# Load new dataset
df = pd.read_csv("dataset/combined_data_v1_2.csv")

# Fit Label Encoder on Severity
le = LabelEncoder()
le.fit(df["severity"])

# Load tokenizer
tokenizer = AutoTokenizer.from_pretrained(
    "models/severity_model"
)

# Load trained model
model = AutoModelForSequenceClassification.from_pretrained(
    "models/severity_model"
)

model.eval()

complaint = "Couple are doing intimate activites in the park these are adult stuff and should not be done in public places. This is a public park and there are children around."

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

predicted_severity = le.inverse_transform([predicted_label])[0]

print("Predicted Severity:", predicted_severity)

print(le.classes_)

