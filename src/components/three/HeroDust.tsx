"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";

import { ScrollTrigger } from "@/lib/gsap";

const COUNT = 500;
const RADIUS = 7;
const CAMERA_Z = 5;

/** PRNG determinista (mulberry32): mismas partículas en cada carga y sin Math.random en el render. */
function createRandom(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createPositions() {
  const random = createRandom(50);
  const positions = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    // Distribución uniforme dentro de una esfera
    const r = RADIUS * Math.cbrt(random());
    const theta = random() * Math.PI * 2;
    const phi = Math.acos(2 * random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  return positions;
}

/** Punto redondo y difuso dibujado en un canvas (sin texturas externas). */
function createSprite() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.4, "rgba(255,255,255,0.6)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }
  return new THREE.CanvasTexture(canvas);
}

function Dust({ progress }: { progress: RefObject<number> }) {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => createPositions(), []);
  const sprite = useMemo(() => createSprite(), []);

  useEffect(() => () => sprite.dispose(), [sprite]);

  useFrame((state, delta) => {
    if (points.current) points.current.rotation.y += 0.02 * delta;
    // La cámara avanza en Z según el progreso de scroll del hero (0 → -1).
    state.camera.position.z = CAMERA_Z - (progress.current ?? 0);
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={sprite}
        color="#FFD60A"
        size={0.07}
        sizeAttenuation
        transparent
        opacity={0.35}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/** Polvo dorado detrás del hero. Único contexto WebGL del sitio. */
export default function HeroDust({ className }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const [frameloop, setFrameloop] = useState<"always" | "never">("always");
  const [dpr, setDpr] = useState<number | [number, number]>([1, 1.5]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    // Pausa el render cuando el hero sale del viewport.
    const observer = new IntersectionObserver(([entry]) => setFrameloop(entry.isIntersecting ? "always" : "never"));
    observer.observe(el);

    const section = el.closest("section");
    const trigger = section
      ? ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom top",
          onUpdate: (self) => {
            progress.current = self.progress;
          },
        })
      : null;

    return () => {
      observer.disconnect();
      trigger?.kill();
    };
  }, []);

  return (
    <div ref={wrapRef} className={className} style={{ pointerEvents: "none" }}>
      <Canvas
        frameloop={frameloop}
        dpr={dpr}
        camera={{ position: [0, 0, CAMERA_Z], fov: 60 }}
        gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
      >
        <fog attach="fog" args={["#0B0B0C", 3, 10]} />
        <PerformanceMonitor onDecline={() => setDpr(1)} />
        <Dust progress={progress} />
      </Canvas>
    </div>
  );
}
