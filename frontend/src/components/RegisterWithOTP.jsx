import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function RegisterWithOTP() {
  const [step, setStep] = useState('register');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await api.post('/api/auth/register', form);
      setUserId(res.data.userId);
      setEmail(res.data.email);
      setStep('otp');
      setSuccess(res.data.message);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await api.post('/api/auth/verify-otp', {
        email,
        otp,
      });
      setSuccess(res.data.message || 'Email verified! You can now log in.');
      setStep('done');
      // redirect to login after short delay so user sees confirmation
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error('OTP verification error:', err);
      setError(err.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP resend
  const handleResendOtp = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await api.post('/api/auth/resend-otp', { email });
      setSuccess(res.data.message || 'OTP resent!');
    } catch (err) {
      console.error('Resend OTP error:', err);
      setError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      {step === 'register' && (
        <form onSubmit={handleRegister}>
          <h2 className="text-xl font-bold mb-4">Register</h2>
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full mb-2 p-2 border rounded"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="w-full mb-2 p-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            className="w-full mb-2 p-2 border rounded"
            required
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
          <p className="mt-3 text-sm text-slate-600">Already registered? <Link to="/login" className="text-blue-600 font-medium hover:underline">Login</Link></p>
          {error && <div className="text-red-600 mt-2">{error}</div>}
          {success && <div className="text-green-600 mt-2">{success}</div>}
        </form>
      )}
      {step === 'otp' && (
        <form onSubmit={handleVerifyOtp}>
          <h2 className="text-xl font-bold mb-4">Verify Email</h2>
          <p className="mb-2">Enter the OTP sent to <span className="font-semibold">{email}</span></p>
          <input
            type="text"
            placeholder="6-digit OTP"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            className="w-full mb-2 p-2 border rounded"
            required
            maxLength={6}
          />
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
          <button type="button" className="w-full mt-2 bg-gray-200 py-2 rounded" onClick={handleResendOtp} disabled={loading}>
            Resend OTP
          </button>
          {error && <div className="text-red-600 mt-2">{error}</div>}
          {success && <div className="text-green-600 mt-2">{success}</div>}
        </form>
      )}
      {step === 'done' && (
        <div>
          <h2 className="text-xl font-bold mb-4">Email Verified!</h2>
          <p className="mb-2">You can now log in.</p>
          {success && <div className="text-green-600 mt-2">{success}</div>}
        </div>
      )}
    </div>
  );
}
