import { useEffect } from "react";
import * as THREE from "three";

interface Model3DProps {
  scene: THREE.Object3D | undefined;
  position?: [number, number, number];
  ref: React.MutableRefObject<THREE.Object3D | null>;
}

export const Model3D = ({ scene, ref }: Model3DProps) => {
  useEffect(() => {
    if (scene) {
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      scene.position.sub(center);

      scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh && (child as THREE.Mesh).material) {
          const material = (child as THREE.Mesh)
            .material as THREE.MeshStandardMaterial;
          material.needsUpdate = true;
        }
      });
    }
  }, [scene]);

  return scene ? <primitive ref={ref} object={scene} /> : null;
};
