"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, MessageCircle, Calendar, MapPin } from "lucide-react"
import Image from "next/image"
import { Heart3D } from "./heart-3d"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnimatedGradientBorder } from "@/components/ui-effects/animated-gradient-border"
import { Confetti } from "@/components/ui-effects/confetti"
import { ScrollArea } from "@/components/ui/scroll-area"

interface SuccessStory {
  id: number
  names: string
  matchDate: string
  location: string
  story: string
  testimonial: string
  image: string
  milestones: {
    date: string
    title: string
    description: string
  }[]
}

interface InteractiveSuccessStoryProps {
  stories: SuccessStory[]
  className?: string
}

export function InteractiveSuccessStory({ stories, className }: InteractiveSuccessStoryProps) {
  const [activeStory, setActiveStory] = useState<SuccessStory | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [activeTab, setActiveTab] = useState("story")

  const handleHeartClick = (story: SuccessStory) => {
    setActiveStory(story)
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3000)
  }

  return (
    <div className={`relative ${className}`}>
      <Confetti trigger={showConfetti} />

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {stories.map((story) => (
          <motion.div
            key={story.id}
            className="flex flex-col items-center"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <AnimatedGradientBorder className="w-full">
              <Card className="w-full h-full flex flex-col">
                <CardHeader className="pb-2">
                  <CardTitle className="text-center">{story.names}</CardTitle>
                  <CardDescription className="text-center">Matched {story.matchDate}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col items-center justify-center">
                  <div className="relative mb-4 w-32 h-32 rounded-full overflow-hidden">
                    <Image src={story.image || "/placeholder.svg"} alt={story.names} fill className="object-cover" />
                  </div>
                  <div className="flex items-center justify-center mb-4">
                    <Heart3D width={150} height={150} onClick={() => handleHeartClick(story)} />
                  </div>
                  <p className="text-center text-sm text-muted-foreground line-clamp-2 mb-4">{story.testimonial}</p>
                  <Button variant="outline" size="sm" className="mt-auto" onClick={() => handleHeartClick(story)}>
                    Read Their Story
                  </Button>
                </CardContent>
              </Card>
            </AnimatedGradientBorder>
          </motion.div>
        ))}
      </div>

      {/* Story Detail Modal */}
      <AnimatePresence>
        {activeStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setActiveStory(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatedGradientBorder>
                <Card className="max-h-[90vh] flex flex-col">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-2xl">{activeStory.names}</CardTitle>
                        <CardDescription>A Harmonia Success Story</CardDescription>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => setActiveStory(null)}>
                        <span className="sr-only">Close</span>
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                            fill="currentColor"
                            fillRule="evenodd"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </Button>
                    </div>
                  </CardHeader>
                  <ScrollArea className="flex-1">
                    <CardContent>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="relative w-24 h-24 rounded-full overflow-hidden">
                          <Image
                            src={activeStory.image || "/placeholder.svg"}
                            alt={activeStory.names}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Matched {activeStory.matchDate}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{activeStory.location}</span>
                          </div>
                          <Badge variant="outline" className="mt-2">
                            <Heart className="h-3 w-3 mr-1 fill-primary text-primary" />
                            Harmonia Success
                          </Badge>
                        </div>
                      </div>

                      <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="story">Their Story</TabsTrigger>
                          <TabsTrigger value="timeline">Relationship Timeline</TabsTrigger>
                        </TabsList>
                        <TabsContent value="story" className="pt-4">
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <p className="italic text-muted-foreground mb-4">"{activeStory.testimonial}"</p>
                            <p>{activeStory.story}</p>
                          </div>
                        </TabsContent>
                        <TabsContent value="timeline" className="pt-4">
                          <ScrollArea className="h-[300px] pr-4">
                            <div className="relative border-l-2 border-primary/30 pl-6 ml-2 space-y-6">
                              {activeStory.milestones.map((milestone, index) => (
                                <div key={index} className="relative">
                                  <div className="absolute -left-8 top-1 w-4 h-4 rounded-full bg-primary"></div>
                                  <div className="mb-1 text-sm text-muted-foreground">{milestone.date}</div>
                                  <h4 className="text-base font-medium">{milestone.title}</h4>
                                  <p className="text-sm">{milestone.description}</p>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        </TabsContent>
                      </Tabs>

                      <div className="flex justify-center mt-6">
                        <Button variant="outline" size="sm" className="gap-2" onClick={() => setActiveStory(null)}>
                          <MessageCircle className="h-4 w-4" />
                          Share Your Story
                        </Button>
                      </div>
                    </CardContent>
                  </ScrollArea>
                </Card>
              </AnimatedGradientBorder>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

