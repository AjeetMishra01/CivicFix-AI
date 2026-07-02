import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/auth/LoginPage';
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import MyComplaintsPage from './pages/citizen/MyComplaintsPage';
import DepartmentDashboard from './pages/department/DepartmentDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import useTheme from './hooks/useTheme';

const ProtectedRoute = ({ role, children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
};

const AppShell = () => {
  const { user } = useAuth();

  if (!user) {
    return <LoginPage />;
  }

  if (user.role === 'citizen') return <CitizenDashboard />;
  if (user.role === 'department') return <DepartmentDashboard />;
  return <AdminDashboard />;
};

function App() {
  useTheme();

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
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
          <Route path="*" element={<AppShell />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;