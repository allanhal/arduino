import './App.css';

import { useEffect, useState } from 'react';

const servos = ["X", "Y", "Z", "A"];
const steps = [-10, -5, -1, 1, 5, 10];

function App() {
  const [ports, setPorts] = useState([]);
  const [currentPort, setCurrentPort] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPorts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:3000/ports");
      if (!response.ok) {
        throw new Error("Failed to fetch ports");
      }
      const data = await response.json();
      setPorts(data);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentPort = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:3000/currentPort");
      if (!response.ok) {
        throw new Error("Failed to fetch currentPort");
      }
      const data = await response.json();
      setCurrentPort(data);
    } finally {
      setLoading(false);
    }
  };

  const fetchSetCurrentPort = async (selectedPort: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:3000/setCurrentPort?port=${selectedPort}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch currentPort");
      }
      const data = await response.json();
      setCurrentPort(data);
    } finally {
      setLoading(false);
    }
  };

  const fetchSetServoStep = async ({
    servo,
    step,
  }: {
    servo: string;
    step: number;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:3000/setServoStep?servo=${servo}&step=${step}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch currentPort");
      }
      await response.json();
      // const data = await response.json();
      // setCurrentPort(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPorts();
    fetchCurrentPort();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Post selection</h1>
      <p className="text-3xl font-bold underline mb-4">Actions:</p>
      <div className="grid grid-cols-3 gap-4">
        <button onClick={fetchPorts} className="mb-4">
          Reload
        </button>
        <button onClick={fetchCurrentPort} className="mb-4">
          fetchCurrentPort
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      <p className="text-3xl font-bold underline mb-4">Ports:</p>
      <div className="grid grid-cols-3 gap-4">
        {ports.map((port, index) => (
          <div key={index}>
            <div>
              <button
                onClick={() => fetchSetCurrentPort(port)}
                className="mb-4"
              >
                <h2 className="text-lg font-semibold">{port}</h2>
              </button>
            </div>
          </div>
        ))}
      </div>

      {currentPort && (
        <div>
          <p className="text-3xl font-bold underline mb-4">Current port:</p>
          <p className="text-sm ">{currentPort}</p>
        </div>
      )}

      <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />

      <h1 className="text-2xl font-bold mb-4">Servos</h1>

      <div>
        {servos.map((servo, index1) => (
          <div key={index1}>
            <p className="text-3xl font-bold underline mb-4">{servo}</p>
            <div className="grid grid-cols-6 gap-4">
              {steps.map((step, index2) => (
                <button
                  key={`${index1}-${index2}`}
                  onClick={() => fetchSetServoStep({ servo, step })}
                  className="mb-4"
                >
                  <h2 className="text-lg font-semibold">{step}</h2>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
