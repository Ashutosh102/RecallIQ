
import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Line } from '@react-three/drei';
import * as THREE from 'three';

// Generate points on a sphere
const generateSpherePoints = (count: number, radius: number) => {
  const points = new Float32Array(count * 3);
  const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const radiusAtY = Math.sqrt(1 - y * y) * radius;
    const theta = phi * i;

    const x = Math.cos(theta) * radiusAtY;
    const z = Math.sin(theta) * radiusAtY;

    points[i * 3] = x;
    points[i * 3 + 1] = y * radius;
    points[i * 3 + 2] = z;
  }

  return points;
};

// Generate connection lines between nearby points
const generateConnections = (points: Float32Array, maxDistance: number) => {
  const connections = [];
  const pointCount = points.length / 3;

  for (let i = 0; i < pointCount; i++) {
    const p1 = new THREE.Vector3(
      points[i * 3],
      points[i * 3 + 1],
      points[i * 3 + 2]
    );

    for (let j = i + 1; j < pointCount; j++) {
      const p2 = new THREE.Vector3(
        points[j * 3],
        points[j * 3 + 1],
        points[j * 3 + 2]
      );

      if (p1.distanceTo(p2) < maxDistance) {
        connections.push([p1, p2]);
      }
    }
  }

  return connections;
};

const GlobePoints = () => {
  const ref = useRef<THREE.Points>(null);
  const { viewport } = useThree();
  
  const points = useMemo(() => generateSpherePoints(800, 2), []);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.1;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
    }
  });

  return (
    <Points ref={ref} positions={points} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#8B5CF6"
        size={viewport.width < 4 ? 0.015 : 0.02}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.8}
      />
    </Points>
  );
};

const ConnectionLines = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  
  const connections = useMemo(() => {
    const points = generateSpherePoints(200, 2);
    return generateConnections(points, 0.8);
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {connections.slice(0, viewport.width < 4 ? 50 : 100).map((connection, index) => (
        <Line
          key={index}
          points={connection}
          color="#22D3EE"
          lineWidth={0.5}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      ))}
    </group>
  );
};

const Scene = () => {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 0, 5);
  }, [camera]);

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#8B5CF6" />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#22D3EE" />
      
      <GlobePoints />
      <ConnectionLines />
      
      {/* Outer glow ring */}
      <mesh>
        <ringGeometry args={[2.8, 3.2, 64]} />
        <meshBasicMaterial
          color="#8B5CF6"
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </>
  );
};

const InteractiveGlobe = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) {
    return (
      <div className="w-full h-64 sm:h-80 lg:h-96 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-64 sm:h-80 lg:h-96 relative overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
      >
        <Scene />
      </Canvas>
      
      {/* Gradient overlay for better blending */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-dark-bg/20 pointer-events-none" />
    </div>
  );
};

export default InteractiveGlobe;
