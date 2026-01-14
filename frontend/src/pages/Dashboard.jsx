import { useContext, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import ProfileDropdown from '../components/ProfileDropdown'
import CalendarGrid from '../components/CalendarGrid'
import TaskForm from '../components/TaskForm'
import api from '../services/api'

function Dashboard() {
  const { user, logout, loading } = useContext(AuthContext)
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
      const response = await api.get('/tasks')
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
    <div className="min-h-screen" style={{
      background: '#f8fafc',
      backgroundImage: `
        linear-gradient(to right, #cbd5e1 1px, transparent 1px),
        linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)
      `,
      backgroundSize: '48px 48px'
    }}>
      <nav className="bg-white border-b border-slate-300 h-16 sticky top-0 z-40">
        <div className="h-full max-w-7xl mx-auto px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-slate-900 rounded-lg"></div>
            <h1 className="text-xl font-bold text-slate-900">Task Manager</h1>
          </div>
          <ProfileDropdown />
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-slate-900 mb-2">Calendar</h2>
          <p className="text-slate-500">View and manage your tasks by date</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-300 shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 min-w-0">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-11 px-4 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              />
            </div>
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-11 px-4 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent appearance-none"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        <CalendarGrid
          tasks={filteredTasks}
          onEventClick={handleEditTask}
          onAddTask={handleCreateTask}
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
