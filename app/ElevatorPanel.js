// app/ElevatorPanel.js
// Left sidebar — the elevator button panel.
// Buttons stack bottom-to-top, like floors in a real building.
// Active floor button glows amber. Inactive buttons are brushed steel.
// Must be a client component to read the current route via usePathname.

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Main floor buttons — ordered bottom to top (array index 0 = bottom of panel).
// flex-direction: column-reverse in CSS handles the visual flip.
const FLOORS = [
  { label: 'LOG',       floor: 'G', href: '/log'       },
  { label: 'TODAY',     floor: '1', href: '/workout'   },
  { label: 'HISTORY',   floor: '2', href: '/history'   },
  { label: 'NUTRITION', floor: '3', href: '/nutrition' },
  { label: 'TRENDS',    floor: '4', href: '/trends'    },
  { label: 'TRAINER',   floor: '5', href: '/trainer'   },
]

// Supplementary buttons — styled like door-control buttons
const SECONDARY = [
  { label: 'SYNC',     floor: '◀', href: '/sync'     },
  { label: 'SETTINGS', floor: '▶', href: '/settings' },
]

export default function ElevatorPanel() {
  const pathname = usePathname()

  return (
    <nav className="button-panel">

      {/* Secondary buttons at the very bottom of the panel */}
      {SECONDARY.map(btn => (
        <Link
          key={btn.href}
          href={btn.href}
          className={`elevator-btn ${pathname === btn.href ? 'active' : ''}`}
          title={btn.label}
        >
          <span className="elevator-btn__floor">{btn.floor}</span>
          <span className="elevator-btn__label">{btn.label}</span>
        </Link>
      ))}

      {/* Divider between secondary and main buttons */}
      <div className="button-panel__divider" />

      {/* Main floor buttons */}
      {FLOORS.map(btn => (
        <Link
          key={btn.href}
          href={btn.href}
          className={`elevator-btn ${pathname === btn.href ? 'active' : ''}`}
          title={btn.label}
        >
          <span className="elevator-btn__floor">{btn.floor}</span>
          <span className="elevator-btn__label">{btn.label}</span>
        </Link>
      ))}

    </nav>
  )
}
