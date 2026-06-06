import styles from './Celebration.module.css'

export default function Celebration({ coins, taskTitle }) {
  const confetti = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    emoji: ['🌸', '✨', '💕', '🎉', '⭐', '🌺'][i % 6],
    style: {
      left: `${10 + (i * 7)}%`,
      animationDelay: `${i * 0.08}s`,
      animationDuration: `${0.8 + Math.random() * 0.4}s`,
    }
  }))

  return (
    <div className={styles.overlay}>
      <div className={styles.confettiContainer}>
        {confetti.map(c => (
          <span key={c.id} className={styles.confetti} style={c.style}>{c.emoji}</span>
        ))}
      </div>

      <div className={styles.bubble}>
        <div className={styles.topEmoji}>🎉</div>
        <div className={styles.bloomText}>You're blooming!</div>
        <div className={styles.coinsEarned}>+{coins} 🪙</div>
        <div className={styles.taskName}>{taskTitle}</div>
        <div className={styles.subtext}>Task completed! Keep going! 💕</div>
      </div>
    </div>
  )
}
