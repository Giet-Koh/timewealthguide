"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, Heart, ArrowUpDown, Pencil, Calculator, Book, Film, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { ValuesQuiz } from "@/components/values-quiz"
import { ValuesPrioritization } from "@/components/values-prioritization"
import { ValuesDefinition } from "@/components/values-definition"
import { Error } from "@/components/ui/error"
import { ErrorBoundary } from "@/components/error-boundary"
import { ValuesReflection } from "@/components/values-reflection"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const steps = [
  { id: 1, name: "Awareness" },
  { id: 2, name: "Attention" },
  { id: 3, name: "Control" },
  { id: 4, name: "Complete" },
]

export default function ValuesDiscoveryPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [values, setValues] = useState<string[]>([])
  const [valuePriorities, setValuePriorities] = useState<{ [key: string]: number }>({})
  const [valueDefinitions, setValueDefinitions] = useState<{ [key: string]: string[] }>({})
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [reflections, setReflections] = useState<{ [key: string]: string }>({})
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({})
  const booksScrollRef = useRef<HTMLDivElement>(null)
  const moviesScrollRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [selectedMedia, setSelectedMedia] = useState<{
    title: string;
    type: 'book' | 'movie';
    author?: string;
    year?: number;
    summary: string;
    image: string;
    link: string;
  } | null>(null)
  const [openBookDialog, setOpenBookDialog] = useState(false)
  const [openMovieDialog, setOpenMovieDialog] = useState(false)

  // Update the useEffect to use mock data instead of localStorage
  useEffect(() => {
    const loadMockData = async () => {
      try {
        // Import the mock service dynamically to avoid issues with SSR
        const { mockApiService } = await import("@/lib/mock-data")
        const mockValues = await mockApiService.getUserValues()

        // Initialize with mock data if no values are set
        if (currentStep === 1 && !values.length) {
          setValues(mockValues.values)
          setValuePriorities(mockValues.priorities)
          setValueDefinitions(mockValues.definitions)
        }
        setError(null)
      } catch (error) {
        console.error("Error loading mock data:", error)
        setError("Failed to load your values. You can start fresh or try again.")
      }
    }

    loadMockData()
  }, [currentStep, values.length])

  // Update the handleNext function to use mock API
  const handleNext = async () => {
    if (currentStep < steps.length) {
      // Validate current step
      if (currentStep === 1 && values.length === 0) {
        setError("Please select at least one value before proceeding.")
        return
      }
      if (currentStep === 2 && Object.keys(valuePriorities).length === 0) {
        setError("Please set priorities for your values before proceeding.")
        return
      }
      if (currentStep === 3 && Object.keys(valueDefinitions).length === 0) {
        setError("Please define your values before proceeding.")
        return
      }

      setCurrentStep(currentStep + 1)
      setError(null)
    } else {
      setIsSaving(true)
      setError(null)
      try {
        // Import the mock service dynamically
        const { mockApiService } = await import("@/lib/mock-data")

        // Save values to mock API
        await mockApiService.updateUserValues({
          values,
          priorities: valuePriorities,
          definitions: valueDefinitions,
        })

        // Also save to localStorage as backup
        localStorage.setItem(
          "userValues",
          JSON.stringify({
            values,
            priorities: valuePriorities,
            definitions: valueDefinitions,
          })
        )

        router.push("/tracker")
      } catch (error) {
        console.error("Error saving values:", error)
        setError("Failed to save your values. Please try again.")
      } finally {
        setIsSaving(false)
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setError(null)
    }
  }

  const handleValuesSelected = (selectedValues: string[]) => {
    setValues(selectedValues)

    // Initialize priorities with equal distribution
    const equalShare = 100 / selectedValues.length
    const initialPriorities = selectedValues.reduce(
      (acc, value) => {
        acc[value] = equalShare
        return acc
      },
      {} as { [key: string]: number },
    )

    setValuePriorities(initialPriorities)

    // Initialize empty definitions
    const initialDefinitions = selectedValues.reduce(
      (acc, value) => {
        acc[value] = []
        return acc
      },
      {} as { [key: string]: string[] },
    )

    setValueDefinitions(initialDefinitions)
  }

  const handlePrioritiesChanged = (priorities: { [key: string]: number }) => {
    setValuePriorities(priorities)
  }

  const handleDefinitionsChanged = (definitions: { [key: string]: string[] }) => {
    setValueDefinitions(definitions)
  }

  const handleReflectionsComplete = (completedReflections: { [key: string]: string }) => {
    setReflections(completedReflections)
  }

  const handleImageError = (id: string) => {
    setImageErrors(prev => ({ ...prev, [id]: true }))
  }

  const scrollCarousel = (direction: 'left' | 'right', type: 'books' | 'movies') => {
    const scrollRef = type === 'books' ? booksScrollRef : moviesScrollRef
    const scrollAmount = 300 // Adjust this value to control scroll distance
    
    if (scrollRef.current) {
      const newScrollLeft = scrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount)
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ErrorBoundary>
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <Progress value={(currentStep / steps.length) * 100} className="h-2" />
            <div className="mt-2 flex justify-between text-sm text-muted-foreground">
              {steps.map((step) => (
                <span key={step.id} className={currentStep >= step.id ? "font-medium text-foreground" : ""}>
                  {step.name}
                </span>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-4">
              <Error message={error} />
            </div>
          )}

          <Card>
            <CardContent className="p-6">
              <Tabs value={currentStep.toString()} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="1">
                    <Heart className="mr-2 h-4 w-4" />
                    Awareness
                  </TabsTrigger>
                  <TabsTrigger value="2">
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    Attention
                  </TabsTrigger>
                  <TabsTrigger value="3">
                    <Pencil className="mr-2 h-4 w-4" />
                    Control
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="1" className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold">Awareness</h3>
                      <p className="text-muted-foreground">
                        Understand your relationship with time through reflection and practical exercises.
                      </p>
                    </div>

                    <div className="space-y-6">
                      <ValuesReflection onComplete={handleReflectionsComplete} />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="2" className="space-y-4">
                  <ValuesPrioritization
                    values={Object.keys(valuePriorities)}
                    initialPriorities={valuePriorities}
                    onPrioritiesChanged={handlePrioritiesChanged}
                  />
                </TabsContent>

                <TabsContent value="3" className="space-y-4">
                  <ValuesDefinition
                    values={values}
                    priorities={valuePriorities}
                    initialDefinitions={valueDefinitions}
                    onDefinitionsChanged={handleDefinitionsChanged}
                  />
                </TabsContent>

                <TabsContent value="4">
                  <div className="space-y-8">
                    <div className="space-y-4 text-center">
                      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-10 w-10 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-medium">Your values profile is ready!</h3>
                      <p className="text-muted-foreground">
                        You&apos;ve successfully set up your values profile. Now you can start tracking your time and see how it
                        aligns with what matters most to you.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xl font-semibold">Recommended Reading & Watching</h4>
                      <p className="text-muted-foreground">
                        Based on your values and time management style, here are some carefully selected recommendations to help you on your journey.
                      </p>
                      <div className="grid gap-4 md:grid-cols-2">
                        <Dialog open={openBookDialog} onOpenChange={setOpenBookDialog}>
                          <DialogTrigger asChild>
                            <Card className="p-4 cursor-pointer hover:bg-accent/50 transition-colors">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <h5 className="font-medium">Books</h5>
                                  <Book className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  Discover inspiring stories about time and life.
                                </p>
                              </div>
                            </Card>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                              <DialogTitle>Recommended Book</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6 py-4">
                              <div className="flex gap-6">
                                <div className="w-48 flex-shrink-0">
                                  <div className="aspect-[2/3] bg-muted rounded-md overflow-hidden">
                                    {!imageErrors['when-breath'] ? (
                                      <img 
                                        src="https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1459945767i/25899336._SY475_.jpg"
                                        alt="When Breath Becomes Air"
                                        className="w-full h-full object-cover"
                                        onError={() => handleImageError('when-breath')}
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                                        <Book className="h-8 w-8" />
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="flex-1 space-y-4">
                                  <div>
                                    <h3 className="text-xl font-semibold">When Breath Becomes Air</h3>
                                    <p className="text-sm text-muted-foreground">by Paul Kalanithi</p>
                                  </div>
                                  <div className="space-y-2">
                                    <h4 className="font-medium">About the Book</h4>
                                    <p className="text-sm text-muted-foreground">
                                      At the age of thirty-six, on the verge of completing a decade's worth of training as a neurosurgeon, Paul Kalanithi was diagnosed with stage IV lung cancer. One day he was a doctor treating the dying, and the next he was a patient struggling to live. And just like that, the future he and his wife had imagined evaporated. When Breath Becomes Air chronicles Kalanithi's transformation from a naïve medical student "possessed," as he wrote, "by the question of what, given that all organisms die, makes a virtuous and meaningful life" into a neurosurgeon at Stanford working in the brain, the most critical place for human identity, and finally into a patient and new father confronting his own mortality.
                                    </p>
                                  </div>
                                  <div className="pt-2">
                                    <a 
                                      href="https://www.amazon.com/When-Breath-Becomes-Paul-Kalanithi/dp/081298840X"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sm text-primary hover:underline"
                                    >
                                      Get the book on Amazon →
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Dialog open={openMovieDialog} onOpenChange={setOpenMovieDialog}>
                          <DialogTrigger asChild>
                            <Card className="p-4 cursor-pointer hover:bg-accent/50 transition-colors">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <h5 className="font-medium">Movies</h5>
                                  <Film className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  Watch powerful stories about time and life.
                                </p>
                              </div>
                            </Card>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                              <DialogTitle>Recommended Movie</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6 py-4">
                              <div className="flex gap-6">
                                <div className="w-48 flex-shrink-0">
                                  <div className="aspect-[2/3] bg-muted rounded-md overflow-hidden">
                                    {!imageErrors['about-time'] ? (
                                      <img 
                                        src="https://image.tmdb.org/t/p/w500/zSuh8dGwqpsWRqhi7YMLwVSupik.jpg"
                                        alt="About Time"
                                        className="w-full h-full object-cover"
                                        onError={() => handleImageError('about-time')}
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                                        <Film className="h-8 w-8" />
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="flex-1 space-y-4">
                                  <div>
                                    <h3 className="text-xl font-semibold">About Time</h3>
                                    <p className="text-sm text-muted-foreground">(2013)</p>
                                  </div>
                                  <div className="space-y-2">
                                    <h4 className="font-medium">About the Movie</h4>
                                    <p className="text-sm text-muted-foreground">
                                      At the age of 21, Tim Lake discovers he can travel in time and change what happens and has happened in his own life. His decision to make his world a better place by getting a girlfriend turns out not to be as easy as you might think. The film follows Tim as he learns to live life to the fullest, appreciating each moment and making the most of his time with loved ones. It's a heartwarming story that explores the precious nature of time and the importance of living in the present moment.
                                    </p>
                                  </div>
                                  <div className="pt-2">
                                    <a 
                                      href="https://www.amazon.com/About-Time-Domhnall-Gleeson/dp/B00H3Q1N5E"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sm text-primary hover:underline"
                                    >
                                      Watch on Amazon Prime →
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>

            <CardFooter className="flex justify-between px-6 py-4 border-t">
              <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleNext} disabled={isSaving}>
                {currentStep < steps.length ? (
                  <>
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  isSaving ? "Saving..." : "Start Tracking"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </ErrorBoundary>
    </div>
  )
}

