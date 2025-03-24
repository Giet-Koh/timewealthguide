"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpDown } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

interface ValuesPrioritizationProps {
  values: string[]
  initialPriorities: { [key: string]: number }
  onPrioritiesChanged: (priorities: { [key: string]: number }) => void
}

export function ValuesPrioritization({ values, initialPriorities, onPrioritiesChanged }: ValuesPrioritizationProps) {
  const [priorities, setPriorities] = useState<{ [key: string]: number }>(initialPriorities)
  const [total, setTotal] = useState(100)

  // Normalize priorities to ensure they sum to 100%
  const normalizePriorities = (newPriorities: { [key: string]: number }) => {
    const sum = Object.values(newPriorities).reduce((acc, val) => acc + val, 0)

    if (sum === 0) {
      // If all values are 0, distribute equally
      const equalShare = 100 / values.length
      const normalized = values.reduce(
        (acc, value) => {
          acc[value] = equalShare
          return acc
        },
        {} as { [key: string]: number },
      )
      return normalized
    }

    // Scale all values proportionally to sum to 100
    const factor = 100 / sum
    const normalized = Object.keys(newPriorities).reduce(
      (acc, key) => {
        acc[key] = Math.round(newPriorities[key] * factor)
        return acc
      },
      {} as { [key: string]: number },
    )

    // Handle rounding errors to ensure exact 100% total
    const newSum = Object.values(normalized).reduce((acc, val) => acc + val, 0)
    if (newSum !== 100) {
      const diff = 100 - newSum
      const largestKey = Object.keys(normalized).reduce((a, b) => (normalized[a] > normalized[b] ? a : b))
      normalized[largestKey] += diff
    }

    return normalized
  }

  const handlePriorityChange = (value: string, newValue: number) => {
    const newPriorities = {
      ...priorities,
      [value]: newValue,
    }

    const normalized = normalizePriorities(newPriorities)
    setPriorities(normalized)
    onPrioritiesChanged(normalized)

    // Update total
    setTotal(Object.values(normalized).reduce((acc, val) => acc + val, 0))
  }

  // Sort values by priority (descending)
  const sortedValues = [...values].sort((a, b) => (priorities[b] || 0) - (priorities[a] || 0))

  // Prepare data for the pie chart
  const chartData = sortedValues.map((value) => ({
    name: value,
    value: priorities[value] || 0,
  }))

  // Generate different shades of gray for the pie chart
  const chartColors = [
    "#E8F0FE", // Very light blue
    "#F3F4F6", // Light gray
    "#FEF3C7", // Light yellow
    "#E0E7FF", // Light indigo
    "#FCE7F3", // Light pink
    "#D1FAE5", // Light green
    "#FEE2E2", // Light red
    "#F5F3FF", // Light purple
    "#ECFDF5", // Light teal
    "#FEF9C3", // Light amber
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Prioritize Your Values</h3>
        <div className="text-sm">
          Total: <span className={total === 100 ? "text-green-500 font-bold" : "text-red-500 font-bold"}>{total}%</span>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Click on a value in the pie chart to adjust its percentage. The values will automatically adjust to total 100%.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, value }) => `${name}: ${value}%`}
                  labelLine={true}
                  style={{ 
                    fontSize: '12px',
                    fill: '#374151',
                    fontWeight: 500,
                    textAnchor: 'middle'
                  }}
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={chartColors[index % chartColors.length]}
                      stroke="#E5E7EB"
                      strokeWidth={1}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.375rem',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-4">
            {sortedValues.map((value) => (
              <div key={value} className="flex items-center justify-between">
                <span className="font-medium">{value}</span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePriorityChange(value, Math.max(0, (priorities[value] || 0) - 5))}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center">{priorities[value] || 0}%</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePriorityChange(value, Math.min(100, (priorities[value] || 0) + 5))}
                  >
                    +
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          // Reset to equal distribution
          const equalShare = 100 / values.length
          const resetPriorities = values.reduce(
            (acc, value) => {
              acc[value] = equalShare
              return acc
            },
            {} as { [key: string]: number },
          )

          setPriorities(resetPriorities)
          onPrioritiesChanged(resetPriorities)
          setTotal(100)
        }}
      >
        <ArrowUpDown className="mr-2 h-4 w-4" />
        Reset to Equal Distribution
      </Button>
    </div>
  )
}

