import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { Trail, Text, useGLTF } from "@react-three/drei";
import * as THREE from "three";

export default function Planet({
  name,
  radius,
  baseSpeed,
  modelPath,
  size,
  speedMultiplier,
  onClick,
  isSelected,
}) {
  const planetRef = useRef();
  const textRef = useRef();
  const timeRef = useRef(0);
  const { camera } = useThree();
  const { scene } = useGLTF(modelPath);

  useFrame(() => {
    if (planetRef.current) {
      timeRef.current += baseSpeed * speedMultiplier;
      planetRef.current.position.x = Math.cos(timeRef.current) * radius;
      planetRef.current.position.z = Math.sin(timeRef.current) * radius;
      planetRef.current.rotation.y += baseSpeed * 0.5;

      if (textRef.current) {
        const textOffset =
          size + (name === "Jupiter" || name === "Uranus" ? 4 : 1);
        textRef.current.position.set(
          planetRef.current.position.x,
          planetRef.current.position.y + textOffset,
          planetRef.current.position.z
        );
        textRef.current.lookAt(camera.position);
      }

      if (isSelected) {
        camera.position.lerp(
          new THREE.Vector3(
            planetRef.current.position.x - 10,
            planetRef.current.position.y + 10,
            planetRef.current.position.z
          ),
          0.1
        );
        camera.lookAt(planetRef.current.position);
      }
    }
  });

  return (
    <>
      <Trail
        local
        width={0.1}
        length={5}
        color="white"
        attenuation={(t) => t * t}
      >
        <primitive
          ref={planetRef}
          object={scene}
          scale={size}
          onClick={() => onClick(name)}
        />
      </Trail>
      <Text
        ref={textRef}
        color="white"
        anchorX="center"
        anchorY="middle"
        fontSize={0.6}
      >
        {name}
      </Text>
    </>
  );
}
