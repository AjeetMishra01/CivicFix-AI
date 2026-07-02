import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { formatStatus } from '../../utils/status';
import ThemeToggle from '../../components/common/ThemeToggle';
import useTheme from '../../hooks/useTheme';

const MyComplaintsPage = () => {
  const { theme, toggleTheme } = useTheme();
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

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between mb-6 gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Citizen portal</p>
            <h1 className="text-2xl font-semibold text-slate-800">My Complaints</h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
            <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium" onClick={() => navigate('/citizen')}>Back</button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {complaints.map((complaint) => (
            <button key={complaint._id} className="text-left rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-sm" onClick={() => setSelectedComplaint(complaint)}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-brand-600 font-medium">{complaint.category}</p>
                  <h3 className="text-lg font-semibold text-slate-800">{complaint.title}</h3>
                </div>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">{formatStatus(complaint.status)}</span>
              </div>
              <p className="text-sm text-slate-600 mt-3">{complaint.description}</p>
              <p className="text-sm text-slate-500 mt-4">{complaint.location}</p>
            </button>
          ))}
        </div>
      </div>

      {selectedComplaint && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-brand-600">{selectedComplaint.category}</p>
                <h2 className="text-xl font-semibold">{selectedComplaint.title}</h2>
              </div>
              <button onClick={() => setSelectedComplaint(null)}>Close</button>
            </div>
            <p className="text-sm text-slate-600 mt-3">{selectedComplaint.description}</p>
            {selectedComplaint.imageUrl && <img src={selectedComplaint.imageUrl} alt="Complaint" className="w-full h-48 object-cover rounded-xl mt-4" />}
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p><span className="font-medium">Status:</span> {formatStatus(selectedComplaint.status)}</p>
              <p><span className="font-medium">Department:</span> {selectedComplaint.department?.name || 'Not assigned'}</p>
              <p><span className="font-medium">Remarks:</span> {selectedComplaint.remarks?.join(', ') || 'No remarks yet'}</p>
              <p><span className="font-medium">Created:</span> {new Date(selectedComplaint.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyComplaintsPage;
