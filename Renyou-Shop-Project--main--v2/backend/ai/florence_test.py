from PIL import Image
from transformers import AutoProcessor, AutoModelForCausalLM
import json
import sys

MODEL_ID = "microsoft/Florence-2-base"

print("LOADING_MODEL...", flush=True)

model = AutoModelForCausalLM.from_pretrained(
    MODEL_ID,
    trust_remote_code=True
)

processor = AutoProcessor.from_pretrained(
    MODEL_ID,
    trust_remote_code=True
)

print("READY", flush=True)

while True:
    image_path = sys.stdin.readline().strip()

    if not image_path:
        continue

    try:
        image = Image.open(image_path).convert("RGB")

        prompt = "<MORE_DETAILED_CAPTION>"

        inputs = processor(
            text=prompt,
            images=image,
            return_tensors="pt"
        )

        generated_ids = model.generate(
            input_ids=inputs["input_ids"],
            pixel_values=inputs["pixel_values"],
            max_new_tokens=128
        )

        result = processor.batch_decode(
            generated_ids,
            skip_special_tokens=True
        )[0]

        print(json.dumps({
            "description": result
        }), flush=True)

    except Exception as e:
        print(json.dumps({
            "error": str(e)
        }), flush=True)