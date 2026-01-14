import { useState, useContext, useRef, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import api from '../services/api'

function ProfileDropdown() {
  const { user, setUser, logout } = useContext(AuthContext)
  const [isOpen, setIsOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
        setIsEditing(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const response = await api.put('/users/profile', { name, email })
      setUser(response.data)
      setSuccess('Profile updated')
      setTimeout(() => {
        setSuccess('')
        setIsEditing(false)
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed')
    }
  }

  const handleCancel = () => {
    setName(user?.name || '')
    setEmail(user?.email || '')
    setIsEditing(false)
    setError('')
    setSuccess('')
  }

  const handleLogout = () => {
    setIsOpen(false)
    logout()
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 h-10 px-3 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 transition-colors"
      >
        <div className="w-7 h-7 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-xs">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <span className="hidden sm:inline text-sm font-semibold text-slate-900">{user?.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-slate-300 z-50 overflow-hidden">
          {isEditing ? (
            <div className="p-4">
              <h3 className="font-bold text-slate-900 mb-4">Edit Profile</h3>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg mb-3 text-xs">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-2 rounded-lg mb-3 text-xs">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="block text-slate-700 text-xs font-semibold mb-1">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-slate-700 text-xs font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-slate-900 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 bg-slate-100 text-slate-700 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                <p className="font-bold text-slate-900 text-sm">{user?.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
              </div>
              
              <div className="p-1">
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded text-slate-700 text-sm font-medium transition-colors"
                >
                  Edit Profile
                </button>
                
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 hover:bg-red-50 rounded text-red-600 text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default ProfileDropdown
