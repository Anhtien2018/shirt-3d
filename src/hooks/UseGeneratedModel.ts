"use client";
import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface useGeneratedModelProps {
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scene: THREE.Group;
  nodes: { [key: string]: THREE.Object3D };
  materials: { [key: string]: THREE.Material };
}
export function useGeneratedModel(
  path: string,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0]
): useGeneratedModelProps {
  const { scene, nodes, materials } = useGLTF(path);

  const optimizedScene = useMemo(() => {
    const clonedScene = scene.clone();
    clonedScene.scale.set(scale, scale, scale);
    clonedScene.position.set(...(position as [number, number, number]));
    clonedScene.rotation.set(...(rotation as [number, number, number]));
    return clonedScene;
  }, [scene, scale, position, rotation]);

  return { scene: optimizedScene, nodes, materials };
}
