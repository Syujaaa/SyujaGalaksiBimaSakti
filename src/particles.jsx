import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function Particles() {
  const particlesRef = useRef();
  const particleCount = 16;
  const positions = new Float32Array(particleCount * 3);
  const velocities = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 200;
    positions[i3 + 1] = (Math.random() - 0.5) * 200;
    positions[i3 + 2] = (Math.random() - 0.5) * 200;

    velocities[i3] = (Math.random() - 0.5) * 0.05;
    velocities[i3 + 1] = (Math.random() - 0.5) * 0.05;
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.05;

    const color =
      Math.random() > 0.9
        ? new THREE.Color("yellow")
        : new THREE.Color("white");
    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;
  }

  useFrame(() => {
    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] += velocities[i];
      if (positions[i] > 100 || positions[i] < -100) velocities[i] *= -1;
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={particleCount}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          array={colors}
          count={particleCount}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.5}
        vertexColors
        depthWrite={false}
        transparent={true}
        opacity={0.8}
      />
    </points>
  );
}
