"use client";

import { useEffect, useState } from 'react';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { taskService } from '@/services/task.service';
import { authService } from '@/services/auth.service';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const { loading: authLoading, user, logout } = useAuth();
  const { loading: protectedLoading } = useProtectedRoute();
  const [tasks, setTasks] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all'|'pending'|'completed'>('all');
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tasks, search, statusFilter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const userProfile = await authService.getCurrentUser();
      // not used directly here but ensures token is valid
      const list = await taskService.getTasks();
      setTasks(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let res = tasks.slice();
    if (search.trim()) {
      res = res.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));
    }
    if (statusFilter !== 'all') {
      res = res.filter((t) => t.status === statusFilter);
    }
    setFiltered(res);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await taskService.createTask({ title, description });
      setTasks((p) => [created, ...p]);
      setTitle('');
      setDescription('');
    } catch (err: any) {
      console.error(err?.response?.data || err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this task?')) return;
    try {
      await taskService.deleteTask(id);
      setTasks((p) => p.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStatus = async (task: any) => {
    try {
      const updated = await taskService.updateTask(task._id, { status: task.status === 'pending' ? 'completed' : 'pending' });
      setTasks((p) => p.map((t) => (t._id === updated._id ? updated : t)));
    } catch (err) {
      console.error(err);
    }
  };

  if (authLoading || protectedLoading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-6">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-zinc-600">Welcome back, {user?.name}</p>
        </div>
        <div>
          <button onClick={() => logout()} className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>
        </div>
      </header>

      <section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <form onSubmit={handleCreate} className="bg-white p-4 rounded shadow mb-4">
            <h3 className="font-semibold mb-2">Create Task</h3>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full border p-2 rounded mb-2" />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="w-full border p-2 rounded mb-2" />
            <button className="bg-green-600 text-white px-3 py-1 rounded">Add</button>
          </form>

          <div className="bg-white p-4 rounded shadow">
            <div className="flex items-center justify-between mb-3">
              <input placeholder="Search tasks" value={search} onChange={(e) => setSearch(e.target.value)} className="border p-2 rounded w-1/2" />
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="border p-2 rounded">
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {loading ? (
              <div>Loading tasks...</div>
            ) : (
              <ul className="space-y-3">
                {filtered.map((t) => (
                  <li key={t._id} className="p-3 border rounded flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{t.title}</h4>
                      <p className="text-sm text-zinc-600">{t.description}</p>
                      <p className="text-xs text-zinc-500 mt-1">{new Date(t.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <button onClick={() => toggleStatus(t)} className={`px-3 py-1 rounded ${t.status === 'completed' ? 'bg-green-600 text-white' : 'bg-yellow-400'}`}>
                        {t.status}
                      </button>
                      <button onClick={() => handleDelete(t._id)} className="text-red-600">Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <aside className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Profile</h3>
          <p className="text-sm">Name: {user?.name}</p>
          <p className="text-sm">Email: {user?.email}</p>
        </aside>
      </section>
    </div>
  );
}
