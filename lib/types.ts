export interface Persona {
  id: string
  name: string
  description: string
  values: string[]
  icon?: string
  color?: string
  activities: string[]
  goals: string[]
}

export interface ValueProfile {
  values: string[]
  priorities: { [key: string]: number }
  definitions: { [key: string]: string[] }
  personas: Persona[]
}

export const DEFAULT_PERSONAS: Persona[] = [
  {
    id: "professional",
    name: "Professional Self",
    description: "Your career and work-related aspirations",
    values: ["Career Growth", "Learning", "Financial Security"],
    icon: "briefcase",
    color: "blue",
    activities: [
      "Team meetings",
      "Project work",
      "Professional development",
      "Networking",
      "Skill building"
    ],
    goals: [
      "Advance in career",
      "Develop expertise",
      "Build professional network",
      "Achieve financial goals"
    ]
  },
  {
    id: "personal",
    name: "Personal Self",
    description: "Your individual growth and well-being",
    values: ["Health", "Personal Growth", "Balance"],
    icon: "user",
    color: "green",
    activities: [
      "Exercise",
      "Meditation",
      "Reading",
      "Self-reflection",
      "Healthy eating"
    ],
    goals: [
      "Maintain physical health",
      "Develop mindfulness",
      "Achieve work-life balance",
      "Personal development"
    ]
  },
  {
    id: "relational",
    name: "Relational Self",
    description: "Your relationships with family and friends",
    values: ["Family", "Friendship", "Community"],
    icon: "users",
    color: "pink",
    activities: [
      "Family time",
      "Social gatherings",
      "Community service",
      "Quality time with friends",
      "Supporting loved ones"
    ],
    goals: [
      "Strengthen family bonds",
      "Nurture friendships",
      "Build community connections",
      "Be there for others"
    ]
  },
  {
    id: "spiritual",
    name: "Spiritual Self",
    description: "Your inner purpose and meaning",
    values: ["Spirituality", "Contribution", "Balance"],
    icon: "heart",
    color: "purple",
    activities: [
      "Meditation",
      "Prayer",
      "Volunteering",
      "Nature walks",
      "Mindful practices"
    ],
    goals: [
      "Deepen spiritual practice",
      "Find inner peace",
      "Make meaningful contributions",
      "Live with purpose"
    ]
  },
  {
    id: "creative",
    name: "Creative Self",
    description: "Your artistic and innovative expression",
    values: ["Creativity", "Learning", "Adventure"],
    icon: "palette",
    color: "orange",
    activities: [
      "Art projects",
      "Writing",
      "Music",
      "Creative problem-solving",
      "Exploring new ideas"
    ],
    goals: [
      "Express creativity",
      "Master creative skills",
      "Complete creative projects",
      "Inspire others"
    ]
  }
] 