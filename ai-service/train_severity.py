import pandas as pd
from transformers import AutoTokenizer, AutoModelForSequenceClassification, TrainingArguments, Trainer
from sklearn.preprocessing import LabelEncoder
from datasets import Dataset
from sklearn.metrics import classification_report
import numpy as np
import joblib
import torch

# ============================
# LOAD DATASET
# ============================
new_df=pd.read_csv("dataset/combined_data_v1_2.csv")

# ============================
# DATA PREPROCESSING
# ============================
#print(new_df.shape)
#print(new_df.info())
#print(new_df.isnull().sum())
#print(new_df.duplicated().sum())
#print(new_df.head())

print(new_df["department"].value_counts())

print(new_df["severity"].value_counts())