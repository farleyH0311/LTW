"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { Paperclip, Send, ImageIcon, Mic, Video, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/components/language-provider";
import { ChatSuggestion } from "@/components/ChatSuggestion";
import { AnimatedGradientBorder } from "@/components/ui-effects/animated-gradient-border";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { instance } from "@/app/axios";

interface Message {
  id: number;
  senderId: number;
  content: string;
  timestamp: string;
  sender: {
    id: number;
    email: string;
    profile?: {
      name?: string;
    };
  };
}

export default function ChatDetailPage() {
  const { id } = useParams();
  const otherUserId = parseInt(id as string);
  const { t } = useLanguage();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isCallDialogOpen, setIsCallDialogOpen] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [callStatus, setCallStatus] = useState<"connecting" | "ringing" | "ongoing" | "ended">("connecting");
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    instance.get(`/api/users/${otherUserId}`)
      .then(({ data }) => {
        setConversation({
          id: data.id,
          name: data.profile?.name ?? data.username ?? `User ${data.id}`,
          avatar: data.profile?.avatar,
          online: data.online,
          lastSeen: data.lastSeen ?? "recently",
        });
      })
      .catch(() => setConversation({ name: "Unknown", avatar: undefined, online: false, lastSeen: "-" }));

    instance.get(`/api/chat/${otherUserId}/messages`)
      .then(({ data }) => setMessages(data))
      .catch(console.error);
  }, [otherUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    instance.post(`/api/chat/${otherUserId}/messages`, { content: message })
      .then(() => instance.get(`/api/chat/${otherUserId}/messages`))
      .then(({ data }) => {
        setMessages(data);
        setMessage("");
      })
      .catch(console.error);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startCall = (video: boolean) => {
    setIsVideoCall(video);
    setIsCallDialogOpen(true);
    setCallStatus("connecting");
    setTimeout(() => {
      setCallStatus("ringing");
      setTimeout(() => {
        setCallStatus("ongoing");
        const interval = setInterval(() => setCallDuration((p) => p + 1), 1000);
        return () => clearInterval(interval);
      }, 2000);
    }, 1000);
  };

  const endCall = () => {
    setCallStatus("ended");
    setTimeout(() => {
      setIsCallDialogOpen(false);
      setCallDuration(0);
    }, 1000);
  };

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 p-3 border-b">
        <div className="relative">
          <Avatar>
            <AvatarImage src={conversation?.avatar} alt={conversation?.name} />
            <AvatarFallback>{conversation?.name?.[0]}</AvatarFallback>
          </Avatar>
          {conversation?.online && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-background"></span>
          )}
        </div>

        <div className="flex-1">
          <p className="font-medium">{conversation?.name}</p>
          <p className="text-xs text-muted-foreground">
            {conversation?.online ? "Online" : `Last seen ${conversation?.lastSeen}`}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => startCall(false)}>
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => startCall(true)}>
            <Video className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Message List */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => {
            const isMe = conversation && msg.senderId === conversation.id;
            const senderName = msg.sender?.profile?.name ?? `User ${msg.senderId}`;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                {!isMe && (
                  <p className="text-sm text-muted-foreground mb-1 ml-1">
                    {senderName}
                  </p>
                )}
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    isMe ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <p className="mt-1 text-right text-xs opacity-70">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* ✅ Chat Suggestion Hiển thị ngay dưới message list */}
      <ChatSuggestion
        lastMessage={messages.at(-1)?.content ?? ""}
        senderName={conversation?.name ?? ""}
        onSelect={(text) => setMessage(text)}
      />

      {/* Input */}
      <div className="border-t p-3">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon"><Paperclip className="h-5 w-5" /></Button>
          <Button variant="ghost" size="icon"><ImageIcon className="h-5 w-5" /></Button>
          <Button variant="ghost" size="icon"><Mic className="h-5 w-5" /></Button>

          <Input
            placeholder={t("chat.typeMessage")}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />

          <AnimatedGradientBorder className={!message.trim() ? "opacity-50" : ""}>
            <Button size="icon" onClick={handleSendMessage} disabled={!message.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </AnimatedGradientBorder>
        </div>
      </div>

      {/* Call Dialog */}
      <Dialog open={isCallDialogOpen} onOpenChange={setIsCallDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isVideoCall ? "Video Call" : "Voice Call"} with {conversation?.name}
            </DialogTitle>
            <DialogDescription>
              {callStatus === "connecting" && "Connecting..."}
              {callStatus === "ringing" && "Ringing..."}
              {callStatus === "ongoing" && `Call duration: ${formatCallDuration(callDuration)}`}
              {callStatus === "ended" && "Call ended"}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center p-6">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={conversation?.avatar} alt={conversation?.name} />
              <AvatarFallback>{conversation?.name?.[0]}</AvatarFallback>
            </Avatar>

            {isVideoCall && callStatus === "ongoing" && (
              <div className="w-full aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                <p className="text-muted-foreground">Video preview would appear here</p>
              </div>
            )}

            <div className="flex gap-4 mt-4">
              {callStatus === "ongoing" && (
                <>
                  <Button variant="outline" size="icon" className="rounded-full h-12 w-12">
                    <Mic className="h-6 w-6" />
                  </Button>
                  {isVideoCall && (
                    <Button variant="outline" size="icon" className="rounded-full h-12 w-12">
                      <Video className="h-6 w-6" />
                    </Button>
                  )}
                </>
              )}
              <Button variant="destructive" size="icon" className="rounded-full h-12 w-12" onClick={endCall}>
                <Phone className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
