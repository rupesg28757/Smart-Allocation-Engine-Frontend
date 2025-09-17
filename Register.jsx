import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'https://smart-allocation-engine-8.onrender.com';

const initialStudentData = {
  name: '',
  email: '',
  password: '',
  skills: '',
  interests: '',
  location_preference: '',
  internship_type: 'paid',
};

const initialOrganizationData = {
  name: '',
  email: '',
  password: '',
  projects: '',
  requirements: '',
};

export default function Register() {
  const [role, setRole] = useState('student');
  const [studentData, setStudentData] = useState(initialStudentData);
  const [organizationData, setOrganizationData] = useState(initialOrganizationData);
  const [message, setMessage] = useState(null);

  const handleStudentChange = (e) => {
    setStudentData({ ...studentData, [e.target.name]: e.target.value });
  };

  const handleOrganizationChange = (e) => {
    setOrganizationData({ ...organizationData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    try {
      if (role === 'student') {
        // ✅ Convert comma separated to arrays
        const payload = {
          ...studentData,
          skills: studentData.skills.split(',').map(s => s.trim()).filter(Boolean),
          interests: studentData.interests.split(',').map(s => s.trim()).filter(Boolean),
        };

        const res = await axios.post(`${API_URL}/register/student`, payload);
        setMessage(res.data.message || 'Student registered successfully');
        setStudentData(initialStudentData);

      } else {
        // ✅ Format projects and requirements
        const projectsArr = organizationData.projects
          .split(',')
          .map(p => ({ title: p.trim(), location: 'Any', internship_type: 'paid' }))
          .filter(p => p.title);

        const requirementsArr = organizationData.requirements
          .split(',')
          .map(r => [r.trim()])
          .filter(r => r[0]);

        if (projectsArr.length !== requirementsArr.length) {
          setMessage('Projects and Requirements count must match');
          return;
        }

        const payload = {
          ...organizationData,
          projects: projectsArr,
          requirements: requirementsArr,
        };

        const res = await axios.post(`${API_URL}/register/organization`, payload);
        setMessage(res.data.message || 'Organization registered successfully');
        setOrganizationData(initialOrganizationData);
      }
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error occurred');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '20px auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Register as {role === 'student' ? 'Student' : 'Organization'}</h2>
      <div>
        <label>
          <input type="radio" checked={role === 'student'} onChange={() => setRole('student')} />
          Student
        </label>
        <label style={{ marginLeft: 20 }}>
          <input type="radio" checked={role === 'organization'} onChange={() => setRole('organization')} />
          Organization
        </label>
      </div>

      {role === 'student' ? (
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Name" value={studentData.name} onChange={handleStudentChange} required style={inputStyle} />
          <input name="email" type="email" placeholder="Email" value={studentData.email} onChange={handleStudentChange} required style={inputStyle} />
          <input name="password" type="password" placeholder="Password" value={studentData.password} onChange={handleStudentChange} required style={inputStyle} />
          <input name="skills" placeholder="Skills (comma separated)" value={studentData.skills} onChange={handleStudentChange} required style={inputStyle} />
          <input name="interests" placeholder="Interests (comma separated)" value={studentData.interests} onChange={handleStudentChange} required style={inputStyle} />
          <input name="location_preference" placeholder="Location Preference" value={studentData.location_preference} onChange={handleStudentChange} required style={inputStyle} />
          <select name="internship_type" value={studentData.internship_type} onChange={handleStudentChange} style={inputStyle}>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
          <button type="submit" style={buttonStyle}>Register</button>
        </form>
      ) : (
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Organization Name" value={organizationData.name} onChange={handleOrganizationChange} required style={inputStyle} />
          <input name="email" type="email" placeholder="Email" value={organizationData.email} onChange={handleOrganizationChange} required style={inputStyle} />
          <input name="password" type="password" placeholder="Password" value={organizationData.password} onChange={handleOrganizationChange} required style={inputStyle} />
          <input name="projects" placeholder="Projects (comma separated titles)" value={organizationData.projects} onChange={handleOrganizationChange} required style={inputStyle} />
          <input name="requirements" placeholder="Requirements (comma separated skill per project)" value={organizationData.requirements} onChange={handleOrganizationChange} required style={inputStyle} />
          <button type="submit" style={buttonStyle}>Register</button>
        </form>
      )}
      {message && <p style={{ marginTop: 10 }}>{message}</p>}
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
