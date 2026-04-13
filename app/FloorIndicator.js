// app/FloorIndicator.js
// Top bar — styled like the digital display above elevator doors.
// Shows the wordmark on the left and the current "floor" name on the right.
// Must be a client component to read the current route via usePathname.

'use client'

import { usePathname } from 'next/navigation'

// Maps URL paths to display names shown in the floor indicator.
const FLOOR_NAMES = {
  '/':           { floor: 'G',  label: 'LOBBY' },
  '/workout':    { floor: '1',  label: 'TODAY — WORKOUT PLANNER' },
  '/log':        { floor: 'G',  label: 'LOG — TRAINING SESSION' },
  '/history':    { floor: '2',  label: 'HISTORY' },
  '/nutrition':  { floor: '3',  label: 'NUTRITION' },
  '/trends':     { floor: '4',  label: 'TRENDS' },
  '/trainer':    { floor: '5',  label: 'TRAINER' },
}

export default function FloorIndicator() {
  const pathname = usePathname()
  const current  = FLOOR_NAMES[pathname] || { floor: '–', label: pathname.toUpperCase() }

  return (
    <div className="floor-indicator">
      <span className="floor-indicator__wordmark">THE LIFT</span>
      <div className="floor-indicator__display">
        <span className="floor-indicator__arrow">▲</span>
        <span>{current.label}</span>
      </div>
    </div>
  )
}
