import React from 'react';
import type { ChatRoom } from '../api/typechat';

interface ChatRoomListProps {
  chatRooms: ChatRoom[];
  selectedRoomId: string | null;
  onSelectRoom: (roomId: string) => void;
}

export const ChatRoomList: React.FC<ChatRoomListProps> = ({
  chatRooms,
  selectedRoomId,
  onSelectRoom,
}) => {
  return (
    <div className="w-64 bg-gray-100 border-r overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Chat Rooms</h2>
        <div className="space-y-2">
          {chatRooms.map((room) => (
            <button
              key={room.id}
              onClick={() => onSelectRoom(room.id)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                selectedRoomId === room.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-white hover:bg-gray-200'
              }`}
            >
              <div className="font-medium">{room.name}</div>
              <div className="text-sm opacity-70">{room.type}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};