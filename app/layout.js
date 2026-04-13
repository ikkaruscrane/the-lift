// app/layout.js
// Root layout — the elevator shell.
// Loads the three design-system fonts, then renders:
//   - FloorIndicator (top bar)
//   - ElevatorPanel (left button panel)
//   - Floor content (the current page)

import { Bebas_Neue, DM_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import FloorIndicator from './FloorIndicator'
import ElevatorPanel  from './ElevatorPanel'

// Display font — floor numbers, section titles, wordmark
const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
})

// UI font — labels, button text, body copy
const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

// Data font — weights, reps, sets, dates, all numeric data
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata = {
  title: 'The Lift',
  description: 'Sullivan Fit — personal fitness tracker',
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <div className="app-shell">
          <FloorIndicator />
          <div className="app-body">
            <ElevatorPanel />
            <main className="floor-content">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}
