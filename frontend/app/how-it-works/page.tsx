"use client"
import Link from "next/link"
import { motion } from "framer-motion"
import { Sparkles, ArrowLeft, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useLanguage } from "@/components/language-provider"
import { PanoramaViewer } from "@/components/interactive/panorama-viewer"
import { AnimatedGradientBorder } from "@/components/ui-effects/animated-gradient-border"

export default function HowItWorksPage() {
  const { t } = useLanguage()

  // Sample hotspots for the panorama
  const hotspots = [
    {
      id: 1,
      x: 0.2, // Position as percentage of the image width (0-1)
      y: 0.5, // Position as percentage of the image height (0-1)
      title: "AI-Powered Matching",
      description:
        "Our sophisticated algorithm analyzes over 100 personality traits, values, and goals to find your perfect match. We use machine learning to continuously improve our matching system based on successful relationships formed on our platform.",
    },
    {
      id: 2,
      x: 0.4,
      y: 0.3,
      title: "Verified Profiles",
      description:
        "Every profile on Harmonia undergoes a thorough verification process. We use a combination of AI and human review to ensure you're connecting with real people who are serious about finding meaningful relationships.",
    },
    {
      id: 3,
      x: 0.6,
      y: 0.6,
      title: "Guided Communication",
      description:
        "Our platform provides smart ice-breakers and conversation starters tailored to your shared interests. This helps you connect meaningfully and move beyond the awkward small talk that plagues traditional dating apps.",
    },
    {
      id: 4,
      x: 0.8,
      y: 0.4,
      title: "Relationship Insights",
      description:
        "As you interact with matches, our system provides personalized insights about your communication patterns and compatibility factors. These insights help you understand your relationship dynamics and grow together.",
    },
    {
      id: 5,
      x: 0.5,
      y: 0.7,
      title: "Our Story",
      description:
        "Harmonia was founded in 2023 by a team of relationship psychologists and AI engineers who were frustrated with superficial dating apps. Our mission is to create meaningful connections that last, using the power of advanced technology combined with deep psychological insights.",
    },
  ]

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
            <Link href="/how-it-works" className="text-sm font-medium text-primary">
              {t("nav.howItWorks")}
            </Link>
            <Link href="/success-stories" className="text-sm font-medium text-muted-foreground hover:text-foreground">
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
            <h1 className="text-4xl font-bold tracking-tight mb-4">{t("landing.howItWorks")}</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore our interactive 360° experience to learn how Harmonia creates meaningful connections.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <PanoramaViewer
              imageSrc="/placeholder.svg?height=800&width=1600&text=360°+Panorama"
              hotspots={hotspots}
              className="shadow-xl"
            />
          </motion.div>

          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-primary"
                >
                  <path
                    d="M21 8V16C21 18.7614 18.7614 21 16 21H8C5.23858 21 3 18.7614 3 16V8C3 5.23858 5.23858 3 8 3H16C18.7614 3 21 5.23858 21 8Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M7 14.5L9.5 17L17 9.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Sign Up & Create Profile</h3>
              <p className="text-muted-foreground">
                Create your account and build a detailed profile that showcases your personality, interests, and
                relationship goals.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-primary"
                >
                  <path
                    d="M9.5 4H4.5C4.22386 4 4 4.22386 4 4.5V9.5C4 9.77614 4.22386 10 4.5 10H9.5C9.77614 10 10 9.77614 10 9.5V4.5C10 4.22386 9.77614 4 9.5 4Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M19.5 4H14.5C14.2239 4 14 4.22386 14 4.5V9.5C14 9.77614 14.2239 10 14.5 10H19.5C19.7761 10 20 9.77614 20 9.5V4.5C20 4.22386 19.7761 4 19.5 4Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M9.5 14H4.5C4.22386 14 4 14.2239 4 14.5V19.5C4 19.7761 4.22386 20 4.5 20H9.5C9.77614 20 10 19.7761 10 19.5V14.5C10 14.2239 9.77614 14 9.5 14Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M19.5 14H14.5C14.2239 14 14 14.2239 14 14.5V19.5C14 19.7761 14.2239 20 14.5 20H19.5C19.7761 20 20 19.7761 20 19.5V14.5C20 14.2239 19.7761 14 19.5 14Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">AI Compatibility Analysis</h3>
              <p className="text-muted-foreground">
                Our advanced algorithm analyzes your profile and preferences to identify your most compatible matches.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-primary"
                >
                  <path
                    d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M3 12H4M12 3V4M20 12H21M12 20V21M5.6 5.6L6.3 6.3M18.4 5.6L17.7 6.3M17.7 17.7L18.4 18.4M6.3 17.7L5.6 18.4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Connect & Communicate</h3>
              <p className="text-muted-foreground">
                Engage with your matches through our guided communication tools designed to foster meaningful
                connections.
              </p>
            </motion.div>
          </div>

          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">The Science Behind Our Matching</h2>
            <div className="max-w-3xl mx-auto grid gap-8 md:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-left"
              >
                <h3 className="text-xl font-bold mb-2">Psychological Compatibility</h3>
                <p className="text-muted-foreground mb-4">
                  Our algorithm is based on established psychological principles of relationship compatibility,
                  including attachment styles, values alignment, and communication patterns.
                </p>
                <h3 className="text-xl font-bold mb-2">Machine Learning</h3>
                <p className="text-muted-foreground">
                  We continuously improve our matching system using machine learning that analyzes successful
                  relationships formed on our platform.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-left"
              >
                <h3 className="text-xl font-bold mb-2">Behavioral Analysis</h3>
                <p className="text-muted-foreground mb-4">
                  Beyond just profile information, we analyze behavioral patterns on the platform to better understand
                  your preferences and improve match quality.
                </p>
                <h3 className="text-xl font-bold mb-2">Relationship Experts</h3>
                <p className="text-muted-foreground">
                  Our algorithm was developed in collaboration with relationship psychologists and experts to ensure it
                  captures the nuances of human connection.
                </p>
              </motion.div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Find Your Perfect Match?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Join thousands of users who have found meaningful connections through our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="inline-block">
                <AnimatedGradientBorder variant="button">
                  <Button size="lg" className="border-0 bg-transparent hover:bg-white/10 text-white">
                    {t("landing.startJourney")} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </AnimatedGradientBorder>
              </Link>
              <Button size="lg" variant="outline" asChild>
                <Link href="/success-stories">View Success Stories</Link>
              </Button>
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
    </div>
  )
}

