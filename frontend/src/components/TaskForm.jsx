import { useState, useEffect, useRef } from 'react'
import api from '../services/api'
import DateTimePicker from './DateTimePicker'

function TaskForm({ task, onClose, onSave }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('pending')
  const [dueDate, setDueDate] = useState('')
  const [error, setError] = useState('')
  const [showDatePicker, setShowDatePicker] = useState(false)
  const anchorRef = useRef(null)
  const modalRef = useRef(null)

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description)
      setStatus(task.status)
      if (task.dueDate) {
        setDueDate(task.dueDate)
      }
    }
  }, [task])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const taskData = {
        title,
        description,
        status,
        dueDate: dueDate || null
      }

      if (task) {
        await api.put(`/tasks/${task._id}`, taskData)
      } else {
        await api.post('/tasks', taskData)
      }
      onSave()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save task')
    }
  }

  const handleDateChange = (date) => {
    setDueDate(date.toISOString())
  }

  const formatDisplayDate = (dateString) => {
    if (!dateString) return 'Select Date & Time'
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div ref={modalRef} className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 w-full max-w-md">
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

          <div className="mb-5">
            <label className="block text-slate-700 font-medium mb-2">Due Date & Time</label>
            <div className="relative">
              <button
                ref={anchorRef}
                type="button"
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300 text-left flex items-center justify-between"
                aria-haspopup="dialog"
                aria-expanded={showDatePicker}
              >
                <span className={dueDate ? 'text-slate-900' : 'text-slate-400'}>
                  {formatDisplayDate(dueDate)}
                </span>
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
              {showDatePicker && (
                <DateTimePicker
                  value={dueDate}
                  onChange={handleDateChange}
                  onClose={() => setShowDatePicker(false)}
                  anchorRef={anchorRef}
                  containerRef={modalRef}
                />
              )}
            </div>
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
