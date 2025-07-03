// src/components/CoachChat.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// Mock data for chat messages
interface ChatMessage {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  timestamp: string;
}

type CoachChatProps = {
  onSendMessage: (message: string) => void;
};

const CoachChat: React.FC<CoachChatProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Mock chat history
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { id: '1', sender: 'coach', text: 'Chào bạn! Tôi là Coach Minh. Tôi ở đây để hỗ trợ bạn trên hành trình cai thuốc lá. Bạn có câu hỏi nào không?', timestamp: '08:00 SA' },
    { id: '2', sender: 'user', text: 'Chào Coach! Tôi cảm thấy hơi khó khăn trong việc đối phó với cơn thèm thuốc buổi sáng.', timestamp: '08:05 SA' },
    { id: '3', sender: 'coach', text: 'Tôi hiểu cảm giác đó. Một số người thấy hữu ích khi uống một cốc nước lớn hoặc đi dạo nhanh khi cơn thèm ập đến. Bạn đã thử cách nào chưa?', timestamp: '08:10 SA' },
    { id: '4', sender: 'user', text: 'Tôi đã thử uống nước, cũng khá hiệu quả đó ạ. Cảm ơn coach!', timestamp: '08:12 SA' },
    { id: '5', sender: 'coach', text: 'Tuyệt vời! Hãy tiếp tục phát huy nhé. Luôn nhớ rằng mỗi nỗ lực đều đáng giá.', timestamp: '08:15 SA' },
  ]);

  const coachName = "Coach Minh";
  const userName = "Bạn"; // Assuming a generic user name for the fallback

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage: ChatMessage = {
        id: String(chatHistory.length + 1),
        sender: 'user',
        text: message.trim(),
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
      setChatHistory((prev) => [...prev, newMessage]);
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  // Scroll to bottom of chat history when new message arrives
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const messageVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    // Removed the outer div, the Card now directly takes full screen dimensions
   // Thay đổi
<Card className="flex flex-col flex-1 rounded-none shadow-none border-none bg-white">
 {/* Full screen, no rounded corners, no shadow, no border */}
      <CardHeader className="p-4 flex flex-row items-center justify-between border-b border-green-100 bg-white">
        <div className="flex items-center space-x-3">
          <Avatar className="w-12 h-12 border-2 border-green-500 bg-green-100">
            <AvatarFallback className="text-green-800 font-semibold text-lg">CM</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="font-bold text-xl text-green-700">{coachName}</CardTitle>
            <p className="text-sm text-gray-500 flex items-center">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full mr-1 animate-pulse"></span>
              Online
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent 
        className="flex-1 flex flex-col overflow-y-auto p-4 space-y-4 bg-green-50 scrollbar-thin scrollbar-thumb-green-400 scrollbar-track-green-100" 
        ref={chatContainerRef}
      >
        <AnimatePresence>
          {chatHistory.map((msg) => (
            <motion.div
              key={msg.id}
              className={`flex items-start ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              variants={messageVariants}
              initial="hidden"
              animate="visible"
            >
              {msg.sender === 'coach' && (
                <Avatar className="w-9 h-9 mr-2 flex-shrink-0 bg-green-100">
                  <AvatarFallback className="text-green-800 text-sm">CM</AvatarFallback>
                </Avatar>
              )}
              <div className={`max-w-[75%] p-3 rounded-xl relative break-words ${
                msg.sender === 'user'
                  ? 'bg-green-600 text-white ml-auto rounded-br-none shadow-md'
                  : 'bg-white text-gray-800 rounded-bl-none shadow-md border border-green-100'
              }`}>
                <p className="text-sm">{msg.text}</p>
                <span className={`absolute text-[10px] bottom-1 ${
                  msg.sender === 'user' ? '-left-[4.5rem] text-gray-200' : '-right-[4.5rem] text-gray-500'
                }`}>
                  {msg.timestamp}
                </span>
              </div>
              {msg.sender === 'user' && (
                <Avatar className="w-9 h-9 ml-2 flex-shrink-0 bg-green-200">
                  <AvatarFallback className="text-green-900 text-sm">Bạn</AvatarFallback>
                </Avatar>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </CardContent>

      <form onSubmit={handleSubmit} className="flex gap-3 p-4 border-t border-green-100 bg-white">
        <Input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Nhập tin nhắn của bạn..."
          className="flex-1 p-3 border-gray-300 rounded-lg focus-visible:ring-green-500 focus-visible:ring-2 focus-visible:ring-offset-0"
        />
        <Button
          type="submit"
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 shadow-md"
        >
          Gửi
        </Button>
      </form>
    </Card>
  );
};

export default CoachChat;