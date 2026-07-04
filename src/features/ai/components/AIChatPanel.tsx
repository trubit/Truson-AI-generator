import React from 'react';
import { Bot, User } from 'lucide-react';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const AIChatPanel: React.FC<{ messages?: ChatMessage[] }> = ({ messages = [] }) => {
  const defaultMessages: ChatMessage[] = [
    {
      id: 'm1',
      sender: 'ai',
      text: 'Hello! I am your AI Software Architecture Assistant. How can I help you design, refactor, or build your platform today?',
      timestamp: 'Just now',
    },
  ];

  const list = messages.length > 0 ? messages : defaultMessages;

  return (
    <div className="flex-grow-1 overflow-auto d-flex flex-column gap-3 p-3 mb-3 bg-dark border border-secondary rounded-4">
      {list.map((msg) => (
        <div
          key={msg.id}
          className={`d-flex gap-3 max-w-xl ${
            msg.sender === 'user' ? 'ms-auto flex-row-reverse' : ''
          }`}
        >
          <div
            className={`rounded-circle p-2 d-flex align-items-center justify-content-center flex-shrink-0 ${
              msg.sender === 'user' ? 'bg-purple text-white' : 'bg-secondary bg-opacity-30 text-cyan'
            }`}
            style={{ width: 36, height: 36 }}
          >
            {msg.sender === 'user' ? <User size={18} /> : <Bot size={18} />}
          </div>
          <div
            className={`p-3 rounded-4 ${
              msg.sender === 'user'
                ? 'bg-purple text-white'
                : 'bg-body-tertiary border border-secondary text-light'
            }`}
          >
            <p className="mb-1 small" style={{ whiteSpace: 'pre-wrap' }}>
              {msg.text}
            </p>
            <span className="text-secondary opacity-75" style={{ fontSize: '0.7rem' }}>
              {msg.timestamp}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
