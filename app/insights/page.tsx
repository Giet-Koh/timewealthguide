"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format, subDays, startOfWeek, eachDayOfInterval } from "date-fns"
import { BarChart, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Error } from "@/components/ui/error"
import { ErrorBoundary } from "@/components/error-boundary"

interface Activity {
  id: string
  name: string
  startTime: string
  endTime: string | null
  duration: number // in minutes
  values: string[]
  date: string
}

interface UserValues {
  values: string[]
  priorities: { [key: string]: number }
  definitions: { [key: string]: string[] }
}

interface DailyData {
  date: string;
  total: number;
  [key: string]: number | string; // Allow string values for date and number values for minutes
}

export default function InsightsPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [userValues, setUserValues] = useState<UserValues | null>(null)
  const [timeRange, setTimeRange] = useState("week")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadMockData = async () => {
      try {
        // Import the mock service dynamically
        const { mockApiService } = await import("@/lib/mock-data")

        // Get user values
        const mockValues = await mockApiService.getUserValues()
        setUserValues(mockValues)

        // Get all activities
        const mockActivities = await mockApiService.getActivities()
        setActivities(mockActivities)
        setError(null)
      } catch (error) {
        console.error("Error loading mock data:", error)
        // Try fallback to localStorage
        try {
          const savedActivities = localStorage.getItem("activities")
          const savedValues = localStorage.getItem("userValues")

          if (savedActivities && savedValues) {
            setActivities(JSON.parse(savedActivities))
            setUserValues(JSON.parse(savedValues))
            setError(null)
          } else {
            setError("No saved data found")
          }
        } catch (storageError) {
          setError("Failed to load your data. Please try again later.")
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
      </div>
    )
  }

  if (!userValues) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Values Not Set Up</CardTitle>
            <CardDescription>You need to set up your values before you can view insights.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  // Filter activities based on selected time range
  const getFilteredActivities = () => {
    const today = new Date()
    let startDate: Date

    switch (timeRange) {
      case "day":
        startDate = today
        break
      case "week":
        startDate = startOfWeek(today, { weekStartsOn: 1 })
        break
      case "month":
        startDate = new Date(today.getFullYear(), today.getMonth(), 1)
        break
      default:
        startDate = subDays(today, 7)
    }

    const startDateStr = format(startDate, "yyyy-MM-dd")
    return activities.filter((activity) => activity.date >= startDateStr)
  }

  const filteredActivities = getFilteredActivities()

  // Calculate value statistics
  const valueStats = userValues.values
    .map((value) => {
      const relevantActivities = filteredActivities.filter((activity) => activity.values.includes(value))
      const totalMinutes = relevantActivities.reduce((sum, activity) => sum + activity.duration, 0)
      return {
        value,
        totalMinutes,
        targetPercentage: userValues.priorities[value] || 0,
      }
    })
    .sort((a, b) => b.totalMinutes - a.totalMinutes)

  // Calculate total tracked time
  const totalTrackedMinutes = filteredActivities.reduce((sum, activity) => sum + activity.duration, 0)

  // Calculate daily activity data for the chart
  const getDailyData = () => {
    const today = new Date()
    let startDate: Date
    const endDate = today

    switch (timeRange) {
      case "day":
        startDate = today
        break
      case "week":
        startDate = startOfWeek(today, { weekStartsOn: 1 })
        break
      case "month":
        startDate = new Date(today.getFullYear(), today.getMonth(), 1)
        break
      default:
        startDate = subDays(today, 7)
    }

    const days = eachDayOfInterval({ start: startDate, end: endDate })

    return days.map((day) => {
      const dateStr = format(day, "yyyy-MM-dd")
      const dayActivities = activities.filter((activity) => activity.date === dateStr)

      const valueData = userValues.values.reduce(
        (acc, value) => {
          const valueActivities = dayActivities.filter((activity) => activity.values.includes(value))
          const minutes = valueActivities.reduce((sum, activity) => sum + activity.duration, 0)
          acc[value] = minutes
          return acc
        },
        {} as { [key: string]: number },
      )

      return {
        date: format(day, "MMM dd"),
        total: dayActivities.reduce((sum, activity) => sum + activity.duration, 0),
        ...valueData,
      } as DailyData
    })
  }

  const dailyData = getDailyData()

  // Format minutes as hours and minutes
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ErrorBoundary>
        <div className="flex flex-col space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-black">Time Wealth Guide</h1>
              <p className="text-lg text-gray-500">Analyze how your time aligns with your values</p>
            </div>

            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px] border-gray-200 focus:ring-gray-200 focus:border-gray-400">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2 card-hover border border-gray-200">
              <CardHeader className="bg-gray-50">
                <CardTitle className="text-black">Time Distribution</CardTitle>
                <CardDescription>How your time is distributed across your values</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="chart">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="chart">
                      <BarChart className="mr-2 h-4 w-4" />
                      Chart
                    </TabsTrigger>
                    <TabsTrigger value="calendar">
                      <Calendar className="mr-2 h-4 w-4" />
                      Calendar
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="chart" className="pt-4">
                    <div className="h-[300px] w-full">
                      <div className="h-full w-full rounded-lg border p-4 bg-gradient-to-br from-white to-gray-50">
                        <div className="flex h-full flex-col justify-between">
                          <div className="space-y-2">
                            {dailyData.map((day, i) => (
                              <div key={i} className="space-y-1">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="font-medium text-black">{day.date}</span>
                                  <span className="text-gray-600">{formatDuration(day.total)}</span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                                  {userValues.values.map((value, j) => {
                                    const valueMinutes = (day[value] as number) || 0
                                    const totalMinutes = Number(day.total)
                                    const width = totalMinutes > 0 ? (valueMinutes / totalMinutes) * 100 : 0
                                    const offset = userValues.values.slice(0, j).reduce((sum, v) => {
                                      const vMinutes = (day[v] as number) || 0
                                      return sum + (totalMinutes > 0 ? (vMinutes / totalMinutes) * 100 : 0)
                                    }, 0)

                                    const grayShades = [
                                      "bg-gray-900",
                                      "bg-gray-800",
                                      "bg-gray-700",
                                      "bg-gray-600",
                                      "bg-gray-500",
                                    ]
                                    const colorClass = grayShades[j % grayShades.length]

                                    return Number(day[value]) > 0 ? (
                                      <div
                                        key={value}
                                        className={`h-full ${colorClass}`}
                                        style={{
                                          width: `${width}%`,
                                          marginLeft: `${offset}%`,
                                        }}
                                      />
                                    ) : null
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="flex flex-wrap gap-2 pt-2">
                            {userValues.values.map((value, i) => {
                              const grayShades = [
                                "bg-gray-900",
                                "bg-gray-800",
                                "bg-gray-700",
                                "bg-gray-600",
                                "bg-gray-500",
                              ]
                              const colorClass = grayShades[i % grayShades.length]

                              return (
                                <div key={value} className="flex items-center text-xs">
                                  <div className={`mr-1 h-3 w-3 rounded-full ${colorClass}`} />
                                  <span className="text-black">{value}</span>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="calendar" className="pt-4">
                    <div className="text-center text-sm text-gray-500">
                      Calendar view would show a heatmap of activity by day
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card className="card-hover border border-gray-200">
              <CardHeader className="bg-gray-50">
                <CardTitle className="text-black">Value Alignment</CardTitle>
                <CardDescription>How your time aligns with your value priorities</CardDescription>
              </CardHeader>
              <CardContent>
                {totalTrackedMinutes > 0 ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-center">
                      <div className="relative h-40 w-40">
                        <div className="absolute inset-0 flex items-center justify-center rounded-full border-8 border-gray-200 bg-gradient-radial from-white to-gray-50">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-black">{formatDuration(totalTrackedMinutes)}</div>
                            <div className="text-xs text-gray-500">Total Time</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {valueStats.map((stat) => (
                        <div key={stat.value} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-black">{stat.value}</span>
                            <span className="text-gray-600">{formatDuration(stat.totalMinutes)}</span>
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <span>Target: {stat.targetPercentage}%</span>
                            <span className="mx-2">•</span>
                            <span className="text-black">
                              Actual: {Math.round((stat.totalMinutes / totalTrackedMinutes) * 100)}%
                            </span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-gray-100">
                            <div
                              className="h-2 rounded-full bg-black"
                              style={{
                                width: `${Math.min(100, (stat.totalMinutes / totalTrackedMinutes) * 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center text-sm text-gray-500">No activities tracked in this time period</div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="card-hover border border-gray-200">
            <CardHeader className="bg-gray-50">
              <CardTitle className="text-black">Activity Breakdown</CardTitle>
              <CardDescription>Most frequent activities and their value alignment</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredActivities.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(valueStats).map(([value, stat]) => (
                      <div key={value} className="card-glass p-6 rounded-lg">
                        <h3 className="text-xl font-semibold text-black mb-4">{value}</h3>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Time Spent</p>
                            <div className="h-2 bg-gray-100 rounded-full">
                              <div
                                className="h-full bg-black rounded-full"
                                style={{ width: `${Math.min(100, (stat.totalMinutes / totalTrackedMinutes) * 100)}%` }}
                              />
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{Math.round((stat.totalMinutes / totalTrackedMinutes) * 100)}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Activities</p>
                            <p className="text-lg font-medium text-black">{stat.totalMinutes} minutes</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Hours</p>
                            <p className="text-lg font-medium text-black">{formatDuration(stat.totalMinutes)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-center text-sm text-gray-500 pt-4">
                    Showing top activities for the selected time period
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-sm text-gray-500">No activities tracked in this time period</div>
              )}
            </CardContent>
          </Card>
        </div>
      </ErrorBoundary>
    </div>
  )
}

