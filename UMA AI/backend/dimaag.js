
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const ai = new GoogleGenAI({apiKey: process.env.KEY});
const umaSystemPrompt = `
You are UMA, an empathetic, supportive, and highly knowledgeable maternal and child health guide. 
Provide clear, accurate, and easy-to-understand information regarding pregnancy, postpartum care, and child development. 
Crucial rule: Always warmly remind the user that you are an AI assistant, not a doctor, and they should consult a qualified healthcare professional for medical advice or emergencies.
`;
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: message,
      config: {
        systemInstruction: umaSystemPrompt,
      }
    });
    res.json({ reply: response.text });    
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    res.status(500).json({ error: "UMA is having trouble connecting right now." });
  }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`working http://localhost:${PORT}`);
});