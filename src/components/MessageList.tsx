import React from 'react';
import type { Message } from '../api/typechat';

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, currentUserId }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              message.senderId === currentUserId
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            <p className="text-sm">{message.content}</p>
            <p className="text-xs mt-1 opacity-70">
              {new Date(message.createdAt).toLocaleTimeString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
