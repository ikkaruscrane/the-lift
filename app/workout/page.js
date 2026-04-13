// app/workout/page.js
// Workout planner — Floor 1 / TODAY.
// Shows your 5-day split. Each tab lets you view or edit the exercises for that day.
// In Edit mode: add exercises from the library, remove them, and
// drag them up or down to reorder.

'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'

// Generic day labels — not tied to a specific split so you can rearrange freely.
const SPLIT_DAYS = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5']

export default function WorkoutPage() {
  const [activeDay, setActiveDay]         = useState(SPLIT_DAYS[0])
  const [editMode, setEditMode]           = useState(false)
  const [planExercises, setPlanExercises] = useState([])
  const [library, setLibrary]             = useState([])
  const [showPicker, setShowPicker]       = useState(false)
  const [pickerSearch, setPickerSearch]   = useState('')
  const [saving, setSaving]               = useState(false)
  const [error, setError]                 = useState(null)

  // Drag-and-drop — track which item is being dragged vs hovered over
  const dragItem     = useRef(null)
  const dragOverItem = useRef(null)

  useEffect(() => { loadPlan(activeDay) }, [activeDay])
  useEffect(() => { loadLibrary() }, [])

  // Fetch the ordered plan for one day
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

  // Fetch all exercises in the library
  async function loadLibrary() {
    const { data, error } = await supabase
      .from('exercises')
      .select('id, name, day, category')
      .order('day', { ascending: true })
      .order('name', { ascending: true })
    if (error) { setError(error.message); return }
    setLibrary(data || [])
  }

  // Add an exercise to today's plan (at the end)
  async function addExercise(exercise) {
    setSaving(true); setError(null)
    const nextOrder = planExercises.length > 0
      ? Math.max(...planExercises.map(p => p.sort_order)) + 1
      : 0
    const { data, error } = await supabase
      .from('plan_exercises')
      .insert({ day_key: activeDay, exercise_id: exercise.id, sort_order: nextOrder })
      .select('id, sort_order, exercise_id, exercises(id, name, day, category)')
      .single()
    if (error) setError(error.message)
    else setPlanExercises(prev => [...prev, data])
    setSaving(false)
  }

  // Remove an exercise from today's plan
  async function removeExercise(planId) {
    setSaving(true); setError(null)
    const { error } = await supabase.from('plan_exercises').delete().eq('id', planId)
    if (error) setError(error.message)
    else setPlanExercises(prev => prev.filter(p => p.id !== planId))
    setSaving(false)
  }

  // ── Drag and drop ───────────────────────────────────────────────────────────

  function onDragStart(index)  { dragItem.current = index }
  function onDragEnter(index)  { dragOverItem.current = index }

  function onDragEnd() {
    const items   = [...planExercises]
    const dragged = items.splice(dragItem.current, 1)[0]
    items.splice(dragOverItem.current, 0, dragged)
    const reordered = items.map((item, i) => ({ ...item, sort_order: i }))
    setPlanExercises(reordered)
    dragItem.current = null
    dragOverItem.current = null
    saveOrder(reordered)
  }

  async function saveOrder(items) {
    setSaving(true); setError(null)
    const updates = items.map(item => ({
      id: item.id,
      day_key: activeDay,
      exercise_id: item.exercise_id,
      sort_order: item.sort_order,
    }))
    const { error } = await supabase.from('plan_exercises').upsert(updates)
    if (error) setError(error.message)
    setSaving(false)
  }

  // ── Picker helpers ──────────────────────────────────────────────────────────

  const plannedIds      = new Set(planExercises.map(p => p.exercise_id))
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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Day tabs */}
      <div className="day-tabs">
        {SPLIT_DAYS.map(day => (
          <button
            key={day}
            onClick={() => { setActiveDay(day); setEditMode(false); setShowPicker(false) }}
            className={`day-tab ${activeDay === day ? 'active' : ''}`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Floor content */}
      <div style={{ padding: '24px', maxWidth: '640px', flex: 1, overflowY: 'auto' }}>

        {/* Day heading + edit toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <span className="section-label">{activeDay}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {saving && (
              <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Saving…</span>
            )}
            <button
              onClick={() => { setEditMode(e => !e); setShowPicker(false) }}
              className={`lift-btn ${editMode ? 'amber' : ''}`}
            >
              {editMode ? 'Done' : 'Edit Plan'}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            marginBottom: '16px',
            padding: '12px 16px',
            background: 'rgba(255,69,58,0.1)',
            border: '1px solid rgba(255,69,58,0.3)',
            borderRadius: '8px',
            fontSize: '13px',
            color: '#FF453A',
          }}>
            {error}
          </div>
        )}

        {/* Empty state */}
        {planExercises.length === 0 && (
          <p style={{ color: 'var(--text-dim)', fontSize: '14px', marginTop: '8px' }}>
            {editMode
              ? 'No exercises yet — click "+ Add Exercise" to start building this day.'
              : 'No exercises planned. Click "Edit Plan" to add some.'}
          </p>
        )}

        {/* Exercise list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {planExercises.map((item, index) => (
            <div
              key={item.id}
              className="exercise-row"
              draggable={editMode}
              onDragStart={() => onDragStart(index)}
              onDragEnter={() => onDragEnter(index)}
              onDragEnd={onDragEnd}
              onDragOver={e => e.preventDefault()}
              style={{ cursor: editMode ? 'grab' : 'default' }}
            >
              {/* Drag handle */}
              {editMode && (
                <span className="exercise-row__handle">⠿</span>
              )}

              {/* Exercise info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="exercise-row__name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.exercises?.name}
                </div>
                <div className="exercise-row__meta">{item.exercises?.category}</div>
              </div>

              {/* Remove button */}
              {editMode && (
                <button
                  className="exercise-row__remove"
                  onClick={() => removeExercise(item.id)}
                  title="Remove from plan"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add exercise button */}
        {editMode && (
          <button
            onClick={() => setShowPicker(p => !p)}
            style={{
              marginTop: '12px',
              width: '100%',
              padding: '14px',
              border: '1px dashed var(--steel-border)',
              borderRadius: '10px',
              background: 'transparent',
              color: 'var(--text-secondary)',
              fontSize: '13px',
              fontFamily: 'var(--font-dm-sans)',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.target.style.borderColor = 'var(--steel-mid)'; e.target.style.color = 'var(--text-primary)' }}
            onMouseLeave={e => { e.target.style.borderColor = 'var(--steel-border)'; e.target.style.color = 'var(--text-secondary)' }}
          >
            {showPicker ? 'Hide library ↑' : '+ Add Exercise'}
          </button>
        )}

        {/* Exercise picker */}
        {editMode && showPicker && (
          <div className="floor-card" style={{ marginTop: '12px', padding: 0, overflow: 'hidden' }}>

            {/* Search */}
            <div style={{ padding: '12px', borderBottom: '1px solid var(--steel-border)' }}>
              <input
                type="text"
                className="lift-input"
                placeholder="Search by name, day, or category…"
                value={pickerSearch}
                onChange={e => setPickerSearch(e.target.value)}
                autoFocus
              />
            </div>

            {/* Results */}
            <ul style={{ maxHeight: '280px', overflowY: 'auto', margin: 0, padding: 0, listStyle: 'none' }}>
              {filteredLibrary.length === 0 && (
                <li style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--text-dim)' }}>
                  No exercises match your search.
                </li>
              )}
              {filteredLibrary.map(ex => {
                const added = plannedIds.has(ex.id)
                return (
                  <li
                    key={ex.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 16px',
                      borderBottom: '1px solid var(--steel-border)',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '13px',
                        fontFamily: 'var(--font-dm-sans)',
                        color: added ? 'var(--text-dim)' : 'var(--text-primary)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {ex.name}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {ex.day} · {ex.category}
                      </div>
                    </div>
                    <button
                      onClick={() => !added && addExercise(ex)}
                      disabled={added}
                      style={{
                        padding: '4px 12px',
                        borderRadius: '6px',
                        border: added ? '1px solid var(--steel-dark)' : '1px solid var(--accent-amber-dim)',
                        background: 'transparent',
                        color: added ? 'var(--text-dim)' : 'var(--accent-amber)',
                        fontSize: '12px',
                        fontFamily: 'var(--font-dm-sans)',
                        cursor: added ? 'default' : 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {added ? 'Added' : 'Add'}
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
