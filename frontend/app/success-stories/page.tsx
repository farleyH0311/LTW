"use client"
import Link from "next/link"
import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useLanguage } from "@/components/language-provider"
import { InteractiveSuccessStory } from "@/components/interactive/interactive-success-story"
import { AnimatedGradientBorder } from "@/components/ui-effects/animated-gradient-border"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

export default function SuccessStoriesPage() {
  const { t } = useLanguage()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    partnerName: "",
    email: "",
    matchDate: "",
    story: "",
  })

  // Sample success stories data
  const successStories = [
    {
      id: 1,
      names: "Sarah & Michael",
      matchDate: "8 months ago",
      location: "New York, NY",
      story:
        "We matched on Harmonia last summer and immediately hit it off. The compatibility assessment was spot on - we share the same values, communication style, and life goals. After chatting for a week, we had our first date at a local coffee shop, and the conversation flowed so naturally. We've been inseparable ever since and are now planning to move in together. Harmonia's AI somehow knew we'd be perfect for each other before we did!",
      testimonial:
        "The compatibility assessment was spot on. We connected instantly and share the same values and goals. We're now planning our future together.",
      image: "/placeholder.svg?height=200&width=200&text=S+M",
      milestones: [
        {
          date: "June 15, 2023",
          title: "First Match",
          description: "Connected on Harmonia with a 95% compatibility score.",
        },
        {
          date: "June 22, 2023",
          title: "First Date",
          description: "Met for coffee at The Brew House in downtown Manhattan.",
        },
        {
          date: "August 10, 2023",
          title: "Became Official",
          description: "Decided to be exclusive after several amazing dates.",
        },
        {
          date: "December 25, 2023",
          title: "First Holiday Together",
          description: "Spent Christmas with Michael's family in Boston.",
        },
        {
          date: "February 14, 2024",
          title: "Moving In Together",
          description: "Signed a lease for our first apartment together.",
        },
      ],
    },
    {
      id: 2,
      names: "David & Emma",
      matchDate: "1 year ago",
      location: "San Francisco, CA",
      story:
        "As busy professionals, we were both skeptical about dating apps, but Harmonia was different. The detailed personality assessment and AI matching actually worked! Our first conversation was about our shared love for hiking, and our first date was a trail hike followed by lunch. What impressed us most was how the app suggested conversation topics based on our shared interests, which helped break the ice. A year later, we're engaged and planning our wedding. We're so grateful to Harmonia for bringing us together.",
      testimonial:
        "We were both skeptical about dating apps, but Harmonia's detailed personality assessment and AI matching actually worked! Now we're engaged!",
      image: "/placeholder.svg?height=200&width=200&text=D+E",
      milestones: [
        {
          date: "March 3, 2023",
          title: "First Match",
          description: "Connected on Harmonia with a 92% compatibility score.",
        },
        {
          date: "March 10, 2023",
          title: "First Date",
          description: "Hiked the Coastal Trail and had lunch at Ocean View Café.",
        },
        {
          date: "May 20, 2023",
          title: "Became Official",
          description: "Made our relationship official during a weekend trip to Napa.",
        },
        {
          date: "September 15, 2023",
          title: "Met the Parents",
          description: "Emma met David's parents during their visit from Chicago.",
        },
        {
          date: "February 14, 2024",
          title: "Got Engaged",
          description: "David proposed during a surprise dinner at the restaurant where they had their third date.",
        },
      ],
    },
    {
      id: 3,
      names: "James & Sophia",
      matchDate: "2 years ago",
      location: "Chicago, IL",
      story:
        "We both had tried several dating apps before Harmonia, but none of them resulted in meaningful connections. When we matched on Harmonia, the compatibility report highlighted our shared values and complementary communication styles. Our first date lasted 6 hours - we just couldn't stop talking! Two years later, we're married and expecting our first child. The AI matching on Harmonia truly changed our lives by bringing us together when other platforms had failed.",
      testimonial:
        "Two years after matching on Harmonia, we're married and expecting our first child. The AI matching truly changed our lives!",
      image: "/placeholder.svg?height=200&width=200&text=J+S",
      milestones: [
        {
          date: "January 5, 2022",
          title: "First Match",
          description: "Connected on Harmonia with a 97% compatibility score.",
        },
        {
          date: "January 12, 2022",
          title: "First Date",
          description: "Met for dinner that turned into a 6-hour conversation.",
        },
        {
          date: "March 1, 2022",
          title: "Became Official",
          description: "Decided to be exclusive after several weeks of dating.",
        },
        {
          date: "December 24, 2022",
          title: "Got Engaged",
          description: "James proposed during a holiday trip to Sophia's hometown.",
        },
        {
          date: "June 15, 2023",
          title: "Wedding Day",
          description: "Got married in a beautiful ceremony with friends and family.",
        },
        {
          date: "March 1, 2024",
          title: "Baby Announcement",
          description: "Announced they're expecting their first child in September.",
        },
      ],
    },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmitStory = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would send this data to your backend
    console.log("Submitting story:", formData)

    // Show success message
    toast({
      title: "Story submitted successfully!",
      description: "Thank you for sharing your Harmonia success story. We'll review it shortly.",
    })

    // Close dialog and reset form
    setIsDialogOpen(false)
    setFormData({
      name: "",
      partnerName: "",
      email: "",
      matchDate: "",
      story: "",
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">Harmonia</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Home
            </Link>
            <Link href="/how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              {t("nav.howItWorks")}
            </Link>
            <Link href="/success-stories" className="text-sm font-medium text-primary">
              {t("nav.testimonials")}
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <LanguageSwitcher />
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              {t("nav.signIn")}
            </Link>
            <Link href="/register" className="inline-block">
              <AnimatedGradientBorder variant="button">
                <Button className="border-0 bg-transparent hover:bg-white/10 text-white">{t("nav.getStarted")}</Button>
              </AnimatedGradientBorder>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="container py-12 md:py-16">
          <div className="mb-12 text-center">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
            <h1 className="text-4xl font-bold tracking-tight mb-4">Success Stories</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Real connections made through our platform. Click on the hearts to explore their journeys.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <InteractiveSuccessStory stories={successStories} />
          </motion.div>

          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">Share Your Story</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Found your perfect match on Harmonia? We'd love to hear about your journey and possibly feature your
              story!
            </p>
            <AnimatedGradientBorder variant="button">
              <Button
                size="lg"
                className="border-0 bg-transparent hover:bg-white/10 text-white"
                onClick={() => setIsDialogOpen(true)}
              >
                Submit Your Story
              </Button>
            </AnimatedGradientBorder>
          </div>

          <div className="bg-muted/30 rounded-xl p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Harmonia by the Numbers</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our AI-powered matching has created thousands of meaningful connections.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <div className="text-4xl font-bold text-primary mb-2">10,000+</div>
                <h3 className="text-xl font-medium mb-2">Successful Matches</h3>
                <p className="text-muted-foreground">Couples who found meaningful connections through our platform.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col items-center text-center"
              >
                <div className="text-4xl font-bold text-primary mb-2">92%</div>
                <h3 className="text-xl font-medium mb-2">Compatibility Accuracy</h3>
                <p className="text-muted-foreground">Our AI accurately predicts relationship compatibility.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col items-center text-center"
              >
                <div className="text-4xl font-bold text-primary mb-2">1,500+</div>
                <h3 className="text-xl font-medium mb-2">Engagements & Marriages</h3>
                <p className="text-muted-foreground">Couples who found lasting love and commitment.</p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-8 md:py-12">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold">Harmonia</span>
          </div>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            © {new Date().getFullYear()} Harmonia. {t("footer.rights")}
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              {t("footer.privacy")}
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              {t("footer.terms")}
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
              {t("footer.contact")}
            </Link>
          </div>
        </div>
      </footer>

      {/* Submit Story Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Your Success Story</DialogTitle>
            <DialogDescription>
              Tell us about your Harmonia experience and how you found your perfect match.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitStory}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="partnerName">Partner's Name</Label>
                  <Input
                    id="partnerName"
                    name="partnerName"
                    value={formData.partnerName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="matchDate">When did you match?</Label>
                <Input
                  id="matchDate"
                  name="matchDate"
                  type="date"
                  value={formData.matchDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="story">Your Story</Label>
                <Textarea
                  id="story"
                  name="story"
                  rows={5}
                  placeholder="Tell us how you met, your journey together, and how Harmonia helped..."
                  value={formData.story}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Submit Story</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

