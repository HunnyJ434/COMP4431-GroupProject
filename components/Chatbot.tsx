'use client';

import { useState } from 'react';

export default function Chatbot() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true); // State to track if the chat is open or closed

  const handleSend = async () => {
    if (!input.trim()) return;
    setLoading(true);

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();

      setMessages([...newMessages, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen); // Toggle the visibility of the chat window
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevents the default action of the Enter key (new line in input)
      
      handleSend(); // Trigger the message send
      setInput("")
    }
  };

  return (
    <>
      <button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg z-50"
      >
        {isOpen ? 'Close Chat' : 'Open Chat'}
      </button>

        <div className={`fixed ${isOpen? "hidden" : ""}  w-[30rem] h-[36rem] bottom-[4rem] z-[10000] right-4 w-64 h-72 bg-gradient-to-b from-blue-500 to-indigo-500 text-white rounded-lg shadow-xl p-3`}>
          <div className="h-[30rem] overflow-y-scroll pr-2 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-4 py-2 rounded-lg max-w-xs ${msg.role === 'user' ? 'bg-blue-600' : 'bg-indigo-600'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center mt-3 border-t border-gray-200 pt-2">
            <input
              type="text"
              className="flex-1 bg-transparent text-white placeholder-white focus:outline-none p-2 rounded-lg text-sm"
              value={input}
              onKeyDown={handleKeyDown} 
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me something..."
            />
            <button
              className="ml-3 bg-white text-blue-500 px-3 py-2 rounded-full hover:bg-gray-100 transition-all duration-200"
              onClick={handleSend}
              disabled={loading}
            >
              {loading ? (
                <span className="animate-spin">...</span>
              ) : (
                <span>Send</span>
              )}
            </button>
          </div>
        </div>

    </>
  );
}
