# 🎯 Focus-Forge

AI-powered study planner that creates personalized schedules using your learning goals.  
Built with **React**, **Express**, and **OpenAI API**.

---

## 🌐 Live Demo

[![](https://img.shields.io/badge/Live%20Demo-🌐-blue?style=for-the-badge)](https://focus-forge-clean.vercel.app/)


---

## 🛠️ How to Run Locally

### 1. Clone the Repository

bash

git clone https://github.com/SuryaD2007/Focus-Forge.git
cd Focus-Forge

### 2. Install Dependencies

cd client
npm install

cd ../server
npm install

### 3. Set Up OpenAI API Key

Create a file named .env inside the server/ folder with:

OPENAI_API_KEY=your_openai_key_here

You can get your API key from: https://platform.openai.com/account/api-keys 


### 4. Run the App

Start Backend (Express):

cd server
node index.js

Start Frontend (React + Vite):

cd ../client
npm run dev

Then go to: http://localhost:5173

### 5. Features

 AI-generated study plans

 GPT-powered Q&A support

 Export study plan as .txt

 Fast React/Vite frontend

 Fullstack integration

### 6. Deployment Notes

Vercel:
 
  - Set root to client/

  - Build command: npm run build

  - Output dir: dist

Render:
 
  - Set root to server/

  - Start command: node index.js

  - Add OPENAI_API_KEY in environment variables


### 7. License

MIT – free to use, modify, and share.

---

Run:

```bash
git add README.md
git rebase --continue
git push origin main

 This version uses **clear, consistent markdown headers** (`###`) and section numbering, so it renders cleanly and professionally on GitHub. 

