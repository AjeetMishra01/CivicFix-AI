import pandas as pd
from transformers import AutoTokenizer, AutoModelForSequenceClassification, TrainingArguments, Trainer
from sklearn.preprocessing import LabelEncoder
from datasets import Dataset
from sklearn.metrics import classification_report
import numpy as np

claude_df= pd.read_csv("dataset/data_claude.csv")
gemini_df= pd.read_csv("dataset/data_gemini.csv")


combined_df = pd.concat([claude_df, gemini_df], ignore_index=True)

#print(combined_df.shape)

#print(combined_df.info())

#print(combined_df.isnull().sum())

#print(combined_df.duplicated().sum())

#combined_df.to_csv("dataset/combined_data.csv", index=False)

tokenizer=AutoTokenizer.from_pretrained("distilbert-base-uncased")

complaints=combined_df["complaint"].tolist()
tokenized_dataset=tokenizer(complaints, padding=True, truncation=True)

#print(type(tokenized_dataset))
#print(tokenized_dataset.keys())
#print(len(tokenized_dataset["input_ids"]))
#print(len(tokenized_dataset["attention_mask"]))

le= LabelEncoder()
combined_df["label"]=le.fit_transform(combined_df["department"])

#print(combined_df.head())

combined_df["input_ids"] = tokenized_dataset["input_ids"]
combined_df["attention_mask"] = tokenized_dataset["attention_mask"]

dataset=Dataset.from_pandas(combined_df)
#print(dataset)

dataset = dataset.train_test_split(test_size=0.2, seed=42)
train_dataset = dataset["train"]
test_dataset = dataset["test"]

columns = ["input_ids", "attention_mask", "label"]

train_dataset.set_format(type="torch", columns=columns)
test_dataset.set_format(type="torch", columns=columns)

#print(len(train_dataset))
#print(len(test_dataset))

model=AutoModelForSequenceClassification.from_pretrained(
    "distilbert-base-uncased",
    num_labels=10
      )

training_args=TrainingArguments(
    output_dir="./results",
    num_train_epochs=3,
    per_device_train_batch_size=16,
    per_device_eval_batch_size=16,
    eval_strategy="epoch",
    save_strategy="epoch",
    logging_steps=50,
    load_best_model_at_end=True,
    learning_rate=2e-5,
)

trainer=Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=test_dataset,
)

#trainer.train()

#model.save_pretrained("models/civicfix_department_model")
#tokenizer.save_pretrained("models/civicfix_department_model")

model = AutoModelForSequenceClassification.from_pretrained(
    "models/civicfix_department_model"
)

trainer = Trainer(model=model)

predictions = trainer.predict(test_dataset)

y_true = predictions.label_ids
y_pred = np.argmax(predictions.predictions, axis=1)

print(classification_report(
    y_true,
    y_pred,
    target_names=le.classes_
))
