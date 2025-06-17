export default function Asteroids() {
  const asteroids = new Array(10).fill(0).map(() => ({
    position: [
      (Math.random() - 0.5) * 200,
      (Math.random() - 0.5) * 50,
      (Math.random() - 0.5) * 200,
    ],
    size: Math.random() * 0.4 + 0.1,
  }));
  return asteroids.map((asteroid, i) => (
    <mesh key={i} position={asteroid.position}>
      <sphereGeometry args={[asteroid.size, 8, 8]} />
      <meshStandardMaterial color="brown" />
    </mesh>
  ));
}
