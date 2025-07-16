// src/components/CoachChat.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  fetchProgressNotifications, 
  fetchCoachReminds, 
  postUserChat,
  type ProgressNotification,
  type CreateNotificationRequest 
} from '@/api/progressNoti';
import { getUserById, type UserInfo } from '@/api/userApi';
import { getActivePlanOfAnUser, type UserPlan } from '@/api/userPlanApi';
import { getActiveMembershipPackage, type MembershipPackageDto } from '@/api/membershipApi';

interface ChatMessage extends ProgressNotification {
  userInfo?: UserInfo | null;
}

type CoachChatProps = {
  coachId?: string; // Made optional since we'll get it from membership
};

const CoachChat: React.FC<CoachChatProps> = ({ coachId: propCoachId }) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'remind'>('chat');
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [remindMessages, setRemindMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [userCache, setUserCache] = useState<Map<string, UserInfo>>(new Map());
  const [activePlan, setActivePlan] = useState<UserPlan | null>(null);
  const [activeMembership, setActiveMembership] = useState<MembershipPackageDto | null>(null);
  const [planLoading, setPlanLoading] = useState(true);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const [shouldScrollToBottomRemind, setShouldScrollToBottomRemind] = useState(true);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const remindContainerRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Lấy current user ID từ localStorage
  const getCurrentUserId = (): string | null => {
    return localStorage.getItem('userId');
  };

  // Lấy active membership package
  const fetchActiveMembership = async () => {
    try {
      const membership = await getActiveMembershipPackage();
      setActiveMembership(membership);
      return membership;
    } catch (error) {
      console.error('Error fetching active membership:', error);
      setActiveMembership(null);
      return null;
    }
  };

  // Lấy active plan của user
  const fetchActivePlan = async () => {
    const userId = getCurrentUserId();
    if (!userId) {
      console.error('No user ID found in localStorage');
      setPlanLoading(false);
      return;
    }

    try {
      const plan = await getActivePlanOfAnUser(userId);
      setActivePlan(plan);
    } catch (error) {
      console.error('Error fetching active plan:', error);
    } finally {
      setPlanLoading(false);
    }
  };

  // Lấy thông tin user và cache lại
  const getUserInfo = async (userId: string): Promise<UserInfo | null> => {
    if (userCache.has(userId)) {
      return userCache.get(userId)!;
    }

    try {
      const userInfo = await getUserById(userId);
      setUserCache(prev => new Map(prev).set(userId, userInfo));
      return userInfo;
    } catch (error) {
      console.error('Error fetching user info:', error);
      return null;
    }
  };

  // Xử lý tin nhắn và gắn thông tin user
  const processMessages = async (messages: ProgressNotification[]): Promise<ChatMessage[]> => {
    const currentUserId = getCurrentUserId();
    const processedMessages: ChatMessage[] = [];

    for (const msg of messages) {
      const chatMessage: ChatMessage = { ...msg, userInfo: undefined };
      
      // Chỉ lấy thông tin user nếu tin nhắn không phải của current user
      if (msg.senderId !== currentUserId) {
        const userInfo = await getUserInfo(msg.senderId);
        if (userInfo) {
          chatMessage.userInfo = userInfo;
        }
      }
      
      processedMessages.push(chatMessage);
    }

    return processedMessages;
  };

  // Scroll to bottom with smooth animation for chat
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const container = chatContainerRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  // Scroll to bottom with smooth animation for remind
  const scrollToBottomRemind = () => {
    if (remindContainerRef.current) {
      const container = remindContainerRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  // Check if user is near bottom (within 100px) for chat
  const isNearBottom = () => {
    if (!chatContainerRef.current) return true;
    const container = chatContainerRef.current;
    const threshold = 100;
    return container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
  };

  // Check if user is near bottom (within 100px) for remind
  const isNearBottomRemind = () => {
    if (!remindContainerRef.current) return true;
    const container = remindContainerRef.current;
    const threshold = 100;
    return container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
  };

  // Handle scroll events for chat
  const handleScroll = () => {
    setShouldScrollToBottom(isNearBottom());
  };

  // Handle scroll events for remind
  const handleScrollRemind = () => {
    setShouldScrollToBottomRemind(isNearBottomRemind());
  };

  // Lấy tin nhắn chat
  const fetchChatMessages = async () => {
    if (!activePlan?.id) return;

    try {
      const notifications = await fetchProgressNotifications('chat');
      const processedMessages = await processMessages(notifications);
      
      // Chỉ update nếu có thay đổi
      setChatMessages(prev => {
        const prevIds = new Set(prev.map(msg => msg.id));
        const newMessages = processedMessages.filter(msg => !prevIds.has(msg.id));
        
        if (newMessages.length > 0) {
          // Trigger scroll to bottom for new messages
          setTimeout(() => {
            if (shouldScrollToBottom) {
              scrollToBottom();
            }
          }, 100);
          
          return [...prev, ...newMessages].sort((a, b) => 
            new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
          );
        }
        return prev;
      });
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    }
  };

  // Lấy tin nhắn remind với coachId từ membership
  const fetchRemindMessages = async () => {
    if (!activeMembership?.coachId) {
      console.warn('No coach assigned to active membership');
      return;
    }

    try {
      const notifications = await fetchCoachReminds(activeMembership.coachId);
      const processedMessages = await processMessages(notifications);
      
      setRemindMessages(prev => {
        const prevIds = new Set(prev.map(msg => msg.id));
        const newMessages = processedMessages.filter(msg => !prevIds.has(msg.id));
        
        if (newMessages.length > 0) {
          // Trigger scroll to bottom for new messages
          setTimeout(() => {
            if (shouldScrollToBottomRemind) {
              scrollToBottomRemind();
            }
          }, 100);
          
          return [...prev, ...newMessages].sort((a, b) => 
            new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
          );
        }
        return prev;
      });
    } catch (error) {
      console.error('Error fetching remind messages:', error);
    }
  };

  // Gửi tin nhắn
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || sending || !activePlan?.id) return;

    setSending(true);
    try {
      const requestBody: CreateNotificationRequest = {
        message: message.trim(),
        channel: 'push',
        type: 'chat'
      };

      const newMessage = await postUserChat(activePlan.id, requestBody);
      const processedMessage = await processMessages([newMessage]);
      
      setChatMessages(prev => [...prev, ...processedMessage]);
      setMessage('');
      
      // Always scroll to bottom after sending a message
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  // Kiểm tra tin nhắn có phải của current user không - CHỈ kiểm tra senderId
  const isCurrentUserMessage = (msg: ChatMessage): boolean => {
    const currentUserId = getCurrentUserId();
    return msg.senderId === currentUserId;
  };

  // Load active plan và membership trước
  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([
        fetchActivePlan(),
        fetchActiveMembership()
      ]);
    };
    loadInitialData();
  }, []);

  // Load dữ liệu ban đầu khi đã có activePlan và activeMembership
  useEffect(() => {
    if (activePlan?.id) {
      setLoading(true);
      const loadMessages = async () => {
        await Promise.all([
          fetchChatMessages(),
          activeMembership?.coachId ? fetchRemindMessages() : Promise.resolve()
        ]);
      };
      
      loadMessages().finally(() => {
        setLoading(false);
        // Scroll to bottom after initial load
        setTimeout(() => {
          scrollToBottom();
          scrollToBottomRemind();
        }, 200);
      });
    }
  }, [activePlan?.id, activeMembership?.coachId]);

  // Polling cho chat messages mỗi 5 giây
  useEffect(() => {
    if (activeTab === 'chat' && activePlan?.id) {
      pollingRef.current = setInterval(fetchChatMessages, 5000);
    } else if (activeTab === 'remind' && activeMembership?.coachId) {
      pollingRef.current = setInterval(fetchRemindMessages, 5000);
    } else {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    }

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [activeTab, activePlan?.id, activeMembership?.coachId]);

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  // Scroll to bottom when tab changes
  useEffect(() => {
    setTimeout(() => {
      if (activeTab === 'chat') {
        scrollToBottom();
      } else {
        scrollToBottomRemind();
      }
    }, 100);
  }, [activeTab]);

  const messageVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const getCurrentMessages = () => {
    return activeTab === 'chat' ? chatMessages : remindMessages;
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getCurrentContainerRef = () => {
    return activeTab === 'chat' ? chatContainerRef : remindContainerRef;
  };

  const getCurrentShouldScrollToBottom = () => {
    return activeTab === 'chat' ? shouldScrollToBottom : shouldScrollToBottomRemind;
  };

  const getCurrentScrollToBottom = () => {
    return activeTab === 'chat' ? scrollToBottom : scrollToBottomRemind;
  };

  // Hiển thị loading khi đang fetch active plan
  if (planLoading) {
    return (
      <Card className="flex flex-col h-full max-h-[600px] rounded-lg shadow-lg border border-green-200 bg-white">
        <CardContent className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          <span className="ml-2 text-gray-600">Đang tải thông tin...</span>
        </CardContent>
      </Card>
    );
  }

  // Hiển thị thông báo nếu không có active plan
  if (!activePlan) {
    return (
      <Card className="flex flex-col h-full max-h-[600px] rounded-lg shadow-lg border border-green-200 bg-white">
        <CardContent className="flex justify-center items-center h-64">
          <div className="text-center">
            <p className="text-gray-600 mb-2">Không tìm thấy plan đang hoạt động</p>
            <p className="text-sm text-gray-500">Vui lòng tạo một plan mới để sử dụng tính năng chat</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-full max-h-[600px] rounded-lg shadow-lg border border-green-200 bg-white">
      <CardHeader className="p-0 bg-white rounded-t-lg">
        {/* Navigation Tabs */}
        <div className="flex border-b border-green-100">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-4 px-6 text-center font-semibold transition-all duration-200 ${
              activeTab === 'chat'
                ? 'text-green-700 border-b-2 border-green-500 bg-green-50'
                : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
            }`}
          >
            Chat
          </button>
          <button
            onClick={() => setActiveTab('remind')}
            className={`flex-1 py-4 px-6 text-center font-semibold transition-all duration-200 ${
              activeTab === 'remind'
                ? 'text-green-700 border-b-2 border-green-500 bg-green-50'
                : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
            }`}
          >
            Remind
            {activeTab === 'remind' && !activeMembership?.coachId && (
              <span className="ml-1 text-xs text-orange-500">(!)</span>
            )}
          </button>
        </div>

        {/* Header Info */}
        <div className="p-4 flex items-center space-x-3 border-b border-green-100">
          <Avatar className="w-12 h-12 border-2 border-green-500 bg-green-100">
            <AvatarFallback className="text-green-800 font-semibold text-lg">
              {activeTab === 'chat' ? 'CH' : 'RM'}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="font-bold text-xl text-green-700">
              {activeTab === 'chat' ? 'Chat với Coach' : 'Remind từ Coach'}
            </CardTitle>
            <p className="text-sm text-gray-500 flex items-center">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full mr-1 animate-pulse"></span>
              {activeTab === 'chat' ? 'Đang hoạt động' : 
                activeMembership?.coachId ? 'Thông báo' : 'Chưa có coach được gán'}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent 
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-green-50 to-white min-h-0 custom-scrollbar"
        ref={getCurrentContainerRef()}
        onScroll={activeTab === 'chat' ? handleScroll : handleScrollRemind}
      >
        <style dangerouslySetInnerHTML={{
          __html: `
            .custom-scrollbar::-webkit-scrollbar {
              width: 8px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: #f0fdf4;
              border-radius: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #10b981;
              border-radius: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #059669;
            }
            .custom-scrollbar {
              scrollbar-width: thin;
              scrollbar-color: #10b981 #f0fdf4;
            }
          `
        }} />

        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        ) : activeTab === 'remind' && !activeMembership?.coachId ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-2">Chưa có coach được gán</p>
              <p className="text-sm text-gray-500">Vui lòng liên hệ admin để được gán coach</p>
            </div>
          </div>
        ) : (
          <AnimatePresence>
            {getCurrentMessages().map((msg) => {
              const isCurrentUser = isCurrentUserMessage(msg);
              const senderInfo = !isCurrentUser && msg.userInfo ? msg.userInfo : null;
              
              return (
                <motion.div
                  key={msg.id}
                  className={`flex items-start ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {!isCurrentUser && (
                    <Avatar className="w-9 h-9 mr-2 flex-shrink-0 bg-green-100">
                      {senderInfo?.avatarPath ? (
                        <AvatarImage src={senderInfo.avatarPath} alt={senderInfo.fullName} />
                      ) : (
                        <AvatarFallback className="text-green-800 text-sm">
                          {senderInfo?.fullName?.charAt(0) || 'C'}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  )}
                  <div className={`max-w-[75%] p-3 rounded-xl relative break-words ${
                    isCurrentUser
                      ? 'bg-green-600 text-white ml-auto rounded-br-none shadow-md'
                      : 'bg-white text-gray-800 rounded-bl-none shadow-md border border-green-100'
                  }`}>
                    {!isCurrentUser && senderInfo && (
                      <p className="text-xs font-semibold mb-1 text-green-600">
                        {senderInfo.fullName || 'Coach'}
                      </p>
                    )}
                    <p className="text-sm">{msg.message}</p>
                    <span className={`absolute text-[10px] bottom-1 ${
                      isCurrentUser 
                        ? '-left-[4.5rem] text-gray-400' 
                        : '-right-[4.5rem] text-gray-500'
                    }`}>
                      {formatTimestamp(msg.sentAt)}
                    </span>
                  </div>
                  {isCurrentUser && (
                    <Avatar className="w-9 h-9 ml-2 flex-shrink-0 bg-green-200">
                      <AvatarFallback className="text-green-900 text-sm">Bạn</AvatarFallback>
                    </Avatar>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </CardContent>

      {/* Chỉ hiển thị form input khi ở tab chat */}
      {activeTab === 'chat' && (
        <form onSubmit={handleSubmit} className="flex gap-3 p-4 border-t border-green-100 bg-white rounded-b-lg">
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Nhập tin nhắn của bạn..."
            disabled={sending}
            className="flex-1 p-3 border-gray-300 rounded-lg focus-visible:ring-green-500 focus-visible:ring-2 focus-visible:ring-offset-0"
          />
          <Button
            type="submit"
            disabled={sending || !message.trim()}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? 'Đang gửi...' : 'Gửi'}
          </Button>
        </form>
      )}

      {/* Scroll to bottom button - show for both tabs */}
      {!getCurrentShouldScrollToBottom() && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          onClick={getCurrentScrollToBottom()}
          className="absolute bottom-20 right-6 bg-green-600 text-white p-2 rounded-full shadow-lg hover:bg-green-700 transition-colors duration-200 z-10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.button>
      )}
    </Card>
  );
};

export default CoachChat;