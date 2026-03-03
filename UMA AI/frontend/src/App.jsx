import { useState } from 'react';
function App() {
  const [inputText, setInputText] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false); 
  const [mode, setMode] = useState('help');
  const [messages, setMessages] = useState([
    { sender: 'uma', type: 'text', content: "Hello! I am UMA. I am ready to help." }
  ]);
  const handleSendMessage = async () => {
    if (!inputText.trim()) return; 
    const userMessage = { sender: 'user', type: 'text', content: inputText };
    setMessages(prev => [...prev, userMessage]);
    const textToSend = inputText;
    setInputText('');
    setIsLoading(true); 
    try {
      if (mode === 'learn') {
        const response = await fetch('http://localhost:5000/api/image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: textToSend })
        });
        const data = await response.json();
        if (data.imageBase64) {
            const imageSrc = `data:image/jpeg;base64,${data.imageBase64}`;
            setMessages(prev => [...prev, { sender: 'uma', type: 'image', content: imageSrc }]);
        }
      } else {
        const response = await fetch('http://localhost:5000/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: textToSend, mode: mode })
        });
        const data = await response.json();
        
        if (data.reply) {
            setMessages(prev => [...prev, { sender: 'uma', type: 'text', content: data.reply }]);
        }
      }
    } catch (error) {
      console.error("API error:", error);
      setMessages(prev => [...prev, { sender: 'uma', type: 'text', content: "I'm having trouble connecting right now." }]);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex h-screen w-full font-sans text-gray-800 bg-white overflow-hidden">
      <div className={`bg-gray-50 border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out shrink-0 ${isSidebarOpen ? 'w-64 opacity-100' : 'w-0 opacity-0 border-none'}`}>
        <div className="p-4 border-b border-gray-200 min-w-[16rem] flex items-center h-[73px]">
          <h2 className="font-semibold text-gray-700">Chat Previous</h2>
        </div>
      </div>
      <div className="flex-1 flex flex-col relative bg-slate-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] overflow-hidden">
        <header className="flex flex-col sm:flex-row items-center p-4 bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10 gap-4">
          <div className="flex items-center w-full sm:w-auto">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 mr-3 text-gray-600 rounded-md">☰</button>
            <div className="text-xl font-bold text-indigo-600">UMA</div>
          </div>
          <div className="flex bg-gray-100 p-1 rounded-full mx-auto space-x-1">
            <button 
              onClick={() => setMode('help')} 
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors duration-200 ${mode === 'help' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200/50'}`}
            >
              Help Mode
            </button>
            <button 
              onClick={() => setMode('normal')} 
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors duration-200 ${mode === 'normal' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200/50'}`}
            >
              Normal Chat
            </button>
            <button 
              onClick={() => setMode('learn')} 
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors duration-200 ${mode === 'learn' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200/50'}`}
            >
              Learn (Images)
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-6">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'uma' && (
                <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm shrink-0">U</div>
              )}
              <div className={`px-5 py-3 max-w-[75%] shadow-sm border ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-2xl rounded-br-sm' : 'bg-white text-gray-700 rounded-2xl rounded-bl-sm'}`}>
                {msg.type === 'text' ? (
                   <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                ) : (
                   <img src={msg.content} alt="UMA Generated" className="rounded-lg max-w-full h-auto" />
                )}
              </div>
               {msg.sender === 'user' && (
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-lg shrink-0">👤</div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start items-end gap-2">
              <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm shrink-0">U</div>
              <div className="bg-white px-5 py-3 rounded-2xl rounded-bl-sm shadow-sm flex gap-1 items-center h-[46px]">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
        </main>
        <footer className="p-4 w-full max-w-4xl mx-auto pb-6">
          <div className="relative flex items-center bg-white shadow-lg border border-gray-200 rounded-full p-1.5 focus-within:ring-2 focus-within:ring-indigo-500/50">
            <input 
              type="text" 
              className="flex-1 bg-transparent px-4 py-3 outline-none text-gray-700"
              placeholder={mode === 'learn' ? "Describe an image to learn..." : "Ask UMA..."}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isLoading}
            />
            <button 
              onClick={handleSendMessage} 
              disabled={isLoading || !inputText.trim()}
              className="p-3 bg-indigo-600 text-white hover:bg-indigo-700 rounded-full w-12 h-12 flex items-center justify-center disabled:opacity-50 transition-colors"
            >
              ➤
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
export default App;