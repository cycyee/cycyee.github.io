import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const COUNT = 120
const GRAVITY_CONSTANT = 0.0005
const PARTICLE_MASS = 1
const DAMPING = 0.997
const SPIN_STRENGTH = 0.0003
const BOUNDS_XY = 4
const SIZE = 0.025

const ATTRACTORS = [
  { pos: new THREE.Vector3(0, 0, -3), mass: 5, axis: new THREE.Vector3(0, 1, 0.3).normalize() },
  { pos: new THREE.Vector3(1.5, 0.8, -4), mass: 2.5, axis: new THREE.Vector3(0, 1, 0).normalize() },
  { pos: new THREE.Vector3(-1.2, -0.5, -2.5), mass: 2, axis: new THREE.Vector3(1, 0, -0.5).normalize() },
]

interface Particle {
  pos: THREE.Vector3
  vel: THREE.Vector3
}

const _toAttractor = new THREE.Vector3()
const _spin = new THREE.Vector3()

function ParticleGroup({ color, offset }: { color: string; offset: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const groupCount = Math.floor(COUNT / 3)

  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: groupCount }, () => ({
      pos: new THREE.Vector3(
        (Math.random() - 0.5) * BOUNDS_XY * 2,
        (Math.random() - 0.5) * BOUNDS_XY * 2,
        -1.5 - Math.random() * 4 + offset,
      ),
      vel: new THREE.Vector3(
        (Math.random() - 0.5) * 0.008,
        (Math.random() - 0.5) * 0.008,
        (Math.random() - 0.5) * 0.003,
      ),
    }))
  }, [groupCount, offset])

  useFrame(() => {
    const mesh = meshRef.current
    if (!mesh) return

    for (let i = 0; i < groupCount; i++) {
      const p = particles[i]

      for (const attractor of ATTRACTORS) {
        _toAttractor.subVectors(attractor.pos, p.pos)
        const distSq = _toAttractor.lengthSq()
        if (distSq < 0.0001) continue

        const gravityStrength = (GRAVITY_CONSTANT * attractor.mass * PARTICLE_MASS) / (distSq + 0.3)
        _toAttractor.normalize()
        p.vel.addScaledVector(_toAttractor, gravityStrength)

        _spin.crossVectors(attractor.axis, _toAttractor)
        p.vel.addScaledVector(_spin, SPIN_STRENGTH * attractor.mass)
      }

      p.vel.multiplyScalar(DAMPING)
      p.pos.add(p.vel)

      if (p.pos.x > BOUNDS_XY) p.pos.x -= BOUNDS_XY * 2
      if (p.pos.x < -BOUNDS_XY) p.pos.x += BOUNDS_XY * 2
      if (p.pos.y > BOUNDS_XY) p.pos.y -= BOUNDS_XY * 2
      if (p.pos.y < -BOUNDS_XY) p.pos.y += BOUNDS_XY * 2
      if (p.pos.z > -0.5) p.pos.z -= 5
      if (p.pos.z < -5.5) p.pos.z += 5

      dummy.position.copy(p.pos)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }

    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, groupCount]} frustumCulled={false}>
      <sphereGeometry args={[SIZE, 6, 6]} />
      <meshBasicMaterial color={color} toneMapped={false} transparent opacity={0.3} blending={THREE.AdditiveBlending} />
    </instancedMesh>
  )
}

export function Particles() {
  return (
    <>
      <ParticleGroup color="#ffffff" offset={0} />
      <ParticleGroup color="#ffffff" offset={-0.5} />
      <ParticleGroup color="#ffffff" offset={-1} />
    </>
  )
}
