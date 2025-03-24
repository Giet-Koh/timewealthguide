"use client"

import * as React from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { XCircle } from "lucide-react"

interface ErrorProps {
  title?: string
  message: string
  className?: string
}

export function Error({ title = "Error", message, className }: ErrorProps) {
  return (
    <Alert variant="destructive" className={className}>
      <XCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
} 