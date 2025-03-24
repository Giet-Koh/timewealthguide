"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TimeTracker } from "@/components/time-tracker"
import { ActivityLog } from "@/components/activity-log"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { CalendarIcon, Clock, ListChecks } from "lucide-react"
import { Error } from "@/components/ui/error"
import { ErrorBoundary } from "@/components/error-boundary"
import { GoogleCalendarIntegration } from "@/components/google-calendar"

export default function TrackerPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [userValues, setUserValues] = useState<{
    values: string[]
    priorities: { [key: string]: number }
    definitions: { [key: string]: string[] }
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadMockData = async () => {
      try {
        // Import the mock service dynamically to avoid issues with SSR
        const { mockApiService } = await import("@/lib/mock-data")
        const mockValues = await mockApiService.getUserValues()
        setUserValues(mockValues)
        setError(null)
      } catch (error) {
        console.error("Error loading mock data:", error)
        // Fallback to localStorage if mock API fails
        try {
          const savedValues = localStorage.getItem("userValues")
          if (savedValues) {
            setUserValues(JSON.parse(savedValues))
            setError(null)
          } else {
            setError("No saved values found. Please set up your values first.")
          }
        } catch (storageError) {
          setError("Failed to load your values. Please try again later.")
        }
      }
    }

    loadMockData()
  }, [])

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Error 
          title="Data Loading Error"
          message={error}
        />
        <div className="mt-4">
          <Button onClick={() => window.location.href = "/onboarding/values-discovery"}>
            Set Up Values
          </Button>
        </div>
      </div>
    )
  }

  if (!userValues) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Values Not Set Up</CardTitle>
            <CardDescription>You need to set up your values before you can track your time.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => window.location.href = "/onboarding/values-discovery"}>Set Up Values</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <ErrorBoundary>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-4xl font-bold">Time Wealth Guide</CardTitle>
              <CardDescription className="text-lg">Track how you spend your time in alignment with your values.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="track" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="track">
                    <Clock className="h-4 w-4 mr-2" />
                    Track Time
                  </TabsTrigger>
                  <TabsTrigger value="log">
                    <ListChecks className="h-4 w-4 mr-2" />
                    Activity Log
                  </TabsTrigger>
                  <TabsTrigger value="calendar">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Calendar
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="track" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="card-glass p-6 rounded-lg">
                      <h2 className="text-xl font-semibold text-black mb-4">Time Tracker</h2>
                      <TimeTracker
                        date={selectedDate}
                        userValues={userValues}
                      />
                    </div>
                    <div className="card-glass p-6 rounded-lg">
                      <h2 className="text-xl font-semibold text-black mb-4">Activity Log</h2>
                      <ActivityLog date={selectedDate} userValues={userValues} />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="calendar" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Date Selection</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => date && setSelectedDate(date)}
                          className="rounded-md border"
                        />
                      </CardContent>
                      <CardFooter>
                        <p className="text-sm text-muted-foreground">
                          Selected date: {format(selectedDate, "PPP")}
                        </p>
                      </CardFooter>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Google Calendar</CardTitle>
                        <CardDescription>
                          Sync your activities with Google Calendar
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <GoogleCalendarIntegration />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </ErrorBoundary>
    </div>
  )
}

