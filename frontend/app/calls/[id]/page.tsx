"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Sparkles, Mic, MicOff, Video, VideoOff, PhoneOff, MessageCircle, MoreVertical, Volume2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useLanguage } from "@/components/language-provider"
import { AnimatedGradientBorder } from "@/components/ui-effects/animated-gradient-border"
import { PulseAnimation } from "@/components/ui-effects/pulse-animation"

export default function CallPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useLanguage()

  const isVideoCall = searchParams.get("video") === "true"
  const [callStatus, setCallStatus] = useState<"connecting" | "ringing" | "ongoing" | "ended">("connecting")
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [callDuration, setCallDuration] = useState(0)

  // Sample conversation data
  const contact = {
    id: Number.parseInt(params.id),
    name: ["Sarah Johnson", "Michael Chen", "Emma Wilson", "David Kim", "Sophia Martinez"][
      Number.parseInt(params.id) - 1
    ],
    avatar: `/placeholder.svg?height=40&width=40&text=${["SJ", "MC", "EW", "DK", "SM"][Number.parseInt(params.id) - 1]}`,
  }

  // Simulate call connection
  useEffect(() => {
    const connectingTimer = setTimeout(() => {
      setCallStatus("ringing")

      const ringingTimer = setTimeout(() => {
        setCallStatus("ongoing")

        // Start call duration timer
        const durationInterval = setInterval(() => {
          setCallDuration((prev) => prev + 1)
        }, 1000)

        return () => clearInterval(durationInterval)
      }, 3000)

      return () => clearTimeout(ringingTimer)
    }, 2000)

    return () => clearTimeout(connectingTimer)
  }, [])

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleEndCall = () => {
    setCallStatus("ended")
    setTimeout(() => {
      router.push(`/chat/${params.id}`)
    }, 1500)
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-primary/10">
      <div className="container flex h-16 items-center justify-between pt-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="text-xl font-semibold">Harmonia</span>
        </div>

        {callStatus === "ongoing" && (
          <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-sm font-medium">{formatCallDuration(callDuration)}</span>
          </div>
        )}

        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        {isVideoCall ? (
          <div className="relative w-full max-w-4xl aspect-video rounded-xl overflow-hidden bg-muted">
            {/* Video placeholder */}
            {!isVideoOff ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground">Video Preview</p>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={contact.avatar} alt={contact.name} />
                  <AvatarFallback>{contact.name[0]}</AvatarFallback>
                </Avatar>
              </div>
            )}

            {/* Self view */}
            {!isVideoOff && (
              <div className="absolute bottom-4 right-4 w-48 aspect-video rounded-lg overflow-hidden border-2 border-background bg-muted">
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-xs text-muted-foreground">Your Camera</p>
                </div>
              </div>
            )}

            {/* Call status overlay */}
            {callStatus !== "ongoing" && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                <div className="text-center">
                  <Avatar className="h-24 w-24 mx-auto mb-4">
                    <AvatarImage src={contact.avatar} alt={contact.name} />
                    <AvatarFallback>{contact.name[0]}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-2xl font-bold mb-2">{contact.name}</h2>
                  <p className="text-muted-foreground mb-6">
                    {callStatus === "connecting" && t("calls.connecting")}
                    {callStatus === "ringing" && t("calls.ringing")}
                    {callStatus === "ended" && t("calls.callEnded")}
                  </p>

                  {(callStatus === "connecting" || callStatus === "ringing") && (
                    <PulseAnimation size="md" color="primary" className="mx-auto" />
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            <PulseAnimation size="lg" color="primary" className="mx-auto mb-8" />
            <Avatar className="h-32 w-32 mx-auto mb-4">
              <AvatarImage src={contact.avatar} alt={contact.name} />
              <AvatarFallback>{contact.name[0]}</AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-bold mb-2">{contact.name}</h2>
            <p className="text-muted-foreground mb-6">
              {callStatus === "connecting" && t("calls.connecting")}
              {callStatus === "ringing" && t("calls.ringing")}
              {callStatus === "ongoing" && formatCallDuration(callDuration)}
              {callStatus === "ended" && t("calls.callEnded")}
            </p>
          </div>
        )}

        {/* Call controls */}
        {callStatus !== "ended" && (
          <div className="mt-8 flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <MicOff className="h-5 w-5 text-destructive" /> : <Mic className="h-5 w-5" />}
            </Button>

            {isVideoCall && (
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full"
                onClick={() => setIsVideoOff(!isVideoOff)}
              >
                {isVideoOff ? <VideoOff className="h-5 w-5 text-destructive" /> : <Video className="h-5 w-5" />}
              </Button>
            )}

            <AnimatedGradientBorder className="rounded-full">
              <Button variant="destructive" size="icon" className="h-14 w-14 rounded-full" onClick={handleEndCall}>
                <PhoneOff className="h-6 w-6" />
              </Button>
            </AnimatedGradientBorder>

            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={() => router.push(`/chat/${params.id}`)}
            >
              <MessageCircle className="h-5 w-5" />
            </Button>

            <Button variant="outline" size="icon" className="h-12 w-12 rounded-full">
              <Volume2 className="h-5 w-5" />
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}

