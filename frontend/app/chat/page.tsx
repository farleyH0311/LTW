"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, Home } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useLanguage } from "@/components/language-provider"

export default function ChatPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")

  const conversations = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40&text=SJ",
      lastMessage: "I'd love to try that hiking trail you mentioned!",
      time: "2m ago",
      unread: 2,
      online: true,
    },
    {
      id: 2,
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=40&width=40&text=MC",
      lastMessage: "Looking forward to our coffee date tomorrow!",
      time: "1h ago",
      unread: 0,
      online: true,
    },
    {
      id: 3,
      name: "Emma Wilson",
      avatar: "/placeholder.svg?height=40&width=40&text=EW",
      lastMessage: "That movie recommendation was perfect, thanks!",
      time: "3h ago",
      unread: 0,
      online: false,
    },
    {
      id: 4,
      name: "David Kim",
      avatar: "/placeholder.svg?height=40&width=40&text=DK",
      lastMessage: "I'll send you the details for the concert.",
      time: "Yesterday",
      unread: 0,
      online: false,
    },
    {
      id: 5,
      name: "Sophia Martinez",
      avatar: "/placeholder.svg?height=40&width=40&text=SM",
      lastMessage: "Our compatibility score was so accurate!",
      time: "2d ago",
      unread: 0,
      online: false,
    },
  ]

  const filteredConversations = conversations.filter((convo) =>
    convo.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSelectChat = (id: number) => {
    router.push(`/chat/${id}`)
  }

  return (
    <main className="flex-1 flex flex-col md:flex-row">
      {/* Conversation List */}
      <div className="w-full md:w-80 border-r">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t("chat.searchConversations")}
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" className="w-full mt-3 gap-2" asChild>
            <Link href="/feed">
              <Home className="h-4 w-4" />
              <span>{t("nav.feed")}</span>
            </Link>
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-8rem)]">
          {filteredConversations.map((convo) => (
            <div
              key={convo.id}
              className="flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer"
              onClick={() => handleSelectChat(convo.id)}
            >
              <div className="relative">
                <Avatar>
                  <AvatarImage src={convo.avatar} alt={convo.name} />
                  <AvatarFallback>{convo.name[0]}</AvatarFallback>
                </Avatar>
                {convo.online && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-background"></span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <p className="font-medium truncate">{convo.name}</p>
                  <p className="text-xs text-muted-foreground">{convo.time}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground truncate">{convo.lastMessage}</p>
                  {convo.unread > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                      {convo.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Empty State */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <MessageCircle className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">{t("chat.selectConversation")}</h2>
          <p className="text-muted-foreground mb-6">{t("chat.selectConversationDesc")}</p>
          <Button asChild>
            <Link href="/matches">{t("matches.title")}</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}

function MessageCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  )
}

