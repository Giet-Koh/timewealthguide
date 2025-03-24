"use client"

import { useState, createElement } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Briefcase, User, Users, Heart, Palette, Plus, X, Target, Activity } from "lucide-react"
import { Persona, DEFAULT_PERSONAS } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const ICON_MAP = {
  briefcase: Briefcase,
  user: User,
  users: Users,
  heart: Heart,
  palette: Palette,
}

const COLOR_MAP = {
  blue: "bg-blue-50 text-blue-700 border-blue-200",
  green: "bg-green-50 text-green-700 border-green-200",
  pink: "bg-pink-50 text-pink-700 border-pink-200",
  purple: "bg-purple-50 text-purple-700 border-purple-200",
  orange: "bg-orange-50 text-orange-700 border-orange-200",
}

interface PersonaSelectorProps {
  selectedPersonas: Persona[]
  onPersonaSelect: (persona: Persona) => void
  onPersonaRemove: (personaId: string) => void
}

export function PersonaSelector({ selectedPersonas, onPersonaSelect, onPersonaRemove }: PersonaSelectorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"values" | "activities" | "goals">("values")

  const availablePersonas = DEFAULT_PERSONAS.filter(
    (persona) => !selectedPersonas.some((p) => p.id === persona.id)
  )

  return (
    <div className="space-y-4">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {selectedPersonas.map((persona) => (
          <Card key={persona.id} className={`border-l-4 border-${persona.color}-500`}>
            <CardHeader className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2"
                onClick={() => onPersonaRemove(persona.id)}
              >
                <X className="h-4 w-4" />
              </Button>
              <CardTitle className="text-lg flex items-center gap-2">
                {ICON_MAP[persona.icon] && createElement(ICON_MAP[persona.icon], { className: "w-4 h-4" })}
                {persona.name}
              </CardTitle>
              <CardDescription>{persona.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="values" className="text-xs">Values</TabsTrigger>
                  <TabsTrigger value="activities" className="text-xs">Activities</TabsTrigger>
                  <TabsTrigger value="goals" className="text-xs">Goals</TabsTrigger>
                </TabsList>
                <TabsContent value="values">
                  <div className="flex flex-wrap gap-2 mt-2">
                    {persona.values.map((value) => (
                      <Badge key={value} variant="secondary">{value}</Badge>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="activities">
                  <ul className="list-disc pl-6 space-y-1 mt-2">
                    {persona.activities.map((activity, index) => (
                      <li key={index}>{activity}</li>
                    ))}
                  </ul>
                </TabsContent>
                <TabsContent value="goals">
                  <ul className="list-disc pl-6 space-y-1 mt-2">
                    {persona.goals.map((goal, index) => (
                      <li key={index}>{goal}</li>
                    ))}
                  </ul>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => setIsModalOpen(true)}
        disabled={availablePersonas.length === 0}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Persona
      </Button>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a Persona</DialogTitle>
            <DialogDescription>
              Select a persona to add to your value profile
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            {availablePersonas.map((persona) => (
              <Button
                key={persona.id}
                variant="outline"
                className="justify-start"
                onClick={() => {
                  onPersonaSelect(persona)
                  setIsModalOpen(false)
                }}
              >
                <div className="flex items-start gap-3">
                  {ICON_MAP[persona.icon] && createElement(ICON_MAP[persona.icon], { className: "w-4 h-4 mt-1" })}
                  <div className="text-left">
                    <div className="font-medium">{persona.name}</div>
                    <div className="text-sm text-muted-foreground">{persona.description}</div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 