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

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'in-progress':
        return 'bg-violet-50 text-violet-700 border-violet-200'
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200'
    }
  }

  const getStatusBg = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-gradient-to-br from-emerald-50 to-white border-emerald-100'
      case 'in-progress':
        return 'bg-gradient-to-br from-violet-50 to-white border-violet-100'
      default:
        return 'bg-gradient-to-br from-amber-50 to-white border-amber-100'
    }
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        No tasks found
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div key={task._id} className={`border rounded-xl p-5 hover:shadow-lg transition-all ${getStatusBg(task.status)}`}>
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-lg text-gray-800">{task.title}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
              {task.status === 'in-progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
            </span>
          </div>
          
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">{task.description}</p>
          
          <div className="flex gap-2 flex-wrap">
            {task.status !== 'completed' && (
              <button
                onClick={() => handleMarkComplete(task)}
                className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-600"
              >
                Mark Complete
              </button>
            )}
            <button
              onClick={() => onEdit(task)}
              className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-200"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(task._id)}
              className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default TaskList
