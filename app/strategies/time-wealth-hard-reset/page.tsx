"use client"

import { useState, Suspense } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { useSearchParams } from "next/navigation"

interface TimeActivity {
  id: string
  name: string
  hours: number
  value: "high" | "medium" | "low"
}

function TimeWealthHardResetContent() {
  const searchParams = useSearchParams()
  const persona = searchParams.get("persona")
  
  const [activities, setActivities] = useState<TimeActivity[]>([
    { id: "work", name: "Work", hours: 0, value: "high" },
    { id: "sleep", name: "Sleep", hours: 0, value: "high" },
    { id: "family", name: "Family Time", hours: 0, value: "high" },
    { id: "exercise", name: "Exercise", hours: 0, value: "medium" },
    { id: "hobbies", name: "Hobbies", hours: 0, value: "medium" },
    { id: "social", name: "Social Media", hours: 0, value: "low" },
    { id: "entertainment", name: "Entertainment", hours: 0, value: "low" },
    { id: "other", name: "Other", hours: 0, value: "low" }
  ])

  const totalHours = activities.reduce((sum, activity) => sum + activity.hours, 0)
  const remainingHours = 168 - totalHours // 168 hours in a week

  const handleHoursChange = (id: string, value: string) => {
    setActivities(activities.map(activity => 
      activity.id === id 
        ? { ...activity, hours: Math.max(0, Math.min(168, Number(value) || 0)) }
        : activity
    ))
  }

  const handleValueChange = (id: string, value: "high" | "medium" | "low") => {
    setActivities(activities.map(activity => 
      activity.id === id 
        ? { ...activity, value }
        : activity
    ))
  }

  const calculateTimeWealth = () => {
    const highValueHours = activities
      .filter(a => a.value === "high")
      .reduce((sum, a) => sum + a.hours, 0)
    
    const mediumValueHours = activities
      .filter(a => a.value === "medium")
      .reduce((sum, a) => sum + a.hours, 0)
    
    const lowValueHours = activities
      .filter(a => a.value === "low")
      .reduce((sum, a) => sum + a.hours, 0)

    const totalHours = highValueHours + mediumValueHours + lowValueHours
    const timeWealthScore = (highValueHours / totalHours) * 100

    return {
      score: Math.round(timeWealthScore),
      highValueHours,
      mediumValueHours,
      lowValueHours
    }
  }

  const timeWealth = calculateTimeWealth()

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Time Wealth Hard Reset</h1>
        <p className="text-muted-foreground">
          Track how you spend your time in a week and identify opportunities for better time management.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Weekly Time Audit</h2>
              <p className="text-sm text-muted-foreground">
                Enter the number of hours you spend on each activity in a week.
              </p>
            </div>

            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={activity.id}>{activity.name}</Label>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant={activity.value === "high" ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleValueChange(activity.id, "high")}
                      >
                        High
                      </Button>
                      <Button
                        variant={activity.value === "medium" ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleValueChange(activity.id, "medium")}
                      >
                        Medium
                      </Button>
                      <Button
                        variant={activity.value === "low" ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleValueChange(activity.id, "low")}
                      >
                        Low
                      </Button>
                    </div>
                  </div>
                  <Input
                    id={activity.id}
                    type="number"
                    min="0"
                    max="168"
                    value={activity.hours}
                    onChange={(e) => handleHoursChange(activity.id, e.target.value)}
                  />
                </div>
              ))}
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span>Total Hours:</span>
                <span className="font-medium">{totalHours}/168</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Remaining Hours:</span>
                <span className="font-medium">{remainingHours}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Your Time Wealth Score</h2>
              <p className="text-sm text-muted-foreground">
                Based on how you spend your time on high-value activities.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Time Wealth Score</span>
                  <span className="font-medium">{timeWealth.score}%</span>
                </div>
                <Progress value={timeWealth.score} className="h-2" />
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Time Distribution</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>High Value Activities</span>
                    <span>{timeWealth.highValueHours} hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Medium Value Activities</span>
                    <span>{timeWealth.mediumValueHours} hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Low Value Activities</span>
                    <span>{timeWealth.lowValueHours} hours</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Recommendations</h3>
                <ul className="space-y-2 text-sm">
                  {timeWealth.score < 50 && (
                    <li>• Consider reducing time spent on low-value activities</li>
                  )}
                  {timeWealth.highValueHours < 40 && (
                    <li>• Try to increase time spent on high-value activities</li>
                  )}
                  {remainingHours > 0 && (
                    <li>• You have {remainingHours} hours unaccounted for - consider tracking these hours</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default function TimeWealthHardResetPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TimeWealthHardResetContent />
    </Suspense>
  )
} 