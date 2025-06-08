"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LogoutButtonProps {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function LogoutButton({
  variant = "default",
  size = "default",
  className,
}: LogoutButtonProps) {
  const router = useRouter();

  const handleLogout = () => {
    // In a real app, you would clear authentication state here
    // For example:
    // 1. Clear cookies/localStorage tokens
    // 2. Call a logout API endpoint
    // 3. Reset any global auth state

    // For now, we'll just redirect to the landing page
    router.push("/");
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      className={className}
    >
      <LogOut className="mr-2 h-4 w-4" />
      Log out
    </Button>
  );
}
