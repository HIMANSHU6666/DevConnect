import React, { useState, useRef, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

// --- Icons as inline SVG components ---
const BotIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7v4" />
    <line x1="8" y1="16" x2="8" y2="16" strokeWidth="3" />
    <line x1="12" y1="16" x2="12" y2="16" strokeWidth="3" />
    <line x1="16" y1="16" x2="16" y2="16" strokeWidth="3" />
  </svg>
);

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const SparkleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
  </svg>
);

const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
  </svg>
);

// --- Suggested quick prompts ---
const QUICK_PROMPTS = [
  { label: '🛒 My Cart', text: 'What products are in my cart?' },
  { label: '📦 My Orders', text: 'Show me my recent orders.' },
  { label: '🏪 My Products', text: 'List all my products.' },
];

// --- Typing indicator component ---
const TypingIndicator = () => (
  <div className="ai-chat__typing">
    <span></span>
    <span></span>
    <span></span>
  </div>
);

// --- Single message bubble ---
const MessageBubble = ({ msg }) => {
  const isUser = msg.role === 'user';
  return (
    <div className={`ai-chat__message ${isUser ? 'ai-chat__message--user' : 'ai-chat__message--bot'}`}>
      {!isUser && (
        <div className="ai-chat__avatar">
          <BotIcon />
        </div>
      )}
      <div className="ai-chat__bubble">
        {msg.text.split('\n').map((line, i, arr) => (
          <span key={i}>
            {line}
            {i < arr.length - 1 && <br />}
          </span>
        ))}
        <span className="ai-chat__time">
          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};

export const AiChat = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: "Hi! 👋 I'm your AI assistant powered by RAG. I can help you with your cart, orders, and products. What would you like to know?",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const sendMessage = async (text) => {
    const messageText = (text || input).trim();
    if (!messageText || loading) return;

    setInput('');
    setError('');
    const userMsg = { role: 'user', text: messageText, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await api.post('/ai/chat', { message: messageText });
      if (res.data.success) {
        const botMsg = { role: 'bot', text: res.data.result, timestamp: Date.now() };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error(res.data.message || 'Something went wrong');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to get response');
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'bot',
        text: 'Chat cleared! How can I help you? 😊',
        timestamp: Date.now(),
      },
    ]);
    setError('');
  };

  if (!user) return null;

  return (
    <>
      {/* Floating Action Button */}
      <button
        id="ai-chat-toggle"
        className={`ai-chat__fab ${isOpen ? 'ai-chat__fab--open' : ''}`}
        onClick={() => setIsOpen((o) => !o)}
        aria-label="Toggle AI Chat"
      >
        {isOpen ? <CloseIcon /> : (
          <>
            <BotIcon />
            <span className="ai-chat__fab-label">AI Assistant</span>
          </>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="ai-chat__window animate-fade-in" role="dialog" aria-label="AI Chat Assistant">
          {/* Header */}
          <div className="ai-chat__header">
            <div className="ai-chat__header-left">
              <div className="ai-chat__header-avatar">
                <BotIcon />
              </div>
              <div>
                <div className="ai-chat__header-title">
                  AI Assistant
                  <span className="ai-chat__sparkle"><SparkleIcon /></span>
                </div>
                <div className="ai-chat__header-subtitle">Powered by RAG + Gemini</div>
              </div>
            </div>
            <div className="ai-chat__header-actions">
              <button className="ai-chat__icon-btn" onClick={clearChat} title="Clear chat">
                <TrashIcon />
              </button>
              <button className="ai-chat__icon-btn" onClick={() => setIsOpen(false)} title="Close">
                <CloseIcon />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="ai-chat__messages" id="ai-chat-messages">
            {messages.map((msg, i) => (
              <MessageBubble key={i} msg={msg} />
            ))}
            {loading && (
              <div className="ai-chat__message ai-chat__message--bot">
                <div className="ai-chat__avatar"><BotIcon /></div>
                <div className="ai-chat__bubble ai-chat__bubble--typing">
                  <TypingIndicator />
                </div>
              </div>
            )}
            {error && (
              <div className="ai-chat__error">
                ⚠️ {error}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="ai-chat__quick-prompts">
            {QUICK_PROMPTS.map((p) => (
              <button
                key={p.text}
                className="ai-chat__quick-btn"
                onClick={() => sendMessage(p.text)}
                disabled={loading}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="ai-chat__input-area">
            <textarea
              ref={inputRef}
              id="ai-chat-input"
              className="ai-chat__input"
              rows={1}
              placeholder="Ask about your cart, orders, or products..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button
              id="ai-chat-send"
              className={`ai-chat__send-btn ${(!input.trim() || loading) ? 'ai-chat__send-btn--disabled' : ''}`}
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              aria-label="Send message"
            >
              <SendIcon />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AiChat;
