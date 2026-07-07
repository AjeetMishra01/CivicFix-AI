import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { formatStatus, getSeverityValue } from '../../utils/status';
import DashboardLayout from '../../components/common/DashboardLayout';
import { MapPin, X, ArrowLeft, ClipboardList, Clock, ShieldAlert, Globe } from 'lucide-react';

const MyComplaintsPage = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  useEffect(() => {
    const fetchMyComplaints = async () => {
      const res = await API.get('/complaints');
      setComplaints(res.data);
    };

    fetchMyComplaints();
  }, []);

  const getStatusBadgeStyle = (status) => {
    if (status === 'resolved') return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
    if (status === 'in-progress') return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
    if (status === 'accepted') return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800';
    return 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-355 dark:border-slate-700';
  };

  const getSeverityStyle = (severity) => {
    const value = getSeverityValue(severity);
    if (value === 'High') return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900';
    if (value === 'Medium') return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900';
    return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900';
  };

  return (
    <DashboardLayout title="My Reported Issues">
      <div className="mb-6 flex items-center justify-between">
        <button 
          onClick={() => navigate('/citizen')} 
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition"
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </button>
        <span className="text-xs text-slate-400 font-semibold">{complaints.length} tickets filed</span>
      </div>

      {complaints.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2">
          {complaints.map((complaint) => (
            <button 
              key={complaint._id} 
              className="text-left rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md hover:border-slate-350 dark:hover:border-slate-700 transition duration-150 flex flex-col justify-between" 
              onClick={() => setSelectedComplaint(complaint)}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-350">
                      {complaint.category}
                    </span>
                    {complaint.severity && (
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase border ${getSeverityStyle(complaint.severity)}`}>
                        {getSeverityValue(complaint.severity)} Priority
                      </span>
                    )}
                  </div>
                  <span className={`rounded-full border px-2 py-0.5 text-3xs font-extrabold uppercase ${getStatusBadgeStyle(complaint.status)}`}>
                    {formatStatus(complaint.status)}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-850 dark:text-slate-100 leading-snug line-clamp-1">{complaint.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">{complaint.description}</p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-850 flex items-center gap-1.5 text-2xs text-slate-400">
                <MapPin size={12} className="shrink-0" />
                <span className="truncate">{complaint.location}</span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-12 text-center">
          <ClipboardList size={40} className="text-slate-350 dark:text-slate-700 mx-auto mb-4" />
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">You haven't reported any issues yet</p>
          <p className="text-xs text-slate-500 dark:text-slate-450 mt-1">Submit your first complaint using the Raise Complaint tool in the home dashboard.</p>
        </div>
      )}

      {/* Complaint Detail Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            <button 
              className="absolute right-4 top-4 p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              onClick={() => setSelectedComplaint(null)}
            >
              <X size={20} />
            </button>

            <div className="mb-4">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-350">
                {selectedComplaint.category}
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-heading mt-2">{selectedComplaint.title}</h2>
            </div>

            <p className="text-sm text-slate-650 dark:text-slate-300 mt-3 leading-relaxed">{selectedComplaint.description}</p>
            
            {selectedComplaint.imageUrl && (
              <div className="mt-4 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                <img src={selectedComplaint.imageUrl} alt="Complaint detail evidence" className="w-full h-48 object-cover" />
              </div>
            )}

            <div className="mt-6 space-y-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Current Status</span>
                  <div className="mt-1">
                    <span className={`inline-block text-[10px] font-extrabold uppercase border px-2 py-0.5 rounded-full ${getStatusBadgeStyle(selectedComplaint.status)}`}>
                      {formatStatus(selectedComplaint.status)}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">AI Predicted Severity</span>
                  <div className="mt-1">
                    <span className={`inline-block text-[10px] font-extrabold uppercase border px-2 py-0.5 rounded-full ${getSeverityStyle(selectedComplaint.severity)}`}>
                      {getSeverityValue(selectedComplaint.severity)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/40">
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Assigned Department</span>
                <p className="font-semibold text-slate-800 dark:text-white mt-0.5">{selectedComplaint.department?.name || 'Awaiting automated routing'}</p>
              </div>

              <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/40">
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 font-sans">Official Comments & Remarks</span>
                {selectedComplaint.remarks?.length > 0 ? (
                  <ul className="space-y-1.5 mt-2">
                    {selectedComplaint.remarks.map((remark, index) => (
                      <li key={index} className="text-xs text-slate-600 dark:text-slate-350 pl-2.5 border-l-2 border-brand-500">
                        {remark}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-500 mt-1 italic">No remarks appended to this ticket yet.</p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/40 flex items-center gap-1 text-slate-400">
                <Clock size={12} />
                <span>Submitted on: {new Date(selectedComplaint.createdAt).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-end mt-6 pt-4 border-t border-slate-100 dark:border-slate-850">
              <button 
                className="px-5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-355 text-xs font-bold hover:bg-slate-50 transition" 
                onClick={() => setSelectedComplaint(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyComplaintsPage;
