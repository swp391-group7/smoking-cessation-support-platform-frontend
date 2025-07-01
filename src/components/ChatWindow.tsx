import React, { useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { useChat, useChatMembers } from '../api/useChat';
import type { User } from '../api/typechat'; 
import { RefreshCw, Wifi, WifiOff } from 'lucide-react';

interface ChatWindowProps {
  roomId: string | null;
  currentUser: User;
  roomName?: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  roomId,
  currentUser,
  roomName,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, loading, error, isPolling, sendMessage, loadMessages } = useChat(roomId);
  const { members } = useChatMembers(roomId);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Create a map of user info for quick lookup
  const userMap = React.useMemo(() => {
    const map = new Map();
    members.forEach(member => {
      map.set(member.user.id, {
        name: member.user.fullName || member.user.username,
        role: member.user.role.role,
      });
    });
    return map;
  }, [members]);

  if (!roomId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-lg font-medium mb-2">Chọn một phòng chat</h3>
          <p>Chọn phòng chat từ danh sách bên trái để bắt đầu trò chuyện</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {roomName || 'Phòng Chat'}
          </h2>
          <p className="text-sm text-gray-500">
            {members.length} thành viên
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-1 text-sm ${
            isPolling ? 'text-green-600' : 'text-red-600'
          }`}>
            {isPolling ? <Wifi size={16} /> : <WifiOff size={16} />}
            <span>{isPolling ? 'Đang kết nối' : 'Mất kết nối'}</span>
          </div>
          <button
            onClick={loadMessages}
            disabled={loading}
            className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {loading && messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-center text-red-500">
              <p className="font-medium">Lỗi tải tin nhắn</p>
              <p className="text-sm">{error}</p>
              <button
                onClick={loadMessages}
                className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Thử lại
              </button>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-2">🎉</div>
              <p>Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => {
              const senderInfo = userMap.get(message.senderId);
              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwn={message.senderId === currentUser.id}
                  senderName={senderInfo?.name}
                  senderRole={senderInfo?.role}
                />
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <MessageInput
        onSendMessage={async (content: string) => { await sendMessage(content); }}
        disabled={loading}
        placeholder="Nhập tin nhắn..."
      />
    </div>
  );
};