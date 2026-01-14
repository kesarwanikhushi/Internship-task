import { useContext } from 'react'
import { ThemeContext } from '../context/ThemeContext'

function KanbanCard({ task, onEdit, onDelete }) {
  const { isDark } = useContext(ThemeContext)
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500'
      case 'in-progress':
        return 'bg-yellow-500'
      default:
        return 'bg-red-500'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await onDelete(task._id)
      } catch (error) {
        console.error('Failed to delete task:', error)
      }
    }
  }

  return (
    <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-lg border p-4 mb-3 hover:shadow-md transition-shadow`}>
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-1 h-12 rounded-full ${getStatusColor(task.status)}`}></div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'} mb-1 break-words`}>{task.title}</h3>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'} break-words`}>{task.description}</p>
        </div>
      </div>

      {task.dueDate && (
        <div className={`flex items-center gap-2 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'} mb-3 pl-4`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{formatDate(task.dueDate)}</span>
        </div>
      )}

      <div className={`flex gap-2 pt-3 border-t ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
        <button
          onClick={() => onEdit(task)}
          className={`flex-1 px-3 py-2 ${isDark ? 'text-slate-300 bg-slate-700 hover:bg-slate-600' : 'text-slate-700 bg-slate-50 hover:bg-slate-100'} rounded-lg transition-colors flex items-center justify-center`}
          title="Edit task"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={handleDelete}
          className={`flex-1 px-3 py-2 text-red-600 ${isDark ? 'bg-red-900/30 hover:bg-red-900/50' : 'bg-red-50 hover:bg-red-100'} rounded-lg transition-colors flex items-center justify-center`}
          title="Delete task"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default KanbanCard
