const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config(); // Load .env

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 Create OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID,
});

// 🧠 Route to generate response
app.post('/generate-study-plan', async (req, res) => {
  const { goal } = req.body;

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // or "gpt-4" if you have access
      messages: [
        { role: "system", content: "You're a helpful tutor." },
        { role: "user", content: `Create a study plan to achieve: ${goal}` }
      ],
    });

    res.json({ plan: chatCompletion.choices[0].message.content });
  } catch (err) {
    console.error("❌ OpenAI error:", err);
    res.status(500).json({ error: "Failed to generate response." });
  }
});

app.post("/chat", async (req, res) => {
  const { message } = req.body;
  console.log("🟡 Incoming Chat Message:", message); // 👈 ADD THIS

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful study tutor." },
        { role: "user", content: message }
      ]
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (err) {
    console.error("❌ Chat Error:", err); // 👈 WATCH THIS OUTPUT
    res.status(500).json({ error: "Chat failed." });
  }
});


const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
