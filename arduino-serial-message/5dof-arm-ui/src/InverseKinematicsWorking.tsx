import React, { useEffect, useRef, useState } from 'react';

const WIDTH = 800;
const HEIGHT = 500;
const JOINT_RADIUS = 10;
const LINE_WIDTH = 3;
const IK_TOLERANCE = 0.1;
const IK_ITER = 1000;
const BACKGROUND_COLOR = "#181818";
const JOINT_COLOR = "#fbf1c7";

class Joint {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = JOINT_COLOR;
    ctx.beginPath();
    ctx.arc(this.x, this.y, JOINT_RADIUS, 0, 2 * Math.PI);
    ctx.fill();
  }

  drawConn(ctx: CanvasRenderingContext2D, other: Joint) {
    ctx.strokeStyle = JOINT_COLOR;
    ctx.lineWidth = LINE_WIDTH;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(other.x, other.y);
    ctx.stroke();
  }

  distance(other: Joint) {
    return Math.sqrt((other.x - this.x) ** 2 + (other.y - this.y) ** 2);
  }
}

const FABRIK = (
  joints: Joint[],
  target: Joint,
  { tol, iter }: { tol: number; iter: number }
) => {
  if (joints.length <= 1) {
    return;
  }

  const distances = joints
    .slice(1)
    .map((joint, idx) => joint.distance(joints[idx]));
  const dist = joints[0].distance(target);

  if (dist > distances.reduce((previous, current) => previous + current, 0)) {
    for (let i = 0; i < joints.length - 1; i++) {
      const rI = target.distance(joints[i]);
      const lambdaI = distances[i] / rI;
      joints[i + 1].x = (1 - lambdaI) * joints[i].x + lambdaI * target.x;
      joints[i + 1].y = (1 - lambdaI) * joints[i].y + lambdaI * target.y;
    }
  } else {
    const b = new Joint(joints[0].x, joints[0].y);

    let difA = target.distance(joints[joints.length - 1]);
    let it = 0;
    while (difA > tol && it < iter) {
      it += 1;

      joints[joints.length - 1].x = target.x;
      joints[joints.length - 1].y = target.y;

      for (let i = joints.length - 2; i >= 0; i--) {
        const rI = joints[i + 1].distance(joints[i]);
        const lambdaI = distances[i] / rI;
        joints[i].x = (1 - lambdaI) * joints[i + 1].x + lambdaI * joints[i].x;
        joints[i].y = (1 - lambdaI) * joints[i + 1].y + lambdaI * joints[i].y;
      }

      joints[0].x = b.x;
      joints[0].y = b.y;

      for (let i = 0; i < joints.length - 1; i++) {
        const rI = joints[i + 1].distance(joints[i]);
        const lambdaI = distances[i] / rI;
        joints[i + 1].x =
          (1 - lambdaI) * joints[i].x + lambdaI * joints[i + 1].x;
        joints[i + 1].y =
          (1 - lambdaI) * joints[i].y + lambdaI * joints[i + 1].y;
      }

      difA = target.distance(joints[joints.length - 1]);
    }
  }
};

const InverseKinematicsWorking: React.FC = () => {
  const [joints, setJoints] = useState<Joint[]>([
    new Joint(WIDTH/2, HEIGHT),
    new Joint(100, 100),
    new Joint(200, 200),
    // new Joint(300, 300),
  ]);
  const [mousePosition, setMousePosition] = useState<[number, number] | null>(
    null
  );
  const [running, setRunning] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    const updateMousePosition = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      setMousePosition([event.pageX - rect.left, event.pageY - rect.top]);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === " " || event.code === "Space" || event.keyCode === 32) {
        setRunning((prevRunning) => !prevRunning);
      }

      if (event.key === "Backspace") {
        setJoints((prevJoints) => prevJoints.slice(0, -1));
      }
    };

    const appendNewJoint = () => {
      if (mousePosition !== null) {
        setJoints((prevJoints) => [
          ...prevJoints,
          new Joint(mousePosition[0], mousePosition[1]),
        ]);
      }
    };

    const drawFrame = () => {
      ctx.fillStyle = BACKGROUND_COLOR;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      joints.forEach((joint, idx) => {
        joint.draw(ctx);
        if (idx > 0) {
          joint.drawConn(ctx, joints[idx - 1]);
        }
      });

      if (mousePosition !== null && running) {
        const target = new Joint(mousePosition[0], mousePosition[1]);
        FABRIK(joints, target, { tol: IK_TOLERANCE, iter: IK_ITER });
      }
    };

    const step = () => {
      drawFrame();
      window.requestAnimationFrame(step);
    };

    window.requestAnimationFrame(step);

    canvas.addEventListener("mousemove", updateMousePosition);
    document.addEventListener("keyup", handleKeyUp);
    canvas.addEventListener("mouseup", appendNewJoint);

    return () => {
      canvas.removeEventListener("mousemove", updateMousePosition);
      document.removeEventListener("keyup", handleKeyUp);
      canvas.removeEventListener("mouseup", appendNewJoint);
    };
  }, [joints, mousePosition, running]);

  return (
    <div>
      <canvas ref={canvasRef} width={WIDTH} height={HEIGHT}></canvas>
    </div>
  );
};

export default InverseKinematicsWorking;
