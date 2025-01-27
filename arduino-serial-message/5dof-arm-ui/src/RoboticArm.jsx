import React from "react";

const RoboticArm = ({ angles }) => {
  const armLengths = [100, 80, 60, 40, 20]; // Length of each arm segment
  const jointRadius = 10; // Radius of the joints

  // Calculate the position of each joint
  const calculateJointPosition = (index) => {
    let x = 0;
    let y = 0;
    for (let i = 0; i <= index; i++) {
      x += armLengths[i] * Math.cos((angles[i] * Math.PI) / 180);
      y += armLengths[i] * Math.sin((angles[i] * Math.PI) / 180);
    }
    return { x, y };
  };

  return (
    <g transform="translate(250, 150)">
      {angles.map((_, index) => {
        const { x, y } = calculateJointPosition(index);
        return (
          <React.Fragment key={index}>
            {/* Arm Segment (Line) */}
            {index > 0 && (
              <line
                x1={calculateJointPosition(index - 1).x}
                y1={calculateJointPosition(index - 1).y}
                x2={x}
                y2={y}
                stroke="blue"
                strokeWidth="4"
              />
            )}
            {/* Joint (Circle) */}
            <circle cx={x} cy={y} r={jointRadius} fill="red" />
          </React.Fragment>
        );
      })}
    </g>
  );
};

export default RoboticArm;