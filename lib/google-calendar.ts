export const GOOGLE_CALENDAR_CONFIG = {
  clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
  scope: 'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events',
  discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
}

export interface CalendarEvent {
  id: string
  summary: string
  description?: string
  start: {
    dateTime: string
    timeZone?: string
  }
  end: {
    dateTime: string
    timeZone?: string
  }
  location?: string
}

export interface GoogleCalendarState {
  isSignedIn: boolean
  events: CalendarEvent[]
  error: string | null
} 