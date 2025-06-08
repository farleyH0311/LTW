"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Calendar, Heart, Home, LayoutDashboard, LogOut, MessageSquare, User } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useLanguage } from "../language-provider"
import { Button } from "../ui/button"
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"
import { NotificationBell } from '@/components/NotificationBell'

export function MobileNavigation() {
  const pathname = usePathname() ?? ""
  const router = useRouter()
  const { t } = useLanguage()
  const storedUserId = typeof window !== 'undefined' ? localStorage.getItem("userId") : null;
  const [userId, setUserId] = useState<number | null>(null); 

  useEffect(() => {
    const stored = localStorage.getItem('userId');
    if (stored && !isNaN(+stored)) {
      setUserId(+stored);
    }
  }, []);

  const navItems = [
    {
      href: "/feed",
      label: t("nav.home"),
      icon: Home,
    },
    {
      href: "/dashboard",
      label: t("nav.dashboard"),
      icon: LayoutDashboard,
    },
    {
      href: "/matches",
      label: t("nav.matches"),
      icon: Heart,
    },
    {
      href: "/messages",
      label: t("nav.messages"),
      icon: MessageSquare,
    },
    {
      href: "/dating",
      label: t("nav.dating"),
      icon: Calendar,
    },
    {
      href: "/profile",
      label: t("nav.profile"),
      icon: User,
    },
  ]

  const handleLogout = () => {
    // Xử lý đăng xuất
    router.push("/login")
  }

  return (
    <>
{userId && (
  <div className="fixed top-4 right-4 z-50 lg:hidden">
    <NotificationBell />

  </div>
)}
      <Sheet>
        <SheetTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            className="fixed bottom-20 right-4 z-50 rounded-full border-primary/20 bg-background lg:hidden"
          >
            <LogOut className="h-5 w-5 text-primary" />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-auto rounded-t-xl pb-8 pt-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <LogOut className="h-10 w-10 text-primary" />
            <h3 className="text-lg font-medium">{t("nav.logout") || "Đăng xuất"}</h3>
            <p className="text-center text-sm text-muted-foreground">
              Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?
            </p>
            <div className="flex w-full gap-2 pt-4">
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={() => document.querySelector<HTMLButtonElement>('[data-radix-collection-item]')?.click()}
              >
                Hủy
              </Button>
              <Button 
                variant="default" 
                className="flex-1 bg-primary" 
                onClick={handleLogout}
              >
                Đăng xuất
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t bg-background lg:hidden">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex h-full w-full flex-col items-center justify-center",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}

