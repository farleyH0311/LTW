"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bot,
  Calendar,
  Heart,
  Home,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  User,
} from "lucide-react";
import { motion } from "framer-motion";
import { logout } from "../,,/../../app/axios";
import { cn } from "@/lib/utils";
import { useLanguage } from "../language-provider";
import { Button } from "../ui/button";
import { disconnectSocket } from "@/app/socket";
import { NotificationBell } from '@/components/NotificationBell';
import { useAuth } from '@/contexts/AuthContext'; 

interface NavItem {
  href: string;
  icon: React.FC<{ className?: string }>;
  label: string;
}

export function AppNavigation() {
  const router = useRouter();
  const { t } = useLanguage();
  const pathname = usePathname() ?? "";
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const storedUserId = typeof window !== 'undefined' ? localStorage.getItem("userId") : null;
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('userId');
    if (stored && !isNaN(+stored)) {
      setUserId(+stored);
    }
  }, []);

  const navItems: NavItem[] = [
    {
      href: "/feed",
      icon: Home,
      label: t("nav.home"),
    },
    {
      href: "/dashboard",
      icon: LayoutDashboard,
      label: t("nav.dashboard"),
    },
    {
      href: "/matches",
      icon: Heart,
      label: t("nav.matches"),
    },
    {
      href: "/messages",
      icon: MessageSquare,
      label: t("nav.messages"),
    },
    {
      href: "/dating",
      icon: Calendar,
      label: t("nav.dating"),
    },
    {
      href: "/profile",
      icon: User,
      label: t("nav.profile"),
    },
    {
      href: "/advice",
      icon: Bot,
      label: t("nav.advice"),
    },

  ];

  const handleTabClick = (href: string) => {
    setActiveTab(href);
    router.push(href);
  };
  const handleLogout = async () => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn đăng xuất?");
    if (!confirmed) return;

    try {
      disconnectSocket();
      await logout();
      localStorage.removeItem("accessToken");
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  const isActive = (href: string) => {
    return pathname.startsWith(href);
  };

  return (
    <nav className="app-navigation hidden justify-between p-4 lg:flex">
      <div className="flex gap-1">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Button
            key={href}
            variant="ghost"
            size="lg"
            className={cn("relative px-3", isActive(href) && "text-primary")}
            onClick={() => handleTabClick(href)}
          >
            <Icon className="mr-2 size-4" />
            {label}
            {isActive(href) && (
              <motion.div
                className="absolute inset-x-0 -bottom-[1px] h-[2px] bg-primary"
                layoutId="tab-indicator"
                transition={{ duration: 0.3 }}
              />
            )}
          </Button>
        ))}
      </div>
      <div className="flex items-center gap-4">
      {userId && (
        <div className="hidden lg:flex items-center">
          <NotificationBell />
        </div>
      )}
        <Button
          variant="outline"
          size="lg"
          className="border-primary/20 text-primary hover:bg-primary/10 hover:text-primary"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {t("nav.logout") || "Đăng xuất"}
        </Button>
      </div>
    </nav>
  );
}
