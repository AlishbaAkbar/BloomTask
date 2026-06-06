import { useMemo } from 'react'

const EMOJIS = ['🌸', '🌺', '✨', '💕', '🦋', '🌷', '💫', '🎀', '🌼']

export default function FloatingPetals() {
  const petals = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 12}s`,
      duration: `${8 + Math.random() * 10}s`,
      size: `${10 + Math.random() * 14}px`,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
    })), [])

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {petals.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: p.left,
            top: '-30px',
            fontSize: p.size,
            opacity: 0.45,
            animation: `floatPetal ${p.duration} ${p.delay} infinite linear`,
          }}
        >
          {p.emoji}
        </div>
      ))}
    </div>
  )
}
