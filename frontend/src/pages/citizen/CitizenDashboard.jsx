import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import { 
  AlertCircle, CheckCircle2, ClipboardList, Filter, MapPin, Search, Star,
  PlusCircle, Calendar, MessageSquare, ShieldAlert, ArrowRight, X, Clock, Upload, Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MapPicker, { geocodeAddress } from '../../components/common/MapPicker';
import Toast from '../../components/common/Toast';
import DashboardLayout from '../../components/common/DashboardLayout';
import { formatStatus, getResolutionTimeText, getSeverityValue, sortComplaintsBySeverity } from '../../utils/status';

const CitizenDashboard = () => {
  const { user } = useAuth();
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
  const [ratingHover, setRatingHover] = useState(null);

  const fetchComplaints = async () => {
    const res = await API.get('/complaints');
    setComplaints(sortComplaintsBySeverity(res.data));
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

  // Helper styles for severity and status badges
  const getSeverityStyle = (severity) => {
    const value = getSeverityValue(severity);
    if (value === 'High') return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900';
    if (value === 'Medium') return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900';
    return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900';
  };

  const getStatusBadgeStyle = (status) => {
    if (status === 'resolved') return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
    if (status === 'in-progress') return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
    if (status === 'accepted') return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800';
    return 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-350 dark:border-slate-700';
  };

  return (
    <DashboardLayout title="Citizen Portal">
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
      
      {/* Welcome Banner Card */}
      <div className="bg-gradient-to-r from-brand-600 to-indigo-700 dark:from-brand-800 dark:to-indigo-950 rounded-3xl p-6 md:p-8 text-white shadow-lg mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Hello, {user?.fullName}</h1>
          <p className="text-brand-100 text-sm mt-1">
            Have an issue in your neighborhood? Report it and watch AI route it to the right department.
          </p>
        </div>
        <button 
          className="rounded-2xl bg-white text-brand-700 hover:bg-slate-50 px-5 py-3 text-sm font-bold shadow-md hover:shadow-lg transition duration-150 active:scale-95 flex items-center gap-2 shrink-0"
          onClick={() => setShowModal(true)}
        >
          <span>Raise a Complaint</span>
          <PlusCircle size={18} />
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-sm border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Reports</span>
            <p className="text-3xl font-black mt-2 text-slate-800 dark:text-slate-100">{complaints.length}</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-500 flex items-center justify-center border border-slate-100 dark:border-slate-850">
            <ClipboardList size={22} />
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-sm border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-sans">Issues Resolved</span>
            <p className="text-3xl font-black mt-2 text-slate-800 dark:text-slate-100">
              {complaints.filter((c) => c.status === 'resolved').length}
            </p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100/20 dark:border-emerald-850/20">
            <CheckCircle2 size={22} />
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-sm border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">In Progress</span>
            <p className="text-3xl font-black mt-2 text-slate-800 dark:text-slate-100">
              {complaints.filter((c) => c.status === 'in-progress').length}
            </p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-100/20 dark:border-amber-850/20">
            <AlertCircle size={22} />
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200/60 dark:border-slate-800/60 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
            <input 
              className="w-full border border-slate-200 dark:border-slate-800 rounded-xl pl-11 pr-4 py-3 bg-white dark:bg-slate-900 text-slate-950 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 text-sm transition" 
              placeholder="Search complaints by description, title or place..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
            />
          </div>
          <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 shrink-0">
            <Filter size={16} className="text-slate-400" />
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)} 
              className="outline-none bg-transparent text-sm text-slate-700 dark:text-slate-350 cursor-pointer"
            >
              <option className="bg-white dark:bg-slate-900">All Categories</option>
              <option className="bg-white dark:bg-slate-900">General</option>
              <option className="bg-white dark:bg-slate-900">Roads</option>
              <option className="bg-white dark:bg-slate-900">Water</option>
              <option className="bg-white dark:bg-slate-900">Safety</option>
            </select>
          </div>
        </div>
      </div>

      {/* Complaints Grid */}
      {filteredComplaints.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredComplaints.map((complaint) => (
            <div 
              key={complaint._id} 
              className="rounded-2xl border border-slate-200/80 dark:border-slate-800/85 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition duration-150 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start gap-3 mb-3.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-350">
                      {complaint.category}
                    </span>
                    {complaint.severity && (
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase border ${getSeverityStyle(complaint.severity)}`}>
                        {getSeverityValue(complaint.severity)} Priority
                      </span>
                    )}
                  </div>
                  <span className={`rounded-full border px-2.5 py-0.5 text-2xs font-extrabold uppercase ${getStatusBadgeStyle(complaint.status)}`}>
                    {formatStatus(complaint.status)}
                  </span>
                </div>
                
                <h3 className="text-base font-bold text-slate-850 dark:text-slate-100 leading-snug line-clamp-1">{complaint.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">{complaint.description}</p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between gap-4">
                <div className="flex items-center gap-1.5 text-2xs text-slate-400 truncate">
                  <MapPin size={14} className="text-slate-450 shrink-0" />
                  <span className="truncate">{complaint.location}</span>
                </div>
                
                <div className="flex items-center gap-3 shrink-0">
                  <button 
                    className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1" 
                    onClick={() => setSelectedComplaint(complaint)}
                  >
                    <span>Details</span>
                    <ArrowRight size={12} />
                  </button>
                  {complaint.status === 'resolved' && (
                    <button 
                      className="text-xs font-bold text-emerald-600 dark:text-emerald-450 hover:underline flex items-center gap-1 border border-emerald-200/50 dark:border-emerald-800/40 bg-emerald-50/50 dark:bg-emerald-950/20 px-2.5 py-1 rounded-lg" 
                      onClick={() => setSelectedComplaint(complaint)}
                    >
                      Feedback
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-12 text-center">
          <ClipboardList size={40} className="text-slate-350 dark:text-slate-700 mx-auto mb-4" />
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No complaints found</p>
          <p className="text-xs text-slate-500 dark:text-slate-450 mt-1">Try refining your search terms or select another category filter.</p>
        </div>
      )}

      {/* Raise a Complaint Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            <button 
              className="absolute right-4 top-4 p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              onClick={() => setShowModal(false)}
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-heading">Submit a New Complaint</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Fill in the fields below. Our AI module will automatically route the ticket to the correct department.</p>

            <form className="mt-6 space-y-4" onSubmit={handleCreate}>
              {/* Category */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Category Type
                </label>
                <select 
                  className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/10 text-slate-800 dark:text-slate-100" 
                  value={form.category} 
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  <option>General</option>
                  <option>Roads</option>
                  <option>Water</option>
                  <option>Safety</option>
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1" htmlFor="complaint-title">
                  Issue Title <span className="text-red-500">*</span>
                </label>
                <input 
                  id="complaint-title"
                  className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/10 text-slate-850 dark:text-white" 
                  placeholder="Summarize the issue in a few words" 
                  value={form.title} 
                  onChange={(e) => setForm({ ...form, title: e.target.value })} 
                  required 
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1" htmlFor="complaint-desc">
                  Detailed Description <span className="text-red-500">*</span>
                </label>
                <textarea 
                  id="complaint-desc"
                  rows="3"
                  className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/10 text-slate-850 dark:text-white" 
                  placeholder="Provide details about the issue so our AI and departments can analyze it accurately..." 
                  value={form.description} 
                  onChange={(e) => setForm({ ...form, description: e.target.value })} 
                  required 
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Upload Image Evidence
                </label>
                <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 relative hover:bg-slate-100 transition cursor-pointer">
                  <Upload size={22} className="text-slate-450 mb-2" />
                  <span className="text-xs text-slate-500 font-semibold">{uploadFile ? uploadFile.name : 'Select JPG or PNG evidence file'}</span>
                  <input 
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => setUploadFile(e.target.files[0])} 
                  />
                </div>
              </div>

              {/* Address Search */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                <div className="sm:col-span-9">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1" htmlFor="complaint-address">
                    Search Address on Map
                  </label>
                  <input 
                    id="complaint-address"
                    className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/10 text-slate-850 dark:text-white" 
                    placeholder="Enter locality, street name, or area" 
                    value={form.address} 
                    onChange={(e) => {
                      setForm({ ...form, address: e.target.value });
                      setLocationError('');
                    }} 
                  />
                </div>
                <button 
                  type="button" 
                  className="sm:col-span-3 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 dark:border-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 py-3 transition"
                  onClick={handleGeocodeAddress}
                >
                  Locate Address
                </button>
              </div>
              {locationError && <p className="text-xs text-red-600 dark:text-red-400 mt-1 font-semibold">{locationError}</p>}

              {/* Location Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1" htmlFor="complaint-location-name">
                  Location Display Name <span className="text-red-500">*</span>
                </label>
                <input 
                  id="complaint-location-name"
                  className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/10 text-slate-850 dark:text-white" 
                  placeholder="e.g. Metro Corner, Sector 4 Block C" 
                  value={form.location} 
                  onChange={(e) => setForm({ ...form, location: e.target.value })} 
                  required 
                />
              </div>

              {/* Leaflet Map Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Confirm Coordinates on Map
                </label>
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

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-850">
                <button 
                  type="button" 
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350 font-bold hover:bg-slate-50 text-sm transition" 
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 text-white font-bold hover:from-brand-700 hover:to-brand-850 text-sm transition"
                >
                  Submit Complaint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Complaint Detail & Feedback Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl relative">
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

            {/* Split Details & Image */}
            <div className="grid md:grid-cols-2 gap-6 items-start mt-6">
              {/* Left Side: General Info */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 space-y-3.5 text-xs">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Description</span>
                    <p className="text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">{selectedComplaint.description}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Address Location</span>
                    <p className="text-slate-700 dark:text-slate-350 mt-1 flex items-center gap-1.5 leading-snug">
                      <MapPin size={12} className="text-brand-500" />
                      <span>{selectedComplaint.address || selectedComplaint.location || 'Not provided'}</span>
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/50 dark:border-slate-800/40">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Status</span>
                      <div className="mt-1">
                        <span className={`inline-block text-[10px] font-extrabold uppercase border px-2 py-0.5 rounded-full ${getStatusBadgeStyle(selectedComplaint.status)}`}>
                          {formatStatus(selectedComplaint.status)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">AI Severity</span>
                      <div className="mt-1">
                        <span className={`inline-block text-[10px] font-extrabold uppercase border px-2 py-0.5 rounded-full ${getSeverityStyle(selectedComplaint.severity)}`}>
                          {getSeverityValue(selectedComplaint.severity)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-2.5 border-t border-slate-200/50 dark:border-slate-800/40 flex items-center gap-2">
                    <Clock size={14} className="text-slate-400" />
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Estimated Resolution Time</span>
                      <p className="font-semibold text-slate-750 dark:text-slate-200">{getResolutionTimeText(selectedComplaint)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Image Evidence */}
              <div>
                <span className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-2">Image Evidence</span>
                {selectedComplaint.imageUrl ? (
                  <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
                    <img src={selectedComplaint.imageUrl} alt="Complaint evidence" className="w-full h-44 object-cover" />
                  </div>
                ) : (
                  <div className="rounded-2xl h-44 border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-400">
                    <Globe size={24} className="mb-2" />
                    <span className="text-xs">No image evidence provided</span>
                  </div>
                )}
              </div>
            </div>

            {/* Department Remarks */}
            <div className="mt-6 border-t border-slate-200/60 dark:border-slate-800/60 pt-5">
              <span className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-2">Official Department Remarks</span>
              <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
                <p className="text-2xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider mb-2">
                  Assigned Department: <span className="font-extrabold text-slate-700 dark:text-slate-350">{selectedComplaint.department?.name || 'Awaiting Routing'}</span>
                </p>
                
                {selectedComplaint.remarks?.length > 0 ? (
                  <ul className="space-y-2 mt-3">
                    {selectedComplaint.remarks.map((remarkItem, index) => (
                      <li key={index} className="text-xs text-slate-600 dark:text-slate-350 border-l-2 border-brand-500 pl-3 py-1">
                        {remarkItem}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-450 mt-2 italic">No official comments appended by resolving officers yet.</p>
                )}
              </div>
            </div>

            {/* Leave Feedback rating */}
            {selectedComplaint.status === 'resolved' && (
              <div className="mt-6 border-t border-slate-200/60 dark:border-slate-800/60 pt-5 bg-brand-50/20 dark:bg-brand-950/10 p-5 rounded-3xl border border-brand-200/20">
                <h3 className="text-sm font-extrabold text-slate-850 dark:text-white flex items-center gap-1.5">
                  <Star className="text-amber-500 fill-amber-500" size={16} />
                  <span>Rate Department Resolution</span>
                </h3>
                <p className="text-2xs text-slate-500 dark:text-slate-405 mt-0.5">Your ratings help evaluate agency performance and resolution latencies.</p>

                <form className="mt-4 space-y-4" onSubmit={handleFeedback}>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button 
                        key={num} 
                        type="button" 
                        onClick={() => setFeedback({ ...feedback, rating: num })} 
                        onMouseEnter={() => setRatingHover(num)}
                        onMouseLeave={() => setRatingHover(null)}
                        className="p-1.5 transition duration-150 transform hover:scale-115 text-slate-300 dark:text-slate-750"
                        aria-label={`Rate ${num} star`}
                      >
                        <Star 
                          size={24} 
                          fill={(ratingHover || feedback.rating) >= num ? "currentColor" : "none"} 
                          className={(ratingHover || feedback.rating) >= num ? "text-amber-500" : "text-slate-300 dark:text-slate-700"}
                        />
                      </button>
                    ))}
                  </div>
                  
                  <textarea 
                    rows="2"
                    className="w-full border border-slate-200 dark:border-slate-800 rounded-2xl px-3.5 py-2.5 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 text-slate-850 dark:text-white" 
                    placeholder="Tell us what you think of the resolution (optional)..." 
                    value={feedback.message} 
                    onChange={(e) => setFeedback({ ...feedback, message: e.target.value })} 
                  />
                  
                  <div className="flex justify-end">
                    <button 
                      className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 text-xs font-bold transition duration-150" 
                      type="submit"
                    >
                      Submit Feedback
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="flex justify-end mt-6 pt-4 border-t border-slate-100 dark:border-slate-850">
              <button 
                className="px-5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350 text-xs font-bold hover:bg-slate-50 transition" 
                onClick={() => setSelectedComplaint(null)}
              >
                Close details
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default CitizenDashboard;
