"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, CheckCircle, Shield, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useLanguage } from "@/components/language-provider"
import { AnimatedGradientBorder } from "@/components/ui-effects/animated-gradient-border"

export default function LandingPage() {
  const { t } = useLanguage()
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">Harmonia</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              {t("nav.howItWorks")}
            </Link>
            <Link href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              {t("nav.testimonials")}
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              {t("nav.pricing")}
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
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/5 to-background z-0" />
          <div className="container relative z-10 py-24 md:py-32 lg:py-40">
            <div className="grid gap-8 md:grid-cols-2 md:gap-12">
              <motion.div
                className="flex flex-col justify-center space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="inline-flex items-center rounded-full border px-3 py-1 text-sm"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <span className="font-medium">{t("landing.tagline")}</span>
                </motion.div>
                <motion.h1
                  className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  {t("landing.title")}
                </motion.h1>
                <motion.p
                  className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  {t("landing.subtitle")}
                </motion.p>
                <motion.div
                  className="flex flex-col gap-2 min-[400px]:flex-row"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <Link href="/register" className="inline-block">
                    <AnimatedGradientBorder variant="button">
                      <Button size="lg" className="border-0 bg-transparent hover:bg-white/10 text-white w-full">
                        {t("landing.startJourney")} <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </AnimatedGradientBorder>
                  </Link>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/how-it-works">{t("landing.learnMore")}</Link>
                  </Button>
                </motion.div>
              </motion.div>
              <motion.div
                className="flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.7 }}
              >
                <AnimatedGradientBorder className="p-0">
                  <div className="relative h-[400px] w-[320px] overflow-hidden rounded-xl shadow-2xl">
                    <Image
                      src="/placeholder.svg?height=800&width=640"
                      alt="Harmonia app interface"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </AnimatedGradientBorder>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="bg-muted/50 py-16 md:py-24">
          <div className="container">
            <motion.div
              className="mx-auto max-w-2xl text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: scrollY > 100 ? 1 : 0, y: scrollY > 100 ? 0 : 20 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{t("landing.howItWorks")}</h2>
              <p className="mt-4 text-muted-foreground md:text-xl">{t("landing.howItWorksSubtitle")}</p>
              <div className="mt-6">
                <Link href="/how-it-works" className="inline-block">
                  <Button variant="outline">Explore Interactive 360° Experience</Button>
                </Link>
              </div>
            </motion.div>
            <div className="grid gap-8 md:grid-cols-3">
              <motion.div
                className="flex flex-col items-center text-center p-6 bg-background rounded-xl shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: scrollY > 200 ? 1 : 0, y: scrollY > 200 ? 0 : 20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-4 rounded-full bg-primary/10 p-3">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">{t("landing.verifiedProfiles")}</h3>
                <p className="mt-2 text-muted-foreground">{t("landing.verifiedProfilesDesc")}</p>
              </motion.div>
              <motion.div
                className="flex flex-col items-center text-center p-6 bg-background rounded-xl shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: scrollY > 200 ? 1 : 0, y: scrollY > 200 ? 0 : 20 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <div className="mb-4 rounded-full bg-primary/10 p-3">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">{t("landing.aiMatching")}</h3>
                <p className="mt-2 text-muted-foreground">{t("landing.aiMatchingDesc")}</p>
              </motion.div>
              <motion.div
                className="flex flex-col items-center text-center p-6 bg-background rounded-xl shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: scrollY > 200 ? 1 : 0, y: scrollY > 200 ? 0 : 20 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <div className="mb-4 rounded-full bg-primary/10 p-3">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">{t("landing.guidedCommunication")}</h3>
                <p className="mt-2 text-muted-foreground">{t("landing.guidedCommunicationDesc")}</p>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="py-16 md:py-24">
          <div className="container">
            <motion.div
              className="mx-auto max-w-2xl text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: scrollY > 500 ? 1 : 0, y: scrollY > 500 ? 0 : 20 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Success Stories</h2>
              <p className="mt-4 text-muted-foreground md:text-xl">Real connections made through our platform.</p>
              <div className="mt-6">
                <Link href="/success-stories" className="inline-block">
                  <Button variant="outline">View Interactive Success Stories</Button>
                </Link>
              </div>
            </motion.div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="rounded-xl border bg-card p-6 shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: scrollY > 600 ? 1 : 0, y: scrollY > 600 ? 0 : 20 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full">
                      <Image
                        src={`/placeholder.svg?height=48&width=48&text=User${i}`}
                        alt={`User ${i}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">Sarah & Michael</h3>
                      <p className="text-sm text-muted-foreground">Matched 8 months ago</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    "The compatibility assessment was spot on. We connected instantly and share the same values and
                    goals. We're now planning our future together."
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="bg-muted/50 py-16 md:py-24">
          <div className="container">
            <motion.div
              className="mx-auto max-w-2xl text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: scrollY > 1000 ? 1 : 0, y: scrollY > 1000 ? 0 : 20 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Membership Plans</h2>
              <p className="mt-4 text-muted-foreground md:text-xl">Choose the plan that fits your journey.</p>
            </motion.div>
            <div className="grid gap-8 md:grid-cols-3">
              <motion.div
                className="flex flex-col rounded-xl border bg-card p-6 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: scrollY > 1100 ? 1 : 0, y: scrollY > 1100 ? 0 : 20 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-xl font-bold">Basic</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-bold">Free</span>
                </div>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Create your profile</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Basic matching</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Limited communication</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>View up to 10 profiles per day</span>
                  </li>
                </ul>
                <div className="mt-auto pt-8">
                  <Link href="/register" className="w-full">
                    <AnimatedGradientBorder variant="button" className="w-full">
                      <Button className="w-full border-0 bg-transparent hover:bg-white/10 text-white">
                        Get Started
                      </Button>
                    </AnimatedGradientBorder>
                  </Link>
                </div>
              </motion.div>
              <motion.div
                className="flex flex-col rounded-xl border bg-card p-6 shadow-sm relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: scrollY > 1100 ? 1 : 0, y: scrollY > 1100 ? 0 : 20 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  Popular
                </div>
                <h3 className="text-xl font-bold">Premium</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-bold">$29.99</span>
                  <span className="ml-1 text-muted-foreground">/month</span>
                </div>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>All Basic features</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Advanced AI matching</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Unlimited communication</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Detailed compatibility reports</span>
                  </li>
                </ul>
                <div className="mt-auto pt-8">
                  <Link href="/register" className="w-full">
                    <AnimatedGradientBorder variant="button" className="w-full">
                      <Button className="w-full border-0 bg-transparent hover:bg-white/10 text-white">
                        Get Started
                      </Button>
                    </AnimatedGradientBorder>
                  </Link>
                </div>
              </motion.div>
              <motion.div
                className="flex flex-col rounded-xl border bg-card p-6 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: scrollY > 1100 ? 1 : 0, y: scrollY > 1100 ? 0 : 20 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <h3 className="text-xl font-bold">Elite</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-bold">$49.99</span>
                  <span className="ml-1 text-muted-foreground">/month</span>
                </div>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>All Premium features</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Priority matching</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Profile boost</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Exclusive virtual events</span>
                  </li>
                </ul>
                <div className="mt-auto pt-8">
                  <Link href="/register" className="w-full">
                    <AnimatedGradientBorder variant="button" className="w-full">
                      <Button className="w-full border-0 bg-transparent hover:bg-white/10 text-white">
                        Get Started
                      </Button>
                    </AnimatedGradientBorder>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container">
            <motion.div
              className="rounded-xl bg-gradient-to-r from-primary to-secondary text-primary-foreground p-8 md:p-12 lg:p-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: scrollY > 1500 ? 1 : 0, y: scrollY > 1500 ? 0 : 20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Find Your Perfect Match?
                </h2>
                <p className="mt-4 md:text-xl">
                  Join thousands of users who have found meaningful connections through our platform.
                </p>
                <Link href="/register" className="inline-block mt-8">
                  <AnimatedGradientBorder variant="button">
                    <Button size="lg" className="border-0 bg-transparent hover:bg-white/10 text-white">
                      {t("landing.createProfile")}
                    </Button>
                  </AnimatedGradientBorder>
                </Link>
              </div>
            </motion.div>
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

