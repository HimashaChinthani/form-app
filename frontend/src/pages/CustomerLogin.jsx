import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Mail, ArrowRight } from 'lucide-react';
import api from '../utils/api';

const CustomerLogin = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login/customer', formData);
      localStorage.setItem('token', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);
      localStorage.setItem('role', 'CUSTOMER');
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => navigate('/application'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-purple-50">
      <div className="blob bg-purple-200 w-[500px] h-[500px] top-[-10%] left-[-10%]"></div>
      <div className="blob bg-fuchsia-200 w-[400px] h-[400px] bottom-[-10%] right-[-10%]" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-md clean-card p-10 relative z-10 animate-fade-in-up">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-purple-500 to-fuchsia-500 mb-6 shadow-xl shadow-purple-500/30 transform rotate-3">
            <User className="w-10 h-10 text-white transform -rotate-3" />
          </div>
          <h2 className="text-4xl font-extrabold text-slate-800 mb-3 tracking-tight">Welcome Back</h2>
          <p className="text-purple-500 font-medium text-lg">Sign in to your customer account</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl mb-8 text-sm font-bold shadow-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 p-4 rounded-xl mb-8 text-sm font-bold shadow-sm">
            {success}
          </div>
        )}
        
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
              <input 
                name="email" type="email" required placeholder="hello@example.com" onChange={handleChange}
                className="input-field pl-12"
              />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
              <input 
                name="password" type="password" required placeholder="••••••••" onChange={handleChange}
                className="input-field pl-12"
              />
            </div>
          </div>
          
          <button type="submit" disabled={loading} className="btn-primary mt-8 flex items-center justify-center gap-2 group">
            {loading ? 'Authenticating...' : 'Sign In to Account'}
            {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-slate-500 font-medium">
            New here?{' '}
            <Link to="/register" className="text-purple-600 font-bold hover:text-purple-500 hover:underline transition-all">
              Create an account
            </Link>
          </p>
          <Link to="/" className="block mt-4 text-purple-400 font-medium hover:text-purple-600 transition-colors text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CustomerLogin;
