"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface MoodRingProps {
  mood: "happy" | "romantic" | "calm" | "energetic" | "thoughtful" | "random"
  size?: "sm" | "md" | "lg"
  className?: string
  pulseEffect?: boolean
}

export function MoodRing({ mood, size = "md", className, pulseEffect = true }: MoodRingProps) {
  const [colors, setColors] = useState<string[]>([])

  useEffect(() => {
    // Define mood color palettes
    const moodColors = {
      happy: ["#FFD700", "#FFA500", "#FF4500"],
      romantic: ["#FF69B4", "#FF1493", "#C71585"],
      calm: ["#00CED1", "#20B2AA", "#5F9EA0"],
      energetic: ["#FF0000", "#FF4500", "#FF8C00"],
      thoughtful: ["#9370DB", "#8A2BE2", "#4B0082"],
      random: [],
    }

    if (mood === "random") {
      // Generate random colors
      const randomColors = Array(3)
        .fill(0)
        .map(() => {
          return `#${Math.floor(Math.random() * 16777215)
            .toString(16)
            .padStart(6, "0")}`
        })
      setColors(randomColors)
    } else {
      setColors(moodColors[mood])
    }
  }, [mood])

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  }

  if (colors.length === 0) return null

  return (
    <div
      className={cn(
        "rounded-full relative overflow-hidden",
        sizeClasses[size],
        pulseEffect && "animate-pulse",
        className,
      )}
    >
      <div
        className="absolute inset-0 animate-spin-slow"
        style={{
          background: `conic-gradient(${colors[0]}, ${colors[1]}, ${colors[2]}, ${colors[0]})`,
        }}
      />
    </div>
  )
}

