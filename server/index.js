const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: 'https://focus-forge-clean.vercel.app',
  methods: ['GET', 'POST'],
  credentials: true,
}));
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/generate-study-plan', async (req, res) => {
  const { goal } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful study coach.' },
        { role: 'user', content: `Create a detailed study plan for this goal: ${goal}` },
      ],
    });

    res.json({ plan: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate study plan.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
