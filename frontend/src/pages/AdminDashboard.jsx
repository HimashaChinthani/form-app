import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Search, Filter, Edit, Trash2, X, LogOut, Check, Users, UserPlus, Key } from 'lucide-react';

const AdminDashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [search, setSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const navigate = useNavigate();

  // Admin Creation State
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminCreationStatus, setAdminCreationStatus] = useState(null);
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);

  const fetchSubmissions = async () => {
    try {
      let query = '?';
      if (search) query += `search=${search}&`;
      if (genderFilter) query += `gender=${genderFilter}&`;
      
      const res = await api.get(`/submissions${query}`);
      setSubmissions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [search, genderFilter]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to permanently delete this submission?')) {
      try {
        await api.delete(`/submissions/${id}`);
        fetchSubmissions();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const startEdit = (sub) => {
    setEditingId(sub._id);
    setEditForm(sub);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const saveEdit = async (id) => {
    try {
      await api.put(`/submissions/${id}`, editForm);
      setEditingId(null);
      fetchSubmissions();
    } catch (err) {
      console.error(err);
      alert('Error updating submission');
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setAdminCreationStatus(null);
    setIsCreatingAdmin(true);
    try {
      const res = await api.post('/auth/create-admin', { email: adminEmail });
      setAdminCreationStatus({ type: 'success', data: res.data });
      setAdminEmail('');
    } catch (err) {
      setAdminCreationStatus({ type: 'error', message: err.response?.data?.message || 'Failed to create admin' });
    } finally {
      setIsCreatingAdmin(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-purple-50 relative overflow-hidden">
      <div className="blob bg-purple-200 w-[800px] h-[800px] top-[-20%] left-[-20%]"></div>
      
      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* Header */}
        <div className="clean-card p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-purple-200">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">Admin Dashboard</h1>
              <p className="text-purple-500 font-medium">Manage user submissions securely</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowAdminForm(!showAdminForm)} className="flex items-center gap-2 px-6 py-3 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-xl transition font-bold shadow-sm border border-purple-200">
              <UserPlus className="w-5 h-5" />
              <span>{showAdminForm ? 'Close Admin Form' : 'Create Admin'}</span>
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition font-bold shadow-sm border border-red-100">
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Create Admin Panel */}
        {showAdminForm && (
          <div className="clean-card p-6 bg-white border-t-4 border-t-purple-500 animate-fade-in-up">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <UserPlus className="text-purple-500 w-5 h-5" /> Register New Admin
            </h2>
            <form onSubmit={handleCreateAdmin} className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="w-full sm:w-auto flex-1">
                <input 
                  type="email" 
                  required 
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="Enter new admin's email..." 
                  className="w-full px-5 py-3.5 bg-purple-50 border border-purple-100 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none text-slate-800 placeholder-purple-300 font-medium transition-all"
                />
              </div>
              <button type="submit" disabled={isCreatingAdmin} className="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-2xl font-bold hover:from-purple-500 hover:to-fuchsia-500 transition-all shadow-md w-full sm:w-auto whitespace-nowrap">
                {isCreatingAdmin ? 'Creating...' : 'Create Admin Account'}
              </button>
            </form>
            
            {adminCreationStatus?.type === 'error' && (
              <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-bold">
                {adminCreationStatus.message}
              </div>
            )}
            
            {adminCreationStatus?.type === 'success' && (
              <div className="mt-4 p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200">
                <p className="font-bold mb-2 flex items-center gap-2"><Check className="w-5 h-5"/> Admin created successfully!</p>
                <div className="bg-white p-3 rounded-lg border border-emerald-100">
                  <p className="text-sm text-slate-600">Email: <span className="font-bold text-slate-800">{adminCreationStatus.data.email}</span></p>
                  <p className="text-sm text-slate-600 flex items-center gap-2">
                    Password: <span className="font-mono bg-slate-100 px-2 py-1 rounded font-bold tracking-widest text-slate-800">{adminCreationStatus.data.password}</span>
                    <span className="text-xs text-rose-500">(Please copy this now, it won't be shown again)</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Toolbar */}
        <div className="clean-card p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by name..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-purple-50 border border-purple-100 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none text-slate-800 placeholder-purple-300 font-bold transition-all"
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto bg-purple-50 border border-purple-100 rounded-2xl px-5 py-2">
            <Filter className="text-purple-400 w-5 h-5" />
            <select 
              value={genderFilter} 
              onChange={(e) => setGenderFilter(e.target.value)}
              className="bg-transparent text-purple-700 py-2 outline-none cursor-pointer appearance-none font-bold min-w-[120px]"
            >
              <option value="">All Genders</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>

        {/* Table Container */}
        <div className="clean-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-purple-50/50 border-b border-purple-100">
                  <th className="p-6 text-purple-500 text-xs font-black uppercase tracking-widest">Applicant Name</th>
                  <th className="p-6 text-purple-500 text-xs font-black uppercase tracking-widest">Contact Email</th>
                  <th className="p-6 text-purple-500 text-xs font-black uppercase tracking-widest">Gender</th>
                  <th className="p-6 text-purple-500 text-xs font-black uppercase tracking-widest">Mobile</th>
                  <th className="p-6 text-purple-500 text-xs font-black uppercase tracking-widest">Address</th>
                  <th className="p-6 text-purple-500 text-xs font-black uppercase tracking-widest">Feedback</th>
                  <th className="p-6 text-purple-500 text-xs font-black uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-50">
                {submissions.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-16 text-center">
                      <div className="flex flex-col items-center justify-center text-purple-300">
                        <Users className="w-16 h-16 mb-4 opacity-50 text-purple-400" />
                        <p className="text-xl font-bold">No submissions found.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  submissions.map(sub => (
                    <tr key={sub._id} className="hover:bg-purple-50/50 transition-colors group">
                      {editingId === sub._id ? (
                        <>
                          <td className="p-4 flex gap-2">
                            <input name="firstName" value={editForm.firstName} onChange={handleEditChange} className="w-full bg-white border border-purple-200 rounded-lg px-4 py-2 font-medium text-slate-700 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100" />
                            <input name="lastName" value={editForm.lastName} onChange={handleEditChange} className="w-full bg-white border border-purple-200 rounded-lg px-4 py-2 font-medium text-slate-700 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100" />
                          </td>
                          <td className="p-4"><input name="email" value={editForm.email} onChange={handleEditChange} className="w-full bg-white border border-purple-200 rounded-lg px-4 py-2 font-medium text-slate-700 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100" /></td>
                          <td className="p-4">
                            <select name="gender" value={editForm.gender} onChange={handleEditChange} className="w-full bg-white border border-purple-200 rounded-lg px-4 py-2 font-medium text-slate-700 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100">
                              <option value="MALE">MALE</option>
                              <option value="FEMALE">FEMALE</option>
                              <option value="OTHER">OTHER</option>
                            </select>
                          </td>
                          <td className="p-4"><input name="mobileNumber" value={editForm.mobileNumber} onChange={handleEditChange} className="w-full bg-white border border-purple-200 rounded-lg px-4 py-2 font-medium text-slate-700 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100" /></td>
                          <td className="p-4"><input name="address" value={editForm.address} onChange={handleEditChange} className="w-full bg-white border border-purple-200 rounded-lg px-4 py-2 font-medium text-slate-700 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 min-w-[200px]" /></td>
                          <td className="p-4"><textarea name="feedback" value={editForm.feedback || ''} onChange={handleEditChange} rows="2" className="w-full bg-white border border-purple-200 rounded-lg px-4 py-2 font-medium text-slate-700 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 min-w-[220px]" /></td>
                          <td className="p-4">
                            <div className="flex gap-2 justify-end">
                              <button onClick={() => saveEdit(sub._id)} className="p-2.5 bg-purple-100 text-purple-600 hover:bg-purple-200 rounded-xl transition"><Check className="w-5 h-5" /></button>
                              <button onClick={cancelEdit} className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition"><X className="w-5 h-5" /></button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="p-6">
                            <div className="font-extrabold text-slate-800 text-base">{sub.firstName} {sub.lastName}</div>
                          </td>
                          <td className="p-6 text-slate-500 font-medium">{sub.email}</td>
                          <td className="p-6">
                            <span className={`px-4 py-1.5 rounded-xl text-xs font-black tracking-widest uppercase
                              ${sub.gender === 'MALE' ? 'bg-purple-100 text-purple-700' : 
                                sub.gender === 'FEMALE' ? 'bg-fuchsia-100 text-fuchsia-700' : 
                                'bg-violet-100 text-violet-700'}`}>
                              {sub.gender}
                            </span>
                          </td>
                          <td className="p-6 text-slate-500 font-bold text-sm tracking-wide">{sub.mobileNumber}</td>
                          <td className="p-6 text-slate-500 font-medium truncate max-w-[250px]">{sub.address}</td>
                          <td className="p-6 text-slate-500 font-medium truncate max-w-[250px]">{sub.feedback || '-'}</td>
                          <td className="p-6">
                            <div className="flex gap-3 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => startEdit(sub)} className="p-2.5 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-xl transition shadow-sm border border-purple-100" title="Edit">
                                <Edit className="w-5 h-5" />
                              </button>
                              <button onClick={() => handleDelete(sub._id)} className="p-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition shadow-sm border border-red-100" title="Delete">
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
