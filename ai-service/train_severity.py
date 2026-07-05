import pandas as pd
from transformers import AutoTokenizer, AutoModelForSequenceClassification, TrainingArguments, Trainer
from sklearn.preprocessing import LabelEncoder
from datasets import Dataset
from sklearn.metrics import classification_report
import numpy as np
import joblib
import torch
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import confusion_matrix

new_df=pd.read_csv("dataset/combined_data_v1_2.csv")

#print(new_df.shape)
#print(new_df.info())
#print(new_df.isnull().sum())
#print(new_df.duplicated().sum())
#print(new_df.head())

new_df["severity"]=new_df["severity"].replace({"Critical":"High"})

tokenizer=AutoTokenizer.from_pretrained("distilbert-base-uncased")

complaints=new_df["complaint"].tolist()
tokenized_dataset=tokenizer(complaints, padding=True, truncation=True)

#print(type(tokenized_dataset))
#print(tokenized_dataset.keys())
#print(len(tokenized_dataset["input_ids"]))
#print(len(tokenized_dataset["attention_mask"]))

new_df["input_ids"] = tokenized_dataset["input_ids"]
new_df["attention_mask"] = tokenized_dataset["attention_mask"]

#print(new_df.columns)
#print(new_df[["input_ids", "attention_mask"]].head())

le= LabelEncoder()
new_df["label"]=le.fit_transform(new_df["severity"])

#print(new_df["label"].head())

joblib.dump(le, "models/severity_label_encoder.pkl")

#print(new_df.columns)

dataset=Dataset.from_pandas(new_df)
#print(dataset)

dataset=dataset.train_test_split(test_size=0.2, seed=42)
train_dataset=dataset["train"]
test_dataset=dataset["test"]

test_df=test_dataset.to_pandas()

#print(train_dataset.shape)
#print(test_dataset.shape)

columns = ["input_ids", "attention_mask", "label"]

train_dataset.set_format(type="torch", columns=columns)
test_dataset.set_format(type="torch", columns=columns)

model=AutoModelForSequenceClassification.from_pretrained(
    "models/severity_model_v2",
    num_labels=3
)

training_args=TrainingArguments(
    output_dir="./results/severity",
    num_train_epochs=3,
    per_device_train_batch_size=16,
    per_device_eval_batch_size=16,
    eval_strategy="epoch",
    save_strategy="epoch",
    logging_dir="./logs",
    logging_steps=50,
    load_best_model_at_end=True,
    learning_rate=2e-5,
    weight_decay=0.01,
    metric_for_best_model="eval_loss",
    greater_is_better=False
)

trainer=Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=test_dataset,
)

print(len(train_dataset))

#trainer.train()

#trainer.save_model("models/severity_model_v2")
#tokenizer.save_pretrained("models/severity_model_v2")

predictions=trainer.predict(test_dataset)

print(predictions.predictions[:5])

x_true = predictions.label_ids
x_pred = np.argmax(predictions.predictions, axis=1)

#for i in range(len(x_true)):
#    if x_true[i] != x_pred[i]:
#       print("=" * 80)
#        print("Complaint :", test_df.iloc[i]["complaint"])
#        print("Actual    :", le.inverse_transform([x_true[i]])[0])
#        print("Predicted :", le.inverse_transform([x_pred[i]])[0])

print(classification_report(x_true, x_pred, target_names=le.classes_))

#print(new_df[new_df["severity"]=="Critical"].sample(20)[["complaint"]].to_string(index=False))

#print(new_df[new_df["severity"]=="High"].sample(20)[["complaint"]].to_string(index=False))

print("Confusion Matrix:")
print(confusion_matrix(x_true, x_pred))

#print(new_df.groupby(["severity"]).size())
#print()
#print(new_df.groupby(["department", "severity"]).size())