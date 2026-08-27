import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, User, Bot, Loader2, RefreshCw, MessageSquare } from 'lucide-react';
import { Drink } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

interface NutritionistChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDrink?: (drink: Drink) => void;
}

export const NutritionistChatModal: React.FC<NutritionistChatModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: 'Xin chào! Tôi là **DailySip Sommelier & Chuyên Gia Dinh Dưỡng**. Bạn đang cảm thấy cơ thể như thế nào hoặc muốn tư vấn thức uống, cách pha chế nào hôm nay?',
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const quickPrompts = [
    'Tôi đau họng nên uống gì?',
    'Cách uống cà phê không say ép tim',
    'Đồ uống đẹp da thanh nhiệt mát gan',
    'Thức uống giảm đầy bụng khó tiêu',
    'Công thức Cold Brew Cam Sả tại nhà'
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const message = textToSend || inputText;
    if (!message.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: message,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/nutritionist-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          chatHistory: messages.slice(-4)
        })
      });

      const data = await res.json();
      const botReply = data.reply || 'DailySip luôn đồng hành chăm sóc sức khỏe cùng bạn!';

      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: botReply,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: 'Xin lỗi, trợ lý AI đang kết nối lại. Bạn vui lòng thử lại sau giây lát!',
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
    >
      <div className="bg-white rounded-3xl max-w-xl w-full h-[650px] max-h-[90vh] flex flex-col shadow-2xl border border-[#e5dfd5] overflow-hidden animate-in fade-in zoom-in-95 duration-200 relative">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#5e7e66] to-[#4a6350] text-[#fdfbf7] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 text-white flex items-center justify-center border border-white/20">
              <Sparkles className="w-5 h-5 text-[#d98b72] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-white">Trợ Lý Dinh Dưỡng DailySip</h3>
                <span className="w-2 h-2 rounded-full bg-[#7d9d85]"></span>
              </div>
              <p className="text-[11px] text-[#eaddcf]">Tư vấn đồ uống & dược tính tự nhiên theo thời gian thực</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick prompt suggestions */}
        <div className="px-4 py-2 bg-[#f7f3ed] border-b border-[#e5dfd5] overflow-x-auto scrollbar-none flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-bold text-[#8c827a] uppercase tracking-wider shrink-0">Gợi ý câu hỏi:</span>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p)}
              disabled={isLoading}
              className="px-2.5 py-1 rounded-full bg-[#fdfbf7] hover:bg-[#eef4f0] text-[#4a453e] hover:text-[#5e7e66] border border-[#e5dfd5] text-[11px] font-medium whitespace-nowrap transition-colors shadow-2xs active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Chat message stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs">
          {messages.map(m => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex gap-2.5 max-w-[88%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs ${
                    isUser ? 'bg-[#4a453e] text-[#fdfbf7]' : 'bg-[#eef4f0] text-[#5e7e66] border border-[#7d9d85]/30'
                  }`}
                >
                  {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>

                <div>
                  <div
                    className={`p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                      isUser
                        ? 'bg-[#7d9d85] text-white rounded-tr-xs shadow-xs'
                        : 'bg-[#f7f3ed] text-[#2c2722] rounded-tl-xs border border-[#e5dfd5]'
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className={`text-[9px] text-[#8c827a] block mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
                    {m.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-2.5 max-w-[80%] mr-auto items-center">
              <div className="w-7 h-7 rounded-full bg-[#eef4f0] text-[#5e7e66] border border-[#7d9d85]/30 flex items-center justify-center text-xs shrink-0">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="p-3 rounded-2xl bg-[#f7f3ed] text-[#4a453e] border border-[#e5dfd5] flex items-center gap-2 text-xs">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#7d9d85]" />
                <span>Chuyên gia đang suy nghĩ câu trả lời tốt nhất...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input box */}
        <div className="p-3 sm:p-4 border-t border-[#e5dfd5] bg-[#f7f3ed] shrink-0">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Nhập triệu chứng, sở thích hoặc câu hỏi về đồ uống..."
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-2xl border border-[#e5dfd5] bg-[#fdfbf7] text-[#2c2722] placeholder-[#a8a095] text-xs focus:outline-hidden focus:ring-2 focus:ring-[#7d9d85] shadow-2xs"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="p-2.5 rounded-2xl bg-[#7d9d85] hover:bg-[#6c8c74] disabled:opacity-50 text-white shadow-xs transition-transform active:scale-95 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
