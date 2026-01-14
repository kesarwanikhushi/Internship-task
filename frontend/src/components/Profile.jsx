import { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import api from '../services/api'

function Profile() {
  const { user, setUser } = useContext(AuthContext)
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const response = await api.put('/api/users/profile', { name, email })
      setUser(response.data)
      setSuccess('Profile updated successfully')
      setIsEditing(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile')
    }
  }

  const handleCancel = () => {
    setName(user?.name || '')
    setEmail(user?.email || '')
    setIsEditing(false)
    setError('')
    setSuccess('')
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-xl font-bold mb-6 text-slate-800">Profile</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg mb-4">
          {success}
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-slate-700 font-medium mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300"
              required
            />
          </div>

          <div className="mb-5">
            <label className="block text-slate-700 font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300"
              required
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-slate-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-900"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-200"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div>
          <div className="mb-5">
            <p className="text-slate-500 text-sm mb-1">Name</p>
            <p className="font-semibold text-slate-800">{user?.name}</p>
          </div>

          <div className="mb-6">
            <p className="text-slate-500 text-sm mb-1">Email</p>
            <p className="font-semibold text-slate-800">{user?.email}</p>
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="w-full bg-slate-800 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-slate-900"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  )
}

export default Profile
