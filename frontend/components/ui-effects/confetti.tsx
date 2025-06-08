"use client"

import { useEffect, useState } from "react"
import JSConfetti from "js-confetti"

interface ConfettiProps {
  trigger: boolean
  onComplete?: () => void
}

export function Confetti({ trigger, onComplete }: ConfettiProps) {
  const [confetti, setConfetti] = useState<JSConfetti | null>(null)

  useEffect(() => {
    // Initialize confetti only on client side
    setConfetti(new JSConfetti())

    return () => {
      // Clean up
      setConfetti(null)
    }
  }, [])

  useEffect(() => {
    if (trigger && confetti) {
      const colors = ["#5D3FD3", "#E83A82", "#F9D923", "#36B5B0"]

      confetti.addConfetti({
        confettiColors: colors,
        confettiRadius: 6,
        confettiNumber: 300,
      })

      // Call onComplete after animation
      setTimeout(() => {
        onComplete?.()
      }, 2500)
    }
  }, [trigger, confetti, onComplete])

  return null
}

