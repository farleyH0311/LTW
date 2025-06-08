"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Sparkles, Search, Phone, Video, Info, Paperclip, Send, ImageIcon, Mic, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useLanguage } from "@/components/language-provider"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { AnimatedGradientBorder } from "@/components/ui-effects/animated-gradient-border"

export default function ChatDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { t } = useLanguage()
  const [message, setMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

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

  const handleStartCall = (video: boolean) => {
    router.push(`/calls/${params.id}?video=${video}`)
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

      <main className="flex-1 flex flex-col md:flex-row">
        {/* Conversation List - Hidden on Mobile */}
        <div className="hidden md:block w-80 border-r">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder={t("chat.searchConversations")} className="pl-9" />
            </div>
          </div>

          <ScrollArea className="h-[calc(100vh-8rem)]">
            {[1, 2, 3, 4, 5].map((id) => {
              const isActive = id === Number.parseInt(params.id)
              const name = ["Sarah Johnson", "Michael Chen", "Emma Wilson", "David Kim", "Sophia Martinez"][id - 1]
              const avatar = `/placeholder.svg?height=40&width=40&text=${["SJ", "MC", "EW", "DK", "SM"][id - 1]}`
              const lastMessage = [
                "I'd love to try that hiking trail you mentioned!",
                "Looking forward to our coffee date tomorrow!",
                "That movie recommendation was perfect, thanks!",
                "I'll send you the details for the concert.",
                "Our compatibility score was so accurate!",
              ][id - 1]
              const time = ["2m ago", "1h ago", "3h ago", "Yesterday", "2d ago"][id - 1]
              const unread = id === 1 ? 2 : 0
              const online = [true, true, false, false, false][id - 1]

              return (
                <Link
                  key={id}
                  href={`/chat/${id}`}
                  className={`flex items-center gap-3 p-3 hover:bg-muted/50 ${isActive ? "bg-muted" : ""}`}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={avatar} alt={name} />
                      <AvatarFallback>{name[0]}</AvatarFallback>
                    </Avatar>
                    {online && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-background"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <p className="font-medium truncate">{name}</p>
                      <p className="text-xs text-muted-foreground">{time}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground truncate">{lastMessage}</p>
                      {unread > 0 && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                          {unread}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              )
            })}
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="flex items-center gap-3 p-3 border-b">
            <Button variant="ghost" size="icon" className="md:hidden" asChild>
              <Link href="/chat">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>

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
              <Button variant="ghost" size="icon" onClick={() => handleStartCall(false)}>
                <Phone className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleStartCall(true)}>
                <Video className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href={`/profile/${params.id}`}>
                  <Info className="h-5 w-5" />
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
        </div>
      </main>
    </div>
  )
}

