import { useState } from 'react';

function App() {
  const [inputText, setInputText] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false); 
  
  const [messages, setMessages] = useState([
    { sender: 'uma', text: "Hello! I am UMA. I'm here to support you with maternal and child health information. How can I help you today?" }
  ]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return; 

    // 1. Add user message to UI immediately
    const userMessage = { sender: 'user', text: inputText };
    setMessages(prev => [...prev, userMessage]);
    
    // Store the text to send, then clear the input box
    const textToSend = inputText;
    setInputText('');
    
    // Turn on the loading indicator
    setIsLoading(true); 

    try {
      // 2. Actually send the message to dimaag.js!
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend })
      });

      const data = await response.json();

      // 3. Add UMA's response to the UI
      if (data.reply) {
        setMessages(prev => [...prev, { sender: 'uma', text: data.reply }]);
      } else {
        throw new Error("No reply from server");
      }

    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { 
        sender: 'uma', 
        text: "I'm having a little trouble connecting to my brain right now. Please make sure dimaag.js is running!" 
      }]);
    } finally {
      setIsLoading(false); // Turn off the loading indicator
    }
  };

  return (
    <div className="flex h-screen w-full font-sans text-gray-800 bg-white overflow-hidden">
      
      {/* LEFT SIDEBAR */}
      <div 
        className={`bg-gray-50 border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out shrink-0 ${
          isSidebarOpen ? 'w-64 opacity-100' : 'w-0 opacity-0 border-none'
        }`}
      >
        <div className="p-4 border-b border-gray-200 min-w-[16rem] flex items-center h-[73px]">
          <h2 className="font-semibold text-gray-700">Chat Previous</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 flex flex-col min-w-[16rem]">
          <p className="text-sm text-gray-400 text-center mt-4">No previous chats yet.</p>
        </div>
      </div>

      {/* RIGHT MAIN AREA */}
      <div className="flex-1 flex flex-col relative bg-slate-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] overflow-hidden">
        
        {/* TOP NAV */}
        <header className="flex items-center justify-between p-4 bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition-colors focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="text-xl font-bold text-indigo-600 tracking-wide">UMA</div>
          </div>
          <div className="flex gap-6 text-sm font-medium text-gray-500">
            <button className="hover:text-indigo-600 transition-colors">Home</button>
            <button className="hover:text-indigo-600 transition-colors">Modules</button>
            <button className="hover:text-indigo-600 transition-colors">Profile</button>
          </div>
        </header>

        {/* CHAT MESSAGES AREA */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-6">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              
              {msg.sender === 'uma' && (
                <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm border border-indigo-200 shadow-sm shrink-0">
                  U
                </div>
              )}

              <div className={`px-5 py-3 max-w-[75%] shadow-sm border ${
                msg.sender === 'user' 
                  ? 'bg-indigo-600 text-white rounded-2xl rounded-br-sm border-indigo-700' 
                  : 'bg-white text-gray-700 rounded-2xl rounded-bl-sm border-gray-100'
              }`}>
                <p className="leading-relaxed">{msg.text}</p>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-lg shadow-sm border border-gray-100 shrink-0">
                  👤
                </div>
              )}
            </div>
          ))}

          {/* LOADING INDICATOR */}
          {isLoading && (
            <div className="flex justify-start items-end gap-2">
              <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm border border-indigo-200 shadow-sm shrink-0">
                U
              </div>
              <div className="bg-white px-5 py-3 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100 flex gap-1 items-center h-[46px]">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
        </main>

        {/* INPUT BAR */}
        <footer className="p-4 w-full max-w-4xl mx-auto pb-6">
          <div className="relative flex items-center bg-white shadow-lg border border-gray-200 rounded-full p-1.5 focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all">
            <input 
              type="text" 
              className="flex-1 bg-transparent px-5 py-3 outline-none text-gray-700 placeholder-gray-400"
              placeholder="Ask me..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isLoading}
            />
            <div className="flex items-center gap-1 pr-1">
              <button className="p-3 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors focus:outline-none">
                🎤
              </button>
              <button 
                onClick={handleSendMessage}
                disabled={isLoading}
                className="p-3 bg-indigo-600 text-white hover:bg-indigo-700 rounded-full transition-colors flex items-center justify-center w-12 h-12 shadow-sm focus:outline-none disabled:opacity-50"
              >
                ➤
              </button>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}

export default App;