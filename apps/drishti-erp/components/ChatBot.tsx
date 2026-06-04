"use client";

import { useChat } from '@ai-sdk/react';
import { useRef, useEffect, useState } from 'react';
import { X, Send, Bot, Loader2 } from 'lucide-react';

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatBot({ isOpen, onClose }: ChatBotProps) {
  const { messages, status, sendMessage } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const isLoading = status === 'streaming' || status === 'submitted';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ role: 'user', parts: [{ type: 'text', text: input }] });
    setInput('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 right-0 w-full h-[85vh] sm:bottom-6 sm:right-6 sm:w-[380px] sm:h-[550px] 2xl:w-[450px] 2xl:h-[700px] bg-[#0d0d0d] border-t sm:border border-[#f2ca50]/30 rounded-t-3xl sm:rounded-2xl flex flex-col shadow-2xl z-50 overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 bg-[#111] border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#f2ca50]/10 flex items-center justify-center">
            <Bot size={16} className="text-[#f2ca50]" />
          </div>
          <div>
            <h3 className="text-white text-sm 2xl:text-base font-semibold tracking-wide">Drishti</h3>
            <p className="text-[#8a8278] text-[10px] 2xl:text-xs uppercase tracking-widest">Online</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white"
        >
          <X size={18} />
        </button>
      </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.length === 0 && (
              <div className="text-center mt-12">
                <div className="w-12 h-12 bg-[#f2ca50]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bot size={24} className="text-[#f2ca50]" />
                </div>
                <h4 className="text-white font-medium mb-2 2xl:text-lg">Welcome to Drishti Studios!</h4>
                <p className="text-sm 2xl:text-base text-[#8a8278] font-light px-4">
                  I'm Drishti, your digital producer. How can I help you today?
                </p>
              </div>
            )}
            
            {messages.map((m: any) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm 2xl:text-base font-light leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-[#f2ca50] text-black rounded-tr-sm' 
                    : 'bg-[#1a1a1a] text-[#e5e2e1] border border-white/5 rounded-tl-sm'
                }`}>
                  {m.parts?.map((p: any) => p.type === 'text' ? p.text : null)}
                </div>
              </div>
            ))}
            {isLoading && (
               <div className="flex justify-start">
                  <div className="bg-[#1a1a1a] text-[#e5e2e1] border border-white/5 rounded-2xl rounded-tl-sm px-4 py-3">
                     <Loader2 size={16} className="animate-spin text-[#f2ca50]" />
                  </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-[#111] border-t border-white/5">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                value={input}
                onChange={handleInputChange}
                placeholder="Type your message..."
                className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-full px-4 py-2 text-sm 2xl:text-base text-white focus:outline-none focus:border-[#f2ca50]/50 transition-colors font-light placeholder:text-[#555]"
              />
              <button 
                type="submit" 
                disabled={isLoading || !input.trim()}
                className="w-10 h-10 rounded-full bg-[#f2ca50] text-black flex items-center justify-center hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={16} className="ml-1" />
              </button>
            </form>
          </div>
    </div>
  );
}
