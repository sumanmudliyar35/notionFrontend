import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home/home';
import Leads from './pages/leads/Leads';
import Login from './pages/login/Login';
import Layout from './components/layout/Layout';
import Admin from './pages/admin/Admin';
import Notification from './pages/notification/Notification';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Routes without Layout, like login */}
        <Route path="/" element={<Login />} />

        {/* Routes wrapped in Layout */}
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/notifications" element={<Notification />} /> {/* Add this line */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
