import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bot, User, Send, Minimize2, Maximize2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface CopilotChatProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshBoard: () => void;
}

const CopilotChat = ({ isOpen, onClose, onRefreshBoard }: CopilotChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I am your AI Recruiter Copilot. I can help you find candidates, update their status, or draft personalized emails. How can I assist you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/ai/copilot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage.content }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: data.reply }]);
        // Refresh the board since the copilot might have updated statuses
        onRefreshBoard();
      } else {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: 'Sorry, I encountered an error connecting to the backend.' }]);
      }
    } catch (error) {
      console.error('Error calling copilot:', error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: 'Connection error. Is the backend running?' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`fixed bottom-6 right-6 bg-toyfight-bg border-4 border-toyfight-yellow z-50 flex flex-col shadow-[8px_8px_0px_0px_rgba(202,255,108,1)] transition-all duration-300 ${
            isMinimized ? 'h-[80px] w-[300px]' : 'h-[600px] w-[400px]'
          }`}
        >
          {/* Header */}
          <div className="bg-toyfight-yellow p-4 flex items-center justify-between text-black shrink-0 relative overflow-hidden">
             
            {/* Retro scanline effect on header */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNCIgaGVpZ2h0PSI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjEiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-50 mix-blend-overlay"></div>
            
            <div className="flex items-center gap-3 relative z-10">
              <div className="bg-black p-2 bg-opacity-20 backdrop-blur-sm border-2 border-black border-opacity-20 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]">
                 <Bot size={20} className="text-black drop-shadow-md" />
              </div>
              <div>
                <h3 className="font-header font-black text-xl leading-none uppercase tracking-tighter drop-shadow-sm">AI Copilot</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                   <div className="w-1.5 h-1.5 bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.8)] animate-pulse"></div>
                   <span className="font-mono text-[10px] font-bold tracking-widest uppercase opacity-80 mix-blend-color-burn">ACTIVE_AGENT</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 relative z-10">
              <button 
                onClick={() => setIsMinimized(!isMinimized)} 
                className="p-1.5 hover:bg-black hover:bg-opacity-10 transition-colors border-2 border-transparent hover:border-black hover:border-opacity-20 active:translate-y-[2px]"
                title={isMinimized ? "Expand" : "Minimize"}
              >
                {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
              </button>
              <button 
                onClick={onClose} 
                className="p-1.5 hover:bg-black hover:bg-opacity-10 transition-colors border-2 border-transparent hover:border-red-600 hover:text-red-600 active:translate-y-[2px]"
                title="Close"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiNmYmZkZjkiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')]">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 fade-in duration-300`}>
                    <div className={`max-w-[85%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      {/* Avatar */}
                      <div className="shrink-0 mt-1">
                        {msg.role === 'assistant' ? (
                          <div className="w-8 h-8 bg-toyfight-yellow flex items-center justify-center border-2 border-toyfight-yellow shadow-[2px_2px_0px_0px_rgba(202,255,108,0.3)]">
                            <Bot size={16} className="text-black" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 bg-toyfight-bg flex items-center justify-center border-2 border-toyfight-cream shadow-[2px_2px_0px_0px_rgba(251,253,249,0.3)]">
                            <User size={16} className="text-toyfight-cream" />
                          </div>
                        )}
                      </div>
                      
                      {/* Bubble */}
                      <div className={`p-3 relative ${
                        msg.role === 'user' 
                          ? 'bg-toyfight-cream text-toyfight-bg border-2 border-toyfight-cream shadow-[4px_4px_0px_0px_rgba(251,253,249,0.2)]' 
                          : 'bg-toyfight-gray text-toyfight-cream border-2 border-toyfight-yellow shadow-[4px_4px_0px_0px_rgba(202,255,108,0.2)]'
                      }`}>
                        <p className={`font-mono text-sm whitespace-pre-wrap ${msg.role === 'user' ? 'font-medium' : ''}`}>
                          {msg.content}
                        </p>
                        
                        {/* Decorative corner accent for retro feel */}
                        <div className={`absolute -bottom-1 -right-1 w-2 h-2 ${msg.role === 'user' ? 'bg-toyfight-cream' : 'bg-toyfight-yellow'}`}></div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start animate-in fade-in">
                    <div className="flex gap-3">
                      <div className="shrink-0 mt-1">
                        <div className="w-8 h-8 bg-toyfight-yellow flex items-center justify-center border-2 border-toyfight-yellow">
                          <Bot size={16} className="text-black" />
                        </div>
                      </div>
                      <div className="p-4 bg-toyfight-gray text-toyfight-cream border-2 border-toyfight-yellow flex items-center gap-1.5 shadow-[4px_4px_0px_0px_rgba(202,255,108,0.2)]">
                        <motion.div className="w-2 h-2 bg-toyfight-yellow" animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity, delay: 0 }} />
                        <motion.div className="w-2 h-2 bg-toyfight-yellow" animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} />
                        <motion.div className="w-2 h-2 bg-toyfight-yellow" animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-toyfight-gray border-t-2 border-toyfight-cream/10 shrink-0 relative z-20">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="E.g., Find applicants for frontend..."
                    className="flex-1 bg-toyfight-bg border-2 border-toyfight-cream/20 py-2.5 px-4 text-toyfight-cream placeholder:text-toyfight-cream/30 focus:outline-none focus:border-toyfight-yellow font-mono text-sm transition-colors shadow-inner"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="bg-toyfight-yellow text-black px-4 py-2 border-2 border-toyfight-yellow flex items-center justify-center hover:bg-white hover:border-white disabled:opacity-50 disabled:cursor-not-allowed transition-all active:translate-y-[2px] shadow-[4px_4px_0px_0px_rgba(251,253,249,0.2)] disabled:shadow-none"
                  >
                    <Send size={18} />
                  </button>
                </form>
                <div className="mt-2 flex items-center gap-2 text-toyfight-cream/40">
                  <div className="w-1 h-3 bg-toyfight-cream/20"></div>
                  <span className="font-mono text-[9px] uppercase tracking-widest">Awaiting Command Input...</span>
                </div>
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CopilotChat;
