
import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sphere, Stars, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Globe component with animated connections
const Globe = () => {
  const globeRef = useRef<THREE.Mesh>(null);
  const linesRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  // Generate connection points on globe surface
  const connectionPoints = useMemo(() => {
    const points = [];
    for (let i = 0; i < 50; i++) {
      const lat = (Math.random() - 0.5) * Math.PI;
      const lon = Math.random() * Math.PI * 2;
      const radius = 2;
      
      const x = radius * Math.cos(lat) * Math.cos(lon);
      const y = radius * Math.sin(lat);
      const z = radius * Math.cos(lat) * Math.sin(lon);
      
      points.push(new THREE.Vector3(x, y, z));
    }
    return points;
  }, []);

  // Create animated connection lines
  const connectionLines = useMemo(() => {
    const lines = [];
    for (let i = 0; i < connectionPoints.length; i++) {
      for (let j = i + 1; j < connectionPoints.length; j++) {
        if (Math.random() > 0.85) { // Only show some connections
          const distance = connectionPoints[i].distanceTo(connectionPoints[j]);
          if (distance < 3) { // Only connect nearby points
            lines.push([connectionPoints[i], connectionPoints[j]]);
          }
        }
      }
    }
    return lines;
  }, [connectionPoints]);

  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.005;
    }
    if (linesRef.current) {
      linesRef.current.rotation.y += 0.005;
    }
  });

  return (
    <>
      {/* Main Globe */}
      <Sphere ref={globeRef} args={[2, 64, 32]}>
        <meshPhongMaterial
          color="#8B5CF6"
          transparent
          opacity={0.1}
          wireframe
        />
      </Sphere>

      {/* Outer glow sphere */}
      <Sphere args={[2.05, 32, 16]}>
        <meshBasicMaterial
          color="#22D3EE"
          transparent
          opacity={0.05}
        />
      </Sphere>

      {/* Connection points */}
      <group ref={linesRef}>
        {connectionPoints.map((point, index) => (
          <mesh key={index} position={point}>
            <sphereGeometry args={[0.02]} />
            <meshBasicMaterial color="#22D3EE" />
          </mesh>
        ))}
        
        {/* Connection lines */}
        {connectionLines.map((line, index) => {
          const geometry = new THREE.BufferGeometry().setFromPoints(line);
          return (
            <line key={index} geometry={geometry}>
              <lineBasicMaterial color="#8B5CF6" transparent opacity={0.3} />
            </line>
          );
        })}
      </group>

      {/* Ambient stars */}
      <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade />
    </>
  );
};

const InteractiveGlobe = () => {
  return (
    <div className="relative w-full h-96 md:h-[500px] overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#8B5CF6" />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#22D3EE" />
        
        <Globe />
        
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.5}
          minDistance={5}
          maxDistance={15}
        />
      </Canvas>
      
      {/* Gradient overlay for better integration */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent pointer-events-none" />
    </div>
  );
};

export default InteractiveGlobe;
