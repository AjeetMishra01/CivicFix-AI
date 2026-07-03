import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import { AlertCircle, CheckCircle2, ClipboardList, Filter, MapPin, Search, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MapPicker, { geocodeAddress } from '../../components/common/MapPicker';
import ThemeToggle from '../../components/common/ThemeToggle';
import Toast from '../../components/common/Toast';
import useTheme from '../../hooks/useTheme';
import { formatStatus } from '../../utils/status';

const CitizenDashboard = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [form, setForm] = useState({ title: '', description: '', category: 'General', location: '', address: '', latitude: '', longitude: '', imageUrl: '' });
  const [locationError, setLocationError] = useState('');
  const [feedback, setFeedback] = useState({ rating: 5, message: '' });
  const [uploadFile, setUploadFile] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const fetchComplaints = async () => {
    const res = await API.get('/complaints');
    setComplaints(res.data);
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const filteredComplaints = useMemo(() => {
    return complaints.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || item.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'All' || item.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [complaints, search, category]);

  const handleCreate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('category', form.category);
    formData.append('location', form.location);
    formData.append('address', form.address);
    formData.append('latitude', form.latitude);
    formData.append('longitude', form.longitude);
    if (uploadFile) formData.append('image', uploadFile);
    await API.post('/complaints', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    setShowModal(false);
    setForm({ title: '', description: '', category: 'General', location: '', address: '', latitude: '', longitude: '', imageUrl: '' });
    setUploadFile(null);
    setLocationError('');
    fetchComplaints();
    setToastMessage('Complaint submitted successfully');
  };

  const handleGeocodeAddress = async () => {
    if (!form.address?.trim()) {
      setLocationError('Enter an address before locating it on the map');
      return;
    }

    try {
      setLocationError('');
      const locationData = await geocodeAddress(form.address.trim());
      setForm({
        ...form,
        latitude: locationData.lat,
        longitude: locationData.lng,
        address: locationData.address,
        location: form.location || locationData.location
      });
    } catch (error) {
      setLocationError('Unable to find that address. Please verify and try again.');
    }
  };

  const handleFeedback = async (e) => {
    e.preventDefault();
    await API.post(`/complaints/${selectedComplaint._id}/feedback`, { rating: feedback.rating, feedback: feedback.message });
    setSelectedComplaint(null);
    setFeedback({ rating: 5, message: '' });
    fetchComplaints();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Toast message={toastMessage} onClose={() => setToastMessage('')} />
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Citizen portal</p>
            <h1 className="text-3xl font-semibold text-slate-800">Welcome, {user?.fullName}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
            <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium" onClick={logout}>Logout</button>
            <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium" onClick={() => navigate('/citizen/my-complaints')}>My Complaints</button>
            <button className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white" onClick={() => setShowModal(true)}>Raise Complaint</button>
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 text-slate-500"><ClipboardList size={18} /> Total Reports</div>
            <p className="text-2xl font-semibold mt-2">{complaints.length}</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 text-slate-500"><CheckCircle2 size={18} /> Resolved</div>
            <p className="text-2xl font-semibold mt-2">{complaints.filter((c) => c.status === 'resolved').length}</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 text-slate-500"><AlertCircle size={18} /> In Progress</div>
            <p className="text-2xl font-semibold mt-2">{complaints.filter((c) => c.status === 'in-progress').length}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-slate-400" size={18} />
              <input className="w-full border rounded-xl pl-10 pr-3 py-2" placeholder="Search by issue or location" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="flex items-center gap-2 border rounded-xl px-3 py-2">
              <Filter size={16} className="text-slate-400" />
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="outline-none bg-transparent">
                <option>All</option>
                <option>General</option>
                <option>Roads</option>
                <option>Water</option>
                <option>Safety</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {filteredComplaints.map((complaint) => (
            <div key={complaint._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-sm">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <p className="text-sm text-brand-600 font-medium">{complaint.category}</p>
                  <h3 className="text-lg font-semibold text-slate-800">{complaint.title}</h3>
                </div>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">{formatStatus(complaint.status)}</span>
              </div>
              <p className="text-sm text-slate-600 mt-3">{complaint.description}</p>
              <div className="flex items-center gap-2 mt-4 text-sm text-slate-500"><MapPin size={16} /> {complaint.location}</div>
              <div className="flex justify-between items-center mt-5">
                <button className="text-sm font-medium text-brand-600" onClick={() => setSelectedComplaint(complaint)}>View details</button>
                {complaint.status === 'resolved' && (
                  <button className="text-sm font-medium text-civic-teal" onClick={() => setSelectedComplaint(complaint)}>Leave feedback</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 overflow-hidden">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold">Raise a complaint</h2>
            <form className="mt-4 space-y-3" onSubmit={handleCreate}>
              <input className="w-full border rounded-xl px-3 py-2" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              <textarea className="w-full border rounded-xl px-3 py-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
              <input className="w-full border rounded-xl px-3 py-2" type="file" accept="image/*" onChange={(e) => setUploadFile(e.target.files[0])} />
              <input className="w-full border rounded-xl px-3 py-2" placeholder="Manual address" value={form.address} onChange={(e) => {
                setForm({ ...form, address: e.target.value });
                setLocationError('');
              }} />
              <button type="button" className="rounded-xl border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-700" onClick={handleGeocodeAddress}>
                Find address on map
              </button>
              {locationError && <p className="text-xs text-rose-600">{locationError}</p>}
              <input className="w-full border rounded-xl px-3 py-2" placeholder="Location name" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
              <div className="rounded-xl border p-3">
                <p className="text-sm text-slate-500 mb-2">Choose a location on the map</p>
                <MapPicker
                  value={{ lat: form.latitude ? Number(form.latitude) : null, lng: form.longitude ? Number(form.longitude) : null }}
                  onChange={(coords) => setForm({
                    ...form,
                    latitude: coords.lat,
                    longitude: coords.lng,
                    address: coords.address || form.address,
                    location: coords.location || form.location
                  })}
                />
              </div>
              <select className="w-full border rounded-xl px-3 py-2" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option>General</option>
                <option>Roads</option>
                <option>Water</option>
                <option>Safety</option>
              </select>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" className="px-4 py-2 rounded-xl border" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-brand-600 text-white">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}

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
              <p><span className="font-medium">Title:</span> {selectedComplaint.title}</p>
              <p><span className="font-medium">Description:</span> {selectedComplaint.description}</p>
              <p><span className="font-medium">Location:</span> {selectedComplaint.location}</p>
              <p><span className="font-medium">Address:</span> {selectedComplaint.address || 'Not provided'}</p>
              <p><span className="font-medium">Status:</span> {formatStatus(selectedComplaint.status)}</p>
              <p><span className="font-medium">Department:</span> {selectedComplaint.department?.name || 'Not assigned'}</p>
              <p><span className="font-medium">Remarks:</span> {selectedComplaint.remarks?.join(', ') || 'No remarks yet'}</p>
              <p><span className="font-medium">Created:</span> {new Date(selectedComplaint.createdAt).toLocaleString()}</p>
            </div>
            {selectedComplaint.status === 'resolved' && (
              <form className="mt-5 space-y-3" onSubmit={handleFeedback}>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button key={num} type="button" onClick={() => setFeedback({ ...feedback, rating: num })} className={`rounded-full p-1 ${feedback.rating >= num ? 'text-amber-500' : 'text-slate-300'}`}>
                      <Star size={18} fill="currentColor" />
                    </button>
                  ))}
                </div>
                <textarea className="w-full border rounded-xl px-3 py-2" placeholder="Share your feedback" value={feedback.message} onChange={(e) => setFeedback({ ...feedback, message: e.target.value })} />
                <button className="rounded-xl bg-civic-teal px-4 py-2 text-white" type="submit">Submit feedback</button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CitizenDashboard;
