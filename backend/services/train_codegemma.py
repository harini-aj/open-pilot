from datasets import load_dataset
from transformers import AutoModelForCausalLM, AutoTokenizer, TrainingArguments, Trainer
from peft import LoraConfig, get_peft_model
import torch

# ===== Load Dataset =====
dataset = load_dataset("json", data_files="dataset.json")
train_data = dataset["train"]

# ===== Load Model and Tokenizer =====
model_name = "google/codegemma-2b"  # Change if using another variant
tokenizer = AutoTokenizer.from_pretrained(model_name)
tokenizer.pad_token = tokenizer.eos_token

# ===== Tokenization Function =====
def tokenize(batch):
    prompt = [
        f"### Instruction:\n{inst}\n\n### Input:\n{inp}\n\n### Response:\n{out}"
        for inst, inp, out in zip(batch["instruction"], batch["input"], batch["output"])
    ]
    tokens = tokenizer(prompt, padding="max_length", truncation=True, max_length=512)
    tokens["labels"] = tokens["input_ids"].copy()
    return tokens

train_tokenized = train_data.map(tokenize, batched=True, remove_columns=train_data.column_names)

# ===== LoRA Config =====
lora_config = LoraConfig(
    r=16,
    lora_alpha=32,
    target_modules=["q_proj", "v_proj"],  # Common for transformer LLMs
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM"
)

# ===== Load Model with LoRA =====
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    load_in_8bit=True,  # Requires bitsandbytes
    device_map="auto"
)
model = get_peft_model(model, lora_config)

# ===== Training Arguments =====
training_args = TrainingArguments(
    output_dir="./codegemma-lora",
    per_device_train_batch_size=2,
    gradient_accumulation_steps=4,
    num_train_epochs=3,
    learning_rate=2e-4,
    fp16=True,
    logging_steps=10,
    save_steps=500,
    save_total_limit=2,
    evaluation_strategy="no",
    report_to="none"
)

# ===== Trainer =====
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_tokenized,
    tokenizer=tokenizer
)

# ===== Train =====
trainer.train()

# ===== Save Adapter =====
model.save_pretrained("./codegemma-lora-adapter")
tokenizer.save_pretrained("./codegemma-lora-adapter")
