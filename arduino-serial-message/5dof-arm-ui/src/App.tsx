import React, { useState } from 'react';

const App: React.FC = () => {
  const [shoulderAngle, setShoulderAngle] = useState(90); // Start at 90° (pointing up)
  const [elbowAngle, setElbowAngle] = useState(90); // Start at 90° (pointing up)
  const [wristAngle, setWristAngle] = useState(90); // Used for color, not position
  const [handAngle, setHandAngle] = useState(90); // Rotation of the hand relative to the wrist

  const armLength = 100;
  const handLength = 30;

  // Starting position (bottom-center of the canvas)
  const canvasWidth = 400;
  const canvasHeight = 400;
  const startX = canvasWidth / 2; // Center horizontally
  const startY = canvasHeight - 10; // Slightly above the bottom for padding

  const calculatePosition = (angle: number, length: number, startX: number, startY: number) => {
    const radians = (angle * Math.PI) / 180;
    const endX = startX + length * Math.cos(radians);
    const endY = startY - length * Math.sin(radians);
    return { endX, endY };
  };

  // Calculate positions for each segment
  const shoulderPos = calculatePosition(shoulderAngle, armLength, startX, startY);
  const elbowPos = calculatePosition(
    shoulderAngle + elbowAngle - 90,
    armLength,
    shoulderPos.endX,
    shoulderPos.endY
  );

  // Hand extends from the elbow position, using Hand Angle for rotation
  const handEndPos = calculatePosition(
    handAngle - 90, // Hand rotation only
    handLength,
    elbowPos.endX,
    elbowPos.endY
  );

  // Calculate hand color based on wrist angle
  const wristColor = `hsl(${wristAngle}, 100%, 50%)`; // Hue shifts with wrist angle

  return (
    <div>
      <svg width={canvasWidth} height={canvasHeight} style={{ border: '1px solid black' }}>
        {/* Shoulder to Elbow */}
        <line x1={startX} y1={startY} x2={shoulderPos.endX} y2={shoulderPos.endY} stroke="black" strokeWidth="2" />
        {/* Elbow to Hand Base */}
        <line x1={shoulderPos.endX} y1={shoulderPos.endY} x2={elbowPos.endX} y2={elbowPos.endY} stroke="black" strokeWidth="2" />
        {/* Hand (extends from Elbow position) */}
        <line
          x1={elbowPos.endX}
          y1={elbowPos.endY}
          x2={handEndPos.endX}
          y2={handEndPos.endY}
          stroke={wristColor}
          strokeWidth="4"
        />
        {/* Joint Circles */}
        <circle cx={startX} cy={startY} r={5} fill="blue" /> {/* Shoulder */}
        <circle cx={shoulderPos.endX} cy={shoulderPos.endY} r={5} fill="green" /> {/* Elbow */}
        <circle cx={elbowPos.endX} cy={elbowPos.endY} r={5} fill="red" /> {/* Hand Joint (base of the hand) */}
      </svg>

      {/* Sliders for controlling the angles */}
      <div style={{ marginTop: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label>
            <strong>Hand Angle: {handAngle}°</strong>
            <input
              type="range"
              min="0"
              max="360"
              value={handAngle}
              onChange={(e) => setHandAngle(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>
            <strong>Wrist Angle (Color Control): {wristAngle}°</strong>
            <input
              type="range"
              min="0"
              max="360"
              value={wristAngle}
              onChange={(e) => setWristAngle(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>
            <strong>Elbow Angle: {elbowAngle}°</strong>
            <input
              type="range"
              min="0"
              max="180"
              value={elbowAngle}
              onChange={(e) => setElbowAngle(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>
            <strong>Shoulder Angle: {shoulderAngle}°</strong>
            <input
              type="range"
              min="0"
              max="180"
              value={shoulderAngle}
              onChange={(e) => setShoulderAngle(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default App;
