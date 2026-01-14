import { useState, useEffect } from 'react'
import api from '../services/api'

function TaskForm({ task, onClose, onSave }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('pending')
  const [error, setError] = useState('')

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description)
      setStatus(task.status)
    }
  }, [task])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      if (task) {
        await api.put(`/tasks/${task._id}`, { title, description, status })
      } else {
        await api.post('/tasks', { title, description, status })
      }
      onSave()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save task')
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-slate-800">{task ? 'Edit Task' : 'Add Task'}</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-slate-700 font-medium mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300"
              required
            />
          </div>

          <div className="mb-5">
            <label className="block text-slate-700 font-medium mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300 resize-none"
              rows="4"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-slate-700 font-medium mb-2">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-slate-800 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-slate-900"
            >
              {task ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-100 text-slate-700 px-4 py-2.5 rounded-lg font-medium hover:bg-slate-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskForm
