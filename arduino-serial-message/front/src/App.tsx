import './App.css';

import { ClassValue, clsx } from 'clsx';
import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

const servos = ["x", "y", "z", "a", "b"];
// const steps = [
//   -180, -100, -50, -25, -20, -15, -10, -5, -1,  1, 5, 10, 15, 20, 25, 50, 100,
//   180,
// ];

const stepsBase = [1, 5, 10, 15, 20, 25, 50, 90, 100, 180];

const steps: unknown[] = [];
stepsBase.forEach((step) => {
  steps.push(step);
});
stepsBase.forEach((step) => {
  steps.push(-step);
});

function App() {
  const [ports, setPorts] = useState([]);
  const [currentPort, setCurrentPort] = useState();
  const [currentDelay, setCurrentDelay] = useState(80);
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
    if (servo === "s") {
      setCurrentDelay(step);
    }
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
        <div>
          <p className="text-3xl font-bold mb-4">current delay</p>
          <p className="mb-4">{currentDelay}</p>
          <p className="text-3xl font-bold mb-4">s</p>
          <div className="grid grid-cols-6 gap-4">
            {[
              0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 120, 150, 160, 180,
              200,
            ].map((step, index2) => (
              <button
                key={index2}
                onClick={() => fetchSetServoStep({ servo: "s", step })}
                className="mb-4 "
              >
                <h2 className="text-lg font-semibold">
                  {currentDelay === step ? "(" : ""}
                  {step}
                  {currentDelay === step ? ")" : ""}
                </h2>
              </button>
            ))}
          </div>
        </div>
        {servos.map((servo, index1) => (
          <div key={index1}>
            <p className="text-3xl font-bold mb-4">{servo}</p>
            <div
              // className={cn(
              //   "grid  gap-4",
              //   "grid-cols-2"
              //   `Number((steps.length/2).toFixed(0))`
              // )}
              className="grid grid-cols-10 gap-4"
            >
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
