import './App.css';

import { useEffect, useState } from 'react';

function App() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:3000/list");
      if (!response.ok) {
        throw new Error("Failed to fetch requests");
      }
      const data = await response.json();
      setRequests(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Request List</h1>
      <button onClick={fetchRequests} className="mb-4">
        Reload
      </button>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {requests.map((request, index) => (
          <div key={index}>
            <div>
              <h2 className="text-lg font-semibold">{request}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
