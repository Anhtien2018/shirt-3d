import { useEffect } from "react";
import * as THREE from "three";

interface Model3DProps {
  scene: THREE.Object3D | undefined;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  ref: React.MutableRefObject<THREE.Object3D | null>;
}

export const Model3DMore = ({
  scene,
  ref,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}: Model3DProps) => {
  useEffect(() => {
    if (scene) {
      // Áp dụng scale, rotation và position
      scene.scale.set(scale, scale, scale);
      scene.rotation.set(...rotation);
      scene.position.set(...position);

      // Đảm bảo vật liệu cập nhật
      scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh && (child as THREE.Mesh).material) {
          const material = (child as THREE.Mesh)
            .material as THREE.MeshStandardMaterial;
          material.needsUpdate = true;
        }
      });
    }
  }, [scene, position, rotation, scale]);

  return scene ? <primitive ref={ref} object={scene} /> : null;
};
