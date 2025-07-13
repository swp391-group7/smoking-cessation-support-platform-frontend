import React from 'react';
import type { Message} from '../api/typechat';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  senderName?: string;
  senderRole?: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwn,
  senderName,
  senderRole,
}) => {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRoleColor = (role?: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'text-red-600 bg-red-50';
      case 'coach':
        return 'text-blue-600 bg-blue-50';
      case 'user':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-2' : ''}`}>
        {!isOwn && (
          <div className="flex items-center mb-1">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${getRoleColor(senderRole)}`}>
              {senderRole?.toUpperCase()}
            </span>
            <span className="text-sm text-gray-600 ml-2">{senderName}</span>
          </div>
        )}
        <div
          className={`px-4 py-2 rounded-lg ${
            isOwn
              ? 'bg-blue-500 text-white rounded-br-none'
              : 'bg-gray-200 text-gray-800 rounded-bl-none'
          }`}
        >
          <p className="text-sm">{message.content}</p>
          <p className={`text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
            {formatTime(message.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
};