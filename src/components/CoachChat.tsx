import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  onClose: () => void;
  onNewMessageCountChange: (count: number) => void;
  isVisible: boolean;
};

const CoachChat: React.FC<CoachChatProps> = ({ onClose, onNewMessageCountChange, isVisible }) => {
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

  // States mới để quản lý scroll và tin nhắn mới
  const [showNewMessageButton, setShowNewMessageButton] = useState(false);
  const [unreadChatMessagesCount, setUnreadChatMessagesCount] = useState(0);

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

  // Scroll to bottom with smooth animation
  const scrollToBottom = useCallback(() => {
    if (chatContainerRef.current) {
      const container = chatContainerRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
      setShowNewMessageButton(false); // Ẩn nút khi scroll xuống
      setUnreadChatMessagesCount(0); // Đặt lại số tin nhắn chưa đọc
    }
  }, []);

  const scrollToBottomRemind = useCallback(() => {
    if (remindContainerRef.current) {
      const container = remindContainerRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, []);

  // Check if user is near bottom (within 100px)
  const isNearBottom = useCallback((containerRef: React.RefObject<HTMLDivElement | null>) => {
    if (!containerRef.current) return true;
    const container = containerRef.current;
    const threshold = 100;
    return container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
  }, []);

  // Lấy tin nhắn chat
  const fetchChatMessages = async () => {
    if (!activePlan?.id) return;

    try {
      const notifications = await fetchProgressNotifications('chat');
      const processedMessages = await processMessages(notifications);

      const sortedMessages = processedMessages.sort((a, b) =>
        new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
      );

      // Chỉ cập nhật nếu có tin nhắn mới hoặc nội dung thay đổi
      if (JSON.stringify(chatMessages) !== JSON.stringify(sortedMessages)) {
        const currentUserId = getCurrentUserId();
        const newMessagesArrived = sortedMessages.length > chatMessages.length;
        let newUnreadCount = 0;

        if (newMessagesArrived) {
          // Tính số tin nhắn mới từ người khác (không phải của mình)
          const latestMessages = sortedMessages.slice(chatMessages.length);
          newUnreadCount = latestMessages.filter(msg => msg.senderId !== currentUserId).length;
        }

        // Kiểm tra xem người dùng có đang ở cuối chat không
        const wasNearBottom = isNearBottom(chatContainerRef);
        
        setChatMessages(sortedMessages);

        // Nếu có tin nhắn mới và chat đang mở:
        // - Nếu người dùng đang ở cuối, tự động scroll.
        // - Nếu người dùng đang scroll lên, hiển thị nút "New messages" và tăng unread count.
        if (newMessagesArrived) {
          if (isVisible) { // Chỉ xử lý scroll và nút nếu chat widget đang mở
            if (wasNearBottom) {
              setTimeout(() => {
                scrollToBottom();
              }, 100);
            } else {
              setShowNewMessageButton(true);
              setUnreadChatMessagesCount(prev => prev + newUnreadCount); // Tăng unread count
            }
          } else { // Nếu chat widget không hiển thị, chỉ tăng unread count
            setUnreadChatMessagesCount(prev => prev + newUnreadCount);
          }
        }
      }
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

      const sortedMessages = processedMessages.sort((a, b) =>
        new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
      );

      if (JSON.stringify(remindMessages) !== JSON.stringify(sortedMessages)) {
        const wasNearBottomRemind = isNearBottom(remindContainerRef);
        setRemindMessages(sortedMessages);

        if (wasNearBottomRemind || sortedMessages.length > remindMessages.length) {
          setTimeout(() => {
            scrollToBottomRemind();
          }, 100);
        }
      }
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

      setChatMessages(prev => {
        const updatedMessages = [...prev, processedMessage[0]];
        return updatedMessages.sort((a, b) =>
          new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
        );
      });
      setMessage('');

      // Sau khi gửi tin nhắn, luôn scroll xuống cuối và ẩn nút "New messages"
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
        setTimeout(() => {
          // Sau khi tải ban đầu, luôn scroll xuống cuối
          scrollToBottom();
          scrollToBottomRemind();
        }, 200);
      });
    }
  }, [activePlan?.id, activeMembership?.coachId, scrollToBottom, scrollToBottomRemind]);


  // Polling cho chat messages mỗi 5 giây
  useEffect(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }

    if (activeTab === 'chat' && activePlan?.id) {
      pollingRef.current = setInterval(fetchChatMessages, 5000);
    } else if (activeTab === 'remind' && activeMembership?.coachId) {
      pollingRef.current = setInterval(fetchRemindMessages, 5000);
    }

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [activeTab, activePlan?.id, activeMembership?.coachId, fetchChatMessages, fetchRemindMessages]);

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  // Khi tab thay đổi, scroll xuống cuối
  useEffect(() => {
    setTimeout(() => {
      if (activeTab === 'chat') {
        scrollToBottom();
      } else {
        scrollToBottomRemind();
      }
    }, 100);
  }, [activeTab, scrollToBottom, scrollToBottomRemind]);

  // Handle scroll events for chat to show/hide "New messages" button
  const handleChatScroll = useCallback(() => {
    if (isNearBottom(chatContainerRef)) {
      setShowNewMessageButton(false);
      setUnreadChatMessagesCount(0); // Khi người dùng scroll xuống cuối, reset unread count
    }
  }, [isNearBottom]);

  // Khi chat widget hiển thị, reset số tin nhắn chưa đọc
  useEffect(() => {
    if (isVisible) {
      setUnreadChatMessagesCount(0);
      setShowNewMessageButton(false); // Ẩn nút "New messages" khi mở chat
      setTimeout(() => {
        scrollToBottom(); // Đảm bảo scroll xuống cuối khi mở chat
      }, 100);
    }
  }, [isVisible, scrollToBottom]);

  // Thông báo số lượng tin nhắn chưa đọc ra bên ngoài thông qua prop
  useEffect(() => {
    onNewMessageCountChange(unreadChatMessagesCount);
  }, [unreadChatMessagesCount, onNewMessageCountChange]);


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

  // Hiển thị loading khi đang fetch active plan
  if (planLoading) {
    return (
      <div className="flex flex-col h-full rounded-lg shadow-lg border border-green-200 bg-white">
        {/* Header cho loading state */}
        <div className="flex flex-row items-center justify-between p-2 border-b border-green-100 bg-green-50 rounded-t-lg">
          <span className="text-sm font-bold text-green-700">Chat & Remind from Coach</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-1 text-gray-500 hover:bg-gray-100 rounded-full w-6 h-6"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </Button>
        </div>
        <div className="flex justify-center items-center flex-1">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
          <span className="ml-2 text-gray-600 text-sm">Đang tải thông tin...</span>
        </div>
      </div>
    );
  }

  // Hiển thị thông báo nếu không có active plan
  if (!activePlan) {
    return (
      <div className="flex flex-col h-full rounded-lg shadow-lg border border-green-200 bg-white">
        {/* Header cho no active plan state */}
        <div className="flex flex-row items-center justify-between p-2 border-b border-green-100 bg-green-50 rounded-t-lg">
          <span className="text-sm font-bold text-green-700">Chat & Remind from Coach</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-1 text-gray-500 hover:bg-gray-100 rounded-full w-6 h-6"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </Button>
        </div>
        <div className="flex flex-col justify-center items-center flex-1 text-center p-4">
          <p className="text-gray-600 text-sm mb-2">Không tìm thấy plan đang hoạt động.</p>
          <p className="text-xs text-gray-500">Vui lòng tạo một plan mới để sử dụng tính năng chat.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg overflow-hidden border border-green-200 shadow-lg">
      {/* Header cho trạng thái bình thường */}
      <div className="flex flex-row items-center justify-between p-2 border-b border-green-100 bg-green-50 rounded-t-lg">
        <span className="text-sm font-bold text-green-700">Chat & Remind from Coach</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="p-1 text-gray-500 hover:bg-gray-100 rounded-full w-6 h-6"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-green-100">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-2.5 px-3 text-center text-xs font-semibold transition-all duration-200 ${
            activeTab === 'chat'
              ? 'text-green-700 border-b-2 border-green-500 bg-green-50'
              : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
          }`}
        >
          Chat
        </button>
        <button
          onClick={() => setActiveTab('remind')}
          className={`flex-1 py-2.5 px-3 text-center text-xs font-semibold transition-all duration-200 ${
            activeTab === 'remind'
              ? 'text-green-700 border-b-2 border-green-500 bg-green-50'
              : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
          }`}
        >
          Remind
          {activeTab === 'remind' && !activeMembership?.coachId && (
            <span className="ml-1 text-[9px] text-orange-500">(!)</span>
          )}
        </button>
      </div>

      {/* Message Area */}
      <div
        className="flex-1 overflow-y-auto p-2 space-y-2 bg-gradient-to-b from-green-50 to-white min-h-0 custom-scrollbar relative"
        ref={activeTab === 'chat' ? chatContainerRef : remindContainerRef}
        onScroll={activeTab === 'chat' ? handleChatScroll : () => {}}
      >
        <style dangerouslySetInnerHTML={{
          __html: `
            .custom-scrollbar::-webkit-scrollbar {
              width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: #f0fdf4;
              border-radius: 3px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #10b981;
              border-radius: 3px;
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
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
          </div>
        ) : activeTab === 'remind' && !activeMembership?.coachId ? (
          <div className="flex justify-center items-center h-full text-center">
            <div className="text-center">
              <div className="w-10 h-10 mx-auto mb-2 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <p className="text-gray-600 text-xs mb-0.5">Chưa có coach được gán</p>
              <p className="text-[10px] text-gray-500">Vui lòng liên hệ admin.</p>
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
                    <Avatar className="w-7 h-7 mr-1.5 flex-shrink-0 bg-green-100">
                      {senderInfo?.avatarPath ? (
                        <AvatarImage src={senderInfo.avatarPath} alt={senderInfo.fullName} />
                      ) : (
                        <AvatarFallback className="text-green-800 text-[10px]">
                          {senderInfo?.fullName?.charAt(0) || 'C'}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  )}
                  <div className={`max-w-[85%] p-1.5 rounded-lg relative break-words ${
                    isCurrentUser
                      ? 'bg-green-600 text-white ml-auto rounded-br-md shadow-sm'
                      : 'bg-white text-gray-800 rounded-bl-md shadow-sm border border-green-100'
                  }`}>
                    {!isCurrentUser && senderInfo && (
                      <p className="text-[11px] font-semibold mb-0.5 text-green-600">
                        {senderInfo.fullName || 'Coach'}
                      </p>
                    )}
                    <p className="text-sm">{msg.message}</p>
                    <span className={`absolute text-[8px] bottom-0.5 ${
                      isCurrentUser
                        ? '-left-12 text-gray-400'
                        : '-right-12 text-gray-500'
                    }`}>
                      {formatTimestamp(msg.sentAt)}
                    </span>
                  </div>
                  {isCurrentUser && (
                    <Avatar className="w-7 h-7 ml-1.5 flex-shrink-0 bg-green-200">
                      <AvatarFallback className="text-green-900 text-[10px]">Bạn</AvatarFallback>
                    </Avatar>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}

        {/* New messages button */}
        {activeTab === 'chat' && showNewMessageButton && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={scrollToBottom}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-green-600 text-white text-xs px-3 py-1.5 rounded-full shadow-lg hover:bg-green-700 transition-colors duration-200 z-10 flex items-center space-x-1"
          >
            <span>New messages ({unreadChatMessagesCount})</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.button>
        )}
      </div>

      {/* Input Form */}
      {activeTab === 'chat' && (
        <form onSubmit={handleSubmit} className="flex gap-1.5 p-2 border-t border-green-100 bg-white rounded-b-lg">
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Gửi tin nhắn..."
            disabled={sending}
            className="flex-1 p-1.5 border-gray-300 rounded-md text-sm focus-visible:ring-green-500 focus-visible:ring-2 focus-visible:ring-offset-0"
          />
          <Button
            type="submit"
            disabled={sending || !message.trim()}
            className="bg-green-600 text-white px-3 py-1.5 rounded-md font-semibold text-sm hover:bg-green-700 transition-colors duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? 'Gửi...' : 'Gửi'}
          </Button>
        </form>
      )}
    </div>
  );
};

export default CoachChat;