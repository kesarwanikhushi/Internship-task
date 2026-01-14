import { useState, useContext, useRef, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import { ThemeContext } from '../context/ThemeContext'
import api from '../services/api'

function ProfileDropdown() {
  const { user, setUser, logout } = useContext(AuthContext)
  const { isDark, toggleTheme } = useContext(ThemeContext)
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
        className={`flex items-center gap-2 h-10 px-3 ${isDark ? 'bg-slate-800 hover:bg-slate-700 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 border-slate-300'} rounded-lg border transition-colors`}
      >
        <div className={`w-7 h-7 rounded-full ${isDark ? 'bg-white' : 'bg-slate-900'} flex items-center justify-center ${isDark ? 'text-slate-900' : 'text-white'} font-bold text-xs`}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <span className={`hidden sm:inline text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{user?.name}</span>
      </button>

      {isOpen && (
        <div className={`absolute right-0 mt-2 w-72 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300'} rounded-lg shadow-xl border z-50 overflow-hidden`}>
          {isEditing ? (
            <div className="p-4">
              <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'} mb-4`}>Edit Profile</h3>
              
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
                  <label className={`block ${isDark ? 'text-slate-300' : 'text-slate-700'} text-xs font-semibold mb-1`}>Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full px-3 py-2 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'} border rounded-lg text-sm focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-white' : 'focus:ring-slate-900'} focus:border-transparent`}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className={`block ${isDark ? 'text-slate-300' : 'text-slate-700'} text-xs font-semibold mb-1`}>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full px-3 py-2 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'} border rounded-lg text-sm focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-white' : 'focus:ring-slate-900'} focus:border-transparent`}
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className={`flex-1 ${isDark ? 'bg-white text-slate-900 hover:bg-slate-100' : 'bg-slate-900 text-white hover:bg-slate-800'} px-3 py-2 rounded-lg text-sm font-semibold transition-colors`}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className={`flex-1 ${isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'} px-3 py-2 rounded-lg text-sm font-semibold transition-colors`}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              <div className={`px-4 py-3 ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'} border-b`}>
                <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'} text-sm`}>{user?.name}</p>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'} mt-0.5`}>{user?.email}</p>
              </div>
              
              <div className="p-1">
                <button
                  onClick={toggleTheme}
                  className={`w-full text-left px-3 py-2 ${isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-50 text-slate-700'} rounded text-sm font-medium transition-colors flex items-center gap-2`}
                >
                  {isDark ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      Light Mode
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                      Dark Mode
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => setIsEditing(true)}
                  className={`w-full text-left px-3 py-2 ${isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-50 text-slate-700'} rounded text-sm font-medium transition-colors`}
                >
                  Edit Profile
                </button>
                
                <button
                  onClick={handleLogout}
                  className={`w-full text-left px-3 py-2 ${isDark ? 'hover:bg-red-900/30' : 'hover:bg-red-50'} rounded text-red-600 text-sm font-medium transition-colors`}
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
