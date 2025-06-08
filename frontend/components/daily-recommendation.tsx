"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart, X, Star, Calendar, MapPin, Sparkles } from "lucide-react";
import { formatJoinedDate } from "../lib/formatdate";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PulseAnimation } from "@/components/ui-effects/pulse-animation";
import { Confetti } from "@/components/ui-effects/confetti";
import { AnimatedGradientBorder } from "@/components/ui-effects/animated-gradient-border";
import { useLanguage } from "@/components/language-provider";

interface Profile {
  id: number;
  name: string;
  age: number;
  location: string;
  compatibility: number;
  about_me: string;
  interests: string[];
  avt: string;
  is_online: boolean;
  last_online_at: Date;
}

interface DailyRecommendationProps {
  onMatch?: () => void;
  onSkip?: () => void;
  recommendations: Profile[];
}

export function DailyRecommendation({
  onMatch,
  onSkip,
  recommendations,
}: DailyRecommendationProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);
  const [exitComplete, setExitComplete] = useState(false);
  const router = useRouter();
  const { t } = useLanguage();

  const currentRecommendation = recommendations[currentIndex];
  const handleLike = () => {
    if (exitComplete) return;
    setDirection("right");
    setShowConfetti(true);
  };

  const handleSkip = () => {
    if (exitComplete) return;

    setDirection("left");
    onSkip?.();
  };

  const handleTransitionEnd = () => {
    setExitComplete(true);
  };

  const handleConfettiComplete = () => {
    setExitComplete(true);
    onMatch?.();
  };

  // Reset and move to next recommendation
  useEffect(() => {
    if (exitComplete) {
      const timer = setTimeout(() => {
        const nextIndex = (currentIndex + 1) % recommendations.length;
        setCurrentIndex(nextIndex);
        setDirection(null);
        setExitComplete(false);
        setShowConfetti(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [exitComplete, currentIndex, recommendations.length]);

  const viewProfile = () => {
    router.push(`/profile/${currentRecommendation.id}`);
  };

  if (!currentRecommendation) return null;

  return (
    <div className="relative w-full max-w-md mx-auto">
      <Confetti trigger={showConfetti} onComplete={handleConfettiComplete} />

      <AnimatedGradientBorder className="p-0">
        <Card
          className={cn(
            "overflow-hidden transition-all duration-500 transform",
            direction === "left" && "translate-x-[-120%] rotate-[-20deg]",
            direction === "right" && "translate-x-[120%] rotate-[20deg]"
          )}
          onTransitionEnd={handleTransitionEnd}
        >
          <div className="relative aspect-[3/4] w-full">
            <Image
              src={currentRecommendation.avt || "/placeholder.svg"}
              alt={currentRecommendation.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

            <div className="absolute top-4 right-4">
              <div className="flex items-center gap-1 rounded-full bg-primary/90 px-3 py-1 text-sm font-medium text-primary-foreground">
                <Sparkles className="mr-1 h-4 w-4" />
                {currentRecommendation.compatibility}% {t("match")}
              </div>
            </div>

            <div className="absolute bottom-0 left-0 p-6 w-full">
              <h3 className="text-2xl font-bold text-white flex items-center">
                {currentRecommendation.name}, {currentRecommendation.age}
                {currentRecommendation.compatibility > 90 && (
                  <Star className="ml-2 h-5 w-5 text-yellow-400 fill-yellow-400" />
                )}
              </h3>

              <div className="flex items-center gap-4 text-white/90 mt-1 mb-3">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{currentRecommendation.location}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {currentRecommendation.is_online ? (
                    <span className="flex items-center gap-1 text-green-600 font-medium">
                      <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                      {t("OnlineNow")}
                    </span>
                  ) : (
                    <span className="text-gray-500">
                      {t("LastSeen")}:{" "}
                      {formatJoinedDate(currentRecommendation.last_online_at)}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-white/80 line-clamp-3 mb-3">
                {currentRecommendation.about_me}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {currentRecommendation.interests.map((interest) => (
                  <Badge
                    key={interest}
                    variant="secondary"
                    className="bg-white/20 hover:bg-white/30 text-white"
                  >
                    {interest}
                  </Badge>
                ))}
              </div>

              <Button
                variant="secondary"
                className="w-full"
                onClick={viewProfile}
              >
                {t("viewFullProfile")}
              </Button>
            </div>
          </div>

          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                size="icon"
                className="h-14 w-14 rounded-full border-2 border-muted-foreground/20"
                onClick={handleSkip}
              >
                <X className="h-8 w-8 text-muted-foreground" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="h-14 w-14 rounded-full border-2 border-primary/20"
                onClick={handleLike}
              >
                <Heart className="h-8 w-8 text-primary" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </AnimatedGradientBorder>

      {/* Pulse animation behind the card for visual interest */}
      <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <PulseAnimation size="lg" color="primary" />
      </div>
    </div>
  );
}

// Helper function to conditionally join class names
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
