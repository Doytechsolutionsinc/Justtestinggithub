import React, { useState, useEffect, useRef } from 'react';
import Chat from './components/Chat';

const API_URL = "https://metrotex-backend.onrender.com"; // Replace with your Render backend URL

fetch(`${process.env.REACT_APP_API_URL}/`, {
function App() {
  const [messages, setMessages] = useState([
    { text: "Hello! I am MetroTex, your smart assistant.", side: "left" }
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { text: input, side: "right" };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    const botMessage = { text: "Typing...", side: "left" };
    setMessages(prev => [...prev, botMessage]);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages(prev => {
        // Remove the "Typing..." message and add the real reply
        const newMessages = prev.slice(0, -1);
        return [...newMessages, { text: data.reply, side: "left" }];
      });
    } catch (error) {
      setMessages(prev => {
        const newMessages = prev.slice(0, -1);
        return [...newMessages, { text: "Sorry, I couldn't reach the server.", side: "left" }];
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="app-container">
      <header>
        <img src="/logo.png" alt="MetroTex Logo" className="logo" />
        <h1>MetroTex</h1>
      </header>

      <div className="chat-window">
        {messages.map((msg, i) => (
          <Chat key={i} text={msg.text} side={msg.side} />
        ))}
        <div ref={scrollRef} />
      </div>

      <div className="input-area">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          rows={1}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
