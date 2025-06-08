import type React from "react"
import { AppNavigation } from "@/components/navigation/app-navigation"
import { MobileNavigation } from "@/components/navigation/mobile-navigation"

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <AppNavigation />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <MobileNavigation />
    </div>
  )
}

