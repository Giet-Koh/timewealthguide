import { ValueProfile, Persona, DEFAULT_PERSONAS } from "./types"

const mockUserValues: ValueProfile = {
  values: [
    "Family",
    "Health",
    "Career Growth",
    "Learning",
    "Creativity",
    "Personal Growth",
  ],
  priorities: {
    "Family": 100,
    "Health": 90,
    "Career Growth": 80,
    "Learning": 75,
    "Creativity": 70,
    "Personal Growth": 85,
  },
  definitions: {
    "Family": ["Spending quality time with loved ones", "Supporting family members", "Creating lasting memories"],
    "Health": ["Regular exercise", "Balanced nutrition", "Adequate rest", "Mental well-being"],
    "Career Growth": ["Skill development", "Professional networking", "Taking on challenges"],
    "Learning": ["Reading books", "Taking courses", "Exploring new topics"],
    "Creativity": ["Artistic expression", "Problem-solving", "Innovation"],
    "Personal Growth": ["Self-reflection", "Setting goals", "Developing new habits"],
  },
  personas: [
    {
      id: "professional",
      name: "Professional Self",
      description: "Your career and work-related aspirations",
      values: ["Career Growth", "Learning"],
      icon: "briefcase",
      color: "blue",
      activities: [
        "Team meetings",
        "Project work",
        "Professional development",
        "Networking events",
        "Industry research"
      ],
      goals: [
        "Get promoted within 2 years",
        "Learn a new programming language",
        "Build professional network",
        "Complete certification"
      ]
    },
    {
      id: "personal",
      name: "Personal Self",
      description: "Your individual growth and well-being",
      values: ["Health", "Personal Growth"],
      icon: "user",
      color: "green",
      activities: [
        "Morning workout",
        "Meditation",
        "Journaling",
        "Healthy meal prep",
        "Reading personal development books"
      ],
      goals: [
        "Exercise 3 times per week",
        "Establish morning routine",
        "Read 12 books this year",
        "Practice mindfulness daily"
      ]
    }
  ],
}

// Generate dates for the past 30 days
const generatePastDates = (days: number) => {
  const dates = []
  const today = new Date()

  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(today.getDate() - i)
    dates.push(date)
  }

  return dates
}

const pastDates = generatePastDates(30)

// Helper to format date as YYYY-MM-DD
const formatDate = (date: Date) => {
  return date.toISOString().split("T")[0]
}

// Helper to generate random time between min and max
const randomTime = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// Helper to generate a random time string (HH:MM)
const randomTimeString = (hour: number) => {
  const minutes = Math.floor(Math.random() * 60)
  return `${hour.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
}

// Generate mock activities
export const mockActivities = pastDates.flatMap((date) => {
  const activities = []
  const dateStr = formatDate(date)
  const numActivities = Math.floor(Math.random() * 8) + 2 // 2-10 activities per day

  // Common activities with their associated values
  const commonActivities = [
    { name: "Family dinner", values: ["Family"] },
    { name: "Morning workout", values: ["Health"] },
    { name: "Team meeting", values: ["Career Growth"] },
    { name: "Reading", values: ["Learning"] },
    { name: "Project work", values: ["Career Growth", "Creativity"] },
    { name: "Meditation", values: ["Health"] },
    { name: "Online course", values: ["Learning", "Career Growth"] },
    { name: "Phone call with parents", values: ["Family"] },
    { name: "Writing", values: ["Creativity"] },
    { name: "Cooking", values: ["Health", "Creativity"] },
    { name: "Playing with kids", values: ["Family"] },
    { name: "Networking event", values: ["Career Growth"] },
    { name: "Doctor appointment", values: ["Health"] },
    { name: "Art project", values: ["Creativity"] },
    { name: "Research", values: ["Learning"] },
  ]

  // Generate activities for this day
  for (let i = 0; i < numActivities; i++) {
    const activityIndex = Math.floor(Math.random() * commonActivities.length)
    const activity = commonActivities[activityIndex]
    const hour = 8 + Math.floor((i * 14) / numActivities) // Spread throughout the day (8am-10pm)
    const startTime = randomTimeString(hour)
    const duration = randomTime(15, 120) // 15 min to 2 hours

    // Calculate end time
    const [startHour, startMinute] = startTime.split(":").map(Number)
    let endHour = startHour + Math.floor((startMinute + duration) / 60)
    const endMinute = (startMinute + duration) % 60
    if (endHour > 23) endHour = 23
    const endTime = `${endHour.toString().padStart(2, "0")}:${endMinute.toString().padStart(2, "0")}`

    activities.push({
      id: `${dateStr}-${i}`,
      name: activity.name,
      startTime,
      endTime,
      duration,
      values: activity.values,
      date: dateStr,
    })
  }

  return activities
})

// Simulate API delay
const simulateDelay = (ms = 500) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

interface Activity {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  duration: number;
  values: string[];
  date: string;
}

interface UserValues {
  values: string[];
  priorities: { [key: string]: number };
  definitions: { [key: string]: string[] };
}

// Mock API service
export const mockApiService = {
  // Get user values
  getUserValues: async (): Promise<ValueProfile> => {
    await simulateDelay()
    return mockUserValues
  },

  // Get activities
  getActivities: async (): Promise<Activity[]> => {
    await simulateDelay()
    return [...mockActivities]
  },

  // Get activities for a specific date
  getActivitiesByDate: async (date: string): Promise<Activity[]> => {
    await simulateDelay()
    return mockActivities.filter((activity) => activity.date === date)
  },

  // Get activities for a date range
  getActivitiesByDateRange: async (startDate: string, endDate: string): Promise<Activity[]> => {
    await simulateDelay()
    return mockActivities.filter((activity) => activity.date >= startDate && activity.date <= endDate)
  },

  // Add a new activity
  addActivity: async (activity: Omit<Activity, 'id'>): Promise<Activity> => {
    await simulateDelay()
    const newActivity = {
      ...activity,
      id: `${activity.date}-${Date.now()}`,
    }
    mockActivities.push(newActivity)
    return newActivity
  },

  // Delete an activity
  deleteActivity: async (id: string): Promise<boolean> => {
    await simulateDelay()
    const index = mockActivities.findIndex((activity) => activity.id === id)
    if (index !== -1) {
      mockActivities.splice(index, 1)
      return true
    }
    return false
  },

  // Update user values
  updateUserValues: async (values: UserValues): Promise<UserValues> => {
    await simulateDelay()
    Object.assign(mockUserValues, values)
    return { ...mockUserValues }
  },

  saveUserValues: async (values: string[], personas: Persona[]): Promise<ValueProfile> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Create priorities (equal distribution for now)
    const priority = Math.floor(100 / values.length)
    const priorities: { [key: string]: number } = {}
    values.forEach((value) => {
      priorities[value] = priority
    })

    // Create default definitions
    const definitions: { [key: string]: string[] } = {}
    values.forEach((value) => {
      definitions[value] = [`Define what ${value} means to you`]
    })

    const newProfile: ValueProfile = {
      values,
      priorities,
      definitions,
      personas,
    }

    // In a real app, save to backend
    localStorage.setItem("userValues", JSON.stringify(newProfile))
    return newProfile
  },
}

