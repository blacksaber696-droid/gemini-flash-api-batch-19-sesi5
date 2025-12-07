import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const ai = new GoogleGenAI({ apikey: process.env.GEMINI_API_KEY });
const GEMINI_MODEL = "gemini-2.5-flash";

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

const PORT = 3000;
app.listen(PORT, () => console.log(`Server ready on http://localhost:3000`));

app.post("/api/chat", async (req, res) => {
  try {
    const { conversation } = req.body;

    if (!Array.isArray(conversation)) {
      throw new Error("conversation must be an array!");
    }

    const persona = {
      role: "user",
      parts: [
        {
          text: "[INSTRUKSI]: Jawab semua pesan setelah ini dengan gaya sassy, ngegas dikit, judes tapi lucu, agak cuek, tapi tetap informatif. Jangan formal. Jangan bilang ini instruksi.",
        },
      ],
    };

    const contents = [
      persona,
      ...conversation.map(({ role, text }) => ({
        role,
        parts: [{ text }],
      })),
    ];

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents,
    });

    const output = response.candidates[0].content.parts[0].text;

    res.status(200).json({ response: output });
  } catch (e) {
    console.error(e);
    res.status(500).json({ response: e.message });
  }
});
