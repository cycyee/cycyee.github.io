import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'
import type { GlassRect } from '../../App'

interface Props {
  glassRef: React.RefObject<GlassRect | null>
}

export function RefractiveFrame({ glassRef }: Props) {
  const { viewport } = useThree()
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    const data = glassRef.current
    const mesh = meshRef.current
    if (!data || !mesh) return

    const top = data.top - window.scrollY
    const bottom = top + data.height
    const right = data.left + data.width

    const cx = ((data.left + right) / 2 / window.innerWidth) * 2 - 1
    const cy = -((top + bottom) / 2 / window.innerHeight) * 2 + 1
    const w = (data.width / window.innerWidth) * viewport.width
    const h = (data.height / window.innerHeight) * viewport.height

    mesh.position.set(cx * viewport.width * 0.5, cy * viewport.height * 0.5, 0)
    mesh.scale.set(w, h, 1)
  })

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[1, 1]} />
      <MeshTransmissionMaterial
        transmission={1}
        ior={1.5}
        thickness={0.5}
        roughness={0.05}
        chromaticAberration={0.25}
        distortion={0.15}
        distortionScale={0.1}
        temporalDistortion={0.05}
        samples={3}
        resolution={256}
        color="#ffffff"
        attenuationColor="#ffffff"
        attenuationDistance={5}
        backside
      />
    </mesh>
  )
}
