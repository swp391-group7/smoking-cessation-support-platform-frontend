// src/components/CoachChat.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
  const coachAvatar = "https://randomuser.me/api/portraits/men/32.jpg"; // Replace with actual coach avatar URL
  const userAvatar = "https://randomuser.me/api/portraits/men/50.jpg"; // Replace with actual user avatar URL or dynamic generation

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
    <Card className="p-6 shadow-md border border-gray-200 h-full flex flex-col">
      <CardHeader className="p-0 mb-4 flex flex-row items-center justify-between border-b pb-4 border-gray-100">
        <div className="flex items-center space-x-3">
          <Avatar className="w-11 h-11 border-2 border-green-primary">
            <AvatarImage src={coachAvatar} alt={coachName} />
            <AvatarFallback className="bg-green-light text-green-dark">CM</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="font-bold text-xl text-green-dark">{coachName}</CardTitle>
            <p className="text-sm text-gray-500 flex items-center">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full mr-1 animate-pulse"></span>
              Online
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 flex-1 flex flex-col overflow-y-auto pr-2 mb-4 scrollbar-thumb-gray-400 scrollbar-track-gray-100 scrollbar-thin" ref={chatContainerRef}>
        <AnimatePresence>
          {chatHistory.map((msg) => (
            <motion.div
              key={msg.id}
              className={`flex items-start mb-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              variants={messageVariants}
              initial="hidden"
              animate="visible"
            >
              {msg.sender === 'coach' && (
                <Avatar className="w-8 h-8 mr-2 flex-shrink-0">
                  <AvatarImage src={coachAvatar} alt={coachName} />
                  <AvatarFallback className="bg-green-light text-green-dark">CM</AvatarFallback>
                </Avatar>
              )}
              <div className={`max-w-[70%] p-3 rounded-xl relative break-words ${
                msg.sender === 'user'
                  ? 'bg-green-primary text-white ml-auto rounded-br-none shadow-sm'
                  : 'bg-gray-100 text-gray-800 rounded-bl-none shadow-sm'
              }`}>
                <p className="text-sm">{msg.text}</p>
                <span className={`absolute text-[10px] bottom-1 whitespace-nowrap ${
                  msg.sender === 'user' ? '-left-[4.5rem] text-gray-400' : '-right-[4.5rem] text-gray-500'
                }`}>
                  {msg.timestamp}
                </span>
              </div>
              {msg.sender === 'user' && (
                <Avatar className="w-8 h-8 ml-2 flex-shrink-0">
                  <AvatarImage src={userAvatar} alt="Bạn" />
                  <AvatarFallback className="bg-blue-100 text-blue-800">Bạn</AvatarFallback>
                </Avatar>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </CardContent>

      <form onSubmit={handleSubmit} className="flex gap-3 mt-auto">
        <Input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Nhập tin nhắn của bạn..."
          className="flex-1 p-3 border-gray-300 rounded-lg focus-visible:ring-green-primary"
        />
        <Button
          type="submit"
          className="bg-green-primary text-white px-5 py-3 rounded-lg font-semibold hover:bg-green-dark transition-colors duration-200"
        >
          Gửi
        </Button>
      </form>
    </Card>
  );
};

export default CoachChat;