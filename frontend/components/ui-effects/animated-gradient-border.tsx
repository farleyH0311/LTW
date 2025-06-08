"use client"

import type React from "react"
import { cn } from "@/lib/utils"

interface AnimatedGradientBorderProps {
  children: React.ReactNode
  className?: string
  containerClassName?: string
  gradientClassName?: string
  variant?: "default" | "button"
}

export function AnimatedGradientBorder({
  children,
  className,
  containerClassName,
  gradientClassName,
  variant = "default",
}: AnimatedGradientBorderProps) {
  // Button-specific styling
  if (variant === "button") {
    return (
      <div
        className={cn(
          "relative rounded-full overflow-hidden p-[1px]",
          "group transition-all duration-300",
          containerClassName,
        )}
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full z-0",
            "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500",
            "bg-[length:200%_100%] animate-gradient",
            gradientClassName,
          )}
        />
        <div className={cn("relative z-10 rounded-full", className)}>{children}</div>
      </div>
    )
  }

  // Default styling for non-button elements
  return (
    <div
      className={cn(
        "relative rounded-xl p-[1px] overflow-hidden",
        "group transition-all duration-300",
        containerClassName,
      )}
    >
      <div
        className={cn(
          "absolute inset-0 rounded-xl z-0",
          "bg-gradient-to-r from-primary via-secondary to-primary",
          "bg-[length:200%_100%] animate-gradient",
          gradientClassName,
        )}
      />
      <div className={cn("relative z-10 rounded-[calc(0.75rem-1px)] h-full", "bg-background", className)}>
        {children}
      </div>
    </div>
  )
}

