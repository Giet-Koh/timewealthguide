import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/loading-spinner"

interface DataStatusProps {
  isLoading: boolean
  isError: boolean
  errorMessage?: string
  isEmpty?: boolean
  emptyMessage?: string
}

export function DataStatus({
  isLoading,
  isError,
  errorMessage = "There was a problem loading the data.",
  isEmpty = false,
  emptyMessage = "No data available.",
}: DataStatusProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <LoadingSpinner size={6} className="mb-4 text-primary" />
        <p className="text-sm text-muted-foreground">Loading data...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{errorMessage}</AlertDescription>
      </Alert>
    )
  }

  if (isEmpty) {
    return (
      <Alert>
        <CheckCircle2 className="h-4 w-4" />
        <AlertTitle>No Data</AlertTitle>
        <AlertDescription>{emptyMessage}</AlertDescription>
      </Alert>
    )
  }

  return null
}

