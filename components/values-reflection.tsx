"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Link from "next/link"

interface ReflectionQuestion {
  id: string
  category: string
  question: string
  description: string
  type: "text" | "scale"
  options?: string[]
}

const reflectionQuestions: ReflectionQuestion[] = [
  {
    id: "time",
    category: "Time Wealth",
    question: "I have a deep awareness of the finite, impermanent nature of my time and its importance as my most precious asset.",
    description: "Consider how you view and value your time.",
    type: "scale",
    options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"]
  },
  {
    id: "time2",
    category: "Time Wealth",
    question: "I have a clear understanding of the two to three most important priorities in my personal and professional lives.",
    description: "Think about what truly matters to you.",
    type: "scale",
    options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"]
  },
  {
    id: "time3",
    category: "Time Wealth",
    question: "I am able to consistently direct attention and focus to the important priorities that I have identified.",
    description: "Reflect on your ability to stay focused on what matters.",
    type: "scale",
    options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"]
  },
  {
    id: "time4",
    category: "Time Wealth",
    question: "I rarely feel too busy or scattered to spend time on the most important priorities.",
    description: "Consider your time management and focus.",
    type: "scale",
    options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"]
  },
  {
    id: "time5",
    category: "Time Wealth",
    question: "I am in control of my calendar and priorities.",
    description: "Think about your sense of control over your time.",
    type: "scale",
    options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"]
  }
]

const followUpQuestions: ReflectionQuestion[] = [
  {
    id: "followup1",
    category: "Time Wealth",
    question: "Are you spending too much of your time on low-value, energy draining activities?",
    description: "Reflect on activities that might be consuming your time without adding value.",
    type: "scale",
    options: ["Yes", "No"]
  },
  {
    id: "followup2",
    category: "Time Wealth",
    question: "Are you being so busy that you are unable to prioritize time with the people who truly matter?",
    description: "Consider your relationships and how your time management affects them.",
    type: "scale",
    options: ["Yes", "No"]
  },
  {
    id: "followup3",
    category: "Time Wealth",
    question: "Are you losing spontaneity in your life as you pursue your most important priorities?",
    description: "Think about the balance between structure and flexibility in your life.",
    type: "scale",
    options: ["Yes", "No"]
  }
]

// Define personas based on survey responses
interface TimeWealthPersona {
  id: string
  name: string
  description: string
  characteristics: string[]
  recommendedStrategies: string[]
  scoreRange: {
    min: number
    max: number
  }
  image: string
}

const timeWealthPersonas: TimeWealthPersona[] = [
  {
    id: "time-master",
    name: "Time Master",
    description: "You have a strong awareness of time's value and effectively manage your priorities.",
    characteristics: [
      "High awareness of time's finite nature",
      "Clear priority setting",
      "Strong focus and control"
    ],
    recommendedStrategies: [
      "Continue to live your best life!",
      "Share your wisdom with others",
      "Maintain your balanced approach"
    ],
    scoreRange: { min: 20, max: 25 },
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: "time-learner",
    name: "Time Learner",
    description: "You're developing awareness of time management and working on improving your skills.",
    characteristics: [
      "Growing time awareness",
      "Developing control",
      "Learning to balance commitments"
    ],
    recommendedStrategies: [
      "Time Wealth Hard Reset",
      "Two-List Exercise",
      "Energy Calendar"
    ],
    scoreRange: { min: 15, max: 19 },
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: "time-seeker",
    name: "Time Seeker",
    description: "You're beginning to recognize the importance of time management and seeking guidance.",
    characteristics: [
      "Initial time awareness",
      "Scattered focus",
      "Difficulty maintaining boundaries"
    ],
    recommendedStrategies: [
      "Time Wealth Hard Reset",
      "Two-List Exercise",
      "Build a daily routine"
    ],
    scoreRange: { min: 10, max: 14 },
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: "time-struggler",
    name: "Time Struggler",
    description: "You're finding it challenging to manage time effectively and need more support.",
    characteristics: [
      "Low time awareness",
      "Poor focus",
      "Difficulty with boundaries"
    ],
    recommendedStrategies: [
      "Time Wealth Hard Reset",
      "Energy Calendar",
      "Build a simple daily routine"
    ],
    scoreRange: { min: 5, max: 9 },
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  }
]

interface ValuesReflectionProps {
  onComplete: (reflections: { [key: string]: string }) => void
}

export function ValuesReflection({ onComplete }: ValuesReflectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [reflections, setReflections] = useState<{ [key: string]: string }>({})
  const [showFollowUp, setShowFollowUp] = useState(false)
  const [persona, setPersona] = useState<TimeWealthPersona | null>(null)
  const [isComplete, setIsComplete] = useState(false)

  const currentQuestions = showFollowUp ? followUpQuestions : reflectionQuestions
  const currentQuestion = currentQuestions[currentIndex]

  const calculateScore = (reflections: { [key: string]: string }) => {
    let score = 0
    Object.values(reflections).forEach(value => {
      switch (value) {
        case "Strongly Agree":
          score += 5
          break
        case "Agree":
          score += 4
          break
        case "Neutral":
          score += 3
          break
        case "Disagree":
          score += 2
          break
        case "Strongly Disagree":
          score += 1
          break
      }
    })
    return score
  }

  const determinePersona = (score: number) => {
    return timeWealthPersonas.find(
      persona => score >= persona.scoreRange.min && score <= persona.scoreRange.max
    ) || timeWealthPersonas[timeWealthPersonas.length - 1]
  }

  const handleNext = () => {
    if (currentIndex < currentQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      // Check if any time wealth questions were answered with "Disagree" or "Strongly Disagree"
      const hasDisagree = Object.entries(reflections).some(
        ([key, value]) => key.startsWith("time") && (value === "Disagree" || value === "Strongly Disagree")
      )
      
      if (hasDisagree && !showFollowUp) {
        setShowFollowUp(true)
        setCurrentIndex(0)
      } else {
        const score = calculateScore(reflections)
        const determinedPersona = determinePersona(score)
        setPersona(determinedPersona)
        setIsComplete(true)
        onComplete(reflections)
      }
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleReflectionChange = (value: string) => {
    if (!currentQuestion) return
    setReflections({
      ...reflections,
      [currentQuestion.id]: value
    })
  }

  const progress = ((currentIndex + 1) / (showFollowUp ? followUpQuestions.length : reflectionQuestions.length)) * 100

  if (isComplete && persona) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Your Time Wealth Profile</h3>
          <p className="text-sm text-muted-foreground">
            Based on your responses, here's your personalized time management profile.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {timeWealthPersonas.map((p) => (
            <Card 
              key={p.id} 
              className={`transition-all duration-200 ${
                p.id === persona.id 
                  ? "p-6 bg-accent/50 border-2 border-primary shadow-lg cursor-pointer hover:shadow-xl" 
                  : "p-4 bg-background/50"
              }`}
            >
              {p.id === persona.id ? (
                <Link href={`/strategies?persona=${p.id}`} className="block">
                  <div className="space-y-4">
                    <div className="relative w-full overflow-hidden rounded-lg h-32">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-bold text-xl text-primary">
                        {p.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {p.description}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Your Characteristics</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {p.characteristics.map((char, index) => (
                          <li key={index}>{char}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Recommended Strategies</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {p.recommendedStrategies.map((strategy, index) => (
                          <li key={index}>{strategy}</li>
                        ))}
                      </ul>
                    </div>
                    <Button className="w-full">
                      View Recommended Strategies
                    </Button>
                  </div>
                </Link>
              ) : (
                <div className="space-y-4">
                  <div className="relative w-full overflow-hidden rounded-lg h-24">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg">
                      {p.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {p.description}
                    </p>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!currentQuestion) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Reflect on Your Values</h3>
        <p className="text-sm text-muted-foreground">
          Take time to reflect on these questions. Your answers will help identify your core values and time management style.
        </p>
      </div>

      <Progress value={progress} className="w-full" />

      <Card className="p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-500">
              {currentQuestion.category}
            </h4>
            <h3 className="text-xl font-semibold">
              {currentQuestion.question}
            </h3>
            <p className="text-sm text-muted-foreground">
              {currentQuestion.description}
            </p>
          </div>

          {currentQuestion.type === "scale" ? (
            <RadioGroup
              value={reflections[currentQuestion.id] || ""}
              onValueChange={handleReflectionChange}
              className="flex flex-col space-y-2"
            >
              {currentQuestion.options?.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={option} />
                  <label htmlFor={option} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {option}
                  </label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <Textarea
              placeholder="Write your reflection here..."
              className="min-h-[150px]"
              value={reflections[currentQuestion.id] || ""}
              onChange={(e) => handleReflectionChange(e.target.value)}
            />
          )}

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              Previous
            </Button>
            <Button onClick={handleNext}>
              {currentIndex === currentQuestions.length - 1 ? "Complete" : "Next"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
} 