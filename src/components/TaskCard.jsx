import { getTimeLabel, formatDate } from '../hooks/useTimeLabel'
import styles from './TaskCard.module.css'

const PRIORITY_META = {
  urgent: { icon: '🔥', label: 'Urgent', color: '#FF6B9D', bg: '#FFF0F6' },
  high:   { icon: '⚡', label: 'High',   color: '#FF8C42', bg: '#FFF7ED' },
  medium: { icon: '✨', label: 'Medium', color: '#A78BFA', bg: '#F5F3FF' },
  low:    { icon: '🌸', label: 'Low',    color: '#10B981', bg: '#ECFDF5' },
}

export default function TaskCard({ task, onToggle, onEdit, onDelete }) {
  const p = PRIORITY_META[task.priority] || PRIORITY_META.medium
  const timeInfo = getTimeLabel(task.dueDate)

  return (
    <div
      className={`${styles.card} ${task.done ? styles.done : ''}`}
      style={{ '--accent': p.color }}
    >
      <div className={styles.accentBar} style={{ background: p.color }} />

      <div className={styles.inner}>
        {/* Check button */}
        <button
          className={`${styles.checkBtn} ${task.done ? styles.checked : ''}`}
          onClick={() => onToggle(task)}
          style={{ '--c': p.color }}
          title={task.done ? 'Mark incomplete' : 'Mark complete'}
        >
          {task.done && <span className={styles.checkMark}>✓</span>}
        </button>

        {/* Content */}
        <div className={styles.content}>
          <div className={styles.titleRow}>
            <span className={styles.moodEmoji}>{task.mood || '🌸'}</span>
            <span className={`${styles.title} ${task.done ? styles.titleDone : ''}`}>
              {task.title}
            </span>
          </div>

          {task.notes && (
            <p className={styles.notes}>{task.notes}</p>
          )}

          <div className={styles.metaRow}>
            {/* Priority */}
            <span className={styles.badge} style={{ background: p.bg, color: p.color }}>
              {p.icon} {p.label}
            </span>

            {/* Category */}
            <span className={styles.badge} style={{ background: '#F5F3FF', color: '#7C3AED' }}>
              🏷 {task.category}
            </span>

            {/* Due date */}
            {task.dueDate && (
              <span className={styles.badge} style={{ background: '#FFF0F6', color: '#FF6B9D' }}>
                📅 {formatDate(task.dueDate)}
              </span>
            )}

            {/* Time label */}
            {timeInfo && !task.done && (
              <span
                className={styles.timeChip}
                style={{ background: timeInfo.bg, color: timeInfo.color }}
              >
                {timeInfo.icon} {timeInfo.text}
              </span>
            )}

            {/* Coins */}
            <span className={styles.coinsChip}>
              🪙 {task.done ? `Earned ${task.coins}` : `+${task.coins}`}
            </span>

            {/* Calendar synced */}
            {task.calendarEventId && (
              <span className={styles.badge} style={{ background: '#EEF2FF', color: '#4F46E5' }}>
                📅 Synced
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          {!task.done && (
            <button className={styles.actionBtn} onClick={() => onEdit(task)} title="Edit">
              ✏️
            </button>
          )}
          <button className={styles.actionBtn} onClick={() => onDelete(task)} title="Delete">
            🗑
          </button>
        </div>
      </div>
    </div>
  )
}
