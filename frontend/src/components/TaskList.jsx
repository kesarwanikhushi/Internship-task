import api from '../services/api'

function TaskList({ tasks, onEdit, onDelete }) {
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/tasks/${id}`)
        onDelete()
      } catch (error) {
        console.error('Failed to delete task:', error)
      }
    }
  }

  const handleMarkComplete = async (task) => {
    try {
      await api.put(`/tasks/${task._id}`, { ...task, status: 'completed' })
      onDelete()
    } catch (error) {
      console.error('Failed to update task:', error)
    }
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed':
        return { bg: 'bg-green-500', text: 'Completed' }
      case 'in-progress':
        return { bg: 'bg-yellow-500', text: 'In Progress' }
      default:
        return { bg: 'bg-red-500', text: 'Pending' }
    }
  }

  const formatDate = (date) => {
    if (!date) return null
    const d = new Date(date)
    const today = new Date()
    const isToday = d.toDateString() === today.toDateString()
    
    if (isToday) {
      return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-300 p-16 text-center">
        <p className="text-slate-400 text-lg">No tasks to display</p>
        <p className="text-slate-400 text-sm mt-2">Create a new task to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        const statusStyle = getStatusStyle(task.status)
        
        return (
          <div key={task._id} className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-300 hover:border-slate-400 transition-all overflow-hidden">
            <div className="p-5">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`${statusStyle.bg} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                      {statusStyle.text}
                    </span>
                    {task.dueDate && (
                      <span className="text-slate-500 text-xs font-medium flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatDate(task.dueDate)}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{task.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{task.description}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 pt-4 border-t border-slate-200">
                {task.status !== 'completed' && (
                  <button
                    onClick={() => handleMarkComplete(task)}
                    className="px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Complete
                  </button>
                )}
                <button
                  onClick={() => onEdit(task)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="px-4 py-2 text-red-600 text-sm font-semibold rounded-lg hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default TaskList
