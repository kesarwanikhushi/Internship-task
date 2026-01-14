import { useContext } from 'react'
import { ThemeContext } from '../context/ThemeContext'
import KanbanCard from './KanbanCard'

function KanbanColumn({ title, tasks, statusColor, onEdit, onDelete }) {
  const { isDark } = useContext(ThemeContext)
  
  return (
    <div className="flex-1 min-w-0">
      <div className={`${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-white/80 border-slate-300'} backdrop-blur-sm rounded-xl border p-4`}>
        <div className="flex items-center gap-2 mb-4">
          <div className={`w-3 h-3 rounded-full ${statusColor}`}></div>
          <h2 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{title}</h2>
          <span className={`ml-auto text-sm font-semibold ${isDark ? 'text-slate-400 bg-slate-700' : 'text-slate-500 bg-slate-100'} px-2 py-1 rounded-full`}>
            {tasks.length}
          </span>
        </div>
        <div className="space-y-0 max-h-[calc(100vh-320px)] overflow-y-auto pr-2">
          {tasks.length === 0 ? (
            <div className={`text-center py-8 ${isDark ? 'text-slate-500' : 'text-slate-400'} text-sm`}>
              No tasks
            </div>
          ) : (
            tasks.map(task => (
              <KanbanCard
                key={task._id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default KanbanColumn
