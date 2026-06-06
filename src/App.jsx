import { useState, useCallback } from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import toast, { Toaster } from 'react-hot-toast'

import { useLocalStorage } from './hooks/useLocalStorage'
import { getTimeLabel, isToday, formatDate } from './hooks/useTimeLabel'
import {
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
  completeCalendarEvent,
} from './googleCalendar'

import FloatingPetals from './components/FloatingPetals'
import TaskForm from './components/TaskForm'
import TaskCard from './components/TaskCard'
import Celebration from './components/Celebration'

// ─── Constants ───────────────────────────────────────────────────────────────

const PRIORITY_META = {
  urgent: { icon: '🔥', label: 'Urgent', color: '#FF6B9D', coins: 50 },
  high:   { icon: '⚡', label: 'High',   color: '#FF8C42', coins: 30 },
  medium: { icon: '✨', label: 'Medium', color: '#A78BFA', coins: 20 },
  low:    { icon: '🌸', label: 'Low',    color: '#10B981', coins: 10 },
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  // Persistent state
  const [tasks, setTasks] = useLocalStorage('bloom_tasks', [
    {
      id: 'demo1',
      title: 'Design my vision board',
      category: 'Creative',
      priority: 'high',
      dueDate: new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10),
      done: false,
      coins: 30,
      notes: 'Use magazine cutouts, pink aesthetic 🎀',
      mood: '🎀',
      calendarEventId: null,
      createdAt: Date.now(),
    },
    {
      id: 'demo2',
      title: 'Morning yoga & journaling',
      category: 'Health',
      priority: 'medium',
      dueDate: new Date().toISOString().slice(0, 10),
      done: false,
      coins: 20,
      notes: '15 min yoga then gratitude journal',
      mood: '🌸',
      calendarEventId: null,
      createdAt: Date.now() - 1000,
    },
  ])
  const [coins, setCoins] = useLocalStorage('bloom_coins', 42)
  const [accessToken, setAccessToken] = useLocalStorage('bloom_gtoken', null)
  const [userInfo, setUserInfo] = useLocalStorage('bloom_user', null)

  // Ephemeral UI state
  const [view, setView] = useState('all')        // all | today | done
  const [filterPriority, setFilterPriority] = useState('all')
  const [sortBy, setSortBy] = useState('due')    // due | priority | new
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('tasks') // tasks | reminders | stats
  const [showForm, setShowForm] = useState(false)
  const [editTask, setEditTask] = useState(null)
  const [celebration, setCelebration] = useState(null) // { coins, title }
  const [calLoading, setCalLoading] = useState(false)

  // ─── Google OAuth login ───────────────────────────────────────────────────

  const googleLogin = useGoogleLogin({
    scope: [
      'https://www.googleapis.com/auth/calendar.events',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ].join(' '),
    onSuccess: async (tokenResponse) => {
      setAccessToken(tokenResponse.access_token)
      // Fetch user info
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        })
        const info = await res.json()
        setUserInfo({ name: info.given_name || info.name, email: info.email, picture: info.picture })
        toast.success(`Welcome, ${info.given_name || 'lovely'}! 🌸 Calendar connected!`)

        // Backfill existing tasks with due dates into Calendar
        const pendingWithDates = tasks.filter(t => !t.done && t.dueDate && !t.calendarEventId)
        if (pendingWithDates.length > 0) {
          toast.loading(`Syncing ${pendingWithDates.length} existing tasks to Calendar...`, { duration: 3000 })
          for (const task of pendingWithDates) {
            try {
              const event = await createCalendarEvent(task, tokenResponse.access_token)
              setTasks(ts => ts.map(t => t.id === task.id ? { ...t, calendarEventId: event.id } : t))
            } catch { /* skip failed ones */ }
          }
        }
      } catch {
        toast.success('Google Calendar connected! 📅')
      }
    },
    onError: () => toast.error('Google sign-in failed. Try again.'),
  })

  const disconnectGoogle = () => {
    setAccessToken(null)
    setUserInfo(null)
    toast('Disconnected from Google Calendar', { icon: '👋' })
  }

  // ─── CRUD ─────────────────────────────────────────────────────────────────

  const handleSaveTask = useCallback(async (formData) => {
    console.log("FORM DATA:", formData)
    const isEdit = !!editTask

    if (isEdit) {
      // Update existing
      const updated = {
        ...editTask,
        ...formData,
        coins: PRIORITY_META[formData.priority].coins,
      }
      setTasks(ts => ts.map(t => t.id === editTask.id ? updated : t))
      
      // Update calendar event if synced
      if (editTask.calendarEventId && accessToken) {
        setCalLoading(true)
        try {
          await updateCalendarEvent(editTask.calendarEventId, updated, accessToken)
          toast.success('Task & Calendar event updated! 📅')
        } catch {
          toast.success('Task updated! (Calendar sync failed)')
        } finally {
          setCalLoading(false)
        }
      } else {
        toast.success('Task updated! 💕')
      }
    } else {
      // Create new
      const newTask = {
        ...formData,
        id: `task_${Date.now()}`,
        done: false,
        coins: PRIORITY_META[formData.priority].coins,
        calendarEventId: null,
        createdAt: Date.now(),
      }
      setTasks(ts => [newTask, ...ts])

      // Sync to Google Calendar if connected and has a due date
      if (accessToken && formData.dueDate) {
        setCalLoading(true)
        try {
          const event = await createCalendarEvent(newTask, accessToken)
          setTasks(ts => ts.map(t => t.id === newTask.id ? { ...t, calendarEventId: event.id } : t))
          toast.success('Task created & synced to Google Calendar! 📅✨', { duration: 4000 })
        } catch (err) {
          console.error('Calendar sync error:', err)
          toast.success('Task created! (Calendar sync failed — check token)')
        } finally {
          setCalLoading(false)
        }
      } else if (accessToken && !formData.dueDate) {
        toast.success('Task created! Add a due date to sync to Calendar 📅')
      } else {
        toast.success('Task created! ✨ Connect Google Calendar for reminders 📅')
      }
    }

    setShowForm(false)
    setEditTask(null)
  }, [editTask, accessToken, setTasks])

  const handleToggleDone = useCallback(async (task) => {
    const nowDone = !task.done

    setTasks(ts => ts.map(t => t.id === task.id ? { ...t, done: nowDone } : t))

    if (nowDone) {
      // Celebrate!
      setCoins(c => c + task.coins)
      setCelebration({ coins: task.coins, title: task.title })
      setTimeout(() => setCelebration(null), 2800)

      // Mark event as done in Calendar
      if (task.calendarEventId && accessToken) {
        try {
          await completeCalendarEvent(task.calendarEventId, task.title, accessToken)
        } catch { /* silent */ }
      }
    } else {
      // Unmark — deduct coins
      setCoins(c => Math.max(0, c - task.coins))
      toast('Task unmarked ✏️', { icon: '🔄' })
    }
  }, [accessToken, setCoins, setTasks])

  const handleDelete = useCallback(async (task) => {
    setTasks(ts => ts.filter(t => t.id !== task.id))

    // Delete from Calendar
    if (task.calendarEventId && accessToken) {
      try {
        await deleteCalendarEvent(task.calendarEventId, accessToken)
        toast('Task & Calendar event deleted 🗑', { icon: '🌸' })
      } catch {
        toast('Task deleted 🗑', { icon: '🌸' })
      }
    } else {
      toast('Task deleted 🌸')
    }
  }, [accessToken, setTasks])

  const openEdit = (task) => {
    setEditTask(task)
    setShowForm(true)
  }

  const openAdd = () => {
    setEditTask(null)
    setShowForm(true)
  }

  // ─── Derived data ─────────────────────────────────────────────────────────

  const todayTasks = tasks.filter(t => isToday(t.dueDate) && !t.done)
  const urgentReminders = tasks
    .filter(t => !t.done && t.dueDate)
    .map(t => ({ ...t, timeInfo: getTimeLabel(t.dueDate) }))
    .filter(t => t.timeInfo && ['overdue', 'critical', 'today', 'soon'].includes(t.timeInfo.level))
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))

  const filteredTasks = tasks
    .filter(t => {
      if (view === 'today') return isToday(t.dueDate) && !t.done
      if (view === 'done')  return t.done
      return !t.done
    })
    .filter(t => filterPriority === 'all' || t.priority === filterPriority)
    .filter(t => {
      if (!searchQuery) return true
      const q = searchQuery.toLowerCase()
      return t.title.toLowerCase().includes(q) || t.category.toLowerCase().includes(q) || (t.notes || '').toLowerCase().includes(q)
    })
    .sort((a, b) => {
      if (sortBy === 'due') return (a.dueDate || 'z') < (b.dueDate || 'z') ? -1 : 1
      if (sortBy === 'priority') {
        const order = { urgent: 0, high: 1, medium: 2, low: 3 }
        return order[a.priority] - order[b.priority]
      }
      return b.createdAt - a.createdAt
    })

  const totalDone = tasks.filter(t => t.done).length
  const totalAll  = tasks.length
  const progressPct = totalAll ? Math.round((totalDone / totalAll) * 100) : 0
  const coinsAvailable = tasks.filter(t => !t.done).reduce((s, t) => s + t.coins, 0)

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <FloatingPetals />

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: 'Nunito, sans-serif',
            fontWeight: 600,
            borderRadius: '14px',
            border: '1px solid rgba(255,182,213,0.3)',
            boxShadow: '0 8px 24px rgba(255,107,157,0.15)',
          },
        }}
      />

      {/* ── Header ── */}
      <header style={S.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={S.logo}>bloom<span style={{ color: '#A78BFA' }}>tasks</span></span>
          <span style={{ fontSize: '22px' }}>🌸</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Tab navigation */}
          <div style={S.navTabs}>
            {[['tasks', '✨ Tasks'], ['reminders', '⏰ Alerts'], ['stats', '📊 Stats']].map(([t, l]) => (
              <button key={t} style={{ ...S.tabBtn, ...(activeTab === t ? S.tabActive : {}) }} onClick={() => setActiveTab(t)}>
                {l}
                {t === 'reminders' && urgentReminders.length > 0 && (
                  <span style={S.alertBadge}>{urgentReminders.length}</span>
                )}
              </button>
            ))}
          </div>

          {/* Coins */}
          <div style={S.coinBadge}>🪙 {coins.toLocaleString()}</div>

          {/* Google Account */}
          {userInfo ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {userInfo.picture && (
                <img src={userInfo.picture} alt={userInfo.name} style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #FF6B9D' }} />
              )}
              <div style={{ fontSize: '12px', lineHeight: 1.3 }}>
                <div style={{ fontWeight: 700, color: '#2D1B3D' }}>{userInfo.name}</div>
                <button onClick={disconnectGoogle} style={{ ...S.linkBtn, color: '#94A3B8' }}>Disconnect</button>
              </div>
            </div>
          ) : (
            <button style={S.calConnectBtn} onClick={() => googleLogin()}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Connect Calendar
            </button>
          )}
        </div>
      </header>

      {/* ── Main Content ── */}
      <main style={S.main}>

        {/* ── TASKS TAB ── */}
        {activeTab === 'tasks' && (
          <>
            {/* Today Banner */}
            {todayTasks.length > 0 && view !== 'done' && (
              <div style={S.todayBanner}>
                <div>
                  <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '18px', color: '#FF6B9D', marginBottom: '4px' }}>
                    🌸 Today's Bloom List — {todayTasks.length} {todayTasks.length === 1 ? 'task' : 'tasks'}
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748B' }}>
                    Complete all to earn <strong style={{ color: '#F59E0B' }}>🪙 {todayTasks.reduce((s, t) => s + t.coins, 0)} coins!</strong>
                  </div>
                </div>
                <div style={{ fontSize: '28px' }}>☀️</div>
              </div>
            )}

            {/* Calendar banner if not connected */}
            {!accessToken && (
              <div style={S.calBanner}>
                <span style={{ fontSize: '24px' }}>📅</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: '14px', color: '#4338CA' }}>Connect Google Calendar for real reminders!</div>
                  <div style={{ fontSize: '12px', color: '#6366F1', marginTop: '2px' }}>Tasks with due dates will appear as calendar events with pop-up notifications</div>
                </div>
                <button style={S.calBannerBtn} onClick={() => googleLogin()}>Connect 📅</button>
              </div>
            )}

            {calLoading && (
              <div style={{ ...S.calBanner, background: 'linear-gradient(135deg, #EEF2FF, #F5F3FF)' }}>
                <span style={{ fontSize: '20px' }}>⏳</span>
                <span style={{ fontSize: '13px', color: '#4F46E5', fontWeight: 600 }}>Syncing with Google Calendar...</span>
              </div>
            )}

            {/* View + Add row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[['all', 'All Tasks'], ['today', 'Today 🌸'], ['done', 'Done ✅']].map(([v, l]) => (
                  <button key={v} style={{ ...S.pillBtn, ...(view === v ? S.pillActive : {}) }} onClick={() => setView(v)}>{l}</button>
                ))}
              </div>
              <button style={S.addBtn} onClick={openAdd}>＋ New Task</button>
            </div>

            {/* Search */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
              <input
                style={S.searchInput}
                placeholder="🔍 Search tasks..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700 }}>SORT:</span>
                {[['due', '📅 Due'], ['priority', '⚡ Priority'], ['new', '✨ New']].map(([v, l]) => (
                  <button key={v} style={{ ...S.pillBtn, ...(sortBy === v ? S.pillActive : {}), fontSize: '11px' }} onClick={() => setSortBy(v)}>{l}</button>
                ))}
              </div>
            </div>

            {/* Priority filter */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '18px', flexWrap: 'wrap' }}>
              <button style={{ ...S.pillBtn, ...(filterPriority === 'all' ? S.pillActive : {}), fontSize: '11px' }} onClick={() => setFilterPriority('all')}>All</button>
              {Object.entries(PRIORITY_META).map(([k, p]) => (
                <button key={k} style={{ ...S.pillBtn, ...(filterPriority === k ? S.pillActive : {}), fontSize: '11px' }} onClick={() => setFilterPriority(k)}>
                  {p.icon} {p.label}
                </button>
              ))}
            </div>

            {/* Task list */}
            {filteredTasks.length === 0 ? (
              <div style={S.emptyState}>
                <div style={{ fontSize: '52px', marginBottom: '12px' }}>🌺</div>
                <div style={{ fontWeight: 800, fontSize: '16px', color: '#C4A4C8' }}>
                  {view === 'done' ? 'No completed tasks yet' : view === 'today' ? "Nothing due today! 🌸" : 'No tasks here!'}
                </div>
                <div style={{ fontSize: '13px', marginTop: '6px', color: '#D4B8D8' }}>
                  {view === 'done' ? 'Complete tasks to earn coins 🪙' : 'Add your first task to start blooming ✨'}
                </div>
                {view !== 'done' && (
                  <button style={{ ...S.addBtn, marginTop: '18px' }} onClick={openAdd}>＋ Add Task</button>
                )}
              </div>
            ) : filteredTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={handleToggleDone}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            ))}
          </>
        )}

        {/* ── REMINDERS TAB ── */}
        {activeTab === 'reminders' && (
          <>
            <div style={S.sectionTitle}>⏰ Smart Reminders</div>

            {urgentReminders.length === 0 ? (
              <div style={S.emptyState}>
                <div style={{ fontSize: '52px', marginBottom: '12px' }}>🌸</div>
                <div style={{ fontWeight: 800, color: '#C4A4C8' }}>All clear!</div>
                <div style={{ fontSize: '13px', color: '#D4B8D8', marginTop: '6px' }}>No urgent tasks right now 💕</div>
              </div>
            ) : urgentReminders.map(task => (
              <div key={task.id} style={{ ...S.reminderCard, borderLeftColor: task.timeInfo.color }}>
                <span style={{ fontSize: '26px' }}>{task.timeInfo.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: '15px', color: '#2D1B3D' }}>{task.title}</div>
                  <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '3px' }}>
                    {task.category} · {PRIORITY_META[task.priority].icon} {PRIORITY_META[task.priority].label}
                  </div>
                  <div style={{ fontSize: '12px', color: '#A78BFA', marginTop: '2px' }}>{task.timeInfo.sublabel}</div>
                  {task.calendarEventId && (
                    <div style={{ fontSize: '11px', color: '#4F46E5', marginTop: '3px', fontWeight: 700 }}>
                      📅 Synced to Google Calendar — you'll get a pop-up reminder!
                    </div>
                  )}
                  {!task.calendarEventId && (
                    <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '3px' }}>
                      Connect Google Calendar to get pop-up reminders
                    </div>
                  )}
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontWeight: 800, color: task.timeInfo.color, fontSize: '13px' }}>{task.timeInfo.text}</div>
                  <div style={{ fontSize: '11px', background: '#FEF3C7', color: '#78350F', padding: '2px 8px', borderRadius: '20px', marginTop: '4px', fontWeight: 700 }}>
                    🪙 +{task.coins}
                  </div>
                </div>
              </div>
            ))}

            {/* Today's mission */}
            {todayTasks.length > 0 && (
              <div style={{ ...S.todayBanner, marginTop: '20px', flexDirection: 'column', alignItems: 'flex-start' }}>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '18px', color: '#FF6B9D', marginBottom: '12px' }}>
                  ✨ Today's Mission
                </div>
                {todayTasks.map(t => (
                  <div key={t.id} style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,182,213,0.2)', width: '100%', fontSize: '14px' }}>
                    <span>{t.mood || '🌸'}</span>
                    <span style={{ flex: 1, fontWeight: 700, color: '#2D1B3D' }}>{t.title}</span>
                    <span style={{ fontSize: '11px', background: '#FEF3C7', color: '#78350F', padding: '3px 10px', borderRadius: '20px', fontWeight: 700 }}>🪙 +{t.coins}</span>
                  </div>
                ))}
                <div style={{ marginTop: '10px', fontSize: '13px', color: '#FF6B9D', fontWeight: 700 }}>
                  Complete all → earn 🪙 {todayTasks.reduce((s, t) => s + t.coins, 0)} coins! 🎉
                </div>
              </div>
            )}

            {/* How reminders work */}
            <div style={{ ...S.calBanner, marginTop: '16px', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
              <div style={{ fontWeight: 800, fontSize: '14px', color: '#4338CA' }}>📅 How Google Calendar reminders work</div>
              <div style={{ fontSize: '13px', color: '#6366F1', lineHeight: 1.6 }}>
                When you add a task with a due date and Google Calendar is connected, BloomTasks creates a calendar event with automatic pop-up notifications:
              </div>
              <div style={{ fontSize: '12px', color: '#4F46E5', lineHeight: 1.8 }}>
                🔥 <strong>Urgent tasks</strong> — reminders at 2 hours, 1 day, and 2 days before<br/>
                ⚡ <strong>High priority</strong> — reminders at 4 hours, 1 day, and 2 days before<br/>
                ✨ <strong>Medium priority</strong> — reminders at 8 hours and 2 days before<br/>
                🌸 <strong>Low priority</strong> — reminder 1 day before
              </div>
              {!accessToken && (
                <button style={S.calBannerBtn} onClick={() => googleLogin()}>Connect Google Calendar →</button>
              )}
            </div>
          </>
        )}

        {/* ── STATS TAB ── */}
        {activeTab === 'stats' && (
          <>
            <div style={S.sectionTitle}>📊 Your Stats</div>

            {/* Stats grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '20px' }}>
              {[
                { num: tasks.filter(t => !t.done).length, label: 'Pending', color: '#FF6B9D' },
                { num: totalDone, label: 'Completed', color: '#10B981' },
                { num: `🪙 ${coins}`, label: 'Coins Earned', color: '#F59E0B' },
                { num: coinsAvailable, label: 'Coins Available', color: '#A78BFA' },
              ].map((s, i) => (
                <div key={i} style={S.statCard}>
                  <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '28px', color: s.color }}>{s.num}</div>
                  <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '4px' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Overall progress */}
            <div style={S.glassCard}>
              <div style={{ fontWeight: 800, fontSize: '15px', color: '#2D1B3D', marginBottom: '10px' }}>Overall Progress 🌸</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#94A3B8', marginBottom: '8px' }}>
                <span>{totalDone} of {totalAll} tasks done</span>
                <span style={{ fontWeight: 800, color: '#FF6B9D' }}>{progressPct}%</span>
              </div>
              <div style={S.progressBg}><div style={{ ...S.progressBar, width: `${progressPct}%` }} /></div>
            </div>

            {/* By category */}
            <div style={{ ...S.glassCard, marginTop: '12px' }}>
              <div style={{ fontWeight: 800, fontSize: '15px', color: '#2D1B3D', marginBottom: '14px' }}>By Category 💕</div>
              {['Work', 'Personal', 'Health', 'Study', 'Creative', 'Social', 'Finance', 'Travel'].map(cat => {
                const catTasks = tasks.filter(t => t.category === cat)
                if (catTasks.length === 0) return null
                const donePct = Math.round((catTasks.filter(t => t.done).length / catTasks.length) * 100)
                return (
                  <div key={cat} style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '5px' }}>
                      <span style={{ fontWeight: 700, color: '#4A3060' }}>{cat}</span>
                      <span style={{ color: '#94A3B8' }}>{catTasks.filter(t => t.done).length}/{catTasks.length}</span>
                    </div>
                    <div style={S.progressBg}><div style={{ ...S.progressBar, width: `${donePct}%` }} /></div>
                  </div>
                )
              })}
            </div>

            {/* Calendar status */}
            <div style={{ ...S.glassCard, marginTop: '12px' }}>
              <div style={{ fontWeight: 800, fontSize: '15px', color: '#2D1B3D', marginBottom: '12px' }}>Google Calendar 📅</div>
              {accessToken ? (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    {userInfo?.picture && <img src={userInfo.picture} alt="" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />}
                    <div>
                      <div style={{ fontWeight: 700, color: '#2D1B3D' }}>{userInfo?.name || 'Connected'}</div>
                      <div style={{ fontSize: '12px', color: '#94A3B8' }}>{userInfo?.email}</div>
                    </div>
                    <span style={{ marginLeft: 'auto', fontSize: '11px', background: '#DCFCE7', color: '#166534', padding: '4px 10px', borderRadius: '20px', fontWeight: 700 }}>✓ Connected</span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748B' }}>
                    {tasks.filter(t => t.calendarEventId).length} tasks synced to your calendar
                  </div>
                  <button onClick={disconnectGoogle} style={{ ...S.linkBtn, marginTop: '8px', color: '#EF4444', fontSize: '13px' }}>
                    Disconnect Google Calendar
                  </button>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '12px' }}>Not connected. Connect to sync tasks and get reminders!</div>
                  <button style={S.calBannerBtn} onClick={() => googleLogin()}>
                    Connect Google Calendar
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* ── Task Form Modal ── */}
      {showForm && (
        <TaskForm
          editTask={editTask}
          onSave={handleSaveTask}
          onClose={() => { setShowForm(false); setEditTask(null) }}
          calendarConnected={!!accessToken}
        />
      )}

      {/* ── Celebration ── */}
      {celebration && (
        <Celebration coins={celebration.coins} taskTitle={celebration.title} />
      )}
    </div>
  )
}

// ─── Styles object ────────────────────────────────────────────────────────────

const S = {
  header: {
    background: 'rgba(255, 255, 255, 0.75)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255, 182, 213, 0.3)',
    padding: '14px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    flexWrap: 'wrap',
    gap: '10px',
  },
  logo: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: '26px',
    color: '#FF6B9D',
    letterSpacing: '-0.5px',
  },
  navTabs: {
    display: 'flex',
    gap: '4px',
    padding: '4px',
    background: 'rgba(255,255,255,0.7)',
    borderRadius: '14px',
    border: '1px solid rgba(255,182,213,0.2)',
  },
  tabBtn: {
    padding: '8px 16px',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    fontFamily: "'Nunito', sans-serif",
    fontWeight: 700,
    fontSize: '13px',
    transition: 'all 0.2s',
    background: 'transparent',
    color: '#94A3B8',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  tabActive: {
    background: 'white',
    color: '#FF6B9D',
    boxShadow: '0 2px 10px rgba(255,107,157,0.2)',
  },
  alertBadge: {
    background: '#FF6B9D',
    color: 'white',
    borderRadius: '10px',
    padding: '1px 6px',
    fontSize: '10px',
    fontWeight: 800,
  },
  coinBadge: {
    background: 'linear-gradient(135deg, #FDE68A, #F59E0B)',
    color: '#78350F',
    padding: '7px 14px',
    borderRadius: '20px',
    fontWeight: 800,
    fontSize: '14px',
    boxShadow: '0 2px 12px rgba(245,158,11,0.3)',
  },
  calConnectBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    background: 'white',
    border: '1.5px solid rgba(99,102,241,0.3)',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: 700,
    color: '#4338CA',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 2px 8px rgba(99,102,241,0.1)',
  },
  linkBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: "'Nunito', sans-serif",
    fontWeight: 700,
    display: 'block',
  },
  main: {
    maxWidth: '860px',
    margin: '0 auto',
    padding: '24px 16px 100px',
    position: 'relative',
    zIndex: 1,
  },
  sectionTitle: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: '22px',
    color: '#2D1B3D',
    marginBottom: '16px',
  },
  todayBanner: {
    background: 'linear-gradient(135deg, rgba(255,107,157,0.08), rgba(167,139,250,0.08))',
    border: '1.5px solid rgba(255,107,157,0.2)',
    borderRadius: '18px',
    padding: '16px 20px',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  calBanner: {
    background: 'linear-gradient(135deg, #EEF2FF, #F5F3FF)',
    border: '1px solid rgba(99,102,241,0.2)',
    borderRadius: '16px',
    padding: '14px 18px',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  calBannerBtn: {
    padding: '9px 18px',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 800,
    fontSize: '13px',
    fontFamily: "'Nunito', sans-serif",
    whiteSpace: 'nowrap',
  },
  addBtn: {
    background: 'linear-gradient(135deg, #FF6B9D, #FF8C42)',
    color: 'white',
    border: 'none',
    borderRadius: '14px',
    padding: '12px 22px',
    cursor: 'pointer',
    fontFamily: "'Nunito', sans-serif",
    fontWeight: 800,
    fontSize: '14px',
    boxShadow: '0 4px 16px rgba(255,107,157,0.4)',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  pillBtn: {
    padding: '8px 14px',
    borderRadius: '20px',
    border: '1.5px solid rgba(255,182,213,0.35)',
    background: 'white',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 700,
    fontFamily: "'Nunito', sans-serif",
    transition: 'all 0.2s',
    color: '#64748B',
  },
  pillActive: {
    background: 'linear-gradient(135deg, #FF6B9D, #A78BFA)',
    color: 'white',
    borderColor: 'transparent',
    boxShadow: '0 2px 10px rgba(255,107,157,0.3)',
  },
  searchInput: {
    flex: 1,
    minWidth: '180px',
    padding: '11px 16px',
    borderRadius: '14px',
    border: '1.5px solid rgba(255,182,213,0.35)',
    background: 'white',
    fontFamily: "'Nunito', sans-serif",
    fontSize: '14px',
    outline: 'none',
  },
  emptyState: {
    textAlign: 'center',
    padding: '56px 20px',
    color: '#C4A4C8',
  },
  reminderCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '14px 18px',
    marginBottom: '10px',
    borderLeft: '5px solid',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    transition: 'transform 0.2s',
  },
  statCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '16px',
    border: '1px solid rgba(255,182,213,0.2)',
    boxShadow: '0 2px 12px rgba(255,107,157,0.05)',
  },
  glassCard: {
    background: 'rgba(255,255,255,0.8)',
    backdropFilter: 'blur(12px)',
    borderRadius: '18px',
    padding: '18px 20px',
    border: '1px solid rgba(255,182,213,0.25)',
    boxShadow: '0 2px 16px rgba(255,107,157,0.05)',
  },
  progressBg: {
    background: 'rgba(255,182,213,0.2)',
    borderRadius: '10px',
    height: '8px',
    overflow: 'hidden',
  },
  progressBar: {
    background: 'linear-gradient(90deg, #FF6B9D, #A78BFA)',
    height: '100%',
    borderRadius: '10px',
    transition: 'width 0.5s ease',
  },
}
