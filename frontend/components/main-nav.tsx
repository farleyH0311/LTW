"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users, MessageCircle, Heart, User, Video, Bot } from "lucide-react"

import { cn } from "@/lib/utils"
import { useLanguage } from "@/components/language-provider"

export function MainNav({ className }: { className?: string }) {
  const pathname = usePathname()
  const { t } = useLanguage()

  const navItems = [
    {
      name: t("nav.feed"),
      href: "/feed",
      icon: Home,
    },
    {
      name: t("nav.matches"),
      href: "/matches",
      icon: Users,
    },
    {
      name: t("nav.messages"),
      href: "/chat",
      icon: MessageCircle,
    },
    {
      name: t("nav.dating"),
      href: "/dating",
      icon: Heart,
    },
    {
      name: t("nav.calls"),
      href: "/calls",
      icon: Video,
    },
    {
      name: t("nav.profile"),
      href: "/profile",
      icon: User,
    },
    {
      name: t("nav.advice"),
      href: "/advice",
      icon: Bot, 
    },
  ]

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
        console.log("t(nav.advice):", t("nav.advice"))


        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-1.5 text-sm font-medium transition-colors",
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </Link>
        )
      })}
    </nav>
  )
}

