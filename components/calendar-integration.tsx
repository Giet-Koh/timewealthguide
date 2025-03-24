"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { CheckIcon, PlusCircle, RefreshCw, Settings } from "lucide-react"
import { format } from "date-fns"

// Supported calendar providers
const CALENDAR_PROVIDERS = [
  { id: "google", name: "Google Calendar" },
  { id: "outlook", name: "Microsoft Outlook" },
  { id: "apple", name: "Apple Calendar" },
]

// Mock calendar events (would come from API in production)
const MOCK_CALENDAR_EVENTS = [
  {
    id: "event1",
    title: "Team Meeting",
    start: "2023-09-12T10:00:00",
    end: "2023-09-12T11:00:00",
    calendarId: "work",
  },
  {
    id: "event2",
    title: "Lunch with Sarah",
    start: "2023-09-12T12:30:00",
    end: "2023-09-12T13:30:00",
    calendarId: "personal",
  },
  {
    id: "event3",
    title: "Doctor Appointment",
    start: "2023-09-12T15:00:00",
    end: "2023-09-12T16:00:00",
    calendarId: "personal",
  },
  {
    id: "event4",
    title: "Project Planning",
    start: "2023-09-12T16:30:00",
    end: "2023-09-12T17:30:00",
    calendarId: "work",
  },
]

// Mock calendars (would come from API in production)
const MOCK_CALENDARS = [
  { id: "work", name: "Work Calendar", color: "#4285F4", provider: "google", connected: true },
  { id: "personal", name: "Personal", color: "#0B8043", provider: "google", connected: true },
  { id: "family", name: "Family", color: "#8E24AA", provider: "apple", connected: false },
]

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  calendarId: string;
}

interface Calendar {
  id: string;
  name: string;
  color: string;
  provider: string;
  connected: boolean;
}

interface CalendarIntegrationProps {
  userValues: {
    values: string[];
    priorities: { [key: string]: number };
    definitions: { [key: string]: string[] };
  };
  onEventImport: (events: CalendarEvent[]) => void;
}

export function CalendarIntegration({ onEventImport }: CalendarIntegrationProps) {
  const [selectedProvider, setSelectedProvider] = useState<string>("google")
  const [showSettings, setShowSettings] = useState(false)
  const [autoImport, setAutoImport] = useState(false)
  const [calendarEvents] = useState<CalendarEvent[]>(MOCK_CALENDAR_EVENTS)
  const [connectedCalendars] = useState<Calendar[]>(MOCK_CALENDARS)
  const [selectedEvents, setSelectedEvents] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Simulate connecting to a calendar provider
  const handleConnectProvider = () => {
    setIsLoading(true)
    // In a real app, this would redirect to OAuth flow
    setTimeout(() => {
      setIsLoading(false)
      // Mock successful connection
      const newCalendars = [...connectedCalendars]
      // Set all calendars of this provider to connected
      newCalendars.forEach((cal) => {
        if (cal.provider === selectedProvider) {
          cal.connected = true
        }
      })
      // connectedCalendars.push(...newCalendars)
    }, 1500)
  }

  // Simulate refreshing calendar events
  const handleRefreshEvents = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      // In a real app, this would fetch the latest events from the calendar API
      // calendarEvents.push(...MOCK_CALENDAR_EVENTS)
    }, 1000)
  }

  // Toggle event selection
  const toggleEventSelection = (eventId: string) => {
    if (selectedEvents.includes(eventId)) {
      setSelectedEvents(selectedEvents.filter((id) => id !== eventId))
    } else {
      setSelectedEvents([...selectedEvents, eventId])
    }
  }

  // Import selected events
  const handleImportEvents = () => {
    const eventsToImport = calendarEvents.filter((event) => selectedEvents.includes(event.id))
    onEventImport(eventsToImport)
    // Reset selection after import
    setSelectedEvents([])
  }

  // Group events by date for display
  const eventsByDate = calendarEvents.reduce<{ [key: string]: CalendarEvent[] }>(
    (acc, event) => {
      const date = format(new Date(event.start), "yyyy-MM-dd")
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(event)
      return acc
    },
    {},
  )

  return (
    <div className="space-y-6">
      <Card className="border border-slate-200">
        <CardHeader className="blue-card-header">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Calendar Integration</CardTitle>
              <CardDescription>Connect your calendars to import events</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(!showSettings)}
              className={showSettings ? "bg-blue-100" : ""}
            >
              <Settings className="h-5 w-5 text-blue-600" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {showSettings ? (
            // Calendar Settings View
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Connect Calendar Provider</Label>
                <div className="flex gap-2">
                  <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                    <SelectTrigger className="input-blue">
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {CALENDAR_PROVIDERS.map((provider) => (
                        <SelectItem key={provider.id} value={provider.id}>
                          {provider.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={handleConnectProvider} disabled={isLoading}>
                    {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Connect"}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Connected Calendars</Label>
                <div className="space-y-2">
                  {connectedCalendars.map((calendar) => (
                    <div
                      key={calendar.id}
                      className="flex items-center justify-between p-3 rounded-md border"
                      style={{ borderLeftColor: calendar.color, borderLeftWidth: "4px" }}
                    >
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: calendar.color }} />
                        <span>{calendar.name}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs text-slate-500 mr-2">
                          {calendar.connected ? "Connected" : "Not connected"}
                        </span>
                        <Switch checked={calendar.connected} disabled />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Switch id="auto-import" checked={autoImport} onCheckedChange={setAutoImport} />
                <Label htmlFor="auto-import">Auto-import new calendar events</Label>
              </div>
            </div>
          ) : (
            // Calendar Events View
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Available Events</h3>
                <Button variant="outline" size="sm" onClick={handleRefreshEvents} disabled={isLoading}>
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-1" /> Refresh
                    </>
                  )}
                </Button>
              </div>

              <div className="space-y-3 max-h-[300px] overflow-auto pr-2">
                {Object.entries(eventsByDate).map(([date, events]) => (
                  <div key={date} className="space-y-1">
                    <h4 className="text-xs font-semibold uppercase text-slate-500 py-1">
                      {format(new Date(date), "EEEE, MMMM d")}
                    </h4>

                    {events.map((event) => {
                      const isSelected = selectedEvents.includes(event.id)
                      const calendar = connectedCalendars.find((cal) => cal.id === event.calendarId)

                      return (
                        <div
                          key={event.id}
                          className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${
                            isSelected
                              ? "bg-blue-50 border border-blue-200"
                              : "hover:bg-slate-50 border border-transparent"
                          }`}
                          onClick={() => toggleEventSelection(event.id)}
                        >
                          <div
                            className="w-3 h-full rounded-full mr-2"
                            style={{ backgroundColor: calendar?.color || "#9e9e9e" }}
                          />
                          <div className="flex-1">
                            <div className="font-medium text-sm">{event.title}</div>
                            <div className="text-xs text-slate-500">
                              {format(new Date(event.start), "h:mm a")} - {format(new Date(event.end), "h:mm a")}
                            </div>
                          </div>
                          <div className="ml-2">{isSelected && <CheckIcon className="h-4 w-4 text-blue-600" />}</div>
                        </div>
                      )
                    })}
                  </div>
                ))}

                {Object.keys(eventsByDate).length === 0 && (
                  <div className="text-center p-4 text-slate-500 text-sm">No calendar events found</div>
                )}
              </div>
            </div>
          )}
        </CardContent>

        {!showSettings && (
          <CardFooter>
            <Button className="w-full btn-primary" onClick={handleImportEvents} disabled={selectedEvents.length === 0}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Import {selectedEvents.length > 0 ? `${selectedEvents.length} Events` : "Events"}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}

