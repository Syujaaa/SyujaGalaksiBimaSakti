import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import { Text, useGLTF, Sparkles } from "@react-three/drei";
import "swiper/css";
import "swiper/css/navigation";
import * as THREE from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

export default function Sun({ onClick }) {
  const sunRef = useRef();
  const textRef = useRef();
  const { camera } = useThree();
  const isMobile = window.innerWidth <= 768;

  const { scene } = useGLTF("/models/sun.glb");

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material.emissive = new THREE.Color(0xffcc00);
        child.material.emissiveIntensity = 2;
        child.material.toneMapped = false;
      }
    });
  }, [scene]);

  return (
    <group ref={sunRef} position={[0, 0, 0]} onClick={onClick}>
      <EffectComposer>
        <Bloom
          intensity={2}
          luminanceThreshold={0.1}
          luminanceSmoothing={0.9}
        />
      </EffectComposer>
      <primitive object={scene} scale={[0.67, 0.67, 0.67]} />

      <Sparkles
        position={[0, 0, 0]}
        count={50}
        speed={0.1}
        size={6}
        scale={10}
        color="#ffcc00"
        noise={0.1}
      />
    </group>
  );
}

useGLTF.preload("/models/sun.glb");
