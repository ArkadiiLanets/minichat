import { useState } from "react";
import { sendToGemini } from "../services/geminiApi";
import { Message } from "../types/message"

export const Chat = () => {
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem("chat_history");
      return saved ? (JSON.parse(saved) as Message[]) : [];
    } catch {
      return [];
    }
  });

  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    const updated = [...messages, { role: "user", text: input }];
    setMessages(updated);
    setInput("");

    try {
      const response = await sendToGemini(
        updated.map((m) => ({
          parts: [{ text: m.text }],
          role: m.role,
        }))
      );
      const final = [...updated, { role: "model", text: response }];
      setMessages(final);
      localStorage.setItem("chat_history", JSON.stringify(final));
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages.map((m, i) => (
          <div key={i} className={`message ${m.role}`}>
            <strong>{m.role === "user" ? "You" : "AI"}:</strong> {m.text}
          </div>
        ))}
      </div>
      {error && <div className="error">⚠️ {error}</div>}
      <div className="input-group">
        <input
          type="text"
          value={input}
          placeholder="Type your message..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};
