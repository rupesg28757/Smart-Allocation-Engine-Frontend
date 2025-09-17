import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'https://smart-allocation-engine-8.onrender.com';

export default function AdminPanel() {
  const [data, setData] = useState({ students: [], organizations: [] });
  const [allocations, setAllocations] = useState([]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(`${API_URL}/admin/data`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, []);

  const runAllocation = async () => {
    try {
      const res = await axios.post(`${API_URL}/admin/allocate`);
      setAllocations(res.data.allocations);
      setMessage(res.data.message);
    } catch (err) {
      setMessage('Error running allocation');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Panel</h2>
      <button onClick={runAllocation} style={buttonStyle}>Run Allocation</button>
      {message && <p>{message}</p>}

      <h3>Students</h3>
      <ul>
        {data.students.map(s => (
          <li key={s.id}>{s.name} ({s.email})</li>
        ))}
      </ul>

      <h3>Organizations</h3>
      <ul>
        {data.organizations.map(o => (
          <li key={o.id}>{o.name} ({o.email})</li>
        ))}
      </ul>

      <h3>Allocations</h3>
      <ul>
        {allocations.map((a, idx) => (
          <li key={idx}>Student ID: {a.student_id} &rarr; Org ID: {a.organization_id} | Project: {a.project}</li>
        ))}
      </ul>
    </div>
  );
}

const buttonStyle = {
  padding: '10px 20px',
  fontSize: 16,
  borderRadius: 4,
  border: 'none',
  backgroundColor: '#28a745',
  color: 'white',
  cursor: 'pointer',
  marginBottom: 20,
};