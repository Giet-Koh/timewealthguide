"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Clock, Trash2, BarChart } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Error } from "@/components/ui/error"

interface ActivityLogProps {
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

export function ActivityLog({ date, userValues }: ActivityLogProps) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([])
  const [valueFilter, setValueFilter] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  // Load activities from localStorage
  useEffect(() => {
    const loadMockData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        // Import the mock service dynamically
        const { mockApiService } = await import("@/lib/mock-data")

        // Get activities for the selected date
        const dateStr = format(date, "yyyy-MM-dd")
        const mockActivities = await mockApiService.getActivitiesByDate(dateStr)
        setActivities(mockActivities)
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
          } else {
            setError("No activities found for this date.")
          }
        } catch (storageError) {
          setError("Failed to load activities. Please try again.")
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadMockData()
  }, [date])

  // Filter activities by date and selected value filter
  useEffect(() => {
    const dateString = format(date, "yyyy-MM-dd")
    let filtered = activities.filter((activity) => activity.date === dateString)

    if (valueFilter) {
      filtered = filtered.filter((activity) => activity.values.includes(valueFilter))
    }

    // Sort by start time
    filtered.sort((a, b) => {
      const timeA = a.startTime.split(":").map(Number)
      const timeB = b.startTime.split(":").map(Number)
      return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1])
    })

    setFilteredActivities(filtered)
  }, [activities, date, valueFilter])

  const handleDeleteActivity = async (id: string) => {
    setIsDeleting(id)
    setError(null)
    try {
      // Import the mock service dynamically
      const { mockApiService } = await import("@/lib/mock-data")

      // Delete activity using mock API
      await mockApiService.deleteActivity(id)

      // Refresh activities
      const dateStr = format(date, "yyyy-MM-dd")
      const updatedActivities = await mockApiService.getActivitiesByDate(dateStr)
      setActivities(updatedActivities)
    } catch (error) {
      console.error("Error deleting activity:", error)
      // Fallback to local state update
      try {
        const updatedActivities = activities.filter((activity) => activity.id !== id)
        setActivities(updatedActivities)
        localStorage.setItem("activities", JSON.stringify(updatedActivities))
      } catch (storageError) {
        setError("Failed to delete activity. Please try again.")
      }
    } finally {
      setIsDeleting(null)
    }
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  // Calculate total time spent on each value
  const valueStats = userValues.values
    .map((value) => {
      const dateString = format(date, "yyyy-MM-dd")
      const relevantActivities = activities.filter(
        (activity) => activity.date === dateString && activity.values.includes(value),
      )
      const totalMinutes = relevantActivities.reduce((sum, activity) => sum + activity.duration, 0)
      return {
        value,
        totalMinutes,
        percentage: userValues.priorities[value] || 0,
      }
    })
    .sort((a, b) => b.totalMinutes - a.totalMinutes)

  // Calculate total tracked time for the day
  const totalTrackedMinutes = filteredActivities.reduce((sum, activity) => sum + activity.duration, 0)

  return (
    <div className="space-y-6">
      {error && (
        <Error message={error} />
      )}

      <div className="flex flex-wrap gap-2">
        <Button
          variant={valueFilter === null ? "default" : "outline"}
          size="sm"
          onClick={() => setValueFilter(null)}
          className={valueFilter === null ? "btn-primary" : "btn-outline"}
        >
          All
        </Button>
        {userValues.values.map((value) => (
          <Button
            key={value}
            variant={valueFilter === value ? "default" : "outline"}
            size="sm"
            onClick={() => setValueFilter(value === valueFilter ? null : value)}
            className={valueFilter === value ? "btn-primary" : "btn-outline"}
          >
            {value}
          </Button>
        ))}
      </div>

      <div className="rounded-lg border border-gray-200 card-hover">
        <div className="flex items-center justify-between p-4 bg-gray-50">
          <h3 className="font-medium text-black">Value Alignment</h3>
          <BarChart className="h-4 w-4 text-black" />
        </div>
        <Separator />
        <div className="p-4">
          {valueStats.length > 0 ? (
            <div className="space-y-4">
              {valueStats
                .filter((stat) => stat.totalMinutes > 0)
                .map((stat) => (
                  <div key={stat.value} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <span className="text-black">{stat.value}</span>
                        <Badge variant="outline" className="ml-2 bg-gray-100 text-black">
                          {formatDuration(stat.totalMinutes)}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">Target: {stat.percentage}%</span>
                        <span className="text-xs text-black">
                          Actual:{" "}
                          {totalTrackedMinutes ? Math.round((stat.totalMinutes / totalTrackedMinutes) * 100) : 0}%
                        </span>
                      </div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100">
                      <div
                        className="h-2 rounded-full bg-black"
                        style={{
                          width: `${totalTrackedMinutes ? Math.min(100, (stat.totalMinutes / totalTrackedMinutes) * 100) : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}

              <div className="pt-2 text-sm text-slate-500">
                Total tracked time: <span className="font-bold">{formatDuration(totalTrackedMinutes)}</span>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-slate-500">No activities tracked for this day</div>
          )}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4 text-black">Activities</h3>
        {isLoading ? (
          <div className="py-8 text-center text-sm text-gray-500 border rounded-lg">
            Loading activities...
          </div>
        ) : filteredActivities.length > 0 ? (
          <ScrollArea className="h-[300px]">
            <div className="space-y-4">
              {filteredActivities.map((activity) => (
                <Card key={activity.id} className="p-4 card-hover border-l-4 border-l-gray-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{activity.name}</h4>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="mr-1 h-3 w-3" />
                        {activity.startTime} - {activity.endTime} ({formatDuration(activity.duration)})
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDeleteActivity(activity.id)}
                      disabled={isDeleting === activity.id}
                    >
                      <Trash2 className={`h-4 w-4 ${isDeleting === activity.id ? 'text-gray-300' : 'text-gray-500 hover:text-red-500'}`} />
                    </Button>
                  </div>
                  {activity.values.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {activity.values.map((value) => (
                        <Badge key={value} className="bg-gray-100 text-black">
                          {value}
                        </Badge>
                      ))}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="py-8 text-center text-sm text-gray-500 border rounded-lg">
            No activities logged for this day
          </div>
        )}
      </div>
    </div>
  )
}

