import CalendarEvent from './CalendarEvent'

function CalendarCell({ date, tasks, isCurrentMonth, isToday, onEventClick }) {
  const dayTasks = tasks.filter(task => {
    if (!task.dueDate) return false
    const taskDate = new Date(task.dueDate)
    return taskDate.toDateString() === date.toDateString()
  })

  return (
    <div className={`min-h-32 border border-slate-200 p-2 ${isCurrentMonth ? 'bg-white' : 'bg-slate-50'} ${isToday ? 'bg-blue-50' : ''}`}>
      <div className={`text-sm font-semibold mb-2 ${isCurrentMonth ? 'text-slate-900' : 'text-slate-400'} ${isToday ? 'text-blue-600' : ''}`}>
        {date.getDate()}
      </div>
      <div className="space-y-1 overflow-y-auto max-h-24">
        {dayTasks.map(task => (
          <CalendarEvent key={task._id} task={task} onClick={onEventClick} />
        ))}
      </div>
    </div>
  )
}

export default CalendarCell
