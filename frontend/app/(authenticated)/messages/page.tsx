"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, ChevronLeft, ChevronRight, Menu, Paperclip, Send, Sparkles, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useLanguage } from "@/components/language-provider"

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState(1)
  const [message, setMessage] = useState("")
  const [showChatList, setShowChatList] = useState(true)
  const { t } = useLanguage()

  // Kiểm tra viewport size để quyết định hiển thị mặc định của chat list trên mobile
  useEffect(() => {
    const handleResize = () => {
      setShowChatList(window.innerWidth >= 768)
    }
    
    // Set initial state
    handleResize()
    
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const toggleChatList = () => {
    setShowChatList(!showChatList)
  }

  const chats = [
    { id: 1, name: "Michael", age: 30, lastMessage: "Hey, how are you doing today?", time: "2h ago", unread: 2 },
    {
      id: 2,
      name: "Emma",
      age: 28,
      lastMessage: "I'd love to meet for coffee sometime!",
      time: "Yesterday",
      unread: 0,
    },
    { id: 3, name: "David", age: 32, lastMessage: "That sounds like a great plan.", time: "2d ago", unread: 0 },
    { id: 4, name: "Sophia", age: 27, lastMessage: "Thanks for the recommendation!", time: "3d ago", unread: 0 },
    { id: 5, name: "James", age: 31, lastMessage: "Looking forward to our date on Friday!", time: "1w ago", unread: 0 },
  ]

  const messages = [
    {
      id: 1,
      sender: "them",
      text: "Hey there! I noticed we both love hiking. What's your favorite trail?",
      time: "10:30 AM",
    },
    {
      id: 2,
      sender: "me",
      text: "Hi! Yes, I'm a big hiking enthusiast. I love the Cascade Falls trail. Have you been there?",
      time: "10:35 AM",
    },
    {
      id: 3,
      sender: "them",
      text: "I haven't been there yet, but it's on my list! I usually go to Mountain Ridge. The views are amazing.",
      time: "10:38 AM",
    },
    {
      id: 4,
      sender: "me",
      text: "Mountain Ridge is beautiful! We should check out Cascade Falls together sometime. The waterfall at the end is breathtaking.",
      time: "10:42 AM",
    },
    {
      id: 5,
      sender: "them",
      text: "That sounds like a great idea! I'd love to explore new trails. When are you usually free?",
      time: "10:45 AM",
    },
    { id: 6, sender: "me", text: "I typically have weekends free. How about you?", time: "10:50 AM" },
    { id: 7, sender: "them", text: "Weekends work for me too! How about next Saturday morning?", time: "10:52 AM" },
    { id: 8, sender: "them", text: "We could grab coffee afterward if you'd like.", time: "10:53 AM" },
  ]

  const handleSendMessage = () => {
    if (message.trim()) {
      // In a real app, you would send the message to the backend
      setMessage("")
    }
  }

  const handleChatSelect = (chatId: number) => {
    setSelectedChat(chatId)
    // On mobile, hide the chat list after selecting a chat
    if (window.innerWidth < 768) {
      setShowChatList(false)
    }
  }

  const selectedChatData = chats.find((chat) => chat.id === selectedChat)

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="relative h-[calc(100vh-4rem)]">
          {/* Mobile chat toggle button */}
          <button
            className="md:hidden absolute top-4 left-4 z-20 p-1 bg-background shadow-sm rounded-md border"
            onClick={toggleChatList}
          >
            {showChatList ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Chat list sidebar */}
          <div
            className={`absolute md:relative z-10 h-full bg-background border-r transition-all duration-300 ${
              showChatList ? "left-0 w-full md:w-[300px]" : "-left-full md:left-0 w-0 md:w-[300px]"
            }`}
          >
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">{t("messages.title") || "Messages"}</h2>
            </div>
            <ScrollArea className="h-[calc(100vh-8rem)]">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className={`flex items-center gap-4 p-4 cursor-pointer hover:bg-muted/50 ${
                    selectedChat === chat.id ? "bg-muted" : ""
                  }`}
                  onClick={() => handleChatSelect(chat.id)}
                >
                  <Avatar className="h-12 w-12 shrink-0">
                    <AvatarImage src={`/placeholder.svg?height=48&width=48&text=${chat.name}`} alt={chat.name} />
                    <AvatarFallback>{chat.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold truncate">
                        {chat.name}, {chat.age}
                      </h3>
                      <span className="text-xs text-muted-foreground">{chat.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                      {chat.unread > 0 && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground shrink-0 ml-2">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>

          {/* Chat content */}
          <div 
            className={`absolute md:relative h-full transition-all duration-300 flex flex-col bg-background ${
              showChatList ? "right-0 w-0 md:w-[calc(100%-300px)] invisible md:visible" : "right-0 w-full md:w-[calc(100%-300px)] visible"
            }`}
          >
            {selectedChatData && (
              <>
                <div className="flex items-center gap-2 p-4 border-b">
                  {!showChatList && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="md:hidden"
                      onClick={toggleChatList}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  )}
                  <Avatar className="h-10 w-10">
                    <AvatarImage 
                      src={`/placeholder.svg?height=40&width=40&text=${selectedChatData.name}`} 
                      alt={selectedChatData.name} 
                    />
                    <AvatarFallback>{selectedChatData.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">
                      {selectedChatData.name}, {selectedChatData.age}
                    </h3>
                    <div className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-green-500"></span>
                      <span className="text-xs text-muted-foreground">Online</span>
                    </div>
                  </div>
                  <div>
                    <Button variant="ghost" size="sm" className="hidden sm:flex" asChild>
                      <Link href={`/profile/${selectedChatData.id}`}>
                        {t("messages.viewProfile") || "View Profile"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="sm:hidden" asChild>
                      <Link href={`/profile/${selectedChatData.id}`}>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                        {msg.sender === "them" && (
                          <Avatar className="mr-2 h-8 w-8 shrink-0 self-end">
                            <AvatarImage 
                              src={`/placeholder.svg?height=32&width=32&text=${selectedChatData.name[0]}`} 
                              alt={selectedChatData.name} 
                            />
                            <AvatarFallback>{selectedChatData.name[0]}</AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`max-w-[85%] sm:max-w-[70%] rounded-lg px-3 py-2 ${
                            msg.sender === "me" ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                        >
                          <p className="break-words text-sm sm:text-base">{msg.text}</p>
                          <p className="mt-1 text-right text-xs opacity-70">{msg.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="border-t p-2 sm:p-4">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="shrink-0">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Input
                      placeholder={t("messages.typePlaceholder") || "Type a message..."}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSendMessage()
                        }
                      }}
                      className="flex-1"
                    />
                    <Button size="icon" onClick={handleSendMessage} disabled={!message.trim()} className="shrink-0">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

