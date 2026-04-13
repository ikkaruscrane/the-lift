// app/page.js
// Lobby / ground floor — redirects to the workout planner.

import { redirect } from 'next/navigation'

export default function Home() {
  redirect('/workout')
}
