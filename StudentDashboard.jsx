import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../App';
import { Link } from 'react-router-dom';

const API_URL = 'https://smart-allocation-engine-8.onrender.com';

export default function StudentDashboard() {
  const { user } = useContext(UserContext);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    async function fetchStudent() {
      try {
        const res = await axios.get(`${API_URL}/student/${user.id}`);
        setStudent(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchStudent();
  }, [user.id]);

  if (!student) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Student Dashboard</h2>
      <p><strong>Name:</strong> {student.name}</p>
      <p><strong>Email:</strong> {student.email}</p>
      <p><strong>Skills:</strong> {student.skills.join(', ')}</p>
      <p><strong>Interests:</strong> {student.interests.join(', ')}</p>
      <p><strong>Location Preference:</strong> {student.location_preference}</p>
      <p><strong>Internship Type:</strong> {student.internship_type}</p>
      <Link to="/allocation-result">View Allocation Result</Link>
    </div>
  );
}