import { useState, useEffect } from "react";


function App() {

  useEffect(() => {
  const savedPlan = localStorage.getItem("focusforge_lastPlan");
  const savedGoal = localStorage.getItem("focusforge_lastGoal");

  if (savedPlan) {
    setPlan(savedPlan);
    setGoal(savedGoal || "");
  }
}, []);

  const [goal, setGoal] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);

const handleGenerate = async () => {
  setLoading(true);
  setPlan("");

  try {
    const response = await fetch("https://focus-forge-backend.onrender.com/generate-study-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goal }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    setPlan(data.plan);

    // ✅ Save to localStorage
    localStorage.setItem("focusforge_lastPlan", data.plan);
    localStorage.setItem("focusforge_lastGoal", goal);
  } catch (error) {
    console.error("❌ Error fetching study plan:", error);
    setPlan("⚠️ Failed to generate a plan. Please try again later.");
  }

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
