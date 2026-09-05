import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Send, CheckCircle2, LayoutTemplate } from 'lucide-react';
import api from '../utils/api';

const ApplicationPage = () => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', gender: 'MALE', mobileNumber: '', address: '', feedback: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);
    try {
      await api.post('/submissions', formData);
      setSuccess(true);
      setFormData({ firstName: '', lastName: '', email: '', gender: 'MALE', mobileNumber: '', address: '', feedback: '' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 md:px-8 relative overflow-hidden bg-purple-50">
      <div className="blob bg-purple-200 w-[600px] h-[600px] top-[-10%] left-[-10%]"></div>
      <div className="blob bg-fuchsia-200 w-[500px] h-[500px] bottom-[10%] right-[-10%]" style={{ animationDelay: '1s' }}></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <header className="flex justify-between items-center mb-10 bg-white p-5 rounded-3xl shadow-sm border border-purple-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-purple-200">
              <LayoutTemplate className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Application Portal</h1>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-5 py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-xl transition border border-purple-200 font-bold">
            <LogOut className="w-5 h-5 text-purple-400" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </header>

        <div className="clean-card p-8 md:p-12 animate-fade-in-up">
          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-3 tracking-tight">Submit Your Details</h2>
            <p className="text-purple-500 font-medium text-lg">Please fill out the form below accurately. All fields marked with an asterisk (*) are required.</p>
          </div>

          {success && (
            <div className="bg-purple-50 border border-purple-200 text-purple-700 p-6 rounded-2xl mb-10 flex items-center gap-5 shadow-sm">
              <CheckCircle2 className="w-10 h-10 flex-shrink-0 text-purple-500" />
              <div>
                <h3 className="font-extrabold text-xl mb-1">Application Submitted!</h3>
                <p className="text-purple-600 font-medium">We have successfully received your information.</p>
              </div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-5 rounded-2xl mb-10 font-bold shadow-sm">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">First Name <span className="text-purple-500">*</span></label>
                <input required name="firstName" value={formData.firstName} onChange={handleChange} className="input-field" placeholder="John" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Last Name <span className="text-purple-500">*</span></label>
                <input required name="lastName" value={formData.lastName} onChange={handleChange} className="input-field" placeholder="Doe" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Email Address <span className="text-purple-500">*</span></label>
              <input required type="email" name="email" value={formData.email} onChange={handleChange} className="input-field" placeholder="john.doe@example.com" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Gender <span className="text-purple-500">*</span></label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="input-field appearance-none cursor-pointer">
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Mobile Number <span className="text-purple-500">*</span></label>
                <input required name="mobileNumber" pattern="[0-9]{10}" title="10 digit mobile number" value={formData.mobileNumber} onChange={handleChange} className="input-field" placeholder="e.g. 1234567890" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Residential Address <span className="text-purple-500">*</span></label>
              <textarea required name="address" rows="3" value={formData.address} onChange={handleChange} className="input-field resize-none" placeholder="123 Main St, City, Country"></textarea>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Additional Feedback (Optional)</label>
              <textarea name="feedback" rows="3" value={formData.feedback} onChange={handleChange} className="input-field resize-none" placeholder="Any comments or notes..."></textarea>
            </div>

            <div className="pt-6 border-t border-purple-50">
              <button type="submit" disabled={loading} className="btn-primary w-full md:w-auto md:min-w-[300px] flex items-center justify-center gap-3 text-lg py-5 mx-auto">
                {loading ? 'Submitting...' : 'Submit Application'}
                {!loading && <Send className="w-5 h-5" />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplicationPage;
