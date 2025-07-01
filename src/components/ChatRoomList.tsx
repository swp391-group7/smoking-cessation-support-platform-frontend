import React from 'react';
import type { ChatRoom } from '../api/typechat';
import { MessageCircle, Users } from 'lucide-react';

interface ChatRoomListProps {
  rooms: ChatRoom[];
  selectedRoomId: string | null;
  onSelectRoom: (roomId: string) => void;
  loading?: boolean;
}

export const ChatRoomList: React.FC<ChatRoomListProps> = ({
  rooms,
  selectedRoomId,
  onSelectRoom,
  loading = false,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <MessageCircle size={48} className="mx-auto mb-2 text-gray-300" />
        <p>Chưa có phòng chat nào</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 p-4">
      {rooms.map((room) => (
        <div
          key={room.id}
          onClick={() => onSelectRoom(room.id)}
          className={`p-3 rounded-lg cursor-pointer transition-colors ${
            selectedRoomId === room.id
              ? 'bg-blue-100 border-blue-500 border-2'
              : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500 text-white rounded-full">
                <Users size={16} />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{room.name}</h3>
                <p className="text-sm text-gray-500 capitalize">{room.type}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">
                {formatDate(room.createAt)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};