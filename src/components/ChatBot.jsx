import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader2, Sparkles } from 'lucide-react';
import { askStateQuestion } from '../services/gemini';
import ReactMarkdown from 'react-markdown';

const ChatBot = ({ stateName, language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      role: 'ai', 
      text: language === 'hi' 
        ? `नमस्ते! मैं RajNeeti AI हूँ। आप मुझसे ${stateName} के बारे में कुछ भी पूछ सकते हैं।` 
        : `Hi! I'm RajNeeti AI. Ask me anything about ${stateName}'s politics, history, or news!`
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatContainerRef.current && !chatContainerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    const aiResponse = await askStateQuestion(stateName, userMsg, language);
    
    setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    setIsTyping(false);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[999] flex flex-col items-end" ref={chatContainerRef}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="mb-4 w-[calc(100vw-2rem)] sm:w-[380px] h-[75vh] max-h-[500px] flex flex-col overflow-hidden rounded-[2rem] bg-zinc-100/90 dark:bg-black/80 backdrop-blur-3xl border border-zinc-300 dark:border-white/20 shadow-2xl origin-bottom-right"
          >
            {/* Header */}
            <div className="px-5 py-4 bg-zinc-200/80 dark:bg-white/10 border-b border-zinc-300 dark:border-white/10 flex justify-between items-center shrink-0">
              <div>
                <h3 className="font-extrabold text-zinc-800 dark:text-white flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                  </span>
                  RajNeeti AI
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Expert on {stateName}</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-zinc-300 dark:hover:bg-white/20 text-zinc-600 dark:text-zinc-300 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-grow p-4 sm:p-5 overflow-y-auto space-y-4 custom-scrollbar">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className={`px-4 py-2.5 max-w-[90%] sm:max-w-[85%] rounded-2xl text-[14px] sm:text-[15px] leading-relaxed shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-sm font-medium' 
                        : 'bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-tl-sm'
                    }`}
                  >
                    {/* Updated Markdown Rendering */}
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown>
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="px-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl rounded-tl-sm flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-blue-500" />
                    <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="p-3 sm:p-4 bg-zinc-200/80 dark:bg-black/40 border-t border-zinc-300 dark:border-white/10 shrink-0">
              <form onSubmit={handleSend} className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={language === 'hi' ? "कुछ पूछें..." : "Ask a question..."}
                  className="flex-grow bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-white text-sm rounded-full px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium placeholder-zinc-400 dark:placeholder-zinc-500"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="p-2.5 sm:p-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 shrink-0"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)" }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="p-3.5 sm:p-4 rounded-full bg-blue-600 text-white shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-blue-400/30 backdrop-blur-md transition-all flex items-center justify-center shrink-0"
      >
        {isOpen ? <X size={24} className="sm:w-7 sm:h-7" /> : <Sparkles size={24} className="sm:w-7 sm:h-7" />}
      </motion.button>
    </div>
  );
};

export default ChatBot;