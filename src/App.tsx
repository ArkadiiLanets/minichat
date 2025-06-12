import React, { useState, useEffect, useRef } from 'react';
import { sendToGemini } from './services/geminiApi';
import ReactMarkdown from 'react-markdown';

import './App.css';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const STORAGE_KEY = 'chat_history';

const Loader = () => (
  <div className="loader" aria-label="Загрузка">
    <span className="loader-dot" />
    <span className="loader-dot" />
    <span className="loader-dot" />
  </div>
);

const App = () => {
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const chatWindowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
  
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      // Приветственное сообщение от AI
      setMessages([
        {
          role: 'model',
          text: 'Здравствуйте! 👋 Я — ваш психологический помощник. Задайте любые вопросы на тему психологии, и я постараюсь помочь.',
        },
      ]);
    }
  }, []);
  

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages: Message[] = [...messages, { role: 'user', text: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await sendToGemini(input);
      const updatedMessages: Message[] = [...newMessages, { role: 'model', text: response }];
      setMessages(updatedMessages);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMessages));
    } catch (error) {
      alert('Ошибка при запросе, я могу вести беседу по теме психология');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 className="title">💬Твой чат психолог</h2>
      <div className="chatWindow" ref={chatWindowRef}>
      {messages.map((msg, idx) => (
  <div key={idx} className={`message ${msg.role}`}>
    <span className="messageRole">{msg.role === 'user' ? 'Вы' : 'Психолог'}:</span>
    <ReactMarkdown>{msg.text}</ReactMarkdown>
  </div>
))}

        {loading && (
          <div className="message model loader-wrapper" aria-label="Чат думает">
            <Loader />
          </div>
        )}
      </div>
      <textarea
        className="textarea"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={4}
        placeholder="Введите сообщение..."
        disabled={loading}
        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
      />
      <button className="button" onClick={handleSend} disabled={loading || !input.trim()}>
        Отправить
      </button>
    </div>
  );
};

export default App;





