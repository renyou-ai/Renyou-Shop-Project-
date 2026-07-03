import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";

const pythonPath = path.join(
  process.cwd(),
  "venv312",
  "Scripts",
  "python.exe"
);

const pythonProcess = spawn(
  pythonPath,
  ["ai/florence_test.py"]
);

pythonProcess.stdout.on("data", (data) => {
  console.log("[FLORENCE]", data.toString());
});

pythonProcess.stderr.on("data", (data) => {
  console.error("[FLORENCE ERROR]", data.toString());
});

export async function analyzeSkin(imageBase64) {
  const base64Data = imageBase64.replace(
    /^data:image\/\w+;base64,/,
    ""
  );

  const imagePath = path.join("temp", "upload.jpg");

  fs.writeFileSync(
    imagePath,
    Buffer.from(base64Data, "base64")
  );

  return new Promise((resolve, reject) => {

    const listener = async (data) => {
      try {
        const text = data.toString().trim();

        if (
          text === "READY" ||
          text.includes("LOADING_MODEL")
        ) {
          return;
        }

        pythonProcess.stdout.off(
          "data",
          listener
        );

        const florenceResult = JSON.parse(text);

const groqResponse = await fetch(
  "https://api.groq.com/openai/v1/chat/completions",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `
You are a skin analysis AI.

Based ONLY on the description provided.

You MUST estimate:

- overall_skin_score (40-95)
- hydration (30-95)
- texture
- radiance

Use different values whenever the description changes.

Do NOT default to 85 or 70.

Return ONLY JSON.

{
  "overall_skin_score": number,
  "hydration": number,
  "texture": "Smooth|Balanced|Uneven",
  "radiance": "High|Warm|Soft|Low",
  "summary": "short text"
}
`
        },
        {
          role: "user",
          content: florenceResult.description
        }
      ],
      temperature: 0.3,
      max_tokens: 200
    })
  }
);

const groqData = await groqResponse.json();

const aiText =
  groqData?.choices?.[0]?.message?.content;

  
resolve(JSON.parse(aiText));

      } catch (err) {
        reject(err);
      }
    };

    pythonProcess.stdout.on(
      "data",
      listener
    );

    pythonProcess.stdin.write(
      imagePath + "\n"
    );
  });
}