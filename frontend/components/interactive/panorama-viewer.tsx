"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Hotspot {
  id: number
  x: number
  y: number
  title: string
  description: string
  icon?: React.ReactNode
}

interface PanoramaViewerProps {
  imageSrc: string
  hotspots: Hotspot[]
  className?: string
}

export function PanoramaViewer({ imageSrc, hotspots, className }: PanoramaViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const [imageWidth, setImageWidth] = useState(0)

  // Initialize container width and image width
  useEffect(() => {
    if (containerRef.current && imageRef.current) {
      setContainerWidth(containerRef.current.offsetWidth)

      // For a 360° panorama, we need the image to be at least twice the container width
      // to create the scrolling effect
      setImageWidth(containerRef.current.offsetWidth * 2)
    }

    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth)
        setImageWidth(containerRef.current.offsetWidth * 2)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Handle mouse down event
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartX(e.pageX - (containerRef.current?.offsetLeft || 0))
    setScrollLeft(containerRef.current?.scrollLeft || 0)
  }

  // Handle mouse leave event
  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  // Handle mouse up event
  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Handle mouse move event
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()

    const x = e.pageX - (containerRef.current?.offsetLeft || 0)
    const walk = (x - startX) * 2 // Scroll speed multiplier

    if (containerRef.current) {
      containerRef.current.scrollLeft = scrollLeft - walk
    }
  }

  // Handle touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setStartX(e.touches[0].pageX - (containerRef.current?.offsetLeft || 0))
    setScrollLeft(containerRef.current?.scrollLeft || 0)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return

    const x = e.touches[0].pageX - (containerRef.current?.offsetLeft || 0)
    const walk = (x - startX) * 2

    if (containerRef.current) {
      containerRef.current.scrollLeft = scrollLeft - walk
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  // Auto-scroll effect
  useEffect(() => {
    if (isDragging || !containerRef.current) return

    let animationId: number
    let scrollPosition = containerRef.current.scrollLeft

    const animate = () => {
      if (!containerRef.current) return

      scrollPosition += 0.5 // Adjust speed as needed

      // Loop the scroll when reaching the end
      if (scrollPosition >= imageWidth - containerWidth) {
        scrollPosition = 0
      }

      containerRef.current.scrollLeft = scrollPosition
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationId)
  }, [isDragging, containerWidth, imageWidth])

  return (
    <div className={`relative overflow-hidden rounded-xl ${className}`}>
      {/* Panorama Container */}
      <div
        ref={containerRef}
        className="w-full h-[400px] overflow-x-scroll overflow-y-hidden cursor-grab scrollbar-hide"
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div style={{ width: `${imageWidth}px`, position: "relative", height: "100%" }}>
          <img
            ref={imageRef}
            src={imageSrc || "/placeholder.svg"}
            alt="360 Panorama"
            className="h-full w-full object-cover"
            style={{ pointerEvents: "none" }}
          />

          {/* Hotspots */}
          {hotspots.map((hotspot) => (
            <button
              key={hotspot.id}
              className="absolute z-10 p-1 rounded-full bg-primary/80 text-white hover:bg-primary transition-all duration-300 transform hover:scale-110 shadow-lg"
              style={{
                left: `${hotspot.x * 100}%`,
                top: `${hotspot.y * 100}%`,
                transform: "translate(-50%, -50%)",
              }}
              onClick={(e) => {
                e.stopPropagation()
                setSelectedHotspot(hotspot)
              }}
            >
              {hotspot.icon || <Info className="h-6 w-6" />}
            </button>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
        Drag to explore or tap hotspots
      </div>

      {/* Hotspot Detail Modal */}
      <AnimatePresence>
        {selectedHotspot && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute inset-0 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm z-20"
          >
            <Card className="w-full max-w-md">
              <CardHeader className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2"
                  onClick={() => setSelectedHotspot(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <CardTitle>{selectedHotspot.title}</CardTitle>
                <CardDescription>Discover our story</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{selectedHotspot.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

