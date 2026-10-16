import { createContext, useContext, useState, useEffect } from 'react';
import { ALL_VISAS } from '../data/visasData';
import { API_BASE_URL, ENDPOINTS, apiFetch } from '../config/apiConfig';

const DEFAULT_APPLICATIONS = [];

const AdminContext = createContext(undefined);

export const AdminProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem('pehla_visa_admin_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [visas, setVisas] = useState([]);
  const [applications, setApplications] = useState([]);

  const fetchVisas = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/visas`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setVisas(data);
          return data;
        }
      }
    } catch (err) {
      console.warn('[Admin REST API] Visas fetch warning:', err);
    }
    return [];
  };

  const fetchApplications = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/applications`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setApplications(data);
          return data;
        }
      }
    } catch (err) {
      console.warn('[Admin REST API] Applications fetch warning:', err);
    }
    return [];
  };

  // Fetch live data from MongoDB REST API on initial mount
  useEffect(() => {
    fetchVisas();
    fetchApplications();
  }, []);

  const loginAdmin = (userData, token, refreshToken) => {
    const user = userData || {
      id: 'admin-1',
      name: 'Pehla Visa Admin',
      email: 'admin@phelavisa.com',
      role: 'ADMIN',
    };
    setAdminUser(user);
    try {
      localStorage.setItem('pehla_visa_admin_session', JSON.stringify(user));
      if (token) localStorage.setItem('pehla_visa_admin_token', token);
      if (refreshToken) localStorage.setItem('pehla_visa_admin_refresh_token', refreshToken);
    } catch {
      // ignore
    }
  };

  const logoutAdmin = () => {
    setAdminUser(null);
    try {
      localStorage.removeItem('pehla_visa_admin_session');
      localStorage.removeItem('pehla_visa_admin_token');
      localStorage.removeItem('pehla_visa_admin_refresh_token');
    } catch {
      // ignore
    }
  };

  const updateVisa = async (updated) => {
    try {
      const res = await fetch(`${API_BASE_URL}/visas/${updated.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || 'Server error updating visa');
      }
      const savedDoc = await res.json();
      setVisas((prev) => prev.map((v) => (v.id === savedDoc.id ? savedDoc : v)));
      return savedDoc;
    } catch (err) {
      console.warn('API updateVisa error:', err);
      throw err;
    }
  };

  const addVisa = async (newVisa) => {
    try {
      const res = await fetch(`${API_BASE_URL}/visas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVisa),
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || 'Server error saving new visa');
      }
      const savedDoc = await res.json();
      setVisas((prev) => [savedDoc, ...prev.filter((v) => v.id !== savedDoc.id)]);
      return savedDoc;
    } catch (err) {
      console.warn('API addVisa error:', err);
      throw err;
    }
  };

  const deleteVisa = async (id) => {
    setVisas((prev) => prev.filter((v) => v.id !== id));
    try {
      await fetch(`${API_BASE_URL}/visas/${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.warn('API deleteVisa error:', err);
    }
  };

  const updateApplication = async (id, updateData) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id || app.bookingRefId === id ? { ...app, ...updateData } : app))
    );
    try {
      const res = await fetch(`${API_BASE_URL}/applications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      if (!res.ok) {
        throw new Error('Failed to update application');
      }
      const savedDoc = await res.json();
      setApplications((prev) =>
        prev.map((app) => (app.id === savedDoc.id || app.bookingRefId === savedDoc.bookingRefId ? savedDoc : app))
      );
      return savedDoc;
    } catch (err) {
      console.warn('API updateApplication error:', err);
      throw err;
    }
  };

  const updateApplicationStatus = async (id, status) => {
    return updateApplication(id, { applicationStatus: status });
  };

  return (
    <AdminContext.Provider
      value={{
        adminUser,
        loginAdmin,
        logoutAdmin,
        visas,
        setVisas,
        fetchVisas,
        updateVisa,
        addVisa,
        deleteVisa,
        applications,
        setApplications,
        fetchApplications,
        updateApplication,
        updateApplicationStatus,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
