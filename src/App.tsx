import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Chatbot from './components/Chatbot';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Sidebar />
        <div className="ml-64">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            {/* Add other routes as needed */}
          </Routes>
        </div>
        <Chatbot />
      </div>
    </Router>
  );
}

export default App;