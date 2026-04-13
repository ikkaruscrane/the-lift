// app/page.js
// Sullivan Fit home page — links to the main sections of the app.

import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Sullivan Fit</h1>
        <p className="text-gray-400 mb-10">Your personal training tracker.</p>

        <nav className="flex flex-col gap-3">
          <Link
            href="/workout"
            className="flex items-center justify-between bg-gray-800 hover:bg-gray-700 rounded-xl px-5 py-4 transition-colors"
          >
            <div>
              <p className="font-semibold">Workout Planner</p>
              <p className="text-sm text-gray-400 mt-0.5">Build your 5-day split and log sessions</p>
            </div>
            <span className="text-gray-500 text-xl">→</span>
          </Link>
        </nav>
      </div>
    </div>
  )
}
