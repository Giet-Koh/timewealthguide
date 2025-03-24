"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, X } from "lucide-react"
import { getValueBgClass, getValueBorderClass, getValueTextClass } from "@/lib/value-colors"

interface ValuesDefinitionProps {
  values: string[]
  priorities: { [key: string]: number }
  initialDefinitions: { [key: string]: string[] }
  onDefinitionsChanged: (definitions: { [key: string]: string[] }) => void
}

export function ValuesDefinition({
  values,
  priorities,
  initialDefinitions,
  onDefinitionsChanged,
}: ValuesDefinitionProps) {
  const [definitions, setDefinitions] = useState<{ [key: string]: string[] }>(initialDefinitions)
  const [newActivities, setNewActivities] = useState<{ [key: string]: string }>({})

  // Sort values by priority (descending)
  const sortedValues = [...values].sort((a, b) => (priorities[b] || 0) - (priorities[a] || 0))

  const handleAddActivity = (value: string) => {
    const activity = newActivities[value]?.trim()
    if (activity && !definitions[value]?.includes(activity)) {
      const updatedDefinitions = {
        ...definitions,
        [value]: [...(definitions[value] || []), activity],
      }
      setDefinitions(updatedDefinitions)
      onDefinitionsChanged(updatedDefinitions)

      // Clear input
      setNewActivities({
        ...newActivities,
        [value]: "",
      })
    }
  }

  const handleRemoveActivity = (value: string, activity: string) => {
    const updatedDefinitions = {
      ...definitions,
      [value]: definitions[value].filter((a) => a !== activity),
    }
    setDefinitions(updatedDefinitions)
    onDefinitionsChanged(updatedDefinitions)
  }

  // Example activities for common values to help users get started
  const exampleActivities: { [key: string]: string[] } = {
    Family: ["Family dinners", "Helping with homework", "Weekend outings", "Calls with parents"],
    Health: ["Exercise", "Meal preparation", "Meditation", "Doctor appointments"],
    "Career Growth": ["Learning new skills", "Networking", "Reading industry news", "Working on projects"],
    Learning: ["Reading books", "Taking courses", "Attending workshops", "Researching topics"],
    Creativity: ["Art projects", "Writing", "Music practice", "Creative problem solving"],
    Community: ["Volunteering", "Neighborhood events", "Supporting local businesses", "Community meetings"],
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Define Activities for Each Value</h3>
        <p className="text-sm text-muted-foreground">
          For each of your core values, define specific activities that align with it. These will help you track how
          your time supports what matters most to you.
        </p>
      </div>

      <div className="space-y-6">
        {sortedValues.map((value) => {
          const bgClass = getValueBgClass(value)
          const borderClass = getValueBorderClass(value)
          const textClass = getValueTextClass(value)

          return (
            <Card key={value} className={`${borderClass} border-l-4`}>
              <CardHeader className={`pb-2 ${bgClass}`}>
                <div className="flex items-center justify-between">
                  <CardTitle className={`text-lg ${textClass}`}>
                    {value}
                    <Badge variant="outline" className="ml-2">
                      {priorities[value] || 0}%
                    </Badge>
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder={`Add activity for ${value}...`}
                    value={newActivities[value] || ""}
                    onChange={(e) =>
                      setNewActivities({
                        ...newActivities,
                        [value]: e.target.value,
                      })
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddActivity(value)
                      }
                    }}
                    className={borderClass}
                  />
                  <Button
                    type="button"
                    size="icon"
                    onClick={() => handleAddActivity(value)}
                    disabled={!newActivities[value]?.trim()}
                    className={bgClass}
                  >
                    <Plus className={`h-4 w-4 ${textClass}`} />
                  </Button>
                </div>

                {definitions[value]?.length === 0 && exampleActivities[value] && (
                  <div className={`rounded-md ${bgClass} p-3`}>
                    <p className="text-sm font-medium mb-2">Examples:</p>
                    <div className="flex flex-wrap gap-2">
                      {exampleActivities[value].map((example) => (
                        <Button
                          key={example}
                          variant="outline"
                          size="sm"
                          className={`h-7 text-xs ${borderClass} ${textClass}`}
                          onClick={() => {
                            const updatedDefinitions = {
                              ...definitions,
                              [value]: [...(definitions[value] || []), example],
                            }
                            setDefinitions(updatedDefinitions)
                            onDefinitionsChanged(updatedDefinitions)
                          }}
                        >
                          + {example}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {definitions[value]?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {definitions[value].map((activity) => (
                      <div key={activity} className={`flex items-center rounded-full ${bgClass} px-3 py-1 text-sm`}>
                        {activity}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-1 h-4 w-4"
                          onClick={() => handleRemoveActivity(value, activity)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

