import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Staff from './components/Staff';
import Properties from './components/Properties';
import Chatbot from './components/Chatbot';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import LandingPage from './components/LandingPage';

function App() {
  // This would come from your auth context
  const isAuthenticated = false;

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {isAuthenticated ? (
          <>
            <Sidebar />
            <div className="ml-64">
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/staff" element={<Staff />} />
                <Route path="/properties" element={<Properties />} />
              </Routes>
            </div>
            <Chatbot />
          </>
        ) : (
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
