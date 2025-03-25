"use client";
import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  KeyboardControls,
  OrbitControls,
  useKeyboardControls,
} from "@react-three/drei";
import { useGeneratedModel } from "@/hooks/UseGeneratedModel";
import { model } from "@/helpers/constant";
import { SceneLighting } from "./SceneLighting";
import { Model3D } from "./Model3D";
import * as THREE from "three";

const CAMERA_CONFIG = {
  fov: 30,
  near: 0.1,
  far: 500,
  position: [0, 0, 20] as [number, number, number],
};

// Bản đồ phím bấm
const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
  { name: "rightward", keys: ["ArrowRight", "KeyD"] },
  { name: "down", keys: ["ArrowDown", "KeyX"] },
  { name: "jump", keys: ["Space"] },
  { name: "run", keys: ["Shift"] },
];

export default function HomeContent(): React.JSX.Element {
  const { scene: houseScene } = useGeneratedModel(model.house);

  return (
    <Canvas
      style={{ width: "100vw", height: "100dvh" }}
      camera={CAMERA_CONFIG}
      onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
    >
      <SceneLighting />
      <KeyboardControls map={keyboardMap}>
        {houseScene && <MovableModel scene={houseScene} />}
      </KeyboardControls>
      <OrbitControls makeDefault enableDamping dampingFactor={0.1} />
    </Canvas>
  );
}

// ✅ Component để di chuyển model
function MovableModel({ scene }: { scene: THREE.Object3D }) {
  const ref = useRef<THREE.Object3D>(null);
  const [, getKeys] = useKeyboardControls();

  // Xử lý đầu vào từ bàn phím
  useFrame((state, delta) => {
    if (!ref.current) return;

    const keys = getKeys();
    const speed = 10;
    const direction = new THREE.Vector3();

    if (keys.forward) direction.z += 1;
    if (keys.backward) direction.z -= 1;
    if (keys.leftward) direction.x += 1;
    if (keys.rightward) direction.x -= 1;
    if (keys.down) direction.y += 1;
    if (keys.jump) direction.y -= 1;
    direction.normalize().multiplyScalar(speed * delta);
    ref.current.position.add(direction);
  });

  return <Model3D ref={ref} scene={scene} />;
}
