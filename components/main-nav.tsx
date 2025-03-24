"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"

export function MainNav() {
  const pathname = usePathname()

  // Don't show the navbar on the landing page
  if (pathname === "/") {
    return null
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center">
        <div className="mr-8 flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Clock className="h-6 w-6 text-black" />
            <span className="font-bold text-2xl text-black">Time Wealth Guide</span>
          </Link>
        </div>
        <nav className="flex flex-1 items-center space-x-1">
          <Link href="/" passHref>
            <Button
              variant={pathname === "/" ? "default" : "ghost"}
              className={pathname === "/" ? "bg-black" : "text-gray-700"}
              size="sm"
            >
              Home
            </Button>
          </Link>
          <Link href="/onboarding/values-discovery" passHref>
            <Button
              variant={pathname.includes("/onboarding") ? "default" : "ghost"}
              className={pathname.includes("/onboarding") ? "bg-black" : "text-gray-700"}
              size="sm"
            >
              Values
            </Button>
          </Link>
          <Link href="/tracker" passHref>
            <Button
              variant={pathname === "/tracker" ? "default" : "ghost"}
              className={pathname === "/tracker" ? "bg-black" : "text-gray-700"}
              size="sm"
            >
              Tracker
            </Button>
          </Link>
          <Link href="/insights" passHref>
            <Button
              variant={pathname === "/insights" ? "default" : "ghost"}
              className={pathname === "/insights" ? "bg-black" : "text-gray-700"}
              size="sm"
            >
              Insights
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}

