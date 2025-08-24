// 3DHeartComponent.jsx
// Single-file React component that renders a 3D extruded heart using @react-three/fiber and @react-three/drei
// Usage:
// 1. npm install three @react-three/fiber @react-three/drei
// 2. Drop this file into your React app and import: import HeartScene from './3DHeartComponent';
// 3. Use <HeartScene /> somewhere in your JSX.

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function HeartMesh({ color = '#ff4d6d', rotationSpeed = 0.01, scale = 0.5 }) {
  const ref = useRef();

  // build the 2D heart shape and extrude it to 3D
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();

    // Smoothed upright heart shape with softer bezier curves
    shape.moveTo(0, 0.5);
    shape.bezierCurveTo(1.5, 2.0, 3.0, 0.5, 0, -1.5);
    shape.bezierCurveTo(-3.0, 0.5, -1.5, 2.0, 0, 0.5);

    const extrudeSettings = {
      depth: 0.6,
      bevelEnabled: true,
      bevelSegments: 12,
      steps: 4,
      bevelSize: 0.08,
      bevelThickness: 0.08,
    };

    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.center();
    return geom;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += rotationSpeed * delta * 60;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });

  return (
    <mesh ref={ref} geometry={geometry} scale={scale}>
      <meshPhysicalMaterial
        clearcoat={0.6}
        clearcoatRoughness={0.05}
        metalness={0.1}
        roughness={0.2}
        color={color}
        reflectivity={0.7}
      />
    </mesh>
  );
}

export default function HeartScene({ color, rotationSpeed, scale, showUI = true }) {
  return (
    <div>
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]} intensity={1} />

        <group position={[0, -0.1, 0]}>
          <HeartMesh color={color} rotationSpeed={rotationSpeed} scale={scale} />
        </group>

        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  );
}
