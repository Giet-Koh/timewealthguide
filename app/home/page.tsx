import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, Clock, BarChart3, Heart } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center space-y-8 text-center">
        <div className="space-y-3">
          <h1 className="text-6xl font-bold tracking-tighter sm:text-7xl gradient-text">Time Wealth Guide</h1>
          <p className="max-w-[700px] text-gray-500">
            Align your time with what truly matters to you. Track, analyze, and optimize your life based on your core
            values.
          </p>
        </div>

        <div className="grid w-full max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="card-hover border border-gray-200">
            <CardHeader className="space-y-1 bg-gray-50">
              <CardTitle className="text-xl text-black">Discover Your Values</CardTitle>
              <CardDescription>Identify what truly matters to you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-20 w-full items-center justify-center rounded-md bg-gray-50">
                <Heart className="h-10 w-10 text-black" />
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/onboarding/values-discovery" className="w-full">
                <Button className="w-full btn-primary">
                  Get Started
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="card-hover border border-gray-200">
            <CardHeader className="space-y-1 bg-gray-50">
              <CardTitle className="text-xl text-black">Track Your Time</CardTitle>
              <CardDescription>Log activities and align them with values</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-20 w-full items-center justify-center rounded-md bg-gray-50">
                <Clock className="h-10 w-10 text-black" />
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/tracker" className="w-full">
                <Button className="w-full btn-primary">
                  Start Tracking
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="card-hover border border-gray-200">
            <CardHeader className="space-y-1 bg-gray-50">
              <CardTitle className="text-xl text-black">View Insights</CardTitle>
              <CardDescription>See how your time aligns with your values</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-20 w-full items-center justify-center rounded-md bg-gray-50">
                <BarChart3 className="h-10 w-10 text-black" />
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/insights" className="w-full">
                <Button className="w-full btn-primary">
                  View Insights
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

