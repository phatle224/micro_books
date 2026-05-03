"use client";

import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera, Environment, ContactShadows, Text } from "@react-three/drei";
import * as THREE from "three";

function Book({ color = "black", ...props }) {
  const mesh = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  // Animation for slight rotation based on mouse
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (mesh.current) {
      mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, Math.cos(t / 2) / 8 + 0.25, 0.1);
      mesh.current.rotation.y = THREE.MathUtils.lerp(mesh.current.rotation.y, Math.sin(t / 4) / 4, 0.1);
      mesh.current.rotation.z = THREE.MathUtils.lerp(mesh.current.rotation.z, Math.sin(t / 4) / 8, 0.1);
      
      // Follow mouse slightly
      mesh.current.position.y = THREE.MathUtils.lerp(mesh.current.position.y, (state.mouse.y * 0.5), 0.1);
      mesh.current.position.x = THREE.MathUtils.lerp(mesh.current.position.x, (state.mouse.x * 0.5), 0.1);
    }
  });

  return (
    <group {...props}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <mesh
          ref={mesh}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          scale={hovered ? 1.05 : 1}
          transition-all
        >
          {/* Book Geometry */}
          <boxGeometry args={[3, 4, 0.5]} />
          <meshStandardMaterial 
            color={hovered ? "#111" : color} 
            roughness={0.1} 
            metalness={0.1}
          />
          
          {/* Cover Label / Detail */}
          <mesh position={[0, 0, 0.26]}>
            <planeGeometry args={[2.5, 3.5]} />
            <meshStandardMaterial color="white" roughness={1} />
            <Text
              position={[0, 1, 0.01]}
              fontSize={0.2}
              color="black"
              font="/fonts/Inter-Bold.woff"
              anchorX="center"
              anchorY="middle"
            >
              MICROBOOKS
            </Text>
            <Text
              position={[0, 0, 0.01]}
              fontSize={0.12}
              color="#666"
              anchorX="center"
              anchorY="middle"
              maxWidth={2}
              textAlign="center"
            >
              The Future of Reading
            </Text>
          </mesh>

          {/* Spine Detail */}
          <mesh position={[-1.51, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[0.5, 3.5]} />
            <meshStandardMaterial color="#222" />
          </mesh>
        </mesh>
      </Float>
    </group>
  );
}

export function Hero3D() {
  return (
    <div className="w-full h-[500px] relative mt-[-100px] mb-[-50px] pointer-events-none md:pointer-events-auto">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={35} />
        
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Book color="#000" position={[0, 0, 0]} />
        
        {/* Floating Particles/Elements */}
        <Float speed={4} rotationIntensity={1} floatIntensity={2}>
          <mesh position={[-4, 2, -2]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color="blue" emissive="blue" emissiveIntensity={2} />
          </mesh>
        </Float>
        
        <Float speed={3} rotationIntensity={1} floatIntensity={2}>
          <mesh position={[4, -2, -1]}>
            <boxGeometry args={[0.2, 0.2, 0.2]} />
            <meshStandardMaterial color="purple" emissive="purple" emissiveIntensity={2} />
          </mesh>
        </Float>

        <Environment preset="city" />
        <ContactShadows position={[0, -3.5, 0]} opacity={0.4} scale={20} blur={2} far={4.5} />
      </Canvas>
      
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/10 blur-[100px] rounded-full -z-10" />
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-purple-500/10 blur-[100px] rounded-full -z-10" />
    </div>
  );
}
