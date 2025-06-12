"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Search,
  Phone,
  Video,
  Info,
  Paperclip,
  Send,
  ImageIcon,
  Mic,
  ArrowLeft,
} from "lucide-react";
import { jwtDecode } from "jwt-decode";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/components/language-provider";
import { MainNav } from "@/components/main-nav";
import { MobileNav } from "@/components/mobile-nav";
import { AnimatedGradientBorder } from "@/components/ui-effects/animated-gradient-border";
import { instance } from "@/app/axios";

interface Message {
  id: number;
  senderId: number;
  content: string;
  timestamp: string;
}

interface DecodedToken {
  userId: number;
  exp?: number;
}

interface ChatDetailPageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default function ChatDetailPage({ params }: ChatDetailPageProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otherUserId, setOtherUserId] = useState<number | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize auth and params
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (typeof window === "undefined") return;
        
        const token = localStorage.getItem("accessToken");
        if (!token) {
          router.push("/login");
          return;
        }

        const decoded = jwtDecode<DecodedToken>(token);
        
        // Check if token is expired
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("accessToken");
          router.push("/login");
          return;
        }

        setAccessToken(token);
        setCurrentUserId(decoded.userId);
      } catch (error) {
        console.error("Token decode error:", error);
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
        }
        router.push("/login");
      }
    };

    const initializeParams = async () => {
      try {
        const resolvedParams = await Promise.resolve(params);
        const userId = parseInt(resolvedParams.id);
        if (isNaN(userId)) {
          router.push("/chat");
          return;
        }
        setOtherUserId(userId);
      } catch (error) {
        console.error("Error resolving params:", error);
        router.push("/chat");
      }
    };

    initializeAuth();
    initializeParams();
  }, [params, router]);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, []);

  const fetchMessages = useCallback(async () => {
    if (!accessToken || !otherUserId) return;

    try {
      setError(null);
      const { data } = await instance.get(`/api/chat/${otherUserId}/messages`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setMessages(data);
      scrollToBottom();
    } catch (error: any) {
      console.error("Fetch messages failed:", error);
      
      if (error?.response?.status === 401) {
        localStorage.removeItem("accessToken");
        router.push("/login");
        return;
      }
      
      setError(error?.response?.data?.message || "Failed to fetch messages");
    }
  }, [accessToken, otherUserId, scrollToBottom, router]);

  const sendMessage = async () => {
    if (!message.trim() || !accessToken || !otherUserId) return;

    setLoading(true);
    try {
      setError(null);
      const { data } = await instance.post(
        `/api/chat/${otherUserId}/messages`,
        { content: message.trim() },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setMessages((prev) => [...prev, data]);
      setMessage("");
      scrollToBottom();
    } catch (error: any) {
      console.error("Send message failed:", error);
      
      if (error?.response?.status === 401) {
        localStorage.removeItem("accessToken");
        router.push("/login");
        return;
      }
      
      setError(error?.response?.data?.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Setup message polling
  useEffect(() => {
    if (!accessToken || !otherUserId) return;

    // Initial fetch
    fetchMessages();

    // Setup polling
    intervalRef.current = setInterval(fetchMessages, 3000);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [accessToken, otherUserId, fetchMessages]);

  const handleStartCall = (video: boolean) => {
    if (!otherUserId) return;
    router.push(`/calls/${otherUserId}?video=${video}`);
  };

  // Show loading state while initializing
  if (!otherUserId || !accessToken) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="flex items-center gap-2 mr-4">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">Harmonia</span>
          </div>

          <div className="hidden md:flex flex-1">
            <MainNav />
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <ThemeToggle />
            <LanguageSwitcher />
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <MobileNav className="md:hidden" />

      <main className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="flex items-center gap-3 p-3 border-b">
          <Button variant="ghost" size="icon" className="md:hidden" asChild>
            <Link href="/chat">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>

          <div className="flex-1">
            <p className="font-medium">Chat with User #{otherUserId}</p>
            {error && (
              <p className="text-sm text-destructive mt-1">{error}</p>
            )}
          </div>

          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handleStartCall(false)}
              disabled={loading}
            >
              <Phone className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handleStartCall(true)}
              disabled={loading}
            >
              <Video className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/profile/${otherUserId}`}>
                <Info className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.length === 0 && !error ? (
              <div className="text-center text-muted-foreground py-8">
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.senderId === currentUserId ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 whitespace-pre-wrap ${
                      msg.senderId === currentUserId 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted"
                    }`}
                  >
                    <p>{msg.content}</p>
                    <p className="mt-1 text-right text-xs opacity-70">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="border-t p-3">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" disabled={loading}>
              <Paperclip className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" disabled={loading}>
              <ImageIcon className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" disabled={loading}>
              <Mic className="h-5 w-5" />
            </Button>

            <Input
              placeholder={t("chat.typeMessage")}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
              disabled={loading}
            />

            <AnimatedGradientBorder className={(!message.trim() || loading) ? "opacity-50" : ""}>
              <Button 
                size="icon" 
                onClick={sendMessage} 
                disabled={!message.trim() || loading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </AnimatedGradientBorder>
          </div>
        </div>
      </main>
    </div>
  );
}