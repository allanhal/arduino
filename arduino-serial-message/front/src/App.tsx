import './App.css';

import { ClassValue, clsx } from 'clsx';
import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

// eslint-disable-next-line react-refresh/only-export-components
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

const servos = ["x", "y", "z", "a", "b"].reverse();
// const steps = [
//   -180, -100, -50, -25, -20, -15, -10, -5, -1,  1, 5, 10, 15, 20, 25, 50, 100,
//   180,
// ];

const stepsBase = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 50, 90, 100, 180];

const steps: (number | string)[] = [];
steps.push("cw");
stepsBase.forEach((step) => {
  steps.push(step);
});
steps.push("ccw");
stepsBase.forEach((step) => {
  steps.push(-step);
});

function App() {
  const [ports, setPorts] = useState([]);
  const [currentPort, setCurrentPort] = useState();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [currentPosition, setCurrentPosition] = useState<any>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [nextPosition, setNextPosition] = useState<any>();
  const [currentDelay, setCurrentDelay] = useState<number | string>(80);
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
      setTimeout(async () => await fetchGetCurrentPosition(), 2000);
    } finally {
      setLoading(false);
    }
  };

  const fetchSetServoStep = async ({
    servo,
    step,
  }: {
    servo: string;
    step: number | string;
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
      setTimeout(async () => await fetchGetCurrentPosition(), 2000);
    } finally {
      setLoading(false);
    }
  };
  const fetchGetCurrentPosition = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3000/getCurrentPosition`);
      if (!response.ok) {
        throw new Error("Failed to fetch currentPort");
      }
      const data = await response.json();

      const str = data.received;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = str.split(" - ").reduce((acc: any, item: any) => {
        const key = item[0]; // First character is the key
        const value = parseInt(item.slice(1), 10); // Rest is the value as a number
        acc[key] = value;
        return acc;
      }, {});

      setCurrentPosition({ ...data, ...result });
      setNextPosition({ ...data, ...result });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPorts();
    fetchCurrentPort();
    fetchGetCurrentPosition();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleClick = (servo: any, current: any, newValue: any) => {
    fetchSetServoStep({ servo, step: newValue - current });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInputChange = (servo: any, value: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setNextPosition((prevState: any) => ({
      ...prevState,
      [servo]: value,
    }));
  };

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
        <div className="mb-4">
          <div>
            <div className="space-y-4">
              {servos.map((servo, index) => (
                <div key={index} className="grid grid-cols-3 gap-2">
                  <label htmlFor={`input${index + 1}`} className="">
                    servo {servos.length - index} - (
                    {currentPosition ? currentPosition[servo] : ""})-(
                    {nextPosition ? nextPosition[servo] : ""})
                  </label>
                  <input
                    id={`input${index + 1}`}
                    type="text"
                    className="mt-1 px-3 py-2 border rounded-lg text focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    // value={nextPosition ? nextPosition[servo] : ""}
                    defaultValue={nextPosition ? nextPosition[servo] : ""}
                    onChange={(e) => handleInputChange(servo, e.target.value)}
                  />
                  <button
                    onClick={() =>
                      handleClick(
                        servo,
                        currentPosition[servo],
                        nextPosition[servo]
                      )
                    }
                    className="mt-6 bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  >
                    Submit
                  </button>
                </div>
              ))}
            </div>

            {/* Button */}
            <button
              onClick={() => {
                servos.forEach((servo) => {
                  handleClick(
                    servo,
                    currentPosition[servo],
                    nextPosition[servo]
                  );
                });
              }}
              className="mt-6 bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              Submit All
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <img src="/6dof-white.png" alt="Logo" />
          </div>

          <div>
            {servos.map((servo, index1) => (
              <div key={index1}>
                <p className="text-3xl font-bold mb-4">
                  servo {servos.length - index1} - (
                  {currentPosition ? currentPosition[servo] : ""})-(
                  {nextPosition ? nextPosition[servo] : ""})
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    id={`input${index1 + 1}`}
                    type="text"
                    className="mt-1 px-3 py-2 border rounded-lg text- focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    // value={nextPosition ? nextPosition[servo] : ""}
                    defaultValue={nextPosition ? nextPosition[servo] : ""}
                    onChange={(e) => handleInputChange(servo, e.target.value)}
                  />
                  <button
                    onClick={() =>
                      handleClick(
                        servo,
                        currentPosition[servo],
                        nextPosition[servo]
                      )
                    }
                    className="mt-6 bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  >
                    Submit
                  </button>
                </div>
                <div className="grid grid-cols-18 gap-2">
                  {steps.map((step, index2) => (
                    <button
                      key={`${index1}-${index2}`}
                      onClick={() => fetchSetServoStep({ servo, step })}
                      className=""
                    >
                      <h2 className="text-md font-semibold">{step}</h2>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
