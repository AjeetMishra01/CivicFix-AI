import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import MyComplaintsPage from './pages/citizen/MyComplaintsPage';
import DepartmentDashboard from './pages/department/DepartmentDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import useTheme from './hooks/useTheme';

const ProtectedRoute = ({ role, children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
      </div>
    );
  }
  
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) {
    // Redirect wrong role to appropriate home dashboards
    if (user.role === 'citizen') return <Navigate to="/citizen" replace />;
    if (user.role === 'department') return <Navigate to="/department" replace />;
    return <Navigate to="/admin" replace />;
  }
  return children;
};

const AppShell = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.role === 'citizen') return <Navigate to="/citizen" replace />;
  if (user.role === 'department') return <Navigate to="/department" replace />;
  return <Navigate to="/admin" replace />;
};

function App() {
  useTheme();

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/citizen"
            element={
              <ProtectedRoute role="citizen">
                <CitizenDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/my-complaints"
            element={
              <ProtectedRoute role="citizen">
                <MyComplaintsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/department"
            element={
              <ProtectedRoute role="department">
                <DepartmentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute role="admin">
                <AdminAnalyticsPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<AppShell />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;