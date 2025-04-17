import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Staff from './components/Staff';
import Properties from './components/Properties';
import Reports from './components/Reports'; // Import Reports
import Chatbot from './components/Chatbot';
import Login from './components/Login';
import Register from './components/Register';
import LandingPage from './components/LandingPage';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { t } = useTranslation();

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen text-lg">{t('loading')}</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AppLayout = ({ children }: { children: JSX.Element }) => (
  <div className="flex min-h-screen bg-gray-100">
    <Sidebar />
    <div className="flex-1 ml-64 p-4">
      {children}
      <Chatbot />
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Dashboard />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Staff />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/properties"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Properties />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Reports />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  );
}

export default App;