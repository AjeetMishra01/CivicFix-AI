import { useEffect, useMemo, useState, useRef } from 'react';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Bell, CheckCircle2, Clock3, FileText, MessageSquare, Star,
  X, AlertTriangle, ChevronRight, CornerDownRight, Check
} from 'lucide-react';
import DashboardLayout from '../../components/common/DashboardLayout';
import { formatStatus, getSeverityValue, sortComplaintsBySeverity } from '../../utils/status';

const DepartmentDashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showRemarkModal, setShowRemarkModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [remark, setRemark] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  const fetchData = async () => {
    const [complaintsRes, departmentsRes] = await Promise.all([API.get('/complaints'), API.get('/departments')]);
    setComplaints(sortComplaintsBySeverity(complaintsRes.data));
    setDepartments(departmentsRes.data);
  };

  useEffect(() => {
    fetchData();
    fetchNotifications();

    // Close notifications on click outside
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    const { data } = await API.get('/notifications');
    setNotifications(data);
  };

  const markNotificationRead = async (id) => {
    await API.put(`/notifications/${id}/read`);
    fetchNotifications();
  };

  const handleStatus = async (complaintId, status, note) => {
    if (status === 'resolved') {
      const confirmed = window.confirm('Are you sure you want to mark this complaint as Resolved? This action cannot be undone.');
      if (!confirmed) return;
    }

    const payload = { status };
    if (note?.trim()) payload.note = note.trim();
    await API.put(`/complaints/${complaintId}/status`, payload);
    setRemark('');
    fetchData();
  };

  const stats = useMemo(() => ({
    all: complaints.length,
    pending: complaints.filter((c) => c.status === 'submitted' || c.status === 'accepted').length,
    progress: complaints.filter((c) => c.status === 'in-progress').length,
    resolved: complaints.filter((c) => c.status === 'resolved').length
  }), [complaints]);

  const filteredComplaints = useMemo(() => {
    let nextComplaints = complaints;

    if (statusFilter === 'pending') {
      nextComplaints = complaints.filter((c) => c.status === 'submitted' || c.status === 'accepted');
    } else if (statusFilter !== 'all') {
      nextComplaints = complaints.filter((c) => c.status === statusFilter);
    }

    if (severityFilter !== 'All') {
      nextComplaints = nextComplaints.filter((c) => getSeverityValue(c.severity) === severityFilter);
    }

    return nextComplaints;
  }, [complaints, severityFilter, statusFilter]);

  const departmentName = user?.department
    ? departments.find((d) => d._id === user.department)?.name
    : 'Department Workspace';

  const unreadNotifications = notifications.filter((item) => !item.readBy?.includes(user?._id));

  // Severity style helper for department lists
  const getSeverityStyles = (severity) => {
    const val = getSeverityValue(severity);
    if (val === 'High') {
      return {
        badge: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900',
        border: 'border-l-4 border-l-red-500',
        bg: 'bg-red-50/10 dark:bg-red-950/5'
      };
    }
    if (val === 'Medium') {
      return {
        badge: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900',
        border: 'border-l-4 border-l-amber-500',
        bg: 'bg-amber-50/10 dark:bg-amber-950/5'
      };
    }
    return {
      badge: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900',
      border: 'border-l-4 border-l-blue-400',
      bg: 'bg-blue-50/10 dark:bg-blue-950/5'
    };
  };

  const getStatusBadgeStyle = (status) => {
    if (status === 'resolved') return 'bg-emerald-100 text-emerald-800 border-emerald-250 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
    if (status === 'in-progress') return 'bg-amber-100 text-amber-800 border-amber-250 dark:bg-amber-950/40 dark:text-amber-300 dark:border-emerald-800';
    if (status === 'accepted') return 'bg-blue-100 text-blue-800 border-blue-250 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800';
    return 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-350 dark:border-slate-700';
  };

  return (
    <DashboardLayout title={departmentName}>
      {/* Top action layout bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Operational Console</p>
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-0.5">Manage tasks, assign remarks, and mark resolutions.</h2>
        </div>

        {/* Notifications Dropdown Container */}
        <div className="relative" ref={notificationRef}>
          <button
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 shadow-sm transition"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={16} />
            <span>Notifications</span>
            {unreadNotifications.length > 0 && (
              <span className="h-5 min-w-[20px] px-1 bg-brand-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                {unreadNotifications.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-xl z-40 max-h-[400px] overflow-y-auto animate-fade-in-up">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                <span className="text-2xs uppercase tracking-wider font-extrabold text-slate-450">Broadcast Alerts</span>
                {unreadNotifications.length > 0 && (
                  <span className="text-[10px] text-brand-650 font-bold">{unreadNotifications.length} unread</span>
                )}
              </div>

              {notifications.length > 0 ? (
                <div className="space-y-2">
                  {notifications.map((notification) => {
                    const isRead = notification.readBy?.includes(user?._id);
                    return (
                      <div
                        key={notification._id}
                        className={`rounded-xl border p-3 transition duration-150 ${isRead
                            ? 'border-slate-100 bg-slate-50/50 dark:border-slate-850 dark:bg-slate-950/20'
                            : 'border-brand-200/50 bg-brand-50/20 dark:border-brand-900/20 dark:bg-brand-950/10'
                          }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <p className="text-xs font-bold text-slate-800 dark:text-white leading-snug">{notification.title}</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{notification.message}</p>
                          </div>
                          {!isRead && (
                            <button
                              className="text-[10px] font-bold text-brand-600 hover:underline shrink-0"
                              onClick={() => markNotificationRead(notification._id)}
                            >
                              Mark read
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-400 text-center py-4 italic">No alerts broadcasted.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stats/Filter Grid Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <button
          className={`text-left rounded-2xl p-4 shadow-sm border transition flex flex-col justify-between ${statusFilter === 'all'
              ? 'border-brand-500 bg-brand-50/30 dark:bg-brand-950/20 text-brand-900 dark:text-brand-300'
              : 'border-slate-200/70 bg-white dark:bg-slate-900 hover:border-slate-350'
            }`}
          onClick={() => setStatusFilter('all')}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5"><FileText size={14} /> All Assigned</span>
          <p className="text-2xl font-black mt-2 text-slate-850 dark:text-slate-100">{stats.all}</p>
        </button>

        <button
          className={`text-left rounded-2xl p-4 shadow-sm border transition flex flex-col justify-between ${statusFilter === 'pending'
              ? 'border-brand-500 bg-brand-50/30 dark:bg-brand-950/20 text-brand-900 dark:text-brand-300'
              : 'border-slate-200/70 bg-white dark:bg-slate-900 hover:border-slate-355'
            }`}
          onClick={() => setStatusFilter('pending')}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5"><FileText size={14} /> Pending</span>
          <p className="text-2xl font-black mt-2 text-slate-850 dark:text-slate-100">{stats.pending}</p>
        </button>

        <button
          className={`text-left rounded-2xl p-4 shadow-sm border transition flex flex-col justify-between ${statusFilter === 'in-progress'
              ? 'border-brand-500 bg-brand-50/30 dark:bg-brand-950/20 text-brand-900 dark:text-brand-300'
              : 'border-slate-200/70 bg-white dark:bg-slate-900 hover:border-slate-355'
            }`}
          onClick={() => setStatusFilter('in-progress')}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5"><Clock3 size={14} /> In Progress</span>
          <p className="text-2xl font-black mt-2 text-slate-850 dark:text-slate-100">{stats.progress}</p>
        </button>

        <button
          className={`text-left rounded-2xl p-4 shadow-sm border transition flex flex-col justify-between ${statusFilter === 'resolved'
              ? 'border-brand-500 bg-brand-50/30 dark:bg-brand-950/20 text-brand-900 dark:text-brand-300'
              : 'border-slate-200/70 bg-white dark:bg-slate-900 hover:border-slate-355'
            }`}
          onClick={() => setStatusFilter('resolved')}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5"><CheckCircle2 size={14} /> Resolved</span>
          <p className="text-2xl font-black mt-2 text-slate-850 dark:text-slate-100">{stats.resolved}</p>
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="mb-6 flex items-center gap-3 bg-white dark:bg-slate-900 rounded-xl px-4 py-3 border border-slate-200/60 dark:border-slate-800/60 max-w-sm">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Severity:</span>
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 outline-none cursor-pointer flex-1"
        >
          <option>All</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
      </div>

      {/* Complaints list */}
      <div className="space-y-4">
        {filteredComplaints.length > 0 ? (
          filteredComplaints.map((complaint) => {
            const styles = getSeverityStyles(complaint.severity);
            return (
              <div
                key={complaint._id}
                className={`rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition duration-150 flex flex-col md:flex-row justify-between items-start md:items-center gap-5 cursor-pointer ${styles.border} ${styles.bg}`}
                onClick={() => setSelectedComplaint(complaint)}
              >
                {/* Left card details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300">
                      {complaint.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase border ${styles.badge}`}>
                      {getSeverityValue(complaint.severity)} Severity
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-850 dark:text-slate-100 leading-snug line-clamp-1">{complaint.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">{complaint.description}</p>
                </div>

                {/* Right actions/badges */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <span className={`rounded-full border px-2.5 py-0.5 text-3xs font-extrabold uppercase ${getStatusBadgeStyle(complaint.status)}`}>
                    {formatStatus(complaint.status)}
                  </span>

                  {complaint.status !== 'resolved' && (
                    <div className="flex items-center gap-2">
                      <button
                        className="rounded-lg bg-brand-600 hover:bg-brand-700 text-white px-3 py-1.5 text-2xs font-extrabold transition shadow-sm"
                        onClick={() => handleStatus(complaint._id, 'accepted')}
                      >
                        Accept
                      </button>
                      <button
                        className="rounded-lg bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 text-2xs font-extrabold transition shadow-sm"
                        onClick={() => handleStatus(complaint._id, 'in-progress')}
                      >
                        Start Work
                      </button>
                      <button
                        className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-2xs font-extrabold transition shadow-sm"
                        onClick={() => handleStatus(complaint._id, 'resolved')}
                      >
                        Resolve
                      </button>
                      <button
                        className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-2xs font-extrabold hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-650 dark:text-slate-300 transition"
                        onClick={() => { setSelectedComplaint(complaint); setShowRemarkModal(true); }}
                      >
                        Add Remark
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-12 text-center">
            <CheckCircle2 size={40} className="text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <p className="text-sm font-bold text-slate-750 dark:text-slate-300">Clean Queue</p>
            <p className="text-xs text-slate-500 dark:text-slate-450 mt-1">No complaints found for the selected severity or status filter.</p>
          </div>
        )}
      </div>

      {/* Selected Complaint Detail Drawer/Modal */}
      {selectedComplaint && !showRemarkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl relative">

            <button
              className="absolute right-4 top-4 p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850 transition"
              onClick={() => setSelectedComplaint(null)}
            >
              <X size={20} />
            </button>

            <div className="mb-4">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-350">
                {selectedComplaint.category}
              </span>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white font-heading mt-2">{selectedComplaint.title}</h2>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-350 mt-4 leading-relaxed">{selectedComplaint.description}</p>

            {/* Split specifications */}
            <div className="grid md:grid-cols-2 gap-6 mt-6 items-start">
              {/* Technical Specifications */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 space-y-3.5 text-xs">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Manual Location</span>
                    <p className="font-semibold text-slate-800 dark:text-white mt-0.5">{selectedComplaint.location}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Map Address</span>
                    <p className="text-slate-700 dark:text-slate-350 mt-0.5 leading-snug">{selectedComplaint.address || 'Not provided'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/50 dark:border-slate-850/40">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Severity Prioritization</span>
                      <p className={`font-semibold mt-1 inline-block border px-2 py-0.5 rounded-md text-[10px] uppercase ${getSeverityStyles(selectedComplaint.severity).badge}`}>
                        {getSeverityValue(selectedComplaint.severity)}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Workflow Status</span>
                      <p className="mt-1">
                        <span className={`inline-block text-[10px] font-extrabold uppercase border px-2 py-0.5 rounded-full ${getStatusBadgeStyle(selectedComplaint.status)}`}>
                          {formatStatus(selectedComplaint.status)}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-200/50 dark:border-slate-850/40">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Complaint Creation Date</span>
                    <p className="text-slate-650 dark:text-slate-300 mt-0.5">{new Date(selectedComplaint.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="space-y-4">
                {selectedComplaint.imageUrl && (
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-2">Complaint Image Proof</span>
                    <img src={selectedComplaint.imageUrl} alt="Complaint detail evidence" className="w-full rounded-2xl object-cover h-36 border border-slate-200 dark:border-slate-800 shadow-sm" />
                  </div>
                )}
                {selectedComplaint.completionImageUrl && (
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-2">Completion Image Proof</span>
                    <img src={selectedComplaint.completionImageUrl} alt="Completion proof" className="w-full rounded-2xl object-cover h-36 border border-slate-200 dark:border-slate-800 shadow-sm" />
                  </div>
                )}
              </div>
            </div>

            {/* Department Remarks */}
            <div className="mt-6 border-t border-slate-200/60 dark:border-slate-800/60 pt-5">
              <span className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-2.5">Remarks Audit Log</span>
              {selectedComplaint.remarks?.length ? (
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-350">
                  {selectedComplaint.remarks.map((remarkItem, index) => (
                    <li key={index} className="flex gap-2 rounded-xl border border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/20 p-3 items-start">
                      <CornerDownRight size={14} className="text-slate-400 shrink-0 mt-0.5" />
                      <span>{remarkItem}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-450 italic mt-1">No remarks added yet.</p>
              )}
            </div>

            {/* Citizen Feedback Rating */}
            {(selectedComplaint.rating || selectedComplaint.feedback) && (
              <div className="mt-6 border-t border-slate-200/60 dark:border-slate-800/60 pt-5 bg-amber-50/10 dark:bg-amber-950/5 p-4 rounded-2xl border border-amber-100/20">
                <span className="block text-[10px] uppercase tracking-wider font-bold text-amber-600 dark:text-amber-400 mb-2">Citizen Feedback Rating</span>
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: selectedComplaint.rating || 0 }).map((_, index) => (
                    <Star key={index} size={16} fill="currentColor" />
                  ))}
                </div>
                {selectedComplaint.feedback && (
                  <p className="mt-2 text-xs text-slate-650 dark:text-slate-300 leading-relaxed font-sans">{selectedComplaint.feedback}</p>
                )}
              </div>
            )}

            {/* Action Bar */}
            {selectedComplaint.status !== 'resolved' && (
              <div className="mt-8 pt-5 border-t border-slate-100 dark:border-slate-850 flex flex-wrap items-center gap-3">
                <button
                  className="rounded-xl bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 text-xs font-bold transition shadow-sm"
                  onClick={() => { handleStatus(selectedComplaint._id, 'accepted'); setSelectedComplaint(null); }}
                >
                  Accept complaint
                </button>
                <button
                  className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 text-xs font-bold transition shadow-sm"
                  onClick={() => { handleStatus(selectedComplaint._id, 'in-progress'); setSelectedComplaint(null); }}
                >
                  Start resolution
                </button>
                <button
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-xs font-bold transition shadow-sm"
                  onClick={() => { handleStatus(selectedComplaint._id, 'resolved'); setSelectedComplaint(null); }}
                >
                  Resolve complaint
                </button>
                <button
                  className="rounded-xl border border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-250 px-4 py-2 text-xs font-bold transition"
                  onClick={() => setShowRemarkModal(true)}
                >
                  Append remark
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Remark Popup Input Modal */}
      {showRemarkModal && selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 w-full max-w-md border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            <h2 className="text-lg font-bold text-slate-850 dark:text-white font-heading">Append Remark</h2>
            <p className="text-2xs text-slate-500 mt-0.5">Your comments are logged on the ticket and visible to citizen auditors.</p>

            <textarea
              rows="3"
              className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 text-slate-850 dark:text-white mt-4"
              placeholder="e.g. Sent repair truck to inspect coordinates, completion estimated by 3pm."
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />

            <div className="mt-5 flex justify-end gap-2.5">
              <button
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-350 text-xs font-bold hover:bg-slate-50 transition"
                onClick={() => { setShowRemarkModal(false); setRemark(''); }}
              >
                Cancel
              </button>
              <button
                disabled={!remark.trim()}
                className="px-4 py-2 rounded-lg bg-brand-650 text-white text-xs font-bold disabled:cursor-not-allowed disabled:opacity-50 transition"
                onClick={() => { handleStatus(selectedComplaint._id, selectedComplaint.status, remark); setShowRemarkModal(false); setSelectedComplaint(null); }}
              >
                Save Comment
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default DepartmentDashboard;
