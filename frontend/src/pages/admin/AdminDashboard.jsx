import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, LayoutDashboard, ShieldCheck, Plus, Trash2, Megaphone,
  UserPlus, Calendar, ListFilter, X, ArrowRight, Loader2, BarChart3, AlertCircle
} from 'lucide-react';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Toast from '../../components/common/Toast';
import DashboardLayout from '../../components/common/DashboardLayout';
import { formatStatus, sortComplaintsBySeverity } from '../../utils/status';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showDepartments, setShowDepartments] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [departmentDetails, setDepartmentDetails] = useState(null);
  const [departmentLoading, setDepartmentLoading] = useState(false);
  const [departmentError, setDepartmentError] = useState('');
  const [officerForm, setOfficerForm] = useState({ fullName: '', email: '', password: '', department: '' });
  const [departmentForm, setDepartmentForm] = useState({ name: '', code: '', description: '' });
  const [toastMessage, setToastMessage] = useState('');
  const [visibleCount, setVisibleCount] = useState(2);
  const [notificationForm, setNotificationForm] = useState({ title: '', message: '', department: 'all' });
  const [activeTab, setActiveTab] = useState('overview'); // visual layout tabs

  const fetchData = async () => {
    const [complaintsRes, departmentsRes] = await Promise.all([API.get('/complaints/all'), API.get('/departments')]);
    setComplaints(sortComplaintsBySeverity(complaintsRes.data));
    setDepartments(departmentsRes.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const stats = useMemo(() => ({
    total: complaints.length,
    resolved: complaints.filter((c) => c.status === 'resolved').length,
    departments: departments.length
  }), [complaints, departments]);

  const visibleComplaints = complaints.slice(0, visibleCount);

  const handleDepartment = async (e) => {
    e.preventDefault();
    await API.post('/departments', departmentForm);
    setDepartmentForm({ name: '', code: '', description: '' });
    fetchData();
    setToastMessage('Department created successfully');
  };

  const handleOfficer = async (e) => {
    e.preventDefault();
    await API.post('/departments/officers', officerForm);
    setOfficerForm({ fullName: '', email: '', password: '', department: '' });
    setToastMessage('Officer created successfully');
  };

  const handleBroadcast = async (e) => {
    e.preventDefault();
    await API.post('/notifications', {
      title: notificationForm.title,
      message: notificationForm.message,
      department: notificationForm.department === 'all' ? null : notificationForm.department
    });
    setNotificationForm({ title: '', message: '', department: 'all' });
    setToastMessage('Broadcast sent successfully');
  };

  const openDepartments = () => {
    setShowDepartments(true);
    setDepartmentError('');
    setDepartmentDetails(null);
    setSelectedDepartment(null);
  };

  const closeDepartments = () => {
    setShowDepartments(false);
    setDepartmentError('');
    setDepartmentDetails(null);
    setSelectedDepartment(null);
  };

  const fetchDepartmentDetails = async (id) => {
    setDepartmentLoading(true);
    setDepartmentError('');
    try {
      const res = await API.get(`/departments/${id}`);
      setSelectedDepartment(id);
      setDepartmentDetails(res.data);
    } catch (error) {
      setDepartmentError(error.response?.data?.message || 'Unable to load department details');
    } finally {
      setDepartmentLoading(false);
    }
  };

  const handleDeleteOfficer = async (id, name) => {
    if (!window.confirm(`Delete officer ${name}?`)) return;
    await API.delete(`/departments/officers/${id}`);
    if (selectedDepartment) await fetchDepartmentDetails(selectedDepartment);
    fetchData();
  };

  const handleDeleteDepartment = async (id, name) => {
    if (!window.confirm(`Delete department ${name}?`)) return;
    try {
      await API.delete(`/departments/${id}`);
      fetchData();
      closeDepartments();
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to delete department');
    }
  };

  const getStatusBadgeStyle = (status) => {
    if (status === 'resolved') return 'bg-emerald-100 text-emerald-800 border-emerald-250 dark:bg-emerald-950/40 dark:text-emerald-350 dark:border-emerald-800';
    if (status === 'in-progress') return 'bg-amber-100 text-amber-800 border-amber-250 dark:bg-amber-950/40 dark:text-amber-350 dark:border-amber-800';
    if (status === 'accepted') return 'bg-blue-100 text-blue-800 border-blue-250 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800';
    return 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-350 dark:border-slate-700';
  };

  return (
    <DashboardLayout title="Admin Command Center">
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
      
      {/* Welcome & quick view bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Operational Console</p>
          <h2 className="text-sm font-semibold text-slate-500 mt-0.5">Control agency structures, add officers, and dispatch global announcements.</h2>
        </div>
        <button 
          onClick={() => navigate('/admin/analytics')}
          className="rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-4 py-2.5 shadow-md flex items-center gap-1.5 transition"
        >
          <BarChart3 size={15} />
          <span>Interactive Analytics</span>
        </button>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-sm border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total System Tickets</span>
            <p className="text-3xl font-black mt-2 text-slate-800 dark:text-slate-100">{stats.total}</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-500 flex items-center justify-center border border-slate-100 dark:border-slate-850">
            <LayoutDashboard size={22} />
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-sm border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Successfully Resolved</span>
            <p className="text-3xl font-black mt-2 text-slate-850 dark:text-slate-100">{stats.resolved}</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100/20 dark:border-emerald-850/20">
            <ShieldCheck size={22} />
          </div>
        </div>

        <div 
          onClick={openDepartments}
          className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-sm border border-slate-200/60 dark:border-slate-800/60 hover:border-brand-500 dark:hover:border-brand-500 flex items-center justify-between cursor-pointer group transition"
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition">Managed Departments</span>
            <p className="text-3xl font-black mt-2 text-slate-850 dark:text-slate-100">{stats.departments}</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center border border-brand-100/20 dark:border-brand-850/20">
            <Building2 size={22} />
          </div>
        </div>
      </div>

      {/* Tabs Layout navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6 gap-6">
        <button 
          className={`pb-3 font-bold text-xs uppercase tracking-wider border-b-2 transition ${activeTab === 'overview' ? 'border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400' : 'border-transparent text-slate-400 hover:text-slate-650'}`}
          onClick={() => setActiveTab('overview')}
        >
          System Overview
        </button>
        <button 
          className={`pb-3 font-bold text-xs uppercase tracking-wider border-b-2 transition ${activeTab === 'provisioning' ? 'border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400' : 'border-transparent text-slate-400 hover:text-slate-650'}`}
          onClick={() => setActiveTab('provisioning')}
        >
          Department Provisioning
        </button>
        <button 
          className={`pb-3 font-bold text-xs uppercase tracking-wider border-b-2 transition ${activeTab === 'broadcast' ? 'border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400' : 'border-transparent text-slate-400 hover:text-slate-650'}`}
          onClick={() => setActiveTab('broadcast')}
        >
          Broadcast Center
        </button>
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Complaints Table/Log list */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-sm border border-slate-200/60 dark:border-slate-800/60">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-850 dark:text-slate-100">Live Complaint Pipeline</h3>
                <p className="text-2xs text-slate-450 mt-0.5">Real-time status updates of all citizen reports logged across agencies.</p>
              </div>
              <span className="text-2xs text-slate-450 font-bold uppercase tracking-wider bg-slate-50 dark:bg-slate-950 border px-2.5 py-1 rounded-lg">
                Showing {Math.min(visibleCount, complaints.length)} of {complaints.length}
              </span>
            </div>

            {/* List */}
            {visibleComplaints.length > 0 ? (
              <div className="space-y-3">
                {visibleComplaints.map((complaint) => (
                  <div 
                    key={complaint._id} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between border border-slate-100 dark:border-slate-850 hover:border-slate-200 rounded-xl p-4 gap-3 bg-slate-50/20 dark:bg-slate-950/10"
                  >
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-150 leading-snug">{complaint.title}</p>
                      <p className="text-2xs text-slate-500 dark:text-slate-400 mt-1 flex flex-wrap gap-x-2 gap-y-0.5">
                        <span>Reporter: <strong className="text-slate-600 dark:text-slate-300 font-semibold">{complaint.citizen?.fullName || 'Anonymous'}</strong></span>
                        <span>•</span>
                        <span>Agency: <strong className="text-slate-600 dark:text-slate-300 font-semibold">{complaint.department?.name || 'Awaiting automated routing'}</strong></span>
                      </p>
                    </div>
                    <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
                      <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${getStatusBadgeStyle(complaint.status)}`}>
                        {formatStatus(complaint.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-450 italic py-4 text-center">No system complaints registered.</p>
            )}

            {visibleCount < complaints.length && (
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-850 flex justify-center">
                <button 
                  className="rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 transition" 
                  onClick={() => setVisibleCount((value) => value + 4)}
                >
                  Load More Complaints
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Provisioning */}
      {activeTab === 'provisioning' && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Department Creation Form */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-sm border border-slate-200/60 dark:border-slate-800/60">
            <h3 className="text-base font-bold text-slate-850 dark:text-slate-100 mb-1">Create Agency Department</h3>
            <p className="text-2xs text-slate-450 mb-4">Register new municipal sectors to routing lists.</p>
            
            <form className="space-y-4" onSubmit={handleDepartment}>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1" htmlFor="dept-name">
                  Department Name
                </label>
                <input 
                  id="dept-name"
                  className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 text-slate-850 dark:text-white" 
                  placeholder="e.g. Roads & Transportation" 
                  value={departmentForm.name} 
                  onChange={(e) => setDepartmentForm({ ...departmentForm, name: e.target.value })} 
                  required 
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1" htmlFor="dept-code">
                  Unique Code / Prefix
                </label>
                <input 
                  id="dept-code"
                  className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 text-slate-850 dark:text-white" 
                  placeholder="e.g. RDS" 
                  value={departmentForm.code} 
                  onChange={(e) => setDepartmentForm({ ...departmentForm, code: e.target.value })} 
                  required 
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1" htmlFor="dept-desc">
                  Description
                </label>
                <textarea 
                  id="dept-desc"
                  rows="2"
                  className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 text-slate-850 dark:text-white" 
                  placeholder="Responsibilities and task coverage info..." 
                  value={departmentForm.description} 
                  onChange={(e) => setDepartmentForm({ ...departmentForm, description: e.target.value })} 
                />
              </div>

              <button 
                className="rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-4 py-2.5 shadow-sm transition" 
                type="submit"
              >
                Save Department
              </button>
            </form>
          </div>

          {/* Officer Provisioning Form */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-sm border border-slate-200/60 dark:border-slate-800/60">
            <h3 className="text-base font-bold text-slate-850 dark:text-slate-100 mb-1">Create Officer Account</h3>
            <p className="text-2xs text-slate-450 mb-4">Provision official login credentials for responding officers.</p>
            
            <form className="space-y-4" onSubmit={handleOfficer}>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1" htmlFor="officer-name">
                  Officer Full Name
                </label>
                <input 
                  id="officer-name"
                  className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 text-slate-850 dark:text-white" 
                  placeholder="e.g. Officer Smith" 
                  value={officerForm.fullName} 
                  onChange={(e) => setOfficerForm({ ...officerForm, fullName: e.target.value })} 
                  required 
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1" htmlFor="officer-email">
                  Official Email Address
                </label>
                <input 
                  id="officer-email"
                  className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 text-slate-850 dark:text-white" 
                  type="email"
                  placeholder="smith@agency.gov" 
                  value={officerForm.email} 
                  onChange={(e) => setOfficerForm({ ...officerForm, email: e.target.value })} 
                  required 
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1" htmlFor="officer-pass">
                  Temporary Password
                </label>
                <input 
                  id="officer-pass"
                  className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 text-slate-855 dark:text-white" 
                  placeholder="••••••••" 
                  value={officerForm.password} 
                  onChange={(e) => setOfficerForm({ ...officerForm, password: e.target.value })} 
                  required 
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Assign Agency Department
                </label>
                <select 
                  className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 text-slate-700 dark:text-slate-300 cursor-pointer" 
                  value={officerForm.department} 
                  onChange={(e) => setOfficerForm({ ...officerForm, department: e.target.value })} 
                  required
                >
                  <option value="">Select department</option>
                  {departments.map((department) => (
                    <option key={department._id} value={department._id} className="bg-white dark:bg-slate-900">{department.name}</option>
                  ))}
                </select>
              </div>

              <button 
                className="rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-4 py-2.5 shadow-sm transition" 
                type="submit"
              >
                Create Officer Account
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab: Broadcast Alerts */}
      {activeTab === 'broadcast' && (
        <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-sm border border-slate-200/60 dark:border-slate-800/60">
          <h3 className="text-base font-bold text-slate-850 dark:text-slate-100 mb-1">Broadcast Notification</h3>
          <p className="text-2xs text-slate-450 mb-4">Send a push warning or informational announcement to all department officers or select a targeted agency channel.</p>
          
          <form className="space-y-4" onSubmit={handleBroadcast}>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Target Channel Reach
              </label>
              <select 
                className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 text-slate-750 dark:text-slate-300 cursor-pointer" 
                value={notificationForm.department} 
                onChange={(e) => setNotificationForm({ ...notificationForm, department: e.target.value })}
              >
                <option value="all">All Departments (Global Reach)</option>
                {departments.map((department) => (
                  <option key={department._id} value={department._id}>{department.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1" htmlFor="broadcast-title">
                Broadcast Title
              </label>
              <input 
                id="broadcast-title"
                className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 text-slate-850 dark:text-white" 
                placeholder="Alert Title or Announcement summary" 
                value={notificationForm.title} 
                onChange={(e) => setNotificationForm({ ...notificationForm, title: e.target.value })} 
                required 
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1" htmlFor="broadcast-msg">
                Alert Message Body
              </label>
              <textarea 
                id="broadcast-msg"
                rows="3"
                className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 text-slate-850 dark:text-white" 
                placeholder="Write message contents here..." 
                value={notificationForm.message} 
                onChange={(e) => setNotificationForm({ ...notificationForm, message: e.target.value })} 
                required 
              />
            </div>

            <button 
              className="rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-4 py-2.5 shadow-sm transition flex items-center gap-1.5" 
              type="submit"
            >
              <Megaphone size={14} />
              <span>Broadcast Announcement</span>
            </button>
          </form>
        </div>
      )}

      {/* Departments Listing Drawer / Popup */}
      {showDepartments && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            <button 
              className="absolute right-4 top-4 p-2 rounded-xl text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-850 transition" 
              onClick={closeDepartments}
            >
              <X size={20} />
            </button>

            <div className="mb-6">
              <p className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">MUNICIPAL MATRIX</p>
              <h2 className="text-2xl font-black text-slate-850 dark:text-white font-heading mt-1">Manage Departments</h2>
            </div>

            {/* Matrix grid */}
            <div className="grid lg:grid-cols-[1fr_1.5fr] gap-6">
              {/* Left Column: list of departments */}
              <div className="space-y-3">
                {departments.map((department) => (
                  <button 
                    key={department._id} 
                    className={`w-full text-left rounded-2xl border p-4 transition duration-150 ${
                      selectedDepartment === department._id 
                        ? 'border-brand-600 bg-brand-50/20 dark:border-brand-550 dark:bg-brand-950/15' 
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-350'
                    }`} 
                    onClick={() => fetchDepartmentDetails(department._id)}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">{department.code}</span>
                        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mt-0.5">{department.name}</h3>
                      </div>
                      <span className="rounded-md bg-slate-50 dark:bg-slate-950 border px-2 py-0.5 text-3xs font-extrabold text-slate-500 uppercase">
                        {department.employeeCount} Officers
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Right Column: details of selected department */}
              <div className="rounded-2xl border border-slate-250/70 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 min-h-[300px] flex flex-col">
                {departmentLoading ? (
                  <div className="m-auto flex flex-col items-center gap-2 text-slate-450">
                    <Loader2 className="animate-spin" size={24} />
                    <span className="text-xs font-semibold">Fetching officers registry...</span>
                  </div>
                ) : departmentError ? (
                  <div className="m-auto flex flex-col items-center gap-2 text-red-500">
                    <AlertCircle size={24} />
                    <p className="text-xs font-semibold">{departmentError}</p>
                  </div>
                ) : !departmentDetails ? (
                  <div className="m-auto text-center text-slate-400">
                    <Building2 className="mx-auto mb-2 opacity-50" size={32} />
                    <p className="text-xs font-bold">No Department Selected</p>
                    <p className="text-[11px] mt-0.5">Select an agency from the list to view officers and credentials.</p>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="mb-5 pb-4 border-b border-slate-100 dark:border-slate-850">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Prefix Code: {departmentDetails.department.code}</span>
                        <h3 className="text-xl font-black text-slate-800 dark:text-slate-150 mt-1">{departmentDetails.department.name}</h3>
                        {departmentDetails.department.description && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{departmentDetails.department.description}</p>
                        )}
                      </div>

                      {/* Employees list */}
                      <div>
                        <span className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-3">Registered Officers</span>
                        {departmentDetails.employees.length ? (
                          <div className="space-y-3">
                            {departmentDetails.employees.map((employee) => (
                              <div 
                                key={employee._id} 
                                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-slate-200 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/20 p-4"
                              >
                                <div>
                                  <p className="text-xs font-bold text-slate-850 dark:text-white leading-snug">{employee.fullName}</p>
                                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{employee.email}</p>
                                  <span className="inline-block text-[9px] uppercase tracking-wider font-extrabold text-slate-400 mt-1">{employee.role}</span>
                                </div>
                                <button 
                                  className="rounded-lg border border-red-200 hover:bg-red-50 dark:border-red-950/30 dark:hover:bg-red-950/20 px-3 py-1.5 text-[10px] font-bold text-red-650 dark:text-red-400 flex items-center gap-1 transition self-start sm:self-auto" 
                                  onClick={() => handleDeleteOfficer(employee._id, employee.fullName)}
                                >
                                  <Trash2 size={12} />
                                  <span>De-register</span>
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-450 italic mt-3">No officer accounts provisioned for this department yet.</p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end pt-5 border-t border-slate-100 dark:border-slate-850 mt-6">
                      <button 
                        className="rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2 flex items-center gap-1.5 shadow-sm transition" 
                        onClick={() => handleDeleteDepartment(departmentDetails.department._id, departmentDetails.department.name)}
                      >
                        <Trash2 size={14} />
                        <span>Delete Department</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
