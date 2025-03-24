"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, X, CheckCircle, Activity, Target } from "lucide-react"
import { PersonaSelector } from "@/components/persona-selector"
import { Persona, DEFAULT_PERSONAS } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Common values that users can select from
const commonValues = [
  "Family",
  "Health",
  "Career Growth",
  "Learning",
  "Creativity",
  "Community",
  "Spirituality",
  "Financial Security",
  "Adventure",
  "Friendship",
  "Personal Growth",
  "Contribution",
  "Balance",
]

// Reflection questions to help users discover their values
const reflectionQuestions = [
  "What would you regret not doing more of in 10 years?",
  "When do you feel most fulfilled or energized?",
  "What are you most proud of in your life so far?",
  "What would you do if money was no object?",
  "What activities make you lose track of time?",
]

interface ValuesQuizProps {
  onValuesSelected: (values: string[], personas: Persona[]) => void
}

export function ValuesQuiz({ onValuesSelected }: ValuesQuizProps) {
  const [selectedValues, setSelectedValues] = useState<string[]>([])
  const [customValue, setCustomValue] = useState("")
  const [reflections, setReflections] = useState<{ [key: string]: string }>({})
  const [selectedPersonas, setSelectedPersonas] = useState<Persona[]>([])
  const [activeTab, setActiveTab] = useState("values")

  const handleValueToggle = (value: string) => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter((v) => v !== value))
    } else {
      setSelectedValues([...selectedValues, value])
    }
  }

  const handleAddCustomValue = () => {
    if (customValue.trim() && !selectedValues.includes(customValue.trim())) {
      setSelectedValues([...selectedValues, customValue.trim()])
      setCustomValue("")
    }
  }

  const handleRemoveValue = (value: string) => {
    setSelectedValues(selectedValues.filter((v) => v !== value))
  }

  const handleReflectionChange = (question: string, answer: string) => {
    setReflections({
      ...reflections,
      [question]: answer,
    })
  }

  const handlePersonaSelect = (persona: Persona) => {
    setSelectedPersonas([...selectedPersonas, persona])
    // Add persona's values to selected values
    persona.values.forEach(value => {
      if (!selectedValues.includes(value)) {
        setSelectedValues([...selectedValues, value])
      }
    })
  }

  const handlePersonaRemove = (persona: Persona) => {
    setSelectedPersonas(selectedPersonas.filter(p => p.id !== persona.id))
  }

  const handleComplete = () => {
    onValuesSelected(selectedValues, selectedPersonas)
  }

  return (
    <Tabs defaultValue="values" className="w-full" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-3 mb-4">
        <TabsTrigger value="values" className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          Values
        </TabsTrigger>
        <TabsTrigger value="personas" className="flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Personas
        </TabsTrigger>
        <TabsTrigger value="goals" className="flex items-center gap-2">
          <Target className="w-4 h-4" />
          Goals
        </TabsTrigger>
      </TabsList>

      <TabsContent value="values">
        <Card>
          <CardHeader>
            <CardTitle>Select Your Values</CardTitle>
            <CardDescription>Choose the values that resonate with you</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {commonValues.map((value) => (
                <Button
                  key={value}
                  variant={selectedValues.includes(value) ? "default" : "outline"}
                  onClick={() => selectedValues.includes(value) ? handleRemoveValue(value) : handleValueToggle(value)}
                >
                  {value}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="personas">
        <Card>
          <CardHeader>
            <CardTitle>Life Role Personas</CardTitle>
            <CardDescription>Select personas to discover values aligned with different aspects of your life</CardDescription>
          </CardHeader>
          <CardContent>
            <PersonaSelector
              selectedPersonas={selectedPersonas}
              onPersonaSelect={handlePersonaSelect}
              onPersonaRemove={handlePersonaRemove}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="goals">
        <Card>
          <CardHeader>
            <CardTitle>Goals & Activities</CardTitle>
            <CardDescription>View suggested goals and activities based on your selected personas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              {selectedPersonas.map((persona) => (
                <Card key={persona.id} className={`border-l-4 border-${persona.color}-500`}>
                  <CardHeader>
                    <CardTitle className="text-lg">{persona.name}</CardTitle>
                    <CardDescription>{persona.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <Activity className="w-4 h-4" /> Activities
                        </h4>
                        <ul className="list-disc pl-6 space-y-1">
                          {persona.activities.map((activity, index) => (
                            <li key={index}>{activity}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <Target className="w-4 h-4" /> Goals
                        </h4>
                        <ul className="list-disc pl-6 space-y-1">
                          {persona.goals.map((goal, index) => (
                            <li key={index}>{goal}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {selectedPersonas.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  Select personas to view suggested goals and activities
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

