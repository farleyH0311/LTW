"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import {
  Sparkles,
  Phone,
  Video,
  Info,
  Paperclip,
  Send,
  ImageIcon,
  Mic,
  ArrowLeft,
} from "lucide-react";

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

export default function ChatDetailPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const params = useParams();
  const otherUserId = parseInt(params?.id as string);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Safely get and decode token
  const getAuthData = useCallback(() => {
    try {
      if (typeof window === "undefined") return { accessToken: null, currentUserId: null };
      
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) return { accessToken: null, currentUserId: null };

      const decoded = jwtDecode<DecodedToken>(accessToken);
      
      // Check if token is expired
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("accessToken");
        router.push("/login");
        return { accessToken: null, currentUserId: null };
      }

      return { accessToken, currentUserId: decoded.userId };
    } catch (error) {
      console.error("Token decode error:", error);
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
      }
      router.push("/login");
      return { accessToken: null, currentUserId: null };
    }
  }, [router]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const fetchMessages = useCallback(async () => {
    const { accessToken } = getAuthData();
    if (!accessToken || !otherUserId || isNaN(otherUserId)) return;

    try {
      setError(null);
      const res = await instance.get(`/api/chat/${otherUserId}/messages`);
      setMessages(res.data);
      setTimeout(scrollToBottom, 100); // Small delay to ensure DOM is updated
    } catch (error: any) {
      console.error("Fetch messages failed:", error);
      setError(error?.response?.data?.message || "Failed to fetch messages");
      
      // Handle auth errors
      if (error?.response?.status === 401) {
        localStorage.removeItem("accessToken");
        router.push("/login");
      }
    }
  }, [otherUserId, getAuthData, scrollToBottom, router]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    
    const { accessToken } = getAuthData();
    if (!accessToken) return;

    setLoading(true);
    try {
      setError(null);
      const res = await instance.post(`/api/chat/${otherUserId}/messages`, {
        content: message.trim(),
      });
      
      setMessages((prev) => [...prev, res.data]);
      setMessage("");
      setTimeout(scrollToBottom, 100);
    } catch (error: any) {
      console.error("Send message failed:", error);
      setError(error?.response?.data?.message || "Failed to send message");
      
      if (error?.response?.status === 401) {
        localStorage.removeItem("accessToken");
        router.push("/login");
      }
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

  const handleStartCall = (video: boolean) => {
    router.push(`/calls/${otherUserId}?video=${video}`);
  };

  // Initialize and setup polling
  useEffect(() => {
    if (!otherUserId || isNaN(otherUserId)) {
      router.push("/chat");
      return;
    }

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
  }, [otherUserId, fetchMessages, router]);

  // Check auth on mount
  useEffect(() => {
    const { accessToken } = getAuthData();
    if (!accessToken) {
      router.push("/login");
    }
  }, [getAuthData, router]);

  const { currentUserId } = getAuthData();

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
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={() => router.push("/chat")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div className="flex-1">
            <p className="font-medium">Chat with User #{otherUserId}</p>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
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
              <a href={`/profile/${otherUserId}`}>
                <Info className="h-5 w-5" />
              </a>
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