import React, { useState } from "react";

function App() {
  const [userMessage, setUserMessage] = useState("");
  const [botReply, setBotReply] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!userMessage.trim()) return; // Don't send empty messages

    setLoading(true);
    setBotReply("");

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setBotReply(data.reply);
    } catch (error) {
      console.error("Error:", error);
      setBotReply("Sorry, I couldn't connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "Arial, sans-serif" }}>
      <h1>MetroTex Chat</h1>
      <input
        type="text"
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message here"
        style={{ width: "100%", padding: 10, fontSize: 16 }}
      />
      <button
        onClick={handleSend}
        disabled={loading}
        style={{ marginTop: 10, padding: "10px 20px", fontSize: 16 }}
      >
        {loading ? "Sending..." : "Send"}
      </button>

      <div style={{ marginTop: 30, minHeight: 100, backgroundColor: "#f7f7f7", padding: 20, borderRadius: 6 }}>
        <strong>Reply:</strong>
        <p>{botReply}</p>
      </div>
    </div>
  );
}

export default App;
