import { useEffect, useMemo, useState } from 'react';
import { Building2, LayoutDashboard, ShieldCheck } from 'lucide-react';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../../components/common/ThemeToggle';
import Toast from '../../components/common/Toast';
import useTheme from '../../hooks/useTheme';
import { formatStatus } from '../../utils/status';

const AdminDashboard = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
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

  const fetchData = async () => {
    const [complaintsRes, departmentsRes] = await Promise.all([API.get('/complaints/all'), API.get('/departments')]);
    setComplaints(complaintsRes.data);
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

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Toast message={toastMessage} onClose={() => setToastMessage('')} />
        <header className="flex flex-wrap justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Admin console</p>
            <h1 className="text-3xl font-semibold text-slate-800">Platform management</h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
            <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium" onClick={logout}>Logout</button>
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-200"><div className="flex items-center gap-2 text-slate-500"><LayoutDashboard size={18} /> Complaints</div><p className="text-2xl font-semibold mt-2">{stats.total}</p></div>
          <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-200"><div className="flex items-center gap-2 text-slate-500"><ShieldCheck size={18} /> Resolved</div><p className="text-2xl font-semibold mt-2">{stats.resolved}</p></div>
          <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-200 cursor-pointer hover:border-brand-600" onClick={openDepartments}>
            <div className="flex items-center gap-2 text-slate-500"><Building2 size={18} /> Departments</div>
            <p className="text-2xl font-semibold mt-2">{stats.departments}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold mb-4">Create department</h2>
            <form className="space-y-3" onSubmit={handleDepartment}>
              <input className="w-full border rounded-xl px-3 py-2" placeholder="Department name" value={departmentForm.name} onChange={(e) => setDepartmentForm({ ...departmentForm, name: e.target.value })} required />
              <input className="w-full border rounded-xl px-3 py-2" placeholder="Code" value={departmentForm.code} onChange={(e) => setDepartmentForm({ ...departmentForm, code: e.target.value })} required />
              <textarea className="w-full border rounded-xl px-3 py-2" placeholder="Description" value={departmentForm.description} onChange={(e) => setDepartmentForm({ ...departmentForm, description: e.target.value })} />
              <button className="rounded-xl bg-brand-600 text-white px-4 py-2" type="submit">Save department</button>
            </form>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold mb-4">Create officer account</h2>
            <form className="space-y-3" onSubmit={handleOfficer}>
              <input className="w-full border rounded-xl px-3 py-2" placeholder="Officer name" value={officerForm.fullName} onChange={(e) => setOfficerForm({ ...officerForm, fullName: e.target.value })} required />
              <input className="w-full border rounded-xl px-3 py-2" placeholder="Email" value={officerForm.email} onChange={(e) => setOfficerForm({ ...officerForm, email: e.target.value })} required />
              <input className="w-full border rounded-xl px-3 py-2" placeholder="Password" value={officerForm.password} onChange={(e) => setOfficerForm({ ...officerForm, password: e.target.value })} required />
              <select className="w-full border rounded-xl px-3 py-2" value={officerForm.department} onChange={(e) => setOfficerForm({ ...officerForm, department: e.target.value })} required>
                <option value="">Select department</option>
                {departments.map((department) => <option key={department._id} value={department._id}>{department.name}</option>)}
              </select>
              <button className="rounded-xl bg-civic-teal text-white px-4 py-2" type="submit">Create officer</button>
            </form>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200 mt-6">
          <h2 className="text-xl font-semibold mb-4">All complaints</h2>
          <div className="space-y-3">
            {complaints.map((complaint) => (
              <div key={complaint._id} className="flex justify-between items-center border rounded-xl p-3">
                <div>
                  <p className="font-medium">{complaint.title}</p>
                  <p className="text-sm text-slate-500">{complaint.citizen?.fullName} • {complaint.department?.name}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">{formatStatus(complaint.status)}</span>
              </div>
            ))}
          </div>
        </div>

      {showDepartments && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Department management</p>
                <h2 className="text-3xl font-semibold text-slate-800">Departments</h2>
              </div>
              <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium" onClick={closeDepartments}>Close</button>
            </div>

            <div className="grid lg:grid-cols-[1fr_1.5fr] gap-6">
              <div className="space-y-3">
                {departments.map((department) => (
                  <button key={department._id} className={`w-full text-left rounded-2xl border p-4 ${selectedDepartment === department._id ? 'border-brand-600 bg-brand-50' : 'border-slate-200 bg-white'} hover:border-brand-600`} onClick={() => fetchDepartmentDetails(department._id)}>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm text-slate-500">{department.code}</p>
                        <h3 className="text-lg font-semibold text-slate-800">{department.name}</h3>
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">{department.employeeCount} employees</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                {departmentLoading ? (
                  <p className="text-sm text-slate-500">Loading details...</p>
                ) : departmentError ? (
                  <p className="text-sm text-rose-600">{departmentError}</p>
                ) : !departmentDetails ? (
                  <p className="text-sm text-slate-500">Select a department to view details.</p>
                ) : (
                  <>
                    <div className="mb-5">
                      <p className="text-sm text-slate-500">{departmentDetails.department.code}</p>
                      <h3 className="text-2xl font-semibold text-slate-800">{departmentDetails.department.name}</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm font-medium text-slate-800">Employees</p>
                        {departmentDetails.employees.length ? (
                          <div className="mt-3 space-y-3">
                            {departmentDetails.employees.map((employee) => (
                              <div key={employee._id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                                <div>
                                  <p className="font-semibold text-slate-800">{employee.fullName}</p>
                                  <p className="text-sm text-slate-500">{employee.email}</p>
                                  <p className="text-sm text-slate-500">{employee.role}</p>
                                </div>
                                <button className="rounded-xl border px-3 py-2 text-sm" onClick={() => handleDeleteOfficer(employee._id, employee.fullName)}>Delete</button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-slate-500 mt-3">No employees found.</p>
                        )}
                      </div>
                      <div className="flex justify-end">
                        <button className="rounded-xl bg-rose-600 px-4 py-2 text-sm text-white" onClick={() => handleDeleteDepartment(departmentDetails.department._id, departmentDetails.department.name)}>
                          Delete Department
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default AdminDashboard;
