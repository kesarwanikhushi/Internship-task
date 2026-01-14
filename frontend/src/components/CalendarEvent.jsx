function CalendarEvent({ task, onClick }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'border-l-green-500'
      case 'in-progress':
        return 'border-l-yellow-500'
      default:
        return 'border-l-red-500'
    }
  }

  const formatTime = (date) => {
    if (!date) return ''
    const d = new Date(date)
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  }

  return (
    <div
      onClick={() => onClick(task)}
      className={`bg-white border-l-4 ${getStatusColor(task.status)} rounded px-2 py-1 mb-1 cursor-pointer hover:shadow-md transition-shadow text-xs`}
    >
      <div className="flex items-start gap-1">
        {task.dueDate && (
          <span className="text-slate-500 font-medium shrink-0">{formatTime(task.dueDate)}</span>
        )}
        <span className="text-slate-900 font-semibold truncate">{task.title}</span>
      </div>
    </div>
  )
}

export default CalendarEvent
