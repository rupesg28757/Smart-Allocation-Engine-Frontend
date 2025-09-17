import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import OrganizationDashboard from './pages/OrganizationDashboard';
import AdminPanel from './pages/AdminPanel';
import AllocationResult from './pages/AllocationResutl';

export const UserContext = React.createContext();

function App() {
  const [user, setUser] = useState(null); // user object with role: 'student' | 'organization' | 'admin'

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <nav style={{ padding: 10, borderBottom: '1px solid #ccc' }}>
          <Link to="/" style={{ marginRight: 10 }}>Home</Link>
          {!user && <>
            <Link to="/login" style={{ marginRight: 10 }}>Login</Link>
            <Link to="/register" style={{ marginRight: 10 }}>Register</Link>
          </>}
          {user && user.role === 'student' && <Link to="/student" style={{ marginRight: 10 }}>Student Dashboard</Link>}
          {user && user.role === 'organization' && <Link to="/organization" style={{ marginRight: 10 }}>Organization Dashboard</Link>}
          {user && user.role === 'admin' && <Link to="/admin" style={{ marginRight: 10 }}>Admin Panel</Link>}
          {user && <button onClick={logout}>Logout</button>}
        </nav>
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          <Route path="/student" element={user && user.role === 'student' ? <StudentDashboard /> : <Navigate to="/login" />} />
          <Route path="/organization" element={user && user.role === 'organization' ? <OrganizationDashboard /> : <Navigate to="/login" />} />
          <Route path="/admin" element={user && user.role === 'admin' ? <AdminPanel /> : <Navigate to="/login" />} />
          <Route path="/allocation-result" element={user && user.role === 'student' ? <AllocationResult /> : <Navigate to="/login" />} />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

function Home({ user }) {
  return (
    <div style={{ padding: 20 }}>
      <h1>AI-Based Smart Allocation Engine for PM Internship Scheme</h1>
      {user ? (
        <p>Welcome, {user.name}!</p>
      ) : (
        <p>Please login or register to continue.</p>
      )}
    </div>
  );
}

export default App;