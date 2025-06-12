"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronRight, Menu, Paperclip, Send, X } from "lucide-react";
import { ChatSuggestion } from "@/components/ChatSuggestion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/components/language-provider";
import { instance } from "@/app/axios";
import { jwtDecode } from "jwt-decode";

const getCurrentUserId = (): number | null => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;
    const decoded = jwtDecode<{ id: number; userId?: number }>(token);
    // Try both 'id' and 'userId' properties
    return decoded.id || decoded.userId || null;
  } catch {
    return null;
  }
};

// Updated types to match backend response
type ChatItem = {
  id: number;
  name: string;
  avatar?: string | null;
  lastMessage?: {
    content: string;
    timestamp: string;
    isFromMe: boolean;
  } | null;
};

type Message = {
  id: number;
  senderId: number;
  content: string;
  timestamp: string;
  sender: {
    id: number;
    email: string;
    profile: {
      name: string;
      avatar?: string | null;
    } | null;
  };
};

export default function MessagesPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const [chats, setChats] = useState<ChatItem[]>([]);
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [showChatList, setShowChatList] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollerRef = useRef<NodeJS.Timeout | null>(null);

  // Get current user ID
  useEffect(() => {
    const uid = getCurrentUserId();
    if (uid) {
      setUserId(uid);
    } else {
      // Redirect to login if no valid token
      router.push('/login');
    }
  }, [router]);

  // Load conversations
  useEffect(() => {
    if (!userId) return;

    const fetchConversations = async () => {
      try {
        const { data } = await instance.get<ChatItem[]>("/api/chat/conversations");
        setChats(data);
        
        // Auto-select first chat if available
        if (data.length > 0 && !selectedChat) {
          setSelectedChat(data[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
      }
    };

    fetchConversations();
  }, [userId, selectedChat]);

  // Fetch messages and set up polling
  useEffect(() => {
    if (selectedChat === null) return;

    const fetchMessages = async () => {
      try {
        const { data } = await instance.get<Message[]>(`/api/chat/${selectedChat}/messages`);
        setMessages(data);
        // Scroll to bottom after a short delay to ensure DOM is updated
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    fetchMessages();
    
    // Set up polling every 3 seconds
    const intervalId = setInterval(fetchMessages, 3000);
    pollerRef.current = intervalId;

    return () => {
      if (pollerRef.current) {
        clearInterval(pollerRef.current);
        pollerRef.current = null;
      }
    };
  }, [selectedChat]);

  const handleSendMessage = async () => {
    if (!message.trim() || selectedChat === null || loading) return;

    setLoading(true);
    try {
      await instance.post(`/api/chat/${selectedChat}/messages`, { 
        content: message.trim() 
      });
      
      setMessage("");
      
      // Immediately fetch updated messages
      const { data } = await instance.get<Message[]>(`/api/chat/${selectedChat}/messages`);
      setMessages(data);
      
      // Scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle responsive chat list toggle
  useEffect(() => {
    const handleResize = () => {
      setShowChatList(window.innerWidth >= 768);
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Get current chat info
  const currentChat = chats.find(c => c.id === selectedChat);

  if (!userId) {
    return <div>Loading...</div>;
  }

  return (
  <div className="flex min-h-screen flex-col">
    <main className="flex flex-col md:flex-row flex-1 overflow-hidden relative">

      {/* Mobile toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-30 p-1 bg-background shadow rounded border"
        onClick={() => setShowChatList(prev => !prev)}
      >
        {showChatList ? <X /> : <Menu />}
      </button>

      {/* Chat List */}
      <div
        className={`transition-all duration-300 z-20 bg-background border-r md:relative flex-shrink-0
          ${showChatList ? "w-full md:w-80" : "w-0 md:w-80"}
          ${!showChatList ? "overflow-hidden" : ""}
        `}
      >
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">
            {t("messages.title") || "Messages"}
          </h2>
        </div>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          {chats.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No conversations yet
            </div>
          ) : (
            chats.map((chat) => (
              <div
                key={chat.id}
                className={`flex items-center gap-4 p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
                  selectedChat === chat.id ? "bg-muted" : ""
                }`}
                onClick={() => {
                  setSelectedChat(chat.id);
                  if (window.innerWidth < 768) {
                    setShowChatList(false);
                  }
                }}
              >
                <Avatar className="h-12 w-12 shrink-0">
                  {chat.avatar ? (
                    <AvatarImage src={chat.avatar} alt={chat.name} />
                  ) : (
                    <AvatarFallback>
                      {chat.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{chat.name}</h3>
                  {chat.lastMessage && (
                    <p className="text-sm text-muted-foreground truncate">
                      {chat.lastMessage.isFromMe ? "You: " : ""}
                      {chat.lastMessage.content}
                    </p>
                  )}
                </div>
                {chat.lastMessage && (
                  <div className="text-xs text-muted-foreground">
                    {new Date(chat.lastMessage.timestamp).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))
          )}
        </ScrollArea>
      </div>

      {/* Chat Content */}
      <div className="flex flex-col flex-1 bg-background min-w-0">
        {selectedChat !== null && currentChat ? (
          <>
            {/* Header */}
            <div className="flex items-center gap-2 p-4 border-b">
              {!showChatList && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setShowChatList(true)}
                >
                  <ChevronRight />
                </Button>
              )}
              <Avatar className="h-10 w-10">
                {currentChat.avatar ? (
                  <AvatarImage
                    src={currentChat.avatar}
                    alt={currentChat.name}
                  />
                ) : (
                  <AvatarFallback>
                    {currentChat.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <h3 className="font-semibold truncate flex-1">
                {currentChat.name}
              </h3>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    No messages yet. Start a conversation!
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isFromMe = msg.senderId === userId;
                    const senderName =
                      msg.sender.profile?.name || `User ${msg.sender.id}`;

                    return (
                      <div
                        key={msg.id}
                        className={`flex ${
                          isFromMe ? "justify-end" : "justify-start"
                        }`}
                      >
                        {!isFromMe && (
                          <Avatar className="mr-2 h-8 w-8 shrink-0">
                            {msg.sender.profile?.avatar ? (
                              <AvatarImage
                                src={msg.sender.profile.avatar}
                                alt={senderName}
                              />
                            ) : (
                              <AvatarFallback>
                                {senderName.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            )}
                          </Avatar>
                        )}
                        <div
                          className={`max-w-[85%] rounded-lg px-3 py-2 ${
                            isFromMe
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p className="break-words">{msg.content}</p>
                          <p className="mt-1 text-right text-xs opacity-70">
                            {new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            {/* ✨ Gợi ý phản hồi từ AI */}
<ChatSuggestion
  lastMessage={messages.at(-1)?.content ?? ""}
  senderName={currentChat.name}
  onSelect={(text) => setMessage(text)}
/>


            {/* Input */}
            <div className="border-t p-2 sm:p-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" disabled>
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  placeholder={
                    t("messages.typePlaceholder") || "Type a message..."
                  }
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="flex-1"
                  disabled={loading}
                />
                <Button
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={!message.trim() || loading}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 min-h-full items-center justify-center text-muted-foreground">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </main>
  </div>
);
}
