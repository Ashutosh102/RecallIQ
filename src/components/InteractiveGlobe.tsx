
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Stars, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Simplified Globe component without complex line rendering
const Globe = () => {
  const globeRef = useRef<THREE.Mesh>(null);
  const pointsRef = useRef<THREE.Group>(null);

  // Simple animation
  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.005;
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.005;
    }
  });

  // Generate simple points on globe surface
  const connectionPoints = [];
  for (let i = 0; i < 20; i++) {
    const lat = (Math.random() - 0.5) * Math.PI;
    const lon = Math.random() * Math.PI * 2;
    const radius = 2.1;
    
    const x = radius * Math.cos(lat) * Math.cos(lon);
    const y = radius * Math.sin(lat);
    const z = radius * Math.cos(lat) * Math.sin(lon);
    
    connectionPoints.push([x, y, z]);
  }

  return (
    <>
      {/* Main Globe */}
      <Sphere ref={globeRef} args={[2, 32, 16]}>
        <meshPhongMaterial
          color="#8B5CF6"
          transparent
          opacity={0.15}
          wireframe
        />
      </Sphere>

      {/* Outer glow sphere */}
      <Sphere args={[2.05, 16, 8]}>
        <meshBasicMaterial
          color="#22D3EE"
          transparent
          opacity={0.05}
        />
      </Sphere>

      {/* Simple connection points */}
      <group ref={pointsRef}>
        {connectionPoints.map((position, index) => (
          <mesh key={`point-${index}`} position={position}>
            <sphereGeometry args={[0.03]} />
            <meshBasicMaterial 
              color="#22D3EE" 
              transparent
              opacity={0.8}
            />
          </mesh>
        ))}
      </group>

      {/* Ambient stars */}
      <Stars radius={100} depth={50} count={500} factor={2} saturation={0} fade />
    </>
  );
};

const InteractiveGlobe = () => {
  return (
    <div className="relative w-full h-96 md:h-[500px] overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "default"
        }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.4} color="#8B5CF6" />
        <pointLight position={[-10, -10, -10]} intensity={0.2} color="#22D3EE" />
        
        <Globe />
        
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.5}
          minDistance={4}
          maxDistance={12}
          enableDamping={true}
          dampingFactor={0.05}
        />
      </Canvas>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent pointer-events-none" />
    </div>
  );
};

export default InteractiveGlobe;
