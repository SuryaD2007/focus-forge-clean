import { useState } from "react";

function App() {
  const [goal, setGoal] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const response = await fetch("http://localhost:3000/generate-study-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goal }),
    });

    const data = await response.json();
    setPlan(data.plan);
    setLoading(false);
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "auto" }}>
      <h1>🎯 FocusForge</h1>
      <p>Enter your study goal below:</p>
      <input
        type="text"
        placeholder="e.g. SAT in 2 months, 2 hrs/day"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        style={{ width: "100%", padding: "10px", fontSize: "16px", marginBottom: "20px" }}
      />
      <button
        onClick={handleGenerate}
        disabled={loading}
        style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
      >
        {loading ? "Generating..." : "Generate Study Plan"}
      </button>

      {plan && (
        <div style={{ marginTop: "30px", whiteSpace: "pre-wrap", background: "#f7f7f7", padding: "20px", borderRadius: "8px" }}>
          <h3>Your Personalized Plan:</h3>
          <p>{plan}</p>
        </div>
      )}
    </div>
  );
}

export default App;
