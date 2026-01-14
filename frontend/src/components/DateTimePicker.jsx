import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

function DateTimePicker({ value, onChange, onClose, anchorRef, containerRef }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null)
  const [hour, setHour] = useState(selectedDate ? selectedDate.getHours() % 12 || 12 : 12)
  const [minute, setMinute] = useState(selectedDate ? selectedDate.getMinutes() : 0)
  const [period, setPeriod] = useState(selectedDate && selectedDate.getHours() >= 12 ? 'PM' : 'AM')
  const popRef = useRef(null)
  const [style, setStyle] = useState({ left: 0, top: 0, transformOrigin: 'left top' })

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popRef.current && !popRef.current.contains(event.target) && !anchorRef?.current?.contains(event.target)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose, anchorRef])

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  const getDaysInMonth = (year, month) => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startDayOfWeek = (firstDay.getDay() + 6) % 7

    const days = []
    const prevMonthLastDay = new Date(year, month, 0).getDate()
    
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      days.push({ date: prevMonthLastDay - i, isCurrentMonth: false, fullDate: new Date(year, month - 1, prevMonthLastDay - i) })
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: i, isCurrentMonth: true, fullDate: new Date(year, month, i) })
    }
    
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ date: i, isCurrentMonth: false, fullDate: new Date(year, month + 1, i) })
    }

    return days
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const handleDateClick = (day) => {
    if (!day.isCurrentMonth) return
    setSelectedDate(day.fullDate)
  }

  const handleApply = () => {
    if (!selectedDate) return
    
    const finalHour = period === 'PM' ? (hour === 12 ? 12 : hour + 12) : (hour === 12 ? 0 : hour)
    const finalDate = new Date(selectedDate)
    finalDate.setHours(finalHour, minute, 0, 0)
    
    onChange(finalDate)
    onClose()
  }

  const isToday = (date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSelected = (date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString()
  }

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const days = getDaysInMonth(year, month)
  useEffect(() => {
    const reposition = () => {
      const anchor = anchorRef?.current
      const pop = popRef.current
      const container = containerRef?.current || document.documentElement
      if (!anchor || !pop) return

      const anchorRect = anchor.getBoundingClientRect()
      const popRect = pop.getBoundingClientRect()
      const containerRect = container.getBoundingClientRect()
      const margin = 8

      // Default: open to the right of the anchor
      let left = anchorRect.right + margin
      let top = anchorRect.top
      let origin = 'left top'

      // If pop would overflow container on the right, place to left
      if (left + popRect.width > containerRect.right - margin) {
        left = anchorRect.left - popRect.width - margin
        origin = 'right top'
      }

      // Ensure not overflow left
      const minLeft = containerRect.left + margin
      if (left < minLeft) left = minLeft

      // Vertical clamp within container
      const maxTop = containerRect.bottom - popRect.height - margin
      const minTop = containerRect.top + margin
      if (top < minTop) top = minTop
      if (top > maxTop) top = maxTop

      setStyle({ left: Math.round(left), top: Math.round(top), transformOrigin: origin })
    }

    reposition()
    window.addEventListener('resize', reposition)
    window.addEventListener('scroll', reposition, true)
    return () => {
      window.removeEventListener('resize', reposition)
      window.removeEventListener('scroll', reposition, true)
    }
  }, [anchorRef, containerRef, currentDate, selectedDate])

  // keyboard interactions
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose()
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault()
        if (!selectedDate) return
        let delta = 0
        if (e.key === 'ArrowLeft') delta = -1
        if (e.key === 'ArrowRight') delta = 1
        if (e.key === 'ArrowUp') delta = -7
        if (e.key === 'ArrowDown') delta = 7
        const next = new Date(selectedDate)
        next.setDate(next.getDate() + delta)
        setSelectedDate(next)
      }
      if (e.key === 'Enter') {
        if (selectedDate) handleApply()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [selectedDate, period, hour, minute])

  const pop = (
    <div
      ref={popRef}
      style={{ left: style.left, top: style.top, position: 'fixed', zIndex: 60, transformOrigin: style.transformOrigin }}
      className="bg-white rounded-2xl shadow-xl border border-slate-200 p-5 w-80"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-center justify-between mb-5">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
          aria-label="Previous month"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="text-base font-semibold text-slate-900">
          {monthNames[month]} {year}
        </div>
        <button
          type="button"
          onClick={handleNextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
          aria-label="Next month"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs font-medium text-slate-500 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 mb-5">
        {days.map((day, index) => {
          const isWeekend = index % 7 >= 5
          const today = isToday(day.fullDate)
          const selected = isSelected(day.fullDate)
          return (
            <button
              key={index}
              type="button"
              onClick={() => handleDateClick(day)}
              disabled={!day.isCurrentMonth}
              className={`h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                !day.isCurrentMonth ? 'text-slate-300 cursor-not-allowed' : ''
              } ${
                day.isCurrentMonth && !selected && !today ? 'text-slate-700 hover:bg-slate-50' : ''
              } ${
                isWeekend && day.isCurrentMonth && !selected && !today ? 'text-slate-500' : ''
              } ${
                today && !selected ? 'ring-1 ring-indigo-200' : ''
              } ${
                selected ? 'bg-slate-900 text-white' : ''
              }`}
            >
              {day.date}
            </button>
          )
        })}
      </div>

      <div className="border-t border-slate-200 pt-4 mb-4">
        <div className="flex items-center gap-2">
          <select
            value={hour}
            onChange={(e) => setHour(parseInt(e.target.value))}
            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            aria-label="Hour"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
              <option key={h} value={h}>{h.toString().padStart(2, '0')}</option>
            ))}
          </select>
          
          <span className="text-slate-500 font-semibold">:</span>
          
          <select
            value={minute}
            onChange={(e) => setMinute(parseInt(e.target.value))}
            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            aria-label="Minute"
          >
            {Array.from({ length: 60 }, (_, i) => i).map(m => (
              <option key={m} value={m}>{m.toString().padStart(2, '0')}</option>
            ))}
          </select>
          
          <div className="flex border border-slate-200 rounded-lg overflow-hidden" role="group" aria-label="AM PM">
            <button
              type="button"
              onClick={() => setPeriod('AM')}
              className={`px-3 py-2 text-sm font-semibold transition-colors ${
                period === 'AM' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              AM
            </button>
            <button
              type="button"
              onClick={() => setPeriod('PM')}
              className={`px-3 py-2 text-sm font-semibold transition-colors ${
                period === 'PM' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              PM
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleApply}
          disabled={!selectedDate}
          className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Apply
        </button>
      </div>
    </div>
  )

  return createPortal(pop, document.body)
}

export default DateTimePicker
