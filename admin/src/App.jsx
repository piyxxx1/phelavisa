import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { AdminLayout } from './components/AdminLayout';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminVisasPage } from './pages/AdminVisasPage';
import { AdminVisaEditPage } from './pages/AdminVisaEditPage';
import { AdminApplicationsPage } from './pages/AdminApplicationsPage';
import { AdminB2BPage } from './pages/AdminB2BPage';
import { AdminReviewsPage } from './pages/AdminReviewsPage';
import { AdminDummyTicketsPage } from './pages/AdminDummyTicketsPage';
import './App.css';

const ProtectedAdminRoute = ({ children }) => {
  const { adminUser } = useAdmin();
  if (!adminUser) {
    return <Navigate to="/login" replace />;
  }
  return <AdminLayout>{children}</AdminLayout>;
};

const AdminMainRouter = () => {
  const { adminUser } = useAdmin();
  const navigate = useNavigate();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          adminUser ? (
            <Navigate to="/" replace />
          ) : (
            <AdminLoginPage onLoginSuccess={() => navigate('/')} />
          )
        }
      />
      <Route
        path="/"
        element={
          <ProtectedAdminRoute>
            <AdminDashboardPage
              onNavigateTab={(tab) => {
                if (tab === 'visas-new') navigate('/newvisa');
                else navigate(`/${tab === 'dashboard' ? '' : tab}`);
              }}
              onEditVisa={(visaId) => navigate(`/visas/edit/${visaId}`)}
            />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/visas"
        element={
          <ProtectedAdminRoute>
            <AdminVisasPage
              onNavigateNewVisa={() => navigate('/newvisa')}
              onEditVisa={(visaId) => navigate(`/visas/edit/${visaId}`)}
            />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/newvisa"
        element={
          <ProtectedAdminRoute>
            <AdminVisaEditPage
              onBack={() => navigate('/visas')}
              onSavedSuccess={() => navigate('/visas')}
            />
          </ProtectedAdminRoute>
        }
      />
      <Route path="/visas/new" element={<Navigate to="/newvisa" replace />} />
      <Route path="/visas/newvisa" element={<Navigate to="/newvisa" replace />} />
      <Route
        path="/visas/edit/:visaId"
        element={
          <ProtectedAdminRoute>
            <AdminVisaEditPage
              onBack={() => navigate('/visas')}
              onSavedSuccess={() => navigate('/visas')}
            />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/applications"
        element={
          <ProtectedAdminRoute>
            <AdminApplicationsPage />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/applications/:appId"
        element={
          <ProtectedAdminRoute>
            <AdminApplicationsPage />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/b2b"
        element={
          <ProtectedAdminRoute>
            <AdminB2BPage />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/reviews"
        element={
          <ProtectedAdminRoute>
            <AdminReviewsPage />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/dummy-tickets"
        element={
          <ProtectedAdminRoute>
            <AdminDummyTicketsPage />
          </ProtectedAdminRoute>
        }
      />
      <Route path="/settings" element={<Navigate to="/b2b" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default function App() {
  return (
    <AdminProvider>
      <AdminMainRouter />
    </AdminProvider>
  );
}
