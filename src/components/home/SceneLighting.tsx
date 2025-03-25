export const SceneLighting = () => {
  return (
    <>
      <ambientLight intensity={2} />
      <directionalLight position={[10, 10, 10]} intensity={2} />
      <hemisphereLight color="#ffffff" groundColor="#b97a20" intensity={2} />
      <pointLight position={[0, 5, 5]} intensity={1} distance={15} decay={2} />
    </>
  );
};
