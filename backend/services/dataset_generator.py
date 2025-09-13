import os
import json
import csv
import requests

OLLAMA_URL = "http://localhost:11434/api/generate"  # Ollama API endpoint
INSTRUCT_MODEL = "codegemma:instruct"

def generate_description(file_content: str) -> str:
    prompt = f"Describe in detail what this file does:\n\n{file_content}"
    
    resp = requests.post(
        OLLAMA_URL,
        json={
            "model": INSTRUCT_MODEL,
            "prompt": prompt,
            "stream": False
        }
    )
    resp.raise_for_status()
    data = resp.json()
    return data.get("response", "").strip()

def generate_dataset(path: str, output_format="json"):
    """
    Walks through the repo and generates dataset with file descriptions.
    """
    dataset = []

    # Step 1: Generate dataset
    print("Generating dataset...")

    for root, _, files in os.walk(path):
        for file in files:
            file_path = os.path.join(root, file)

            # Skip binary or huge files
            if not file_path.endswith((".py", ".js", ".ts", ".tsx", ".java", ".cpp", ".c", ".go", ".rb", ".php", ".html", ".css", ".json", ".md")):
                continue

            try:
                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()
            except Exception as e:
                print(f"❌ Could not read {file_path}: {e}")
                continue

            print(f"📄 Processing: {file_path}")
            desc = generate_description(content)
            print({
                "instruction": desc,
                "input": "",
                "output": content
            })
            dataset.append({
                "instruction": desc,
                "input": "",
                "output": content
            })

    # Save dataset
    output_file = f"dataset.{output_format}"
    if output_format == "json":
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(dataset, f, ensure_ascii=False, indent=2)
    elif output_format == "csv":
        with open(output_file, "w", encoding="utf-8", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=["file_path", "description"])
            writer.writeheader()
            writer.writerows(dataset)

    print("Generating dataset...Done")
    print(f"✅ Dataset saved to {output_file}")
    return output_file
