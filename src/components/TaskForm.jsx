import { useState, useEffect } from 'react'
import styles from './TaskForm.module.css'

const PRIORITIES = [
  { key: 'urgent', label: 'Urgent', icon: '🔥', coins: 50, color: '#FF6B9D', bg: '#FFF0F6' },
  { key: 'high',   label: 'High',   icon: '⚡', coins: 30, color: '#FF8C42', bg: '#FFF7ED' },
  { key: 'medium', label: 'Medium', icon: '✨', coins: 20, color: '#A78BFA', bg: '#F5F3FF' },
  { key: 'low',    label: 'Low',    icon: '🌸', coins: 10, color: '#10B981', bg: '#ECFDF5' },
]

const CATEGORIES = ['Work', 'Personal', 'Health', 'Study', 'Creative', 'Social', 'Finance', 'Travel']
const MOODS = ['🌸', '✨', '💕', '🌺', '🦋', '💫', '🌷', '🎀', '🌼', '🍓', '🌙', '🌈']

const EMPTY_FORM = {
  title: '',
  category: 'Personal',
  priority: 'medium',
  dueDate: '',
  dueTime: '',
  notes: '',
  mood: '🌸',
}

export default function TaskForm({ editTask, onSave, onClose, calendarConnected }) {
  const [form, setForm] = useState(EMPTY_FORM)

  useEffect(() => {
    if (editTask) {
      setForm({
        title: editTask.title || '',
        category: editTask.category || 'Personal',
        priority: editTask.priority || 'medium',
        dueDate: editTask.dueDate || '',
        dueTime: editTask.dueTime || '',
        notes: editTask.notes || '',
        mood: editTask.mood || '🌸',
      })
    } else {
      setForm(EMPTY_FORM)
    }
  }, [editTask])

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleSave = () => {
    if (!form.title.trim()) return
    onSave(form)
  }

  const selectedPriority = PRIORITIES.find(p => p.key === form.priority)

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <span className={styles.title}>
            {editTask ? '✏️ Edit Task' : '✨ New Task'}
          </span>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Title */}
        <div className={styles.field}>
          <label className={styles.label}>Task Title *</label>
          <input
            className={styles.input}
            placeholder="What do you want to bloom? 🌸"
            value={form.title}
            onChange={e => set('title', e.target.value)}
            autoFocus
            onKeyDown={e => e.key === 'Enter' && handleSave()}
          />
        </div>

        {/* Category + Date + Time row */}
        <div className={styles.row2}>
          <div className={styles.field}>
            <label className={styles.label}>Category</label>
            <select className={styles.select} value={form.category} onChange={e => set('category', e.target.value)}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Due Date</label>
            <input
              type="date"
              className={styles.input}
              value={form.dueDate}
              min={new Date().toISOString().slice(0, 10)}
              onChange={e => set('dueDate', e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Time (Optional)</label>
            <input
              type="time"
              className={styles.input}
              value={form.dueTime}
              onChange={e => set('dueTime', e.target.value)}
            />
          </div>
        </div>

        {/* Priority */}
        <div className={styles.field}>
          <label className={styles.label}>
            Priority
            {selectedPriority && (
              <span className={styles.coinsHint}>
                Complete for 🪙 {selectedPriority.coins} coins
              </span>
            )}
          </label>
          <div className={styles.priorityGrid}>
            {PRIORITIES.map(p => (
              <button
                key={p.key}
                className={`${styles.priorityBtn} ${form.priority === p.key ? styles.priorityActive : ''}`}
                style={{
                  '--p-color': p.color,
                  '--p-bg': p.bg,
                  borderColor: form.priority === p.key ? p.color : 'rgba(255,182,213,0.3)',
                  background: form.priority === p.key ? p.bg : 'white',
                }}
                onClick={() => set('priority', p.key)}
              >
                <span className={styles.priorityIcon}>{p.icon}</span>
                <span className={styles.priorityLabel} style={{ color: form.priority === p.key ? p.color : '#94A3B8' }}>
                  {p.label}
                </span>
                <span className={styles.priorityCoins}>+{p.coins} 🪙</span>
              </button>
            ))}
          </div>
        </div>

        {/* Mood */}
        <div className={styles.field}>
          <label className={styles.label}>Mood Emoji</label>
          <div className={styles.moodRow}>
            {MOODS.map(m => (
              <button
                key={m}
                className={`${styles.moodBtn} ${form.mood === m ? styles.moodActive : ''}`}
                onClick={() => set('mood', m)}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className={styles.field}>
          <label className={styles.label}>Notes</label>
          <textarea
            className={styles.textarea}
            placeholder="Details, inspiration, or reminders... 💭"
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
            rows={3}
          />
        </div>

        {/* Calendar info */}
        {calendarConnected && form.dueDate && (
          <div className={styles.calInfo}>
            <span>📅</span>
            <span>This task will be added to your Google Calendar with smart reminders!</span>
          </div>
        )}
        {!calendarConnected && (
          <div className={styles.calWarning}>
            <span>💡</span>
            <span>Connect Google Calendar (after saving) to get real reminders!</span>
          </div>
        )}

        {/* Buttons */}
        <div className={styles.btnRow}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button
            className={styles.saveBtn}
            onClick={handleSave}
            disabled={!form.title.trim()}
          >
            {editTask ? '💕 Update Task' : '✨ Create Task'}
          </button>
        </div>
      </div>
    </div>
  )
}
