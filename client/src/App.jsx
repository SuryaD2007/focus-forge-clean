import { useState } from "react";
import "./App.css";

function App() {
  const [goal, setGoal] = useState("");
  const [plan, setPlan] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [chatReply, setChatReply] = useState("");

  // Use environment variable for backend URL
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleSubmit = async () => {
    setPlan("⏳ Generating...");
    try {
      const res = await fetch(`${apiUrl}/generate-study-plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ goal }),
      });

      const data = await res.json();
      setPlan(data.plan || "⚠️ No plan received");
    } catch (err) {
      console.error("Client Error:", err);
      setPlan("❌ Failed to generate a plan. Please check the backend.");
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>🎯 Study Plan Generator</h1>
      <input
        type="text"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        placeholder="Learn full-stack web dev in 3 months"
        style={{ width: "400px", padding: "10px", fontSize: "1rem" }}
      />
      <button onClick={handleSubmit} style={{ marginLeft: "1rem", padding: "10px 20px" }}>
        Generate Plan
      </button>
      <div
        style={{
          marginTop: "2rem",
          background: "#f8f8f8",
          padding: "20px",
          borderRadius: "8px",
          fontSize: "1rem",
          lineHeight: "1.6",
        }}
        dangerouslySetInnerHTML={{
          __html: plan
            .replace(/\*\*/g, "")
            .replace(/\n{2,}/g, "<br/><br/>")
            .replace(/\n\s*[-–•]\s*(.*?)(?=\n|$)/g, "<div style='margin-left: 20px; margin-bottom: 8px;'>• $1</div>")
            .replace(/\n/g, "<br/>")
            .replace(/\n\s*\d+\.\s*(.*?):/g, "<div style='font-size: 1.3rem; font-weight: bold; margin: 1.5rem 0 0.5rem;'>$&</div>"),
        }}
      ></div>

      {plan && !plan.startsWith("⏳") && !plan.startsWith("❌") && (
        <button
          onClick={() => {
            const element = document.createElement("a");
            const file = new Blob([plan], { type: "text/plain" });
            element.href = URL.createObjectURL(file);
            element.download = "study-plan.txt";
            document.body.appendChild(element);
            element.click();
          }}
          style={{
            marginTop: "1rem",
            padding: "10px 20px",
            fontSize: "1rem",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          ⬇️ Download as .txt
        </button>
      )}

      <h2 style={{ marginTop: "2rem" }}>💬 Ask your GPT Tutor</h2>

      <input
        type="text"
        value={chatMessage}
        onChange={(e) => setChatMessage(e.target.value)}
        placeholder="Ask a follow-up question..."
        style={{ width: "100%", padding: "10px", fontSize: "1rem", marginTop: "10px" }}
      />

      <button
        onClick={async () => {
          setChatReply("⏳ Thinking...");
          try {
            const res = await fetch(`${apiUrl}/chat`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ message: chatMessage }),
            });
            const data = await res.json();
            setChatReply(data.reply || "⚠️ No reply received.");
          } catch (err) {
            console.error("❌ Chat Error:", err);
            setChatReply("❌ Chat request failed.");
          }
        }}
        style={{ marginTop: "10px", padding: "10px 20px", cursor: "pointer" }}
      >
        Ask GPT
      </button>

      {chatReply && (
        <div
          style={{
            marginTop: "1.5rem",
            padding: "1.2rem",
            background: "#f9f9f9",
            borderRadius: "10px",
            fontSize: "16px",
            lineHeight: "1.6",
            whiteSpace: "pre-wrap",
            border: "1px solid #ddd",
          }}
        >
          <strong style={{ display: "block", marginBottom: "0.5rem" }}>GPT says:</strong>
          {chatReply.replace(/\*\*/g, "")}
        </div>
      )}
    </div>
  );
}

export default App;
