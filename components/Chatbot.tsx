'use client';

import { useState } from 'react';
import { useSession } from "next-auth/react";

export default function Chatbot() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const { data: session } = useSession();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    setLoading(true);

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput(""); 

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          userId: session?.user.id,
        }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error fetching chatbot response:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleChat = () => setIsOpen(!isOpen);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 bg-[#002147] text-white px-4 py-2 rounded-full shadow-lg hover:bg-[#003366] transition-all duration-200 z-[10000]"
      >
        {isOpen ? 'Close Chat' : 'Chat with us'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-[4rem] right-4 z-[10000] bg-[#F3F4F6] text-[#002147] border border-gray-300 rounded-lg shadow-xl p-4 flex flex-col resize overflow-auto"
          style={{ minWidth: '18rem', minHeight: '24rem', maxWidth: '32rem', maxHeight: '85vh' }}
        >
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto space-y-3 p-2">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-4 py-3 rounded-lg max-w-xs text-sm ${
                  msg.role === 'user' 
                    ? 'bg-[#002147] text-white' 
                    : 'bg-[#D6E0EF] text-[#002147]'
                }`}>
                  {/* Assistant: show line by line */}
                  {msg.role === 'assistant' ? (
                    <div className="space-y-1">
                      {msg.content.split('\n').map((line, index) => (
                        <p key={index}>{line.replace(/\*\*/g, '').trim()}</p>
                      ))}
                    </div>
                  ) : (
                    <span>{msg.content}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input Section */}
          <div className="flex flex-col lg:flex-row items-center border-t border-gray-300 pt-3">
            <input
              type="text"
              className="flex-1 bg-gray-100 text-[#002147] p-3 rounded-lg text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003366] w-full"
              value={input}
              onKeyDown={handleKeyDown}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
            />
            <button
              className="ml-3 bg-[#002147] text-white px-4 py-2 mt-3 w-full lg:mt-0 lg:w-[6rem] rounded-full hover:bg-[#003366] transition-all duration-200"
              onClick={handleSend}
              disabled={loading}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="white" d="M4 12a8 8 0 0116 0"></path>
                </svg>
              ) : (
                <span>Send</span>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
