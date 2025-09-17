import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../App';

const API_URL = 'https://smart-allocation-engine-8.onrender.com';

export default function AllocationResult() {
  const { user } = useContext(UserContext);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResult() {
      try {
        const res = await axios.get(`${API_URL}/student/${user.id}/allocation`);
        setResult(res.data);
      } catch (err) {
        setResult(null);
      } finally {
        setLoading(false);
      }
    }
    fetchResult();
  }, [user.id]);

  if (loading) return <p>Loading allocation result...</p>;

  if (!result) return <p>No allocation result found.</p>;

  if (result.message) return <p>{result.message}</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Allocation Result</h2>
      <p>You have been allocated to:</p>
      <p><strong>Organization:</strong> {result.organization}</p>
      <p><strong>Project:</strong> {result.project}</p>
    </div>
  );
}