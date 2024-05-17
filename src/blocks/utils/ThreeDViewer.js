import React, { useRef, useEffect } from 'react';
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls as ThreeOrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

extend({ OrbitControls: ThreeOrbitControls });

const OrbitControls = (props) => {
  const { camera, gl } = useThree();
  const controls = useRef();
  useFrame(() => controls.current.update());
  return <orbitControls ref={controls} args={[camera, gl.domElement]} {...props} />;
};

export const ThreeDViewer = ({ blob, fileUrl, fileType }) => {
  const meshRef = useRef();

  useEffect(() => {
    if (blob) { return }
    const loader = fileType === 'stl' ? new STLLoader() : new GLTFLoader();

    loader.load(fileUrl, (geometry) => {
      if (fileType === 'stl') {
        meshRef.current.geometry = geometry;
        console.log("loading stl")
      } else {
        meshRef.current.geometry = geometry.scene.children[0].geometry;
      }
    });
  }, [fileUrl, fileType]);

  useEffect(() => {
    console.log("loading blob")
    if (blob) {
      const reader = new FileReader();
      reader.onload = function (event) {
        const loader = new STLLoader();
        loader.load(event.target.result, (geometry) => {
          meshRef.current.geometry = geometry;
        });
      };
      reader.readAsDataURL(blob);
    }
  }, [blob]);

  return (
    <Canvas style={{ background: 'white' }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2.5, 8, 5]} intensity={1.5} />
      <directionalLight position={[-2.5, -8, -5]} intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, 10]} intensity={1} />
      <mesh ref={meshRef} castShadow receiveShadow>
        <meshStandardMaterial color='white' metalness={0.3} roughness={0.7} />
      </mesh>
      <OrbitControls />
    </Canvas>
  );
};