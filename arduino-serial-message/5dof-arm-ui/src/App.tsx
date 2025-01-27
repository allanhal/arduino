/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';

import InverseKinematicsWorking from './InverseKinematicsWorking';

const App: React.FC = () => {
  const [shoulderAngle, setShoulderAngle] = useState(90); // Start at 90° (pointing up)
  const [elbowAngle, setElbowAngle] = useState(90); // Start at 90° (pointing up)
  const [wristAngle, setWristAngle] = useState(90); // Used for color, not position
  const [handAngle, setHandAngle] = useState(90); // Rotation of the hand relative to the wrist
  const [lastClickPosition, setLastClickPosition] = useState<{
    x: number;
    y: number;
  } | null>(null); // Store last click position
  const [isOutOfRange, setIsOutOfRange] = useState(false); // Track if the last click was out of range

  const armLength = 100;
  const handLength = 30;

  // Starting position (bottom-center of the canvas)
  const canvasWidth = 500;
  const canvasHeight = 300;
  const startX = canvasWidth / 2; // Center horizontally
  const startY = canvasHeight - 10; // Slightly above the bottom for padding

  const calculatePosition = (
    angle: number,
    length: number,
    startX: number,
    startY: number
  ) => {
    const radians = (angle * Math.PI) / 180;
    const endX = startX + length * Math.cos(radians);
    const endY = startY - length * Math.sin(radians); // Subtract because Y increases downwards in SVG
    return { endX, endY };
  };

  // Clamp angles to be between 0° and 180°
  const clampAngle = (angle: number) => {
    return Math.min(Math.max(angle, 0), 180);
  };

  // Calculate positions for each segment
  const shoulderPos = calculatePosition(
    shoulderAngle,
    armLength,
    startX,
    startY
  );
  const elbowPos = calculatePosition(
    shoulderAngle + elbowAngle - 90,
    armLength,
    shoulderPos.endX,
    shoulderPos.endY
  );

  // Calculate the forearm angle (angle of the line from elbow to wrist)
  const forearmAngle = shoulderAngle + elbowAngle - 90;

  // Hand extends from the elbow position, using Hand Angle for rotation (relative to forearm)
  // const handEndPos = calculatePosition(
  //   forearmAngle + handAngle, // Hand rotation relative to forearm
  //   handLength,
  //   elbowPos.endX,
  //   elbowPos.endY
  // );

  const handEndPos = calculatePosition(
    forearmAngle + handAngle - 90, // Subtract 90 to align the hand's behavior
    handLength,
    elbowPos.endX,
    elbowPos.endY
  );

  // Calculate hand color based on wrist angle
  const wristColor = `hsl(${wristAngle}, 100%, 50%)`; // Hue shifts with wrist angle

  // Inverse Kinematics to calculate angles based on target position
  // const handleClick = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
  //   const targetX = event.nativeEvent.offsetX;
  //   const targetY = event.nativeEvent.offsetY;

  //   // Save the last clicked position
  //   setLastClickPosition({ x: targetX, y: targetY });

  //   const dx = targetX - startX;
  //   const dy = targetY - startY;
  //   const distance = Math.sqrt(dx * dx + dy * dy);

  //   // Check if the distance is beyond the reachable range
  //   if (distance > armLength * 2 + handLength) {
  //     setIsOutOfRange(true);
  //     return;
  //   }

  //   setIsOutOfRange(false);

  //   // Calculate the shoulder angle (angle between the target and horizontal axis)
  //   const shoulderAngleNew = Math.atan2(dy, dx) * (180 / Math.PI);

  //   // Apply the law of cosines
  //   const cosElbow =
  //     (distance * distance - armLength * armLength - armLength * armLength) /
  //     (-2 * armLength * armLength);

  //   // Clamp the cosine value to the range [-1, 1] to avoid NaN
  //   const clampedCosElbow = Math.max(-1, Math.min(1, cosElbow));

  //   // Calculate the elbow angle
  //   const elbowAngleNew = Math.acos(clampedCosElbow) * (180 / Math.PI);

  //   // Clamp elbow angle to avoid exceeding limits (0 to 180 degrees)
  //   const clampedElbowAngle = clampAngle(elbowAngleNew);

  //   // Forearm angle (sum of shoulder and elbow angles)
  //   const forearmAngleNew = shoulderAngleNew + clampedElbowAngle - 90;

  //   // Calculate the hand angle (relative to the forearm)
  //   const targetAngle =
  //     Math.atan2(targetY - elbowPos.endY, targetX - elbowPos.endX) *
  //     (180 / Math.PI);
  //   const handAngleNew = targetAngle - forearmAngleNew;

  //   // Clamp hand angle
  //   const clampedHandAngle = clampAngle(handAngleNew);

  //   // Update the arm angles
  //   setShoulderAngle(clampAngle(shoulderAngleNew));
  //   setElbowAngle(clampedElbowAngle);
  //   setHandAngle(clampedHandAngle);
  // };

  const handleClick = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    const targetX = event.nativeEvent.offsetX;
    const targetY = event.nativeEvent.offsetY;

    // Save the last clicked position
    setLastClickPosition({ x: targetX, y: targetY });

    const dx = targetX - startX;
    const dy = targetY - startY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Check if the target is reachable
    if (distance > armLength * 2) {
      setIsOutOfRange(true); // Set out-of-range flag
      return;
    }

    // If target is reachable, reset out-of-range flag
    setIsOutOfRange(false);

    // Calculate the elbow angle using the law of cosines
    const cosElbow =
      (distance * distance - armLength * armLength - armLength * armLength) /
      (-2 * armLength * armLength);

    // Clamp the cosElbow value to be within [-1, 1] to avoid NaN
    const clampedCosElbow = Math.max(-1, Math.min(1, cosElbow));

    // Calculate the elbow angle
    const elbowAngleNew = Math.acos(clampedCosElbow) * (180 / Math.PI);

    // Calculate the shoulder angle based on target direction
    const shoulderAngleNew = Math.atan2(dy, dx) * (180 / Math.PI);

    // Clamp angles to ensure they are between 0° and 180°
    const clampedShoulderAngle = clampAngle(shoulderAngleNew);
    const clampedElbowAngle = clampAngle(elbowAngleNew);

    // Calculate the forearm angle (angle of the line from elbow to wrist)
    const forearmAngleNew = clampedShoulderAngle + clampedElbowAngle - 90;

    // Calculate the hand angle (relative to the forearm)
    const targetAngle =
      Math.atan2(targetY - elbowPos.endY, targetX - elbowPos.endX) *
      (180 / Math.PI);
    const handAngleNew = targetAngle - forearmAngleNew;

    // Clamp the hand angle to ensure it is between 0° and 180°
    const clampedHandAngle = clampAngle(handAngleNew);

    setShoulderAngle(clampedShoulderAngle);
    setElbowAngle(clampedElbowAngle);
    setHandAngle(clampedHandAngle);
  };

  return (
    <>
      <div style={{ display: "flex", alignItems: "flex-start" }}>
        <InverseKinematicsWorking />
      </div>

      <div style={{ display: "flex", alignItems: "flex-start" }}>
        <div style={{ position: "relative" }}>
          <svg
            width={canvasWidth}
            height={canvasHeight}
            style={{ border: "1px solid black", cursor: "pointer" }}
            onClick={handleClick}
          >
            {/* Reachable area (circle) */}
            <circle
              cx={startX}
              cy={startY}
              r={armLength + armLength + handLength}
              fill="none"
              stroke="#ccc"
              strokeWidth="1"
              strokeDasharray="4"
            />
            {/* Shoulder to Elbow */}
            <line
              x1={startX}
              y1={startY}
              x2={shoulderPos.endX}
              y2={shoulderPos.endY}
              stroke="black"
              strokeWidth="2"
            />
            {/* Elbow to Hand Base */}
            <line
              x1={shoulderPos.endX}
              y1={shoulderPos.endY}
              x2={elbowPos.endX}
              y2={elbowPos.endY}
              stroke="black"
              strokeWidth="2"
            />
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
            <circle cx={startX} cy={startY} r={5} fill="blue" />{" "}
            {/* Shoulder */}
            <circle
              cx={shoulderPos.endX}
              cy={shoulderPos.endY}
              r={5}
              fill="green"
            />{" "}
            {/* Elbow */}
            <circle
              cx={elbowPos.endX}
              cy={elbowPos.endY}
              r={5}
              fill="red"
            />{" "}
            {/* Hand Joint (base of the hand) */}
            {/* Marker for last clicked position */}
            {lastClickPosition && (
              <circle
                cx={lastClickPosition.x}
                cy={lastClickPosition.y}
                r={5}
                fill={isOutOfRange ? "red" : "purple"}
                stroke="white"
                strokeWidth="1"
              />
            )}
          </svg>

          {/* Clickable Hint */}
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              padding: "5px 10px",
              borderRadius: "5px",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            Click anywhere to move the arm!
          </div>
        </div>

        {/* Display last clicked position */}
        <div style={{ marginLeft: "20px" }}>
          <h3>Last Clicked Position</h3>
          {lastClickPosition ? (
            <p>
              X: {lastClickPosition.x.toFixed(2)}, Y:{" "}
              {lastClickPosition.y.toFixed(2)}
              {isOutOfRange && (
                <span style={{ color: "red", marginLeft: "10px" }}>
                  (Out of reach)
                </span>
              )}
            </p>
          ) : (
            <p>No click recorded yet.</p>
          )}
        </div>

        {/* Sliders for controlling the angles */}
        <div style={{ marginTop: "20px", marginLeft: "20px" }}>
          <div style={{ marginBottom: "10px" }}>
            <label>
              <strong>Hand Angle: {handAngle.toFixed(2)}°</strong>
              <input
                type="range"
                min="0"
                max="180"
                value={handAngle}
                onChange={(e) => setHandAngle(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </label>
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>
              <strong>
                Wrist Color:
                <span style={{ marginLeft: "10px", color: wristColor }}>
                  {wristColor} {/* Display the color in HEX */}
                </span>
              </strong>
              <input
                type="range"
                min="0"
                max="360"
                value={wristAngle}
                onChange={(e) => setWristAngle(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </label>
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>
              <strong>Elbow Angle: {elbowAngle.toFixed(2)}°</strong>
              <input
                type="range"
                min="0"
                max="180"
                value={elbowAngle}
                onChange={(e) => setElbowAngle(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </label>
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>
              <strong>Shoulder Angle: {shoulderAngle.toFixed(2)}°</strong>
              <input
                type="range"
                min="0"
                max="180"
                value={shoulderAngle}
                onChange={(e) => setShoulderAngle(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
