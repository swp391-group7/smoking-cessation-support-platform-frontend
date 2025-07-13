import React from 'react';
import type { ChatRoom } from '../api/typechat';

interface ChatHeaderProps {
  chatRoom: ChatRoom | null;
  onBack?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ chatRoom, onBack }) => {
  return (
    <div className="bg-white border-b p-4 flex items-center">
      {onBack && (
        <button
          onClick={onBack}
          className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
        >
          ←
        </button>
      )}
      <div>
        <h1 className="text-lg font-semibold">
          {chatRoom ? chatRoom.name : 'Select a chat room'}
        </h1>
        {chatRoom && (
          <p className="text-sm text-gray-600">{chatRoom.type}</p>
        )}
      </div>
    </div>
  );
};
