export const getValueColorClass = (value: string): string => {
  return "value-default"
}

// Get badge class for a value
export const getValueBadgeClass = (value: string): string => {
  return "value-badge-default"
}

// Get progress bar class for a value
export const getValueProgressClass = (value: string): string => {
  return "progress-bar-default"
}

// Get text color class for a value
export const getValueTextClass = (value: string): string => {
  return "value-color-default"
}

// Get background color for a value (with opacity)
export const getValueBgClass = (value: string, opacity = 10): string => {
  return `bg-gray-100`
}

// Get border color for a value (with opacity)
export const getValueBorderClass = (value: string, opacity = 30): string => {
  return `border-gray-200`
}

// Get a consistent color for charts based on the value
export const getValueChartColor = (value: string): string => {
  return "#000000"
}

export function getValueColor(value: string): string {
  return 'text-black';
}

export function getValueBgColor(value: string): string {
  return 'bg-gray-100';
}

export function getValueBorderColor(value: string): string {
  return 'border-gray-200';
}

export function getValueHoverColor(value: string): string {
  return 'hover:bg-gray-200';
}

export function getValueTextColor(value: string): string {
  return 'text-black';
}

export function getValueProgressColor(value: string): string {
  return 'bg-black';
}

export function getValueRingColor(value: string): string {
  return 'ring-gray-200';
}

export function getValueFocusColor(value: string): string {
  return 'focus:ring-gray-300';
}

export function getValueActiveColor(value: string): string {
  return 'active:bg-gray-300';
}

export function getValueDisabledColor(value: string): string {
  return 'disabled:bg-gray-100 disabled:text-gray-400';
}

