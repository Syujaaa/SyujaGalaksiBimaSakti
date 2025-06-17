import { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

export default function Background() {
  const { scene } = useGLTF("/models/space.glb");
  const ref = useRef();

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.0002;
    }
  });

  return <primitive object={scene} scale={[100, 100, 100]} ref={ref} />;
}
