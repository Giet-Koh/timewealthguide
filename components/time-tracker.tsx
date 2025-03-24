"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"
import { Play, Pause, Save, CalendarIcon } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIntegration } from "@/components/calendar-integration"
import { Badge } from "@/components/ui/badge"
import { Error } from "@/components/ui/error"

interface TimeTrackerProps {
  date: Date
  userValues: {
    values: string[]
    priorities: { [key: string]: number }
    definitions: { [key: string]: string[] }
  }
}

interface Activity {
  id: string
  name: string
  startTime: string
  endTime: string | null
  duration: number // in minutes
  values: string[]
  date: string
}

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  calendarId: string;
}

export function TimeTracker({ date, userValues }: TimeTrackerProps) {
  const [isTracking, setIsTracking] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [activityName, setActivityName] = useState("")
  const [selectedValues, setSelectedValues] = useState<string[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)
  const [quickActivities, setQuickActivities] = useState<string[]>([])
  const [trackerTab, setTrackerTab] = useState("manual")
  const [importedEvents, setImportedEvents] = useState<CalendarEvent[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Load activities from localStorage or mock API on component mount
  useEffect(() => {
    const loadMockData = async () => {
      try {
        // Import the mock service dynamically
        const { mockApiService } = await import("@/lib/mock-data")

        // Ensure we have a valid date
        if (!date || isNaN(date.getTime())) {
          setError("Invalid date provided")
          return
        }

        // Get activities for the selected date
        const dateStr = format(date, "yyyy-MM-dd")
        const mockActivities = await mockApiService.getActivitiesByDate(dateStr)
        setActivities(mockActivities)

        // Generate quick activities from user's value definitions
        const allActivities = Object.values(userValues.definitions).flat()
        const uniqueActivities = [...new Set(allActivities)]
        setQuickActivities(uniqueActivities.slice(0, 6)) // Limit to 6 quick activities
        setError(null)
      } catch (error) {
        console.error("Error loading mock activities:", error)
        // Fallback to localStorage
        try {
          const savedActivities = localStorage.getItem("activities")
          if (savedActivities) {
            const parsedActivities = JSON.parse(savedActivities)
            // Filter activities for the current date
            const dateStr = format(date, "yyyy-MM-dd")
            const filteredActivities = parsedActivities.filter((activity: Activity) => activity.date === dateStr)
            setActivities(filteredActivities)
            setError(null)
          }

          // Generate quick activities from user's value definitions
          const allActivities = Object.values(userValues.definitions).flat()
          const uniqueActivities = [...new Set(allActivities)]
          setQuickActivities(uniqueActivities.slice(0, 6))
        } catch (storageError) {
          setError("Failed to load activities. Your progress will still be saved locally.")
        }
      }
    }

    loadMockData()
  }, [date, userValues])

  // Save activities to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("activities", JSON.stringify(activities))
  }, [activities])

  // Update elapsed time every second when tracking
  useEffect(() => {
    if (isTracking && startTime) {
      const interval = setInterval(() => {
        const now = new Date()
        const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000)
        setElapsedTime(elapsed)
      }, 1000)
      setTimer(interval)
      return () => clearInterval(interval)
    } else if (timer) {
      clearInterval(timer)
    }
    return () => {
      if (timer) {
        clearInterval(timer)
      }
    }
  }, [isTracking, startTime, timer])

  const formatElapsedTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleStartTracking = (name?: string) => {
    if (isTracking) {
      setError("An activity is already being tracked. Please stop or save it first.")
      return
    }
    const now = new Date()
    setStartTime(now)
    setIsTracking(true)
    if (name) {
      setActivityName(name)
    }
    setError(null)
  }

  const handleStopTracking = () => {
    setIsTracking(false)
    setError(null)
  }

  const handleSaveActivity = async () => {
    if (!startTime || !activityName.trim()) {
      setError("Please provide an activity name before saving.")
      return
    }

    if (selectedValues.length === 0) {
      setError("Please select at least one value that this activity aligns with.")
      return
    }

    setIsSaving(true)
    setError(null)

    const now = new Date()
    const durationMinutes = Math.round((now.getTime() - startTime.getTime()) / 60000)

    const newActivity = {
      id: Date.now().toString(),
      name: activityName,
      startTime: format(startTime, "HH:mm"),
      endTime: format(now, "HH:mm"),
      duration: durationMinutes,
      values: selectedValues,
      date: format(date, "yyyy-MM-dd"),
    }

    try {
      // Import the mock service dynamically
      const { mockApiService } = await import("@/lib/mock-data")

      // Add activity using mock API
      await mockApiService.addActivity(newActivity)

      // Refresh activities
      const dateStr = format(date, "yyyy-MM-dd")
      const updatedActivities = await mockApiService.getActivitiesByDate(dateStr)
      setActivities(updatedActivities)
      
      // Reset form
      setIsTracking(false)
      setStartTime(null)
      setElapsedTime(0)
      setActivityName("")
      setSelectedValues([])
      setError(null)
    } catch (error) {
      console.error("Error saving activity:", error)
      try {
        // Fallback to local state update
        setActivities([...activities, newActivity])
        localStorage.setItem("activities", JSON.stringify([...activities, newActivity]))
        
        // Reset form
        setIsTracking(false)
        setStartTime(null)
        setElapsedTime(0)
        setActivityName("")
        setSelectedValues([])
        setError("Activity saved locally. Will sync when connection is restored.")
      } catch (storageError) {
        setError("Failed to save activity. Please try again.")
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleValueToggle = (value: string) => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter((v) => v !== value))
    } else {
      setSelectedValues([...selectedValues, value])
    }
  }

  // Handle imported events from calendar
  const handleCalendarEventImport = async (events: CalendarEvent[]) => {
    try {
      setImportedEvents(events)
      // Convert calendar events to activities
      const calendarActivities: Activity[] = events.map(event => ({
        id: event.id,
        name: event.title,
        startTime: format(new Date(event.start), "HH:mm"),
        endTime: format(new Date(event.end), "HH:mm"),
        duration: Math.round((new Date(event.end).getTime() - new Date(event.start).getTime()) / 60000),
        values: [],
        date: format(new Date(event.start), "yyyy-MM-dd")
      }))
      setActivities(prev => [...prev, ...calendarActivities])
      setError(null)
    } catch (error) {
      console.error("Error importing calendar events:", error)
      setError("Failed to import calendar events. Please try again.")
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <Error message={error} />
      )}

      <Tabs value={trackerTab} onValueChange={setTrackerTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manual">
            <Play className="mr-2 h-4 w-4" />
            Manual Tracking
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Calendar Import
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="space-y-4 pt-4">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="activity-name">Activity Name</Label>
            <Input
              id="activity-name"
              placeholder="What are you doing?"
              value={activityName}
              onChange={(e) => setActivityName(e.target.value)}
              disabled={isTracking}
              className="input-blue"
            />
          </div>

          {!isTracking ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {quickActivities.map((activity) => (
                  <Button
                    key={activity}
                    variant="outline"
                    className="justify-start overflow-hidden text-ellipsis whitespace-nowrap btn-outline-blue"
                    onClick={() => handleStartTracking(activity)}
                  >
                    <Play className="mr-2 h-4 w-4 text-blue-600" />
                    {activity}
                  </Button>
                ))}
              </div>

              <Button
                className="w-full btn-primary"
                onClick={() => handleStartTracking()}
                disabled={!activityName.trim()}
              >
                <Play className="mr-2 h-4 w-4" />
                Start Tracking
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-mono">{formatElapsedTime(elapsedTime)}</div>
                <div className="text-sm text-slate-500">{activityName}</div>
              </div>

              <div className="space-y-2">
                <Label>Values</Label>
                <div className="grid grid-cols-2 gap-2">
                  {userValues.values.map((value) => (
                    <div key={value} className="flex items-center space-x-2">
                      <Checkbox
                        id={value}
                        checked={selectedValues.includes(value)}
                        onCheckedChange={() => handleValueToggle(value)}
                      />
                      <Label htmlFor={value} className="text-sm">
                        {value}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 btn-outline-blue" onClick={handleStopTracking}>
                  <Pause className="mr-2 h-4 w-4" />
                  Pause
                </Button>
                <Button className="flex-1 btn-primary" onClick={handleSaveActivity} disabled={isSaving}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="calendar" className="pt-4">
          <CalendarIntegration 
            userValues={userValues}
            onEventImport={handleCalendarEventImport}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

