import KanbanColumn from './KanbanColumn'
import api from '../services/api'

function KanbanBoard({ tasks, onEdit, onDelete }) {
  const pendingTasks = tasks.filter(task => task.status === 'pending')
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress')
  const completedTasks = tasks.filter(task => task.status === 'completed')

  const handleDelete = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`)
      onDelete()
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }

  return (
    <div className="flex gap-4">
      <KanbanColumn
        title="Pending"
        tasks={pendingTasks}
        statusColor="bg-red-500"
        onEdit={onEdit}
        onDelete={handleDelete}
      />
      <KanbanColumn
        title="In Progress"
        tasks={inProgressTasks}
        statusColor="bg-yellow-500"
        onEdit={onEdit}
        onDelete={handleDelete}
      />
      <KanbanColumn
        title="Completed"
        tasks={completedTasks}
        statusColor="bg-green-500"
        onEdit={onEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}

export default KanbanBoard
