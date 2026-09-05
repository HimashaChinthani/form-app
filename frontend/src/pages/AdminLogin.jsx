import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, KeyRound, Mail, ArrowRight } from 'lucide-react';
import api from '../utils/api';

const AdminLogin = () => {
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
      const res = await api.post('/auth/login/admin', formData);
      localStorage.setItem('token', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);
      localStorage.setItem('role', 'ADMIN');
      setSuccess('Login successful! Accessing portal...');
      setTimeout(() => navigate('/admin/dashboard'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-purple-50">
      <div className="blob bg-purple-200 w-[500px] h-[500px] top-[-10%] right-[-10%]"></div>
      <div className="blob bg-fuchsia-200 w-[400px] h-[400px] bottom-[-10%] left-[-10%]" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-md clean-card p-10 relative z-10 animate-fade-in-up border-t-8 border-t-purple-500">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-purple-600 to-fuchsia-600 mb-6 shadow-xl shadow-purple-500/30 transform rotate-3">
            <ShieldAlert className="w-10 h-10 text-white transform -rotate-3" />
          </div>
          <h2 className="text-4xl font-extrabold text-slate-800 mb-3 tracking-tight">Admin Portal</h2>
          <p className="text-purple-500 font-medium text-lg">Restricted access area</p>
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
            <label className="text-sm font-bold text-slate-700 ml-1">Admin Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
              <input 
                name="email" type="email" required placeholder="admin@example.com" onChange={handleChange}
                className="input-field pl-12"
              />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 ml-1">Master Password</label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
              <input 
                name="password" type="password" required placeholder="••••••••" onChange={handleChange}
                className="input-field pl-12"
              />
            </div>
          </div>
          
          <button type="submit" disabled={loading} className="btn-primary mt-8 flex items-center justify-center gap-2 group">
            {loading ? 'Verifying...' : 'Authorize Access'}
            {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="mt-10 text-center">
          <Link to="/" className="block text-purple-400 font-medium hover:text-purple-600 transition-colors text-sm">
            ← Return to Public Portal
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
