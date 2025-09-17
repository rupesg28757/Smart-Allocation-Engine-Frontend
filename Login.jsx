import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../App';
import { useNavigate } from 'react-router-dom';

const API_URL = 'https://smart-allocation-engine-8.onrender.com'; // Flask backend

export default function Login() {
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (role === 'admin') {
        // ✅ Hardcoded admin login
        if (email === 'admin@admin.com' && password === 'admin123') {
          setUser({ id: 0, name: 'Admin', email, role: 'admin' });
          navigate('/admin');
        } else {
          setError('Invalid admin credentials');
        }
        return;
      }

      // ✅ Student / Organization login through Flask API
      const res = await axios.post(`${API_URL}/login/${role}`, { email, password });
      setUser({ ...res.data, role });

      if (role === 'student') navigate('/student');
      else if (role === 'organization') navigate('/organization');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '20px auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Login as {role.charAt(0).toUpperCase() + role.slice(1)}</h2>
      <div>
        <label>
          <input type="radio" checked={role === 'student'} onChange={() => setRole('student')} />
          Student
        </label>
        <label style={{ marginLeft: 20 }}>
          <input type="radio" checked={role === 'organization'} onChange={() => setRole('organization')} />
          Organization
        </label>
        <label style={{ marginLeft: 20 }}>
          <input type="radio" checked={role === 'admin'} onChange={() => setRole('admin')} />
          Admin
        </label>
      </div>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={inputStyle} />
        <button type="submit" style={buttonStyle}>Login</button>
      </form>
      {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
      {role === 'admin' && <p>Admin credentials: email: admin@admin.com, password: admin123</p>}
    </div>
  );
}

const inputStyle = {
  display: 'block',
  width: '100%',
  padding: 8,
  margin: '10px 0',
  fontSize: 16,
  borderRadius: 4,
  border: '1px solid #ccc',
};

const buttonStyle = {
  padding: '10px 20px',
  fontSize: 16,
  borderRadius: 4,
  border: 'none',
  backgroundColor: '#007BFF',
  color: 'white',
  cursor: 'pointer',
};
