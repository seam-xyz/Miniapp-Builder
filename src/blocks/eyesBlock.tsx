import { useState, useEffect, useRef } from "react";
import { BlockModel, ComposerComponentProps, FeedComponentProps } from "./types";
import "./BlockStyles.css";

const containerStyle = {
  width: '150px',
  height: '50px',
  borderRadius: '10px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '10px',
};

const eyeStyle = {
  backgroundColor: 'white',
  width: '15px',
  height: '20px',
  borderRadius: '15px',
  animation: 'blink 5s infinite',
  transition: 'transform 0.2s ease',
};

function Eyes() {
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const containerRef = useRef();

  useEffect(() => {
    const handleMouseMove = (e: any) => {
      setOffsetX(e.clientX);
      setOffsetY(e.clientY);
    };

    const handleDeviceOrientation = (e: any) => {
      setOffsetX(e.gamma); // range is [-90,90]
      setOffsetY(e.beta);  // range is [-180,180]
    };

    const isMobile = /Mobi|Android/i.test(navigator.userAgent);

    if (isMobile && window.DeviceOrientationEvent) {
      // console.log("DeviceOrientation is supported")
      window.addEventListener('deviceorientation', handleDeviceOrientation);
    } else {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (isMobile && window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleDeviceOrientation);
      } else {
        window.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  const eyeStyle = () => {
    if (!containerRef.current) {
      return {};
    }
    //@ts-ignore
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const containerCenterX = left + width / 2;
    const containerCenterY = top + height / 2;
    const deltaX = offsetX - containerCenterX;
    const deltaY = offsetY - containerCenterY;
    const angle = Math.atan2(deltaY, deltaX);
    const eyeRadius = 10; // Adjust the radius as needed
    const x = eyeRadius * Math.cos(angle);
    const y = eyeRadius * Math.sin(angle);
    return {
      transform: `translate(${x}px, ${y}px)`,
    };
  };

  return (
    //@ts-ignore
    <div id="container" ref={containerRef} style={containerStyle}>
      <div id="left" className="eye" style={eyeStyle()}></div>
      <div id="right" className="eye" style={eyeStyle()}></div>
    </div>
  );
}

export const EyesFeedComponent = ({ model }: FeedComponentProps) => {
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: 'pink', display: 'flex', flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <style >
        {`
        .eye {
          background-color: white;
          width: 15px;
          height: 20px;
          border-radius: 15px;
          animation: blink 5s infinite;
          transition: transform 0.2s ease;
        }
      `}
      </style>
      <Eyes />
    </div>
  );
}

export const EyesComposerComponent = ({ model, done }: ComposerComponentProps) => {
  return <h1>no edit, only eyes 👀</h1>;
}
