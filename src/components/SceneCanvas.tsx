import { Canvas } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { Particles } from './three/Particles'
import { RefractiveFrame } from './three/RefractiveFrame'
import type { GlassRect } from '../App'

interface SceneCanvasProps {
  glassRef: React.RefObject<GlassRect | null>
}

export function SceneCanvas({ glassRef }: SceneCanvasProps) {
  return (
    <Canvas
      camera={{ fov: 50, near: 0.1, far: 100, position: [0, 0, 5] }}
      gl={{ antialias: true }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <color attach="background" args={['#1a1a1a']} />
      <Environment resolution={64}>
        <Lightformer form="ring" intensity={0.6} position={[0, 2, -6]} scale={8} color="#dde4ff" />
        <Lightformer form="rect" intensity={0.3} position={[-3, -1, -8]} scale={4} color="#ffd0e0" />
        <Lightformer form="rect" intensity={0.3} position={[3, -1, -8]} scale={4} color="#ffe8c0" />
      </Environment>
      <Particles />
      <RefractiveFrame glassRef={glassRef} />
    </Canvas>
  )
}
