"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useState, Suspense } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"

interface TimeActivity {
  id: string
  name: string
  hours: number
  value: "high" | "medium" | "low"
}

interface LovedOne {
  name: string
  visitsPerYear: number
  yourAge: number
  theirAge: number
}

interface Task {
  id: string
  text: string
}

const strategies = [
  {
    id: "time-wealth-hard-reset",
    title: "Time Wealth Hard Reset",
    description: "Calculate how many meaningful moments you have left with your loved ones.",
    steps: [
      "Enter details about your loved ones",
      "Calculate remaining time together",
      "Reflect on your relationships",
      "Make time for what matters most"
    ],
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: "two-list-exercise",
    title: "Two-List Exercise",
    description: "A powerful technique to identify and focus on your most important priorities.",
    steps: [
      "List all your current tasks",
      "Identify your top 3 priorities",
      "Create a 'not-to-do' list",
      "Schedule your priorities first",
      "Review and adjust weekly"
    ],
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: "energy-calendar",
    title: "Energy Calendar",
    description: "Map your energy levels throughout the day to optimize your productivity.",
    steps: [
      "Track your energy levels",
      "Identify peak performance times",
      "Schedule important tasks accordingly",
      "Plan rest periods",
      "Adjust based on patterns"
    ],
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: "books-and-movies",
    title: "Books and Movies",
    description: "Learn from inspiring stories and practical wisdom about time management.",
    resources: [
      {
        title: "When Breath Becomes Air",
        type: "Book",
        description: "A powerful memoir about making the most of limited time."
      },
      {
        title: "The Last Lecture",
        type: "Book",
        description: "Randy Pausch's inspiring perspective on time and life."
      },
      {
        title: "About Time",
        type: "Movie",
        description: "A heartwarming story about valuing time with loved ones."
      }
    ],
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  }
]

const personaStrategies = {
  "time-master": ["Continue to live your best life!", "Share your wisdom with others", "Maintain your balanced approach"],
  "time-learner": ["Time Wealth Hard Reset", "Two-List Exercise", "Energy Calendar"],
  "time-seeker": ["Time Wealth Hard Reset", "Two-List Exercise", "Build a daily routine"],
  "time-struggler": ["Time Wealth Hard Reset", "Energy Calendar", "Build a simple daily routine"]
}

function StrategiesContent() {
  const searchParams = useSearchParams()
  const persona = searchParams.get("persona")
  const recommendedStrategies = persona ? personaStrategies[persona as keyof typeof personaStrategies] : []
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null)
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
  const [lovedOnes, setLovedOnes] = useState<LovedOne[]>([{
    name: "",
    visitsPerYear: 0,
    yourAge: 0,
    theirAge: 0
  }])
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState("")
  const [priorityTasks, setPriorityTasks] = useState<Task[]>([])
  const [notToDoTasks, setNotToDoTasks] = useState<Task[]>([])
  const [newPriorityTask, setNewPriorityTask] = useState("")
  const [newNotToDoTask, setNewNotToDoTask] = useState("")

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

  const calculateRemainingVisits = (lovedOne: LovedOne) => {
    const lifeExpectancy = 85 // Average life expectancy
    const yearsRemaining = Math.min(
      lifeExpectancy - lovedOne.yourAge,
      lifeExpectancy - lovedOne.theirAge
    )
    const remainingVisits = Math.round(yearsRemaining * lovedOne.visitsPerYear)
    return {
      yearsRemaining: Math.round(yearsRemaining),
      remainingVisits
    }
  }

  const addLovedOne = () => {
    setLovedOnes([...lovedOnes, {
      name: "",
      visitsPerYear: 0,
      yourAge: 0,
      theirAge: 0
    }])
  }

  const updateLovedOne = (index: number, field: keyof LovedOne, value: string | number) => {
    const newLovedOnes = [...lovedOnes]
    newLovedOnes[index] = {
      ...newLovedOnes[index],
      [field]: value
    }
    setLovedOnes(newLovedOnes)
  }

  const addTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        text: newTask.trim()
      }
      setTasks([...tasks, task])
      setNewTask("")
    }
  }

  const addPriorityTask = () => {
    if (newPriorityTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        text: newPriorityTask.trim()
      }
      setPriorityTasks([...priorityTasks, task])
      setNewPriorityTask("")
    }
  }

  const addNotToDoTask = () => {
    if (newNotToDoTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        text: newNotToDoTask.trim()
      }
      setNotToDoTasks([...notToDoTasks, task])
      setNewNotToDoTask("")
    }
  }

  const removeFromPriority = (task: Task) => {
    setPriorityTasks(priorityTasks.filter(t => t.id !== task.id))
  }

  const removeFromNotToDo = (task: Task) => {
    setNotToDoTasks(notToDoTasks.filter(t => t.id !== task.id))
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Time Awareness Strategies</h1>
        {persona && (
          <div className="p-4 bg-accent/50 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Recommended for You</h2>
            <p className="text-muted-foreground">
              Based on your Time Wealth Profile, here are the strategies that will help you most.
            </p>
          </div>
        )}
        <p className="text-muted-foreground">
          Explore these proven strategies to improve your time management and awareness.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {strategies.map((strategy) => {
          const isRecommended = recommendedStrategies.includes(strategy.title)
          const isSelected = selectedStrategy === strategy.id
          return (
            <div key={strategy.id} className="space-y-4">
              <Card 
                className={`p-6 transition-all duration-200 ${
                  isRecommended ? "bg-accent/50 border-2 border-primary shadow-lg" : ""
                }`}
              >
                <div className="space-y-4">
                  <div className="relative h-48 w-full overflow-hidden rounded-lg">
                    <Image
                      src={strategy.image}
                      alt={strategy.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold">{strategy.title}</h2>
                    <p className="text-muted-foreground">{strategy.description}</p>
                  </div>
                  {strategy.steps ? (
                    <div className="space-y-2">
                      <h3 className="font-medium">Steps:</h3>
                      <ol className="list-decimal list-inside space-y-1">
                        {strategy.steps.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <h3 className="font-medium">Resources:</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {strategy.resources?.map((resource, index) => (
                          <li key={index}>
                            <span className="font-medium">{resource.title}</span>
                            <span className="text-muted-foreground"> ({resource.type})</span>
                            <p className="text-sm text-muted-foreground">{resource.description}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <Button 
                    className="w-full"
                    onClick={() => setSelectedStrategy(isSelected ? null : strategy.id)}
                  >
                    {isSelected ? "Hide Calculator" : strategy.id === "time-wealth-hard-reset" ? "Start Meaningful Connections Calculator" : 
                     strategy.id === "energy-calendar" ? "Start Weekly Time Audit" : "Start Strategy"}
                  </Button>
                </div>
              </Card>

              {isSelected && strategy.id === "time-wealth-hard-reset" && (
                <Card className="p-6">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold">Time Wealth Hard Reset</h2>
                      <p className="text-sm text-muted-foreground">
                        Calculate meaningful connections with your loved ones.
                      </p>
                    </div>

                    {/* Meaningful Connections Calculator */}
                    <div className="space-y-6">
                      {lovedOnes.map((lovedOne, index) => (
                        <div key={index} className="space-y-4 p-4 border rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Name</Label>
                              <Input
                                value={lovedOne.name}
                                onChange={(e) => updateLovedOne(index, "name", e.target.value)}
                                placeholder="Enter name"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Visits per Year</Label>
                              <Input
                                type="number"
                                min="0"
                                value={lovedOne.visitsPerYear}
                                onChange={(e) => updateLovedOne(index, "visitsPerYear", Number(e.target.value))}
                                placeholder="Number of times you meet per year"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Your Age</Label>
                              <Input
                                type="number"
                                min="0"
                                max="120"
                                value={lovedOne.yourAge}
                                onChange={(e) => updateLovedOne(index, "yourAge", Number(e.target.value))}
                                placeholder="Enter your age"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Their Age</Label>
                              <Input
                                type="number"
                                min="0"
                                max="120"
                                value={lovedOne.theirAge}
                                onChange={(e) => updateLovedOne(index, "theirAge", Number(e.target.value))}
                                placeholder="Enter their age"
                              />
                            </div>
                          </div>

                          {lovedOne.name && lovedOne.visitsPerYear > 0 && lovedOne.yourAge > 0 && lovedOne.theirAge > 0 && (
                            <div className="pt-4 border-t">
                              <h3 className="font-medium mb-2">Time Together Projection</h3>
                              <div className="space-y-2 text-sm">
                                {(() => {
                                  const { yearsRemaining, remainingVisits } = calculateRemainingVisits(lovedOne)
                                  return (
                                    <>
                                      <div className="flex justify-between">
                                        <span>Years Remaining</span>
                                        <span className="font-medium">{yearsRemaining} years</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Remaining Visits</span>
                                        <span className="font-medium">{remainingVisits} times</span>
                                      </div>
                                      <div className="text-muted-foreground mt-2">
                                        Based on current visit frequency, you might see {lovedOne.name} {remainingVisits} more times in your life.
                                      </div>
                                    </>
                                  )
                                })()}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}

                      <Button
                        variant="outline"
                        onClick={addLovedOne}
                        className="w-full"
                      >
                        Add Another Loved One
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {isSelected && strategy.id === "energy-calendar" && (
                <Card className="p-6">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold">Energy Calendar</h2>
                      <p className="text-sm text-muted-foreground">
                        Track your weekly time allocation and energy levels.
                      </p>
                    </div>

                    {/* Weekly Time Audit */}
                    <div className="space-y-4">
                      <h3 className="font-medium">Weekly Time Audit</h3>
                      <div className="space-y-4">
                        {activities.map((activity) => (
                          <div key={activity.id} className="flex items-center gap-4">
                            <div className="flex-1">
                              <Label>{activity.name}</Label>
                              <Input
                                type="number"
                                min="0"
                                max="168"
                                value={activity.hours}
                                onChange={(e) => handleHoursChange(activity.id, e.target.value)}
                                placeholder="Hours per week"
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant={activity.value === "high" ? "default" : "outline"}
                                onClick={() => handleValueChange(activity.id, "high")}
                              >
                                High
                              </Button>
                              <Button
                                variant={activity.value === "medium" ? "default" : "outline"}
                                onClick={() => handleValueChange(activity.id, "medium")}
                              >
                                Medium
                              </Button>
                              <Button
                                variant={activity.value === "low" ? "default" : "outline"}
                                onClick={() => handleValueChange(activity.id, "low")}
                              >
                                Low
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {totalHours > 0 && (
                        <div className="pt-4 border-t">
                          <h3 className="font-medium mb-2">Time Wealth Score</h3>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>High Value Time</span>
                                <span className="font-medium">{timeWealth.highValueHours} hours</span>
                              </div>
                              <Progress value={(timeWealth.highValueHours / totalHours) * 100} className="h-2" />
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Medium Value Time</span>
                                <span className="font-medium">{timeWealth.mediumValueHours} hours</span>
                              </div>
                              <Progress value={(timeWealth.mediumValueHours / totalHours) * 100} className="h-2" />
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Low Value Time</span>
                                <span className="font-medium">{timeWealth.lowValueHours} hours</span>
                              </div>
                              <Progress value={(timeWealth.lowValueHours / totalHours) * 100} className="h-2" />
                            </div>
                            <div className="pt-2">
                              <div className="flex justify-between items-center">
                                <span className="font-medium">Time Wealth Score</span>
                                <span className="text-2xl font-bold">{timeWealth.score}%</span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {timeWealth.score >= 70 ? "Excellent time wealth! Keep up the great balance." :
                                 timeWealth.score >= 50 ? "Good time wealth. Look for opportunities to increase high-value activities." :
                                 "Consider reallocating more time to high-value activities."}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              )}

              {isSelected && strategy.id === "two-list-exercise" && (
                <Card className="p-6">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold">Two-List Exercise</h2>
                      <p className="text-sm text-muted-foreground">
                        Identify your priorities and create a not-to-do list.
                      </p>
                    </div>

                    {/* Task Input Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Priority List Input */}
                      <div className="space-y-2">
                        <h3 className="font-medium">Priority List</h3>
                        <div className="flex gap-2">
                          <Input
                            value={newPriorityTask}
                            onChange={(e) => setNewPriorityTask(e.target.value)}
                            placeholder="Enter a priority task"
                            onKeyPress={(e) => e.key === 'Enter' && addPriorityTask()}
                          />
                          <Button onClick={addPriorityTask}>Add</Button>
                        </div>
                        <div className="space-y-2 mt-4">
                          {priorityTasks.map((task) => (
                            <div key={task.id} className="flex items-center gap-2 p-2 border rounded bg-accent/50">
                              <span className="flex-1">{task.text}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeFromPriority(task)}
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Not-To-Do List Input */}
                      <div className="space-y-2">
                        <h3 className="font-medium">Not-To-Do List</h3>
                        <div className="flex gap-2">
                          <Input
                            value={newNotToDoTask}
                            onChange={(e) => setNewNotToDoTask(e.target.value)}
                            placeholder="Enter a not-to-do task"
                            onKeyPress={(e) => e.key === 'Enter' && addNotToDoTask()}
                          />
                          <Button onClick={addNotToDoTask}>Add</Button>
                        </div>
                        <div className="space-y-2 mt-4">
                          {notToDoTasks.map((task) => (
                            <div key={task.id} className="flex items-center gap-2 p-2 border rounded bg-destructive/10">
                              <span className="flex-1">{task.text}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeFromNotToDo(task)}
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Optional: Show total counts */}
                    <div className="flex justify-between text-sm text-muted-foreground pt-4 border-t">
                      <span>Priority Tasks: {priorityTasks.length}</span>
                      <span>Not-To-Do Tasks: {notToDoTasks.length}</span>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function StrategiesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StrategiesContent />
    </Suspense>
  )
} 