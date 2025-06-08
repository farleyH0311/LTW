"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users, MessageCircle, Heart, User, Video } from "lucide-react"

import { cn } from "@/lib/utils"
import { useLanguage } from "@/components/language-provider"

export function MobileNav({ className }: { className?: string }) {
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
  ]

  return (
    <div className={cn("fixed bottom-0 left-0 z-50 w-full border-t bg-background", className)}>
      <div className="grid h-16 grid-cols-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1",
                isActive ? "text-primary" : "text-muted-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

