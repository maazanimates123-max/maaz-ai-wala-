"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const PURPLE = new THREE.Color("#a78bfa");
const VIOLET = new THREE.Color("#7c3aed");
const CYAN = new THREE.Color("#22d3ee");

function seeded(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

/** Fresnel glow shader: bright purple→cyan rim, transparent centre — reads as a glowing 3D energy core. */
function GlowMaterial({ power = 2.2, intensity = 1.4 }: { power?: number; intensity?: number }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uA: { value: PURPLE }, uB: { value: CYAN }, uPower: { value: power }, uIntensity: { value: intensity } }), [power, intensity]);
  useFrame((s) => {
    if (mat.current) mat.current.uniforms.uTime.value = s.clock.elapsedTime;
  });
  return (
    <shaderMaterial
      ref={mat}
      uniforms={uniforms}
      transparent
      depthWrite={false}
      blending={THREE.AdditiveBlending}
      vertexShader={`
        varying vec3 vN; varying vec3 vV; varying vec3 vP;
        void main(){ vec4 mv = modelViewMatrix*vec4(position,1.0); vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz); vP = position; gl_Position = projectionMatrix*mv; }`}
      fragmentShader={`
        uniform float uTime; uniform vec3 uA; uniform vec3 uB; uniform float uPower; uniform float uIntensity;
        varying vec3 vN; varying vec3 vV; varying vec3 vP;
        void main(){
          float f = pow(1.0 - max(dot(vN, vV), 0.0), uPower);
          float m = 0.5 + 0.5*sin(vP.y*3.0 + uTime*1.4);
          vec3 c = mix(uA, uB, m);
          gl_FragColor = vec4(c * f * uIntensity, f);
        }`}
    />
  );
}

function Core() {
  const shell = useRef<THREE.Mesh>(null);
  const shell2 = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);
  useFrame((s, d) => {
    const dt = Math.min(d, 0.05);
    if (shell.current) { shell.current.rotation.x += dt * 0.25; shell.current.rotation.y += dt * 0.35; }
    if (shell2.current) { shell2.current.rotation.x -= dt * 0.18; shell2.current.rotation.z += dt * 0.22; }
    if (inner.current) inner.current.scale.setScalar(1 + Math.sin(s.clock.elapsedTime * 1.8) * 0.05);
  });
  return (
    <group>
      <mesh ref={inner}><sphereGeometry args={[0.62, 64, 64]} /><GlowMaterial power={1.6} intensity={1.8} /></mesh>
      <mesh><sphereGeometry args={[0.34, 32, 32]} /><meshBasicMaterial color={PURPLE} transparent opacity={0.9} toneMapped={false} /></mesh>
      <mesh ref={shell}><icosahedronGeometry args={[0.95, 1]} /><meshBasicMaterial color={PURPLE} wireframe transparent opacity={0.55} /></mesh>
      <mesh ref={shell2}><icosahedronGeometry args={[1.12, 0]} /><meshBasicMaterial color={CYAN} wireframe transparent opacity={0.35} /></mesh>
      <mesh><sphereGeometry args={[1.35, 48, 48]} /><GlowMaterial power={3.2} intensity={0.9} /></mesh>
    </group>
  );
}

function Rings() {
  const refs = [useRef<THREE.Group>(null), useRef<THREE.Group>(null), useRef<THREE.Group>(null)];
  const cfg = [
    { r: 1.7, tilt: [1.15, 0.2, 0], speed: 0.5, color: CYAN },
    { r: 2.0, tilt: [1.45, -0.6, 0.3], speed: -0.35, color: PURPLE },
    { r: 2.35, tilt: [0.9, 0.9, -0.2], speed: 0.25, color: VIOLET },
  ];
  useFrame((_, d) => refs.forEach((r, i) => r.current && (r.current.rotation.z += Math.min(d, 0.05) * cfg[i].speed)));
  return (
    <>
      {cfg.map((c, i) => (
        <group key={i} rotation={c.tilt as [number, number, number]}>
          <group ref={refs[i]}>
            <mesh><torusGeometry args={[c.r, 0.007, 8, 220]} /><meshBasicMaterial color={c.color} transparent opacity={0.45} /></mesh>
            <mesh position={[c.r, 0, 0]}><sphereGeometry args={[0.055, 16, 16]} /><meshBasicMaterial color={c.color} toneMapped={false} /></mesh>
            <mesh position={[c.r, 0, 0]}><sphereGeometry args={[0.14, 16, 16]} /><meshBasicMaterial color={c.color} transparent opacity={0.2} blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>
          </group>
        </group>
      ))}
    </>
  );
}

function Network({ count, pulses: pulseCount }: { count: number; pulses: number }) {
  const { nodes, edges, linePositions } = useMemo(() => {
    const rand = seeded(42);
    const nodes: THREE.Vector3[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const radius = 2.75 + (rand() - 0.5) * 0.5;
      nodes.push(new THREE.Vector3(Math.cos(golden * i) * r * radius, y * radius, Math.sin(golden * i) * r * radius));
    }
    const edges: [number, number][] = [];
    const seen = new Set<string>();
    nodes.forEach((a, i) =>
      nodes.map((b, j) => ({ j, d: a.distanceTo(b) })).filter((x) => x.j !== i).sort((x, y) => x.d - y.d).slice(0, 3).forEach(({ j }) => {
        const k = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (!seen.has(k)) { seen.add(k); edges.push([i, j]); }
      }),
    );
    const linePositions = new Float32Array(edges.length * 6);
    edges.forEach(([a, b], k) => linePositions.set([nodes[a].x, nodes[a].y, nodes[a].z, nodes[b].x, nodes[b].y, nodes[b].z], k * 6));
    return { nodes, edges, linePositions };
  }, [count]);

  const nodePositions = useMemo(() => new Float32Array(nodes.flatMap((n) => [n.x, n.y, n.z])), [nodes]);
  const pulses = useMemo(() => {
    const rand = seeded(7);
    return Array.from({ length: pulseCount }, () => ({ e: Math.floor(rand() * edges.length), t: rand(), v: 0.35 + rand() * 0.6 }));
  }, [pulseCount, edges.length]);
  const pulsePos = useMemo(() => new Float32Array(pulseCount * 3), [pulseCount]);
  const pulseRef = useRef<THREE.Points>(null);
  const group = useRef<THREE.Group>(null);

  useFrame((_, d) => {
    const dt = Math.min(d, 0.05);
    if (group.current) group.current.rotation.y -= dt * 0.06;
    pulses.forEach((p, k) => {
      p.t += dt * p.v;
      if (p.t > 1) { p.t = 0; p.e = (p.e + 13) % edges.length; }
      const [a, b] = edges[p.e];
      pulsePos[k * 3] = nodes[a].x + (nodes[b].x - nodes[a].x) * p.t;
      pulsePos[k * 3 + 1] = nodes[a].y + (nodes[b].y - nodes[a].y) * p.t;
      pulsePos[k * 3 + 2] = nodes[a].z + (nodes[b].z - nodes[a].z) * p.t;
    });
    if (pulseRef.current) pulseRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group ref={group}>
      <lineSegments>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[linePositions, 3]} /></bufferGeometry>
        <lineBasicMaterial color={PURPLE} transparent opacity={0.16} blending={THREE.AdditiveBlending} depthWrite={false} />
      </lineSegments>
      <points>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[nodePositions, 3]} /></bufferGeometry>
        <pointsMaterial color={PURPLE} size={0.07} sizeAttenuation transparent opacity={0.9} depthWrite={false} />
      </points>
      <points ref={pulseRef}>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[pulsePos, 3]} /></bufferGeometry>
        <pointsMaterial color={CYAN} size={0.09} sizeAttenuation transparent blending={THREE.AdditiveBlending} depthWrite={false} />
      </points>
    </group>
  );
}

function Dust({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const rand = seeded(99);
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) a.set([(rand() - 0.5) * 14, (rand() - 0.5) * 9, (rand() - 0.5) * 8 - 2], i * 3);
    return a;
  }, [count]);
  useFrame((_, d) => ref.current && (ref.current.rotation.y += Math.min(d, 0.05) * 0.015));
  return (
    <points ref={ref}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <pointsMaterial color="#c4b5fd" size={0.02} sizeAttenuation transparent opacity={0.55} depthWrite={false} />
    </points>
  );
}

function Rig({ children }: { children: React.ReactNode }) {
  const g = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (!g.current) return;
    g.current.rotation.x = THREE.MathUtils.lerp(g.current.rotation.x, s.pointer.y * 0.3, 0.05);
    g.current.rotation.y = THREE.MathUtils.lerp(g.current.rotation.y, s.pointer.x * 0.45, 0.05);
  });
  return <group ref={g}>{children}</group>;
}

export default function AiCoreScene({ lite = false, paused = false }: { lite?: boolean; paused?: boolean }) {
  return (
    <Canvas
      dpr={lite ? [1, 1.5] : [1, 2]}
      camera={{ position: [0, 0, 7.4], fov: 45 }}
      gl={{ antialias: !lite, alpha: true, powerPreference: lite ? "low-power" : "high-performance" }}
      frameloop={paused ? "never" : "always"}
      aria-hidden
    >
      <Rig>
        <Core />
        <Rings />
        <Network count={lite ? 46 : 80} pulses={lite ? 16 : 36} />
      </Rig>
      <Dust count={lite ? 160 : 420} />
    </Canvas>
  );
}
