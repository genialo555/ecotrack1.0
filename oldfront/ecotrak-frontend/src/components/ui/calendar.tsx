"use client"

import * as React from "react"

export interface CalendarProps {
  className?: string
  selected?: Date
  onSelect?: (date: Date) => void
  disabled?: boolean
  placeholder?: string
  mode?: 'single' | 'range'
  initialFocus?: boolean
}

function Calendar({
  className,
  selected,
  onSelect,
  disabled,
  placeholder = "Pick a date",
  mode = 'single',
  initialFocus,
  ...props
}: CalendarProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value)
    onSelect?.(date)
  }

  return (
    <div className={`p-3 ${className}`}>
      <input
        type="date"
        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        value={selected ? selected.toISOString().split('T')[0] : ''}
        onChange={handleChange}
        disabled={disabled}
        placeholder={placeholder}
        autoFocus={initialFocus}
        {...props}
      />
    </div>
  )
}

Calendar.displayName = "Calendar"

export { Calendar }
