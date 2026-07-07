import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart3, TrendingUp, HelpCircle, Activity } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import API from '../../services/api';
import DashboardLayout from '../../components/common/DashboardLayout';

const AdminAnalyticsPage = () => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const { data } = await API.get('/complaints/analytics');
      setAnalytics(data);
    };

    fetchAnalytics();
  }, []);

  if (!analytics) {
    return (
      <DashboardLayout title="System Analytics">
        <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl min-h-[300px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mb-3"></div>
          <p className="text-xs text-slate-500 font-semibold">Aggregating platform performance metrics...</p>
        </div>
      </DashboardLayout>
    );
  }

  // Custom colors matching brand
  const statusColors = ['#64748b', '#3b82f6', '#f59e0b', '#10b981']; // Submitted, Accepted, In Progress, Resolved
  const severityColors = ['#ef4444', '#f59e0b', '#10b981']; // High, Medium, Low

  return (
    <DashboardLayout title="System Analytics">
      {/* Back navigation */}
      <div className="mb-6 flex items-center justify-between">
        <button 
          onClick={() => navigate('/admin')} 
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition"
        >
          <ArrowLeft size={16} />
          <span>Back to Command Center</span>
        </button>
      </div>

      <div className="space-y-6">
        {/* Core overview analytics stats card grid */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-sm border border-slate-200/60 dark:border-slate-800/60">
          <div className="flex items-center gap-2 text-slate-800 dark:text-white mb-5">
            <BarChart3 size={18} className="text-brand-500" />
            <h2 className="text-base font-bold">Key Performance Indicators</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Tickets', value: analytics.overview.totalComplaints, color: 'text-slate-850 dark:text-white' },
              { label: 'Pending / Submitted', value: analytics.overview.submitted, color: 'text-slate-500 dark:text-slate-400' },
              { label: 'Under Review', value: analytics.overview.accepted, color: 'text-blue-600 dark:text-blue-400' },
              { label: 'Resolution Active', value: analytics.overview.inProgress, color: 'text-amber-500 dark:text-amber-405' },
              { label: 'Resolved Tickets', value: analytics.overview.resolved, color: 'text-emerald-600 dark:text-emerald-450' },
              { label: 'High Priority', value: analytics.overview.highSeverity, color: 'text-red-650 dark:text-red-400' },
              { label: 'Medium Priority', value: analytics.overview.mediumSeverity, color: 'text-amber-600 dark:text-amber-400' },
              { label: 'Low Priority', value: analytics.overview.lowSeverity, color: 'text-emerald-650 dark:text-emerald-400' }
            ].map((card) => (
              <div key={card.label} className="rounded-xl border border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/20 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 leading-snug">{card.label}</p>
                <p className={`text-2xl font-black mt-1.5 ${card.color}`}>{card.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recharts graphs container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Complaints by Department */}
          <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-850 dark:text-white mb-5 uppercase tracking-wider">Tickets by Agency</h3>
            <div className="h-[260px] w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.complaintsByDepartment} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                      borderRadius: '12px', 
                      color: '#fff', 
                      border: 'none',
                      fontSize: '11px'
                    }} 
                  />
                  <Bar dataKey="complaints" fill="#2563eb" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Status Distribution */}
          <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-850 dark:text-white mb-5 uppercase tracking-wider">Status Distribution</h3>
            <div className="h-[260px] w-full text-xs flex flex-col justify-between">
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie 
                    data={analytics.statusDistribution} 
                    dataKey="value" 
                    nameKey="name" 
                    innerRadius={55} 
                    outerRadius={80} 
                    paddingAngle={3}
                  >
                    {analytics.statusDistribution.map((entry, index) => (
                      <Cell key={entry.name} fill={statusColors[index % statusColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                      borderRadius: '12px', 
                      color: '#fff', 
                      border: 'none',
                      fontSize: '11px' 
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
                {analytics.statusDistribution.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-550 dark:text-slate-400">
                    <span className="h-2.5 w-2.5 rounded-full inline-block shrink-0" style={{ backgroundColor: statusColors[index % statusColors.length] }}></span>
                    <span>{item.name}: {item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Severity Distribution */}
          <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-850 dark:text-white mb-5 uppercase tracking-wider">Severity Distribution</h3>
            <div className="h-[260px] w-full text-xs flex flex-col justify-between">
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie 
                    data={analytics.severityDistribution} 
                    dataKey="value" 
                    nameKey="name" 
                    outerRadius={80} 
                    paddingAngle={3}
                  >
                    {analytics.severityDistribution.map((entry, index) => (
                      <Cell key={entry.name} fill={severityColors[index % severityColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                      borderRadius: '12px', 
                      color: '#fff', 
                      border: 'none',
                      fontSize: '11px'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
                {analytics.severityDistribution.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-550 dark:text-slate-400">
                    <span className="h-2.5 w-2.5 rounded-full inline-block shrink-0" style={{ backgroundColor: severityColors[index % severityColors.length] }}></span>
                    <span>{item.name}: {item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Created over Time */}
          <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-850 dark:text-white mb-5 uppercase tracking-wider">Creation Velocity</h3>
            <div className="h-[260px] w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.complaintsOverTime} margin={{ top: 10, right: 15, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                  <XAxis dataKey="date" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                      borderRadius: '12px', 
                      color: '#fff', 
                      border: 'none',
                      fontSize: '11px'
                    }} 
                  />
                  <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={3} dot={{ strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Department Performance Table */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100 dark:border-slate-850">
            <h3 className="text-base font-bold text-slate-850 dark:text-white">Agency Resolution Metrics</h3>
            <p className="text-2xs text-slate-450 mt-0.5">Summary of ticket counts and speed rates resolved by municipal teams.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950 text-left text-slate-450 uppercase tracking-wider font-extrabold text-[10px]">
                <tr>
                  <th className="px-5 py-3.5">Department / Sector</th>
                  <th className="px-5 py-3.5">Total Backlog</th>
                  <th className="px-5 py-3.5">Resolved</th>
                  <th className="px-5 py-3.5">Pending Action</th>
                  <th className="px-5 py-3.5 text-right">Resolution Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-medium">
                {analytics.departmentStats.map((department) => (
                  <tr key={department._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition duration-150">
                    <td className="px-5 py-3.5 font-bold text-slate-800 dark:text-slate-200">{department.name}</td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-350">{department.totalComplaints}</td>
                    <td className="px-5 py-3.5 text-emerald-600 dark:text-emerald-400">{department.resolvedComplaints}</td>
                    <td className="px-5 py-3.5 text-amber-600 dark:text-amber-400">{department.pendingComplaints}</td>
                    <td className="px-5 py-3.5 text-right font-black text-slate-800 dark:text-slate-100">
                      <div className="inline-flex items-center gap-2">
                        {/* Little indicator */}
                        <div className="w-16 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden hidden sm:block">
                          <div 
                            className="bg-brand-500 h-full rounded-full" 
                            style={{ width: `${department.resolutionRate}%` }}
                          ></div>
                        </div>
                        <span>{department.resolutionRate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminAnalyticsPage;
