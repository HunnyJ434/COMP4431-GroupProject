/*'use client';

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
*/
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
          userId: session?.user.id, // Include session user data here
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
        <div className="fixed w-[16rem] h-[28rem] md:w-[20rem] lg:w-[25rem]  bottom-[4rem] z-[10000] right-4 bg-white text-[#002147] border border-gray-300 rounded-lg shadow-xl p-4 flex flex-col">
          
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto space-y-3 p-2">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-4 py-3 rounded-lg max-w-xs text-sm ${
                  msg.role === 'user' 
                  ? 'bg-[#002147] text-white' 
                  : 'bg-[#FFD700] text-black'
                }`}>
                  {msg.content}
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
