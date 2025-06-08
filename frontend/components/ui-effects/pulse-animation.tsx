"use client"

import { cn } from "@/lib/utils"

interface PulseAnimationProps {
  size?: "sm" | "md" | "lg"
  color?: "primary" | "secondary" | "success"
  className?: string
}

export function PulseAnimation({ size = "md", color = "primary", className }: PulseAnimationProps) {
  const sizeClasses = {
    sm: "h-16 w-16",
    md: "h-24 w-24",
    lg: "h-32 w-32",
  }

  const colorClasses = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    success: "bg-green-500",
  }

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <div className={cn("absolute rounded-full opacity-70 animate-ping", sizeClasses[size], colorClasses[color])} />
      <div
        className={cn(
          "absolute rounded-full opacity-50 animate-pulse",
          "h-[calc(100%+16px)] w-[calc(100%+16px)]",
          colorClasses[color],
        )}
      />
      <div className={cn("relative rounded-full", "h-[calc(100%-16px)] w-[calc(100%-16px)]", colorClasses[color])} />
    </div>
  )
}

