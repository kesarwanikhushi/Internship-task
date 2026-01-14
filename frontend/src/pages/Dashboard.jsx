import { useContext, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import Profile from '../components/Profile'
import TaskList from '../components/TaskList'
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
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800">Task Manager</h1>
          <button
            onClick={logout}
            className="bg-slate-100 text-slate-700 px-5 py-2 rounded-lg font-medium hover:bg-slate-200"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Profile />
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-slate-800">My Tasks</h2>
                <button
                  onClick={handleCreateTask}
                  className="bg-slate-800 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-slate-900 w-full sm:w-auto"
                >
                  Add New Task
                </button>
              </div>

              <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <TaskList
                tasks={filteredTasks}
                onEdit={handleEditTask}
                onDelete={fetchTasks}
              />
            </div>
          </div>
        </div>
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
