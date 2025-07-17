import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageCircle, Bell, Send, ArrowLeft } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import {postCoachNotify, getProgressNotifications, type ProgressNotification, type CreateNotificationRequest} from '@/api/progressNoti';
// API interfaces
import { baseApi } from '@/api/BaseApi'; // Giả sử bạn đã cấu hình sẵn baseApi

export interface ProgressNotificationDto {
  id: string;
  planId: string;
  message: string;
  channel: string;
  type: string;
  sentAt: string;
  senderId: string;
  recipientId: string;
  isRead: boolean;
}

export interface CreateNotificationRequest {
  message: string;
  channel: string;
  type: string;
}

export interface ProgressNotification {
  id: string;
  planId: string;
  message: string;
  channel: string;
  type: string;
  sentAt: string;
  senderId: string;
  recipientId: string;
  isRead: boolean;
}

// API gọi danh sách thông báo theo planId và type
export const getProgressNotifications = async (
  planId: string,
  type: string
): Promise<ProgressNotificationDto[]> => {
  const { data } = await baseApi.get<ProgressNotificationDto[]>(
    `/progress-notifications/by-plan/${planId}/type/${type}`
  );
  return data;
};

// API gửi thông báo từ huấn luyện viên
export const postCoachNotify = async (
  planId: string,
  body: CreateNotificationRequest
): Promise<ProgressNotification> => {
  const { data } = await baseApi.post<ProgressNotification>(
    `/progress-notifications/${planId}/coach-notify`,
    body
  );
  return data;
};

const CoachChatMember: React.FC = () => {
  const location = useLocation();
  const { planId, userId, membershipStartDate, avatarUrl, fullName } = location.state || {};
  
  const [activeTab, setActiveTab] = useState<'chat' | 'remind'>('chat');
  const [chatMessages, setChatMessages] = useState<ProgressNotificationDto[]>([]);
  const [lastMessageId, setLastMessageId] = useState<string>(''); // Track last message ID
  const [newMessage, setNewMessage] = useState('');
  const [remindMessage, setRemindMessage] = useState('');
  const [remindChannel, setRemindChannel] = useState<'push' | 'email'>('push');
  const [loading, setLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [sendingRemind, setSendingRemind] = useState(false);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = JSON.parse(localStorage.getItem('user') || '{}').id;

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load chat messages with optimization
  const loadChatMessages = async (forceScroll = false) => {
    if (!planId) return;
    
    try {
      setLoading(true);
      const messages = await getProgressNotifications(planId, 'chat');
      
      // Filter messages by membership start date
      const filteredMessages = messages.filter(msg => {
        const msgDate = new Date(msg.sentAt);
        const startDate = new Date(membershipStartDate);
        return msgDate >= startDate;
      });
      
      // Sort by time
      const sortedMessages = filteredMessages.sort((a, b) => 
        new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
      );
      
      // Check if there are new messages
      const latestMessageId = sortedMessages.length > 0 ? sortedMessages[sortedMessages.length - 1].id : '';
      
      // Only update if there are new messages or this is the first load
      if (latestMessageId !== lastMessageId || chatMessages.length === 0) {
        setChatMessages(sortedMessages);
        setLastMessageId(latestMessageId);
        
        // Chỉ scroll khi được yêu cầu (khi gửi tin nhắn mới)
        if (forceScroll) {
          setShouldScrollToBottom(true);
        }
      }
    } catch (error) {
      console.error('Error loading chat messages:', error);
    } finally {
      setLoading(false);
    }
  };

  // Send chat message
  const sendChatMessage = async () => {
    if (!newMessage.trim() || !planId || sendingMessage) return;
    
    try {
      setSendingMessage(true);
      await postCoachNotify(planId, {
        message: newMessage,
        channel: 'push',
        type: 'chat'
      });
      
      setNewMessage('');
      // Reload messages và scroll xuống khi gửi tin nhắn mới
      await loadChatMessages(true);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  // Send reminder
  const sendReminder = async () => {
    if (!remindMessage.trim() || !planId || sendingRemind) return;
    
    try {
      setSendingRemind(true);
      await postCoachNotify(planId, {
        message: remindMessage,
        channel: remindChannel,
        type: 'remind'
      });
      
      setRemindMessage('');
      alert('Reminder sent successfully!');
    } catch (error) {
      console.error('Error sending reminder:', error);
      alert('Error sending reminder');
    } finally {
      setSendingRemind(false);
    }
  };

  // Auto-refresh messages every 5 seconds (không scroll)
  useEffect(() => {
    if (activeTab === 'chat') {
      loadChatMessages(false); // Load lần đầu không scroll
      
      const interval = setInterval(() => {
        loadChatMessages(false); // Auto refresh không scroll
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [activeTab, planId, membershipStartDate]);

  // Effect để handle scroll khi cần
  useEffect(() => {
    if (shouldScrollToBottom) {
      scrollToBottom();
      setShouldScrollToBottom(false);
    }
  }, [chatMessages, shouldScrollToBottom]);

  // Format date for display
  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Get user initials for avatar fallback
  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (!planId || !userId) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg border p-6 text-center">
          <p className="text-gray-600 mb-4">Invalid access. Please go back and try again.</p>
          <Button 
            onClick={() => window.history.back()}
            variant="outline"
            className="h-9"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className=" flex items-center justify-center p-4 w-full">
      <div className="w-full h-full flex-1 bg-white rounded-lg shadow-lg border flex flex-col" style={{ height: '600px' }}>
        {/* Header - Compact */}
        <div className="bg-white border-b p-3 flex-shrink-0 rounded-t-lg">
          <div className="flex items-center space-x-3">
            <Button 
              onClick={() => window.history.back()}
              variant="outline"
              size="sm"
              className="h-8 px-2"
            >
              <ArrowLeft className="w-3 h-3" />
            </Button>
            
            <Avatar className="w-8 h-8">
              <AvatarImage src={avatarUrl} alt={fullName} />
              <AvatarFallback className="text-xs">
                {getUserInitials(fullName || 'User')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <h1 className="text-sm font-semibold truncate">{fullName}</h1>
              <p className="text-xs text-gray-600 truncate">ID: {planId}</p>
            </div>
          </div>
        </div>

        {/* Tab Content - Fixed height */}
        <div className="flex-1 min-h-0">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'chat' | 'remind')} className="h-full flex flex-col">
            {/* Tabs Header - Compact */}
            <div className="bg-white border-b flex-shrink-0">
              <TabsList className="w-full h-10 bg-transparent border-b-0 rounded-none">
                <TabsTrigger 
                  value="chat" 
                  className="flex items-center space-x-2 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-green-600 rounded-none text-sm"
                >
                  <MessageCircle className="w-3 h-3" />
                  <span>Chat</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="remind" 
                  className="flex items-center space-x-2 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-green-600 rounded-none text-sm"
                >
                  <Bell className="w-3 h-3" />
                  <span>Reminder</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Chat Tab - Fixed height container */}
            <TabsContent value="chat" className="flex-1 m-0 p-0 flex flex-col min-h-0">
              {/* Messages Area - Fixed height, scrollable */}
              <div className="flex-1 overflow-y-auto bg-gray-50 p-3 min-h-0">
                {loading && chatMessages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                  </div>
                ) : chatMessages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                    No messages yet. Start a conversation!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {chatMessages.map((message) => {
                      const isCurrentUser = message.senderId === currentUserId;
                      
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex items-start space-x-2 max-w-[75%] ${isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                            <Avatar className="w-6 h-6 flex-shrink-0">
                              <AvatarImage 
                                src={isCurrentUser ? undefined : avatarUrl} 
                                alt={isCurrentUser ? 'You' : fullName} 
                              />
                              <AvatarFallback className="text-xs">
                                {isCurrentUser ? 'Y' : getUserInitials(fullName || 'User').charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className={`rounded-lg p-2 ${
                              isCurrentUser 
                                ? 'bg-green-600 text-white' 
                                : 'bg-white border shadow-sm'
                            }`}>
                              <p className="text-sm">{message.message}</p>
                              <p className={`text-xs mt-1 ${
                                isCurrentUser ? 'text-green-100' : 'text-gray-500'
                              }`}>
                                {formatMessageTime(message.sentAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Message Input - Fixed at bottom */}
              <div className="bg-white border-t p-3 flex-shrink-0">
                <div className="flex space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                    disabled={sendingMessage}
                    className="flex-1 h-9 text-sm"
                  />
                  <Button 
                    onClick={sendChatMessage}
                    disabled={!newMessage.trim() || sendingMessage}
                    className="bg-green-600 hover:bg-green-700 h-9 px-3"
                  >
                    {sendingMessage ? (
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                    ) : (
                      <Send className="w-3 h-3" />
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Reminder Tab - Fixed height container */}
            <TabsContent value="remind" className="flex-1 m-0 p-0 min-h-0">
              <div className="h-full bg-white overflow-y-auto">
                <div className="p-4">
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-lg font-semibold mb-4">Send Reminder</h2>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Channel</label>
                      <Select value={remindChannel} onValueChange={(value) => setRemindChannel(value as 'push' | 'email')}>
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="push">Push Notification</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Message</label>
                      <Textarea
                        value={remindMessage}
                        onChange={(e) => setRemindMessage(e.target.value)}
                        placeholder="Enter your reminder message..."
                        rows={4}
                        disabled={sendingRemind}
                        className="min-h-24 text-sm"
                      />
                    </div>

                    <Button 
                      onClick={sendReminder}
                      disabled={!remindMessage.trim() || sendingRemind}
                      className="w-full bg-green-600 hover:bg-green-700 h-9"
                    >
                      {sendingRemind ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Bell className="w-3 h-3 mr-2" />
                          Send Reminder
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CoachChatMember;