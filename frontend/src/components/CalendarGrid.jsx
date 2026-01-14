import { useState } from 'react'
import CalendarCell from './CalendarCell'

function CalendarGrid({ tasks, onEventClick, onAddTask }) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const getMonthData = (year, month) => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startDayOfWeek = firstDay.getDay()

    const days = []
    
    const prevMonthLastDay = new Date(year, month, 0).getDate()
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      days.push(new Date(year, month - 1, prevMonthLastDay - i))
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }
    
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i))
    }

    return days
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const today = new Date()
  const calendarDays = getMonthData(year, month)

  return (
    <div>
      <div className="bg-white border border-slate-300 rounded-xl p-4 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-slate-900">{monthNames[month]} {year}</h2>
          <div className="flex gap-1">
            <button
              onClick={handlePrevMonth}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNextMonth}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button
              onClick={handleToday}
              className="px-3 h-8 text-sm font-semibold rounded-lg hover:bg-slate-100 text-slate-700"
            >
              Today
            </button>
          </div>
        </div>
        <button
          onClick={onAddTask}
          className="px-4 h-9 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors text-sm"
        >
          Add Task
        </button>
      </div>

      <div className="bg-white border border-slate-300 rounded-xl overflow-hidden">
        <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-300">
          {dayNames.map(day => (
            <div key={day} className="py-3 text-center text-sm font-bold text-slate-700 border-r border-slate-200 last:border-r-0">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {calendarDays.map((date, index) => (
            <CalendarCell
              key={index}
              date={date}
              tasks={tasks}
              isCurrentMonth={date.getMonth() === month}
              isToday={date.toDateString() === today.toDateString()}
              onEventClick={onEventClick}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default CalendarGrid
