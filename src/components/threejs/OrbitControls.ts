import { useTheme } from "@mui/material/styles";
import { WorldBound } from "@/types/model";

export const useOrbitControl = (
  orbitControlRef: React.MutableRefObject<any>
) => {
  const theme = useTheme();

  const zoomInOut = (zoomStep: number) => {
    if (orbitControlRef.current) {
      const controls: any = orbitControlRef.current;
      const camera = controls.object;

      const newZ = camera.position.z + zoomStep;
      const maxZoom = 20;
      const targetZoom = Math.min(Math.max(newZ, 3), maxZoom);

      const zoomDuration = 300;
      const startTime = performance.now();

      const animateZoom = (currentTime: number) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / zoomDuration, 1);
        const newZoom =
          camera.position.z + (targetZoom - camera.position.z) * progress;
        camera.position.z = newZoom;
        controls.update();

        if (progress < 1) {
          requestAnimationFrame(animateZoom);
        }
      };

      requestAnimationFrame(animateZoom);
    }
  };

  const moveOrbitToCenter = (worldBound: WorldBound): Promise<void> => {
    const width = Math.abs(worldBound.xMax - worldBound.xMin);
    const centerPoint = worldBound.xMax - width / 2;

    const control: any = orbitControlRef.current;
    if (!control) return Promise.resolve();

    const marginLeft = isMobile ? 0 : -1;
    const targetPosition = {
      x: centerPoint + marginLeft,
      y: worldBound.hasTopModule ? (isMobile ? 1 : 1.5) : 0.5,
      z: 0,
    };

    const startPosition = {
      x: control.target.x,
      y: control.target.y,
      z: control.target.z,
    };

    return animateOrbitControlToPosition(
      control,
      null,
      startPosition,
      targetPosition,
      300
    );
  };

  const animateOrbitControlToPosition = (
    control: any,
    camera: any,
    startPosition: { x: number; y: number; z: number },
    targetPosition: { x: number; y: number; z: number },
    duration: number
  ): Promise<void> => {
    const startTime = performance.now();

    const animate = (resolve: () => void) => (time: number) => {
      const elapsedTime = time - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      if (camera) {
        camera.position.set(
          startPosition.x + (targetPosition.x - startPosition.x) * progress,
          startPosition.y + (targetPosition.y - startPosition.y) * progress,
          startPosition.z + (targetPosition.z - startPosition.z) * progress
        );
      } else {
        control.target.set(
          startPosition.x + (targetPosition.x - startPosition.x) * progress,
          startPosition.y + (targetPosition.y - startPosition.y) * progress,
          startPosition.z + (targetPosition.z - startPosition.z) * progress
        );
      }

      control.update();

      if (progress < 1) {
        requestAnimationFrame(() => animate(resolve));
      } else {
        resolve();
      }
    };

    return new Promise((resolve) =>
      requestAnimationFrame(() => animate(resolve))
    );
  };

  const cameraToFrontView = async (worldBound: WorldBound) => {
    let width = Math.abs(worldBound.xMax - worldBound.xMin);
    let depth = Math.abs(worldBound.zMax - worldBound.zMin);
    width = Math.max(width, 5.5);

    const control: any = orbitControlRef.current;
    if (!control) return;

    const camera = control.object;
    const targetCamera = { x: 0, y: 0, z: 0 };

    await moveOrbitToCenter(worldBound);

    return await animateOrbitControlToPosition(
      control,
      camera,
      camera.position,
      targetCamera,
      300
    );
  };

  return {
    zoomInOut,
    moveOrbitToCenter,
    cameraToFrontView,
  };
};
