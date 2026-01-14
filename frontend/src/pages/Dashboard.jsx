import { useContext, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { ThemeContext } from '../context/ThemeContext'
import ProfileDropdown from '../components/ProfileDropdown'
import KanbanBoard from '../components/KanbanBoard'
import TaskForm from '../components/TaskForm'
import api from '../services/api'

function Dashboard() {
  const { user, logout, loading } = useContext(AuthContext)
  const { isDark, toggleTheme } = useContext(ThemeContext)
  const [tasks, setTasks] = useState([])
  const [filteredTasks, setFilteredTasks] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [editingTask, setEditingTask] = useState(null)
  const [showTaskForm, setShowTaskForm] = useState(false)

  useEffect(() => {
    if (user) {
      fetchTasks()
    }
  }, [user])

  useEffect(() => {
    filterTasks()
  }, [tasks, searchTerm, statusFilter])

  const fetchTasks = async () => {
    try {
      const response = await api.get('/api/tasks')
      setTasks(response.data)
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    }
  }

  const filterTasks = () => {
    let filtered = tasks

    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter) {
      filtered = filtered.filter(task => task.status === statusFilter)
    }

    setFilteredTasks(filtered)
  }

  const handleCreateTask = () => {
    setEditingTask(null)
    setShowTaskForm(true)
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setShowTaskForm(true)
  }

  const handleCloseForm = () => {
    setShowTaskForm(false)
    setEditingTask(null)
  }

  const handleTaskSaved = () => {
    fetchTasks()
    handleCloseForm()
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''}`} style={{
      background: isDark ? '#0f172a' : '#f1f5f9',
      backgroundImage: isDark 
        ? `linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)`
        : `linear-gradient(to right, #94a3b8 1px, transparent 1px), linear-gradient(to bottom, #94a3b8 1px, transparent 1px)`,
      backgroundSize: '48px 48px'
    }}>
      <nav className={`${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'} border-b h-16 sticky top-0 z-40`}>
        <div className="h-full max-w-7xl mx-auto px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-8 h-8 ${isDark ? 'bg-white' : 'bg-slate-900'} rounded-lg`}></div>
            <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Task Manager</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className={`w-10 h-10 flex items-center justify-center rounded-lg ${isDark ? 'bg-slate-800 hover:bg-slate-700 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 border-slate-300'} border transition-colors`}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <ProfileDropdown />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} mb-2`}>Board</h2>
            <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>Organize and track your tasks</p>
          </div>
          <button
            onClick={handleCreateTask}
            className={`px-6 h-11 ${isDark ? 'bg-white text-slate-900 hover:bg-slate-100' : 'bg-slate-900 text-white hover:bg-slate-800'} rounded-lg font-semibold transition-colors`}
          >
            New Task
          </button>
        </div>

        <div className={`${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-white/80 border-slate-300'} backdrop-blur-sm rounded-2xl border shadow-sm p-6 mb-6`}>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 min-w-0">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full h-11 px-4 ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-slate-50 border-slate-300'} border rounded-lg text-sm focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-white' : 'focus:ring-slate-900'} focus:border-transparent`}
              />
            </div>
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`w-full h-11 px-4 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-300'} border rounded-lg text-sm focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-white' : 'focus:ring-slate-900'} focus:border-transparent appearance-none`}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        <KanbanBoard
          tasks={filteredTasks}
          onEdit={handleEditTask}
          onDelete={fetchTasks}
        />
      </div>

      {showTaskForm && (
        <TaskForm
          task={editingTask}
          onClose={handleCloseForm}
          onSave={handleTaskSaved}
        />
      )}
    </div>
  )
}

export default Dashboard
