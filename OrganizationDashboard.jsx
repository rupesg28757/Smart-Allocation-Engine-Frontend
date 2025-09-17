import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../App';

const API_URL = 'https://smart-allocation-engine-8.onrender.com';

export default function OrganizationDashboard() {
  const { user } = useContext(UserContext);
  const [organization, setOrganization] = useState(null);
  const [projects, setProjects] = useState('');
  const [requirements, setRequirements] = useState('');
  const [message, setMessage] = useState(null);

  useEffect(() => {
    async function fetchOrganization() {
      try {
        const res = await axios.get(`${API_URL}/organization/${user.id}`);
        setOrganization(res.data);

        // ✅ Safely map projects and requirements
        if (res.data.projects) {
          setProjects(res.data.projects.map(p => p.title).join(', '));
        }
        if (res.data.requirements) {
          setRequirements(res.data.requirements.flat().join(', '));
        }
      } catch (err) {
        console.error(err);
        setMessage('Error loading organization details');
      }
    }
    fetchOrganization();
  }, [user.id]);

  const handleUpdate = async () => {
    setMessage(null);

    const projectsArr = projects
      .split(',')
      .map(p => ({ title: p.trim(), location: 'Any', internship_type: 'paid' }))
      .filter(p => p.title);

    const requirementsArr = requirements
      .split(',')
      .map(r => [r.trim()])
      .filter(r => r[0]);

    if (projectsArr.length !== requirementsArr.length) {
      setMessage('Projects and Requirements count must match');
      return;
    }

    try {
      const res = await axios.put(`${API_URL}/organization/${user.id}/update_projects`, {
        projects: projectsArr,
        requirements: requirementsArr,
      });
      setMessage(res.data.message || 'Projects updated successfully');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error updating projects');
    }
  };

  if (!organization) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: 600, margin: '20px auto' }}>
      <h2>Organization Dashboard</h2>
      <p><strong>Name:</strong> {organization.name}</p>
      <p><strong>Email:</strong> {organization.email}</p>

      <div>
        <label>Projects (comma separated titles):</label>
        <input
          type="text"
          value={projects}
          onChange={e => setProjects(e.target.value)}
          style={inputStyle}
        />
      </div>
      <div>
        <label>Requirements (comma separated skills):</label>
        <input
          type="text"
          value={requirements}
          onChange={e => setRequirements(e.target.value)}
          style={inputStyle}
        />
      </div>

      <button onClick={handleUpdate} style={buttonStyle}>Update Projects</button>
      {message && <p>{message}</p>}
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: 8,
  margin: '5px 0 15px',
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
