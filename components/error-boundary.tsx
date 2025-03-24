"use client"

import * as React from "react"
import { Error } from "@/components/ui/error"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  isClient: boolean
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { 
      hasError: false, 
      error: null,
      isClient: false 
    }
  }

  componentDidMount() {
    // Set isClient to true once mounted on client
    this.setState({ isClient: true })
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can log the error to an error reporting service here
    console.error("Error caught by boundary:", error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    // Only render error UI on client side
    if (this.state.hasError && this.state.isClient) {
      return (
        <div className="container mx-auto px-4 py-8">
          <Error
            title="Something went wrong"
            message={this.state.error?.message || "An unexpected error occurred."}
            className="mb-4"
          />
          <Button onClick={this.handleRetry} className="btn-primary">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}