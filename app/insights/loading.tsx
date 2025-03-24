import { LoadingSpinner } from "@/components/loading-spinner"

export default function Loading() {
  return (
    <div className="container mx-auto flex h-[80vh] items-center justify-center px-4 py-8">
      <div className="text-center">
        <LoadingSpinner size={12} className="mb-4 text-primary" />
        <h2 className="text-xl font-medium">Loading Insights</h2>
        <p className="text-muted-foreground">Analyzing your time data...</p>
      </div>
    </div>
  )
}

