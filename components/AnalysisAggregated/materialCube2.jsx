import React, { useRef } from "react";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

const TypeCube = ({ position, color, label,size }) => {
  const cubeRef = useRef();

  // Rotate cube on y-axis
  useFrame(() => {
    if (cubeRef.current) {
      cubeRef.current.rotation.y += 0.01;
    }
  });

  // 🔹 SHORT LABEL (first 2 letters)
  const shortLabel = label
    ?.trim()
    .slice(0, 2)
    .toUpperCase();

  return (
    <group position={position}>
      {/* Rotating Cube */}
     <mesh ref={cubeRef}>
  <boxGeometry args={[size, size, size]} />
  <meshStandardMaterial
    color={color}
    roughness={0.35}
    metalness={0.45}
  />
</mesh>


      {/* Label BELOW cube */}
      <Text
  position={[0, -(size / 1 + 0.5), 0]}
  fontSize={size * 0.50}
  color="white"
  anchorX="center"
  anchorY="middle"
>
        {shortLabel}
      </Text>
    </group>
  );
};

export default TypeCube;
  
