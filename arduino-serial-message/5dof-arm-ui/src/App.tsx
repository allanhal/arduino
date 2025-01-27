import React, { useState } from 'react';

const App: React.FC = () => {
  const [shoulderAngle, setShoulderAngle] = useState(90); // Start at 90° (pointing up)
  const [elbowAngle, setElbowAngle] = useState(90); // Start at 90° (pointing up)
  const [wristAngle, setWristAngle] = useState(90); // Start at 90° (pointing up)
  const [handAngle, setHandAngle] = useState(90); // Start at 90° (pointing up)

  const armLength = 100;

  // Starting position (bottom-center of the canvas)
  const canvasWidth = 400;
  const canvasHeight = 400;
  const startX = canvasWidth / 2; // Center horizontally
  const startY = canvasHeight - 10; // Slightly above the bottom for padding

  const calculatePosition = (angle: number, length: number, startX: number, startY: number) => {
    const radians = (angle * Math.PI) / 180;
    const endX = startX + length * Math.cos(radians); // Use cos for X
    const endY = startY - length * Math.sin(radians); // Use -sin for Y
    return { endX, endY };
  };

  // Calculate positions for each segment using cumulative angles
  const shoulderPos = calculatePosition(shoulderAngle, armLength, startX, startY);
  const elbowPos = calculatePosition(
    shoulderAngle + elbowAngle - 90,
    armLength,
    shoulderPos.endX,
    shoulderPos.endY
  );
  const wristPos = calculatePosition(
    shoulderAngle + elbowAngle + wristAngle - 180,
    armLength,
    elbowPos.endX,
    elbowPos.endY
  );
  const handPos = calculatePosition(
    shoulderAngle + elbowAngle + wristAngle + handAngle - 270,
    armLength,
    wristPos.endX,
    wristPos.endY
  );

  return (
    <div>
      <svg width={canvasWidth} height={canvasHeight} style={{ border: '1px solid black' }}>
        {/* Shoulder to Elbow */}
        <line x1={startX} y1={startY} x2={shoulderPos.endX} y2={shoulderPos.endY} stroke="black" strokeWidth="2" />
        {/* Elbow to Wrist */}
        <line x1={shoulderPos.endX} y1={shoulderPos.endY} x2={elbowPos.endX} y2={elbowPos.endY} stroke="black" strokeWidth="2" />
        {/* Wrist to Hand */}
        <line x1={elbowPos.endX} y1={elbowPos.endY} x2={wristPos.endX} y2={wristPos.endY} stroke="black" strokeWidth="2" />
        {/* Hand */}
        <line x1={wristPos.endX} y1={wristPos.endY} x2={handPos.endX} y2={handPos.endY} stroke="black" strokeWidth="2" />
      </svg>

      <div>
        <label>
          Hand Angle: {handAngle}°
          <input
            type="range"
            min="0"
            max="180"
            value={handAngle}
            onChange={(e) => setHandAngle(Number(e.target.value))}
          />
        </label>
      </div>

      <div>
        <label>
          Wrist Angle: {wristAngle}°
          <input
            type="range"
            min="0"
            max="180"
            value={wristAngle}
            onChange={(e) => setWristAngle(Number(e.target.value))}
          />
        </label>
      </div>

      <div>
        <label>
          Elbow Angle: {elbowAngle}°
          <input
            type="range"
            min="0"
            max="180"
            value={elbowAngle}
            onChange={(e) => setElbowAngle(Number(e.target.value))}
          />
        </label>
      </div>

      <div>
        <label>
          Shoulder Angle: {shoulderAngle}°
          <input
            type="range"
            min="0"
            max="180"
            value={shoulderAngle}
            onChange={(e) => setShoulderAngle(Number(e.target.value))}
          />
        </label>
      </div>
    </div>
  );
};

export default App;
