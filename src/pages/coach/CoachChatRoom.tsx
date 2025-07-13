// File: src/pages/coach/CoachChatRoom.tsx
import React, { useState } from 'react';
import { ChatRoomList } from '../../components/ChatRoomList';
import { MessageList } from '../../components/MessageList';
import { MessageInput } from '../../components/MessageInput';
import { ChatHeader } from '../../components/ChatHeader';
import { useChat } from '../../hooks/useChat';
import { useChatRooms } from '../../hooks/useChatRooms';

export const CoachChatRoom: React.FC = () => {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const { chatRooms, loading: roomsLoading, error: roomsError } = useChatRooms();
  const { messages, loading: messagesLoading, error: messagesError, sendMessage } = useChat(selectedRoomId);

  // Mock current coach ID - replace with actual user context
  const currentUserId = 'current-coach-id';

  const selectedRoom = chatRooms.find(room => room.id === selectedRoomId) || null;

  const handleSendMessage = (content: string) => {
    sendMessage(content);
  };

  return (
    <div className="h-screen flex bg-gray-50">
      <ChatRoomList
        chatRooms={chatRooms}
        selectedRoomId={selectedRoomId}
        onSelectRoom={setSelectedRoomId}
      />
      
      <div className="flex-1 flex flex-col">
        <ChatHeader chatRoom={selectedRoom} />
        
        {selectedRoomId ? (
          <>
            {messagesError && (
              <div className="p-4 bg-red-100 border-b">
                <p className="text-red-600">{messagesError}</p>
              </div>
            )}
            
            <MessageList messages={messages} currentUserId={currentUserId} />
            
            <MessageInput
              onSendMessage={handleSendMessage}
              disabled={messagesLoading}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Coach Chat Panel</h2>
              <p className="text-gray-600">Select a chat room to start coaching</p>
            </div>
          </div>
        )}
      </div>
      
      {roomsLoading && (
        <div className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded">
          Loading chat rooms...
        </div>
      )}
      
      {roomsError && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded">
          {roomsError}
        </div>
      )}
    </div>
  );
};
// Export the component for use in other parts of the application
export default CoachChatRoom;