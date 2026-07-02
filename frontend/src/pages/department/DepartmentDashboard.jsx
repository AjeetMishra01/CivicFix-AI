import { useEffect, useMemo, useState } from 'react';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, Clock3, FileText, MessageSquare, PlusCircle, Star } from 'lucide-react';
import ThemeToggle from '../../components/common/ThemeToggle';
import useTheme from '../../hooks/useTheme';
import { formatStatus } from '../../utils/status';

const DepartmentDashboard = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showRemarkModal, setShowRemarkModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [remark, setRemark] = useState('');

  const fetchData = async () => {
    const [complaintsRes, departmentsRes] = await Promise.all([API.get('/complaints'), API.get('/departments')]);
    setComplaints(complaintsRes.data);
    setDepartments(departmentsRes.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

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
    if (statusFilter === 'all') return complaints;
    if (statusFilter === 'pending') return complaints.filter((c) => c.status === 'submitted' || c.status === 'accepted');
    return complaints.filter((c) => c.status === statusFilter);
  }, [complaints, statusFilter]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-wrap justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-civic-teal">Department dashboard</p>
            <h1 className="text-3xl font-semibold text-slate-800">{user?.department ? departments.find((d) => d._id === user.department)?.name : 'Officer workspace'}</h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
            <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium" onClick={logout}>Logout</button>
          </div>
        </header>

        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className={`rounded-2xl p-4 shadow-sm border ${statusFilter === 'all' ? 'border-brand-600 bg-brand-50' : 'border-slate-200 bg-white'} cursor-pointer transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-sm`} onClick={() => setStatusFilter('all')}>
            <div className="flex items-center gap-2 text-slate-500"><FileText size={18} /> All</div>
            <p className="text-2xl font-semibold mt-2">{stats.all}</p>
          </div>
          <div className={`rounded-2xl p-4 shadow-sm border ${statusFilter === 'pending' ? 'border-brand-600 bg-brand-50' : 'border-slate-200 bg-white'} cursor-pointer transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-sm`} onClick={() => setStatusFilter('pending')}>
            <div className="flex items-center gap-2 text-slate-500"><FileText size={18} /> Pending</div>
            <p className="text-2xl font-semibold mt-2">{stats.pending}</p>
          </div>
          <div className={`rounded-2xl p-4 shadow-sm border ${statusFilter === 'in-progress' ? 'border-brand-600 bg-brand-50' : 'border-slate-200 bg-white'} cursor-pointer transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-sm`} onClick={() => setStatusFilter('in-progress')}>
            <div className="flex items-center gap-2 text-slate-500"><Clock3 size={18} /> In Progress</div>
            <p className="text-2xl font-semibold mt-2">{stats.progress}</p>
          </div>
          <div className={`rounded-2xl p-4 shadow-sm border ${statusFilter === 'resolved' ? 'border-brand-600 bg-brand-50' : 'border-slate-200 bg-white'} cursor-pointer transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-sm`} onClick={() => setStatusFilter('resolved')}>
            <div className="flex items-center gap-2 text-slate-500"><CheckCircle2 size={18} /> Resolved</div>
            <p className="text-2xl font-semibold mt-2">{stats.resolved}</p>
          </div>
        </div>

        <div className="space-y-4">
          {filteredComplaints.map((complaint) => (
            <div key={complaint._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm cursor-pointer transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-sm" onClick={() => setSelectedComplaint(complaint)}>
              <div className="flex justify-between items-start gap-3">
                <div>
                  <p className="text-sm text-civic-teal font-medium">{complaint.category}</p>
                  <h3 className="text-lg font-semibold text-slate-800">{complaint.title}</h3>
                  <p className="text-sm text-slate-600 mt-2">{complaint.description}</p>
                </div>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">{formatStatus(complaint.status)}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {!['resolved'].includes(complaint.status) && (
                  <>
                    <button className="rounded-xl bg-brand-600 px-3 py-2 text-sm text-white transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-sm" onClick={(e) => { e.stopPropagation(); handleStatus(complaint._id, 'accepted'); }}>Accept</button>
                    <button className="rounded-xl bg-civic-amber px-3 py-2 text-sm text-white transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-sm" onClick={(e) => { e.stopPropagation(); handleStatus(complaint._id, 'in-progress'); }}>In Progress</button>
                    <button className="rounded-xl bg-civic-teal px-3 py-2 text-sm text-white transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-sm" onClick={(e) => { e.stopPropagation(); handleStatus(complaint._id, 'resolved'); }}>Resolve</button>
                    <button className="rounded-xl border px-3 py-2 text-sm transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-sm" onClick={(e) => { e.stopPropagation(); setSelectedComplaint(complaint); }}>
                      Remarks
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedComplaint && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-civic-teal">{selectedComplaint.category}</p>
                <h2 className="text-2xl font-semibold text-slate-800">{selectedComplaint.title}</h2>
              </div>
              <button className="text-sm font-medium text-slate-500" onClick={() => { setSelectedComplaint(null); setShowRemarkModal(false); setRemark(''); }}>Close</button>
            </div>
            <p className="text-sm text-slate-600 mt-4">{selectedComplaint.description}</p>
            <div className="grid gap-3 md:grid-cols-2 mt-5 text-sm text-slate-600">
              <div>
                <p className="font-medium text-slate-800">Address</p>
                <p>{selectedComplaint.address || 'Not provided'}</p>
              </div>
              <div>
                <p className="font-medium text-slate-800">Location</p>
                <p>{selectedComplaint.location || 'Not provided'}</p>
              </div>
              <div>
                <p className="font-medium text-slate-800">Status</p>
                <p>{formatStatus(selectedComplaint.status)}</p>
              </div>
              <div>
                <p className="font-medium text-slate-800">Created Date</p>
                <p>{new Date(selectedComplaint.createdAt).toLocaleString()}</p>
              </div>
            </div>
            {selectedComplaint.imageUrl && (
              <div className="mt-5">
                <p className="font-medium text-slate-800">Complaint image</p>
                <img src={selectedComplaint.imageUrl} alt="Complaint" className="mt-2 w-full rounded-2xl object-cover" />
              </div>
            )}
            {selectedComplaint.completionImageUrl && (
              <div className="mt-5">
                <p className="font-medium text-slate-800">Completion proof image</p>
                <img src={selectedComplaint.completionImageUrl} alt="Completion proof" className="mt-2 w-full rounded-2xl object-cover" />
              </div>
            )}
            <div className="mt-5">
              <p className="font-medium text-slate-800">Department remarks</p>
              {selectedComplaint.remarks?.length ? (
                <ul className="mt-2 space-y-2 text-sm text-slate-600">
                  {selectedComplaint.remarks.map((remarkItem, index) => (
                    <li key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                      {remarkItem}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-slate-500">No remarks yet</p>
              )}
            </div>
            {(selectedComplaint.rating || selectedComplaint.feedback) && (
              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-medium text-slate-800">Citizen feedback</p>
                <div className="mt-3 flex items-center gap-2 text-amber-500">
                  {Array.from({ length: selectedComplaint.rating || 0 }).map((_, index) => (
                    <Star key={index} size={18} />
                  ))}
                </div>
                <p className="mt-2 text-sm text-slate-600">{selectedComplaint.feedback || 'No feedback message provided.'}</p>
              </div>
            )}
            { !['resolved'].includes(selectedComplaint.status) && (
              <div className="mt-6 flex flex-wrap gap-3">
                <button className="rounded-xl bg-brand-600 px-3 py-2 text-sm text-white transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-sm" onClick={(e) => { e.stopPropagation(); handleStatus(selectedComplaint._id, 'accepted'); setSelectedComplaint(null); }}>Accept</button>
                <button className="rounded-xl bg-civic-amber px-3 py-2 text-sm text-white transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-sm" onClick={(e) => { e.stopPropagation(); handleStatus(selectedComplaint._id, 'in-progress'); setSelectedComplaint(null); }}>In Progress</button>
                <button className="rounded-xl bg-civic-teal px-3 py-2 text-sm text-white transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-sm" onClick={(e) => { e.stopPropagation(); handleStatus(selectedComplaint._id, 'resolved'); setSelectedComplaint(null); }}>Resolve</button>
                <button className="rounded-xl border px-3 py-2 text-sm transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-sm" onClick={(e) => { e.stopPropagation(); setShowRemarkModal(true); }}>Remarks</button>
              </div>
            ) }
          </div>
        </div>
      )}

      {showRemarkModal && selectedComplaint && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-xl">
            <h2 className="text-xl font-semibold">Add remarks</h2>
            <textarea className="w-full border rounded-xl px-3 py-2 mt-4" placeholder="Note to citizen or internal team" value={remark} onChange={(e) => setRemark(e.target.value)} />
            <div className="mt-4 flex justify-end gap-3">
              <button className="px-4 py-2 rounded-xl border" onClick={() => { setShowRemarkModal(false); setRemark(''); }}>
                Cancel
              </button>
              <button disabled={!remark.trim()} className="px-4 py-2 rounded-xl bg-brand-600 text-white disabled:cursor-not-allowed disabled:opacity-50" onClick={() => { handleStatus(selectedComplaint._id, selectedComplaint.status, remark); setShowRemarkModal(false); setSelectedComplaint(null); }}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentDashboard;
