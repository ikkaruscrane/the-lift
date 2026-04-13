// app/workout/page.js
// Main workout planner page.
// Shows your 5-day split. Each tab lets you view or edit the exercises for that day.
// In Edit mode you can add exercises from the library, remove them, and
// drag them up or down to reorder.

'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'

// The 5 days in the Sullivan split — used for tabs and filtering.
const SPLIT_DAYS = [
  'D1 – Push',
  'D2 – Quads/Glutes',
  'D3 – Posterior Chain',
  'D4 – Pull',
  'D5 – Ham/Glutes',
]

export default function WorkoutPage() {
  const [activeDay, setActiveDay]         = useState(SPLIT_DAYS[0])
  const [editMode, setEditMode]           = useState(false)
  const [planExercises, setPlanExercises] = useState([]) // exercises in the current day's plan
  const [library, setLibrary]             = useState([]) // full exercise library
  const [showPicker, setShowPicker]       = useState(false)
  const [pickerSearch, setPickerSearch]   = useState('')
  const [saving, setSaving]               = useState(false)
  const [error, setError]                 = useState(null)

  // Drag-and-drop state — tracks which item is being dragged
  const dragItem    = useRef(null)
  const dragOverItem = useRef(null)

  // Load the plan for the selected day whenever the active day changes
  useEffect(() => {
    loadPlan(activeDay)
  }, [activeDay])

  // Load the full exercise library once on mount
  useEffect(() => {
    loadLibrary()
  }, [])

  // Fetch the ordered plan for one day from the plan_exercises table
  async function loadPlan(day) {
    setError(null)
    const { data, error } = await supabase
      .from('plan_exercises')
      .select('id, sort_order, exercise_id, exercises(id, name, day, category)')
      .eq('day_key', day)
      .order('sort_order', { ascending: true })

    if (error) { setError(error.message); return }
    setPlanExercises(data || [])
  }

  // Fetch every exercise in the library
  async function loadLibrary() {
    const { data, error } = await supabase
      .from('exercises')
      .select('id, name, day, category')
      .order('day', { ascending: true })
      .order('name', { ascending: true })

    if (error) { setError(error.message); return }
    setLibrary(data || [])
  }

  // Add an exercise from the library into today's plan
  async function addExercise(exercise) {
    setSaving(true)
    setError(null)

    // Put it at the end of the list
    const nextOrder = planExercises.length > 0
      ? Math.max(...planExercises.map(p => p.sort_order)) + 1
      : 0

    const { data, error } = await supabase
      .from('plan_exercises')
      .insert({ day_key: activeDay, exercise_id: exercise.id, sort_order: nextOrder })
      .select('id, sort_order, exercise_id, exercises(id, name, day, category)')
      .single()

    if (error) { setError(error.message) }
    else { setPlanExercises(prev => [...prev, data]) }

    setSaving(false)
  }

  // Remove an exercise from today's plan
  async function removeExercise(planId) {
    setSaving(true)
    setError(null)

    const { error } = await supabase
      .from('plan_exercises')
      .delete()
      .eq('id', planId)

    if (error) { setError(error.message) }
    else { setPlanExercises(prev => prev.filter(p => p.id !== planId)) }

    setSaving(false)
  }

  // ── Drag and drop handlers ──────────────────────────────────────────────────

  function onDragStart(index) {
    dragItem.current = index
  }

  function onDragEnter(index) {
    dragOverItem.current = index
  }

  function onDragEnd() {
    // Reorder the local list
    const items = [...planExercises]
    const dragged = items.splice(dragItem.current, 1)[0]
    items.splice(dragOverItem.current, 0, dragged)

    // Reassign sort_order values (0, 1, 2 …)
    const reordered = items.map((item, i) => ({ ...item, sort_order: i }))
    setPlanExercises(reordered)

    dragItem.current    = null
    dragOverItem.current = null

    // Persist new order to Supabase
    saveOrder(reordered)
  }

  // Write updated sort_order values back to Supabase
  async function saveOrder(items) {
    setSaving(true)
    setError(null)

    // Upsert all rows with their new sort_order
    const updates = items.map(item => ({
      id: item.id,
      day_key: activeDay,
      exercise_id: item.exercise_id,
      sort_order: item.sort_order,
    }))

    const { error } = await supabase
      .from('plan_exercises')
      .upsert(updates)

    if (error) setError(error.message)
    setSaving(false)
  }

  // ── Picker helpers ──────────────────────────────────────────────────────────

  // IDs of exercises already in today's plan (so we can grey them out in picker)
  const plannedIds = new Set(planExercises.map(p => p.exercise_id))

  // Filter library by search term
  const filteredLibrary = library.filter(ex => {
    const q = pickerSearch.toLowerCase()
    return (
      ex.name.toLowerCase().includes(q) ||
      (ex.day || '').toLowerCase().includes(q) ||
      (ex.category || '').toLowerCase().includes(q)
    )
  })

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Page header */}
      <div className="border-b border-gray-800 px-6 py-5">
        <h1 className="text-2xl font-bold tracking-tight">Workout Planner</h1>
        <p className="text-sm text-gray-400 mt-1">Build your 5-day split and log your sessions</p>
      </div>

      {/* Day tabs */}
      <div className="flex overflow-x-auto border-b border-gray-800 px-6 gap-1 pt-4">
        {SPLIT_DAYS.map(day => (
          <button
            key={day}
            onClick={() => { setActiveDay(day); setEditMode(false); setShowPicker(false) }}
            className={`whitespace-nowrap px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${
              activeDay === day
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Day content */}
      <div className="px-6 py-6 max-w-2xl">

        {/* Edit / Done button */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold">{activeDay}</h2>
          <button
            onClick={() => { setEditMode(e => !e); setShowPicker(false) }}
            className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${
              editMode
                ? 'bg-green-700 hover:bg-green-600 text-white'
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
          >
            {editMode ? 'Done' : 'Edit Plan'}
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 bg-red-900/50 border border-red-700 text-red-300 text-sm rounded px-4 py-3">
            {error}
          </div>
        )}

        {/* Saving indicator */}
        {saving && (
          <p className="text-xs text-gray-500 mb-3">Saving…</p>
        )}

        {/* Exercise list */}
        {planExercises.length === 0 && (
          <p className="text-gray-500 text-sm">
            {editMode
              ? 'No exercises yet — click "Add Exercise" below to start building your plan.'
              : 'No exercises in this day\'s plan. Click "Edit Plan" to add some.'}
          </p>
        )}

        <ul className="space-y-2">
          {planExercises.map((item, index) => (
            <li
              key={item.id}
              draggable={editMode}
              onDragStart={() => onDragStart(index)}
              onDragEnter={() => onDragEnter(index)}
              onDragEnd={onDragEnd}
              onDragOver={e => e.preventDefault()}
              className={`flex items-center gap-3 bg-gray-800 rounded-lg px-4 py-3 ${
                editMode ? 'cursor-grab active:cursor-grabbing' : ''
              }`}
            >
              {/* Drag handle — only visible in edit mode */}
              {editMode && (
                <span className="text-gray-500 select-none text-lg leading-none">⠿</span>
              )}

              {/* Exercise info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{item.exercises?.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.exercises?.category}</p>
              </div>

              {/* Remove button — only in edit mode */}
              {editMode && (
                <button
                  onClick={() => removeExercise(item.id)}
                  className="text-gray-500 hover:text-red-400 transition-colors text-lg leading-none px-1"
                  title="Remove from plan"
                >
                  ×
                </button>
              )}
            </li>
          ))}
        </ul>

        {/* Add Exercise button — only in edit mode */}
        {editMode && (
          <button
            onClick={() => setShowPicker(p => !p)}
            className="mt-4 w-full border border-dashed border-gray-600 hover:border-gray-400 text-gray-400 hover:text-white rounded-lg py-3 text-sm transition-colors"
          >
            {showPicker ? 'Hide exercise library ↑' : '+ Add Exercise'}
          </button>
        )}

        {/* Exercise picker */}
        {editMode && showPicker && (
          <div className="mt-3 bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">

            {/* Search bar */}
            <div className="p-3 border-b border-gray-700">
              <input
                type="text"
                placeholder="Search exercises, day, or category…"
                value={pickerSearch}
                onChange={e => setPickerSearch(e.target.value)}
                className="w-full bg-gray-800 text-white text-sm rounded px-3 py-2 placeholder-gray-500 outline-none focus:ring-1 focus:ring-gray-500"
                autoFocus
              />
            </div>

            {/* Exercise list */}
            <ul className="max-h-72 overflow-y-auto divide-y divide-gray-800">
              {filteredLibrary.length === 0 && (
                <li className="px-4 py-3 text-sm text-gray-500">No exercises match your search.</li>
              )}
              {filteredLibrary.map(ex => {
                const alreadyAdded = plannedIds.has(ex.id)
                return (
                  <li key={ex.id} className="flex items-center gap-3 px-4 py-3">
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${alreadyAdded ? 'text-gray-500' : 'text-white'}`}>
                        {ex.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{ex.day} · {ex.category}</p>
                    </div>
                    <button
                      onClick={() => !alreadyAdded && addExercise(ex)}
                      disabled={alreadyAdded}
                      className={`text-xs px-3 py-1 rounded font-medium transition-colors ${
                        alreadyAdded
                          ? 'bg-gray-800 text-gray-600 cursor-default'
                          : 'bg-gray-700 hover:bg-gray-600 text-white'
                      }`}
                    >
                      {alreadyAdded ? 'Added' : 'Add'}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        )}

      </div>
    </div>
  )
}
