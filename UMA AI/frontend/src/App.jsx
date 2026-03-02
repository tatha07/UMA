 import { useState } from 'react';

function App() {
  const [inputText, setInputText] = useState('');

  return (
    <div className="flex flex-col h-screen bg-[#EEF2FF] font-sans text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 flex items-center justify-between border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-indigo-600">UMA</h1>
          <span className="text-xs text-gray-500 font-medium tracking-wide uppercase">Maternal & Child Health Guide</span>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* UMA's Greeting */}
        <div className="flex justify-start">
          <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm max-w-[80%] border border-gray-100">
            <p className="text-sm leading-relaxed text-gray-700">
              Hello! I am UMA. I'm here to support you with maternal and child health information. How can I help you today?
            </p>
          </div>
        </div>
      </main>

      {/* Input Area */}
      <footer className="bg-white p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          {/* Mic Button Placeholder */}
          <button className="p-3 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500">
            🎤
          </button>
          
          <input 
            type="text" 
            placeholder="Ask UMA a question..."
            className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          
          {/* Send Button Placeholder */}
          <button className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            Send
          </button>
        </div>
      </footer>
    </div>
  );
}

export default App;