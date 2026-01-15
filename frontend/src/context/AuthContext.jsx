import { createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUser = async () => {
    try {
      const response = await api.get('/api/users/profile')
      setUser(response.data)
    } catch (error) {
      console.error('Failed to fetch user:', error)
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      delete api.defaults.headers.common['Authorization']
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password })
    localStorage.setItem('accessToken', response.data.accessToken)
    localStorage.setItem('refreshToken', response.data.refreshToken)
    api.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`
    setUser(response.data.user)
    navigate('/dashboard')
  }

  const register = async (name, email, password) => {
    const response = await api.post('/api/auth/register', { name, email, password })
    // Note: Registration only creates account, doesn't log in
    // User needs to verify OTP first
    navigate('/register')
  }

  const logout = async () => {
    try {
      await api.post('/api/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    }
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
