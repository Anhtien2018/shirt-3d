"use client";
import { useMemo, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface UseGeneratedModelProps {
  scene: THREE.Group | null;
  nodes: Record<string, THREE.Object3D>;
  materials: Record<string, THREE.Material>;
}

export function useGeneratedModel(
  path: string,
  scale = 1.5,
  position: [number, number, number] = [0, 0, 0],
  rotation: [number, number, number] = [0, 0, 0]
): UseGeneratedModelProps {
  const gltf = useGLTF(path) as any;
  if (!gltf || !gltf.scene) return { scene: null, nodes: {}, materials: {} };
  const { scene, nodes, materials } = gltf;

  const optimizedScene = useMemo(() => {
    if (!scene) return null;
    const clonedScene = scene.clone() as THREE.Group;
    clonedScene.scale.set(scale, scale, scale);
    clonedScene.position.set(...position);
    clonedScene.rotation.set(...rotation);

    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.matrixAutoUpdate = true;
        child.position.set(...position);
        child.updateMatrixWorld();
      }
    });

    return clonedScene;
  }, [scene, scale, position, rotation]);

  useEffect(() => {
    return () => {
      if (optimizedScene) {
        optimizedScene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            (child as THREE.Mesh).geometry.dispose();
            if ((child as THREE.Mesh).material) {
              ((child as THREE.Mesh).material as THREE.Material).dispose();
            }
          }
        });
      }
    };
  }, [optimizedScene]);

  return { scene: optimizedScene, nodes, materials };
}

useGLTF.preload("/gltf/t-shirt/scene.gltf");
