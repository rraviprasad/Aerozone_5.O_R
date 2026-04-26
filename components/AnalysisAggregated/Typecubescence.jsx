import React, { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import TypeCube from "./materialCube2";

const COLORS = [
  "#7c3aed",
  "#22c55e",
  "#0ea5e9",
  "#f97316",
  "#ec4899"
];

const TypeCubeScene = ({ rows = [] }) => {

  /* -------- Extract Unique Types -------- */
  const types = useMemo(() => {
    return [
      ...new Set(
        rows
          .map(r => String(r.Type || "").trim())
          .filter(Boolean)
          .map(t => t.substring(0, 2).toUpperCase())
          .filter(t => t !== "00")
      )
    ].sort();
  }, [rows]);


  const CUBE_SIZE = 1.5;   // 👈 increase / decrease cube size here
  const GAP = 2;        // tiny breathing gap between cubes

  /* -------- Layout -------- */
  const COLUMNS = 2;
const SPACING = CUBE_SIZE + GAP;

const rowsCount = Math.ceil(types.length / COLUMNS);

const startX = -((COLUMNS - 1) * SPACING) / 2;
const startY = ((rowsCount - 1) * SPACING) / 2;


  /* -------- FIXED CAMERA (important) -------- */
  const cameraZ = 10; // constant → cubes always same size

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        background: "#000",
        borderRadius: "12px",
        border: "1px solid #7e22ce",
        overflow: "hidden"
      }}
    >
      <Canvas camera={{ position: [0, 0, cameraZ], fov: 60 }}>
        {/* Lights */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />

        {/* Horizontal Row */}
        {types.map((type, index) => {
  const row = Math.floor(index / COLUMNS);
  const col = index % COLUMNS;

  const x = startX + col * SPACING;
  const y = startY - row * SPACING;

  return (
    <TypeCube
      key={type}
      label={type}
      color={COLORS[index % COLORS.length]}
      size={CUBE_SIZE}
      position={[x, y, 0]}
    />
  );
})}


        {/* Locked controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={false}
        // enableRotate={false}
        />
      </Canvas>
    </div>
  );
};

export default TypeCubeScene;
