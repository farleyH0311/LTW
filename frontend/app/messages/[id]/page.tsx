"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Paperclip, Send, ImageIcon, Mic, Video, Phone } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useLanguage } from "@/components/language-provider"
import { AnimatedGradientBorder } from "@/components/ui-effects/animated-gradient-border"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

export default function ChatDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { t } = useLanguage()
  const [message, setMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isCallDialogOpen, setIsCallDialogOpen] = useState(false)
  const [isVideoCall, setIsVideoCall] = useState(false)
  const [callStatus, setCallStatus] = useState<"connecting" | "ringing" | "ongoing" | "ended">("connecting")
  const [callDuration, setCallDuration] = useState(0)

  // Sample conversation data
  const conversation = {
    id: Number.parseInt(params.id),
    name: ["Sarah Johnson", "Michael Chen", "Emma Wilson", "David Kim", "Sophia Martinez"][
      Number.parseInt(params.id) - 1
    ],
    avatar: `/placeholder.svg?height=40&width=40&text=${["SJ", "MC", "EW", "DK", "SM"][Number.parseInt(params.id) - 1]}`,
    online: [true, true, false, false, false][Number.parseInt(params.id) - 1],
    lastSeen: ["Just now", "Just now", "3 hours ago", "Yesterday", "2 days ago"][Number.parseInt(params.id) - 1],
  }

  // Sample messages
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "them",
      text: "Hey there! I noticed we have a 92% compatibility score. That's pretty impressive!",
      time: "10:30 AM",
    },
    {
      id: 2,
      sender: "me",
      text: "Hi! Yes, I was surprised by that too. Harmonia's AI seems to know what it's doing!",
      time: "10:35 AM",
    },
    {
      id: 3,
      sender: "them",
      text: "Definitely! I see we both love hiking and trying new restaurants. Any favorite trails or spots you'd recommend?",
      time: "10:38 AM",
    },
    {
      id: 4,
      sender: "me",
      text: "I love the Cascade Falls trail for hiking - the views are amazing! For restaurants, there's this new fusion place downtown called Harmony Kitchen that's fantastic.",
      time: "10:42 AM",
    },
    {
      id: 5,
      sender: "them",
      text: "Cascade Falls is on my list! And I've heard good things about Harmony Kitchen too. Would you maybe want to check it out together sometime?",
      time: "10:45 AM",
    },
  ])

  const handleSendMessage = () => {
    if (!message.trim()) return

    const newMessage = {
      id: messages.length + 1,
      sender: "me",
      text: message,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages([...messages, newMessage])
    setMessage("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Simulate receiving a message after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      const newMessage = {
        id: messages.length + 1,
        sender: "them",
        text: "By the way, I noticed you're into photography too. I'd love to see some of your work!",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      setMessages((prev) => [...prev, newMessage])
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  // Handle call functionality
  const startCall = (video: boolean) => {
    setIsVideoCall(video)
    setIsCallDialogOpen(true)
    setCallStatus("connecting")

    // Simulate call connection
    setTimeout(() => {
      setCallStatus("ringing")

      setTimeout(() => {
        setCallStatus("ongoing")

        // Start call duration timer
        const durationInterval = setInterval(() => {
          setCallDuration((prev) => prev + 1)
        }, 1000)

        return () => clearInterval(durationInterval)
      }, 2000)
    }, 1000)
  }

  const endCall = () => {
    setCallStatus("ended")
    setTimeout(() => {
      setIsCallDialogOpen(false)
      setCallDuration(0)
    }, 1000)
  }

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-3 border-b">
        <div className="relative">
          <Avatar>
            <AvatarImage src={conversation.avatar} alt={conversation.name} />
            <AvatarFallback>{conversation.name[0]}</AvatarFallback>
          </Avatar>
          {conversation.online && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-background"></span>
          )}
        </div>

        <div className="flex-1">
          <p className="font-medium">{conversation.name}</p>
          <p className="text-xs text-muted-foreground">
            {conversation.online ? "Online" : `Last seen ${conversation.lastSeen}`}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => startCall(false)}>
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => startCall(true)}>
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/users/${params.id}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            </Link>
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
              {msg.sender === "them" && (
                <Avatar className="mr-2 h-8 w-8">
                  <AvatarImage src={conversation.avatar} alt={conversation.name} />
                  <AvatarFallback>{conversation.name[0]}</AvatarFallback>
                </Avatar>
              )}

              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  msg.sender === "me" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <p className="mt-1 text-right text-xs opacity-70">{msg.time}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="border-t p-3">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <ImageIcon className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Mic className="h-5 w-5" />
          </Button>

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
              {isVideoCall ? "Video Call" : "Voice Call"} with {conversation.name}
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
              <AvatarImage src={conversation.avatar} alt={conversation.name} />
              <AvatarFallback>{conversation.name[0]}</AvatarFallback>
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
  )
}

