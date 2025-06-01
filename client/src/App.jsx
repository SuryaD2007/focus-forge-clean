import { useEffect, useState } from "react";
import "./App.css";
import {
  auth,
  provider,
  signInWithPopup,
  signOut,
  db,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "./firebase";

function App() {
  console.log("⚡ App loaded"); // ✅ Add this

  const [goal, setGoal] = useState("");
  const [plan, setPlan] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [chatReply, setChatReply] = useState("");
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const savedUser = localStorage.getItem("focusforge_user");
    if (savedUser) setUser(JSON.parse(savedUser));
    console.log("🔍 VITE_API_URL:", import.meta.env.VITE_API_URL);


  }, []);

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      localStorage.setItem("focusforge_user", JSON.stringify(result.user));
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const logout = () => {
    signOut(auth);
    setUser(null);
    localStorage.removeItem("focusforge_user");
  };

  const handleSubmit = async () => {
    setPlan("⏳ Generating...");
    try {
      const res = await fetch(`${apiUrl}/generate-study-plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal }),
      });

      const data = await res.json();
      setPlan(data.plan || "⚠️ No plan received");

      if (user) {
        await addDoc(collection(db, "plans"), {
          uid: user.uid,
          goal,
          plan: data.plan,
          createdAt: new Date(),
        });
      }
    } catch (err) {
      console.error("Client Error:", err);
      setPlan("❌ Failed to generate a plan. Please check the backend.");
    }
  };

  const fetchHistory = async () => {
    if (!user) return;
    const q = query(
      collection(db, "plans"),
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    const items = snapshot.docs.map((doc) => doc.data());
    setHistory(items);
  };

  console.log("👤 user state is:", user);

  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-sans">
      <h1 className="text-3xl font-bold mb-4">🎯 Study Plan Generator</h1>

      {user ? (
        <div className="mb-4">
          <p className="mb-2">Welcome, {user.displayName}</p>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            🚪 Log Out
          </button>
        </div>
      ) : (
        <button
          onClick={login}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          🔐 Sign in with Google
        </button>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <input
          type="text"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Learn full-stack web dev in 3 months"
          className="w-full sm:w-96 px-4 py-2 border rounded text-base"
        />
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Generate Plan
        </button>
      </div>

      {plan && (
        <div className="mt-6 bg-gray-100 p-4 rounded text-base leading-relaxed">
          <h3 className="text-lg font-semibold mb-2">Your Personalized Plan:</h3>
          <div
            dangerouslySetInnerHTML={{
              __html: plan
                .replace(/\*\*/g, "")
                .replace(/\n{2,}/g, "<br/><br/>")
                .replace(/\n\s*[-–•]\s*(.*?)(?=\n|$)/g, "<div class='ml-4 mb-2'>• $1</div>")
                .replace(/\n/g, "<br/>")
                .replace(/\n\s*\d+\.\s*(.*?):/g, "<div class='text-lg font-bold mt-6 mb-2'>$&</div>")
            }}
          />
          <button
            onClick={() => {
              localStorage.removeItem("focusforge_lastPlan");
              localStorage.removeItem("focusforge_lastGoal");
              setPlan("");
              setGoal("");
            }}
            className="mt-4 px-3 py-2 text-sm bg-gray-300 hover:bg-gray-400 rounded"
          >
            🗑 Clear Saved Plan
          </button>
        </div>
      )}

      {user && (
        <div className="mt-8">
          <button
            onClick={fetchHistory}
            className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            📜 Show My Plan History
          </button>
          <ul className="space-y-4">
            {history.map((item, index) => (
              <li key={index} className="bg-gray-200 p-4 rounded">
                <strong>Goal:</strong> {item.goal}
                <br />
                <strong>Plan:</strong> <br /> {item.plan}
              </li>
            ))}
          </ul>
        </div>
      )}

      <h2 className="mt-10 text-xl font-semibold">💬 Ask your GPT Tutor</h2>

      <input
        type="text"
        value={chatMessage}
        onChange={(e) => setChatMessage(e.target.value)}
        placeholder="Ask a follow-up question..."
        className="w-full px-4 py-2 mt-2 border rounded text-base"
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
        className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        Ask GPT
      </button>

      {chatReply && (
        <div className="mt-4 p-4 bg-gray-100 rounded text-base border border-gray-300">
          <strong className="block mb-2">GPT says:</strong>
          {chatReply.replace(/\*\*/g, "")}
        </div>
      )}
    </div>
  );
}

export default App;

// 🔁 Vercel redeploy trigger
