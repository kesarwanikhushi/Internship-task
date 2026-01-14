import { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { register } = useContext(AuthContext)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      await register(name, email, password)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 w-full max-w-md">
        <h2 className="text-3xl font-bold mb-8 text-slate-800">Create Account</h2>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

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

          <div className="mb-6">
            <label className="block text-slate-700 font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-slate-800 text-white py-3 rounded-lg font-medium hover:bg-slate-900"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-slate-600">
          Already have an account? <Link to="/login" className="text-slate-800 font-medium hover:underline">Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
