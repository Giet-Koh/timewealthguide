"use client"

import { useEffect, useState } from 'react'
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from '@react-oauth/google'
import { Button } from '@/components/ui/button'
import { Calendar } from 'lucide-react'
import { GOOGLE_CALENDAR_CONFIG, CalendarEvent, GoogleCalendarState } from '@/lib/google-calendar'

declare global {
  interface Window {
    gapi: any
  }
}

export function GoogleCalendarIntegration() {
  const [state, setState] = useState<GoogleCalendarState>({
    isSignedIn: false,
    events: [],
    error: null,
  })

  const initClient = async (token: string) => {
    try {
      const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch calendar events')
      }

      const data = await response.json()
      setState((prev) => ({
        ...prev,
        isSignedIn: true,
        events: data.items || [],
      }))
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'An error occurred',
      }))
    }
  }

  const handleSuccess = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      await initClient(credentialResponse.credential)
    }
  }

  const handleError = () => {
    setState((prev) => ({
      ...prev,
      error: 'Login Failed',
    }))
  }

  const handleSignOut = () => {
    googleLogout()
    setState({
      isSignedIn: false,
      events: [],
      error: null,
    })
  }

  if (!GOOGLE_CALENDAR_CONFIG.clientId) {
    return <div>Google Calendar client ID not configured</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Google Calendar Integration</h2>
        {state.isSignedIn ? (
          <Button onClick={handleSignOut} variant="outline">
            Sign Out
          </Button>
        ) : (
          <GoogleOAuthProvider clientId={GOOGLE_CALENDAR_CONFIG.clientId}>
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={handleError}
              useOneTap
            />
          </GoogleOAuthProvider>
        )}
      </div>

      {state.error && (
        <div className="text-red-500">Error: {state.error}</div>
      )}

      {state.isSignedIn && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Upcoming Events</h3>
          <div className="grid gap-4">
            {state.events.map((event: CalendarEvent) => (
              <div
                key={event.id}
                className="flex items-start space-x-4 p-4 rounded-lg border"
              >
                <Calendar className="h-5 w-5 text-blue-500 mt-1" />
                <div>
                  <h4 className="font-medium">{event.summary}</h4>
                  {event.description && (
                    <p className="text-sm text-gray-500">{event.description}</p>
                  )}
                  <div className="text-sm text-gray-500 mt-1">
                    {new Date(event.start.dateTime).toLocaleString()} -{' '}
                    {new Date(event.end.dateTime).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 