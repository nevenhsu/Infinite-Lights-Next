'use client'

import { useRef, useMemo, useEffect, forwardRef } from 'react'
import { TubeGeometry, LineCurve3, Vector3 } from 'three'
import { Uniform } from 'three'
import { useMeshHandle, type HandleRef } from '@/components/sceneWithControls/hooks/useMeshHandle'
import { fragmentShader, vertexShader } from './shades'
import { options } from '@/components/sceneWithControls/config'
import { getAttributes, type CarLightArgs } from './attributes'
import type { MeshProps } from '@react-three/fiber'
import type { Mesh, Vector2, ShaderMaterial } from 'three'

type CarLightProps = {
  meshProps: MeshProps
  fade: Vector2
  args: CarLightArgs
}

type UniformsKeys = 'uColor' | 'uTravelLength' | 'uTime' | 'uSpeed'

export type CarLightRef = HandleRef<UniformsKeys>

export default forwardRef<CarLightRef, CarLightProps>(function CarLight(
  { meshProps, fade, args },
  ref
) {
  const meshRef = useRef<Mesh<TubeGeometry, ShaderMaterial>>(null)

  useMeshHandle(ref, meshRef)

  // Builds instanced data for the packing
  const objData = useMemo(() => {
    const curve = new LineCurve3(new Vector3(0, 0, 0), new Vector3(0, 0, -1))
    const tube = new TubeGeometry(curve, 40, 1, 8, false)

    return {
      index: tube.index,
      attributes: tube.attributes,
    }
  }, [])

  const attributes = useMemo(() => {
    return getAttributes(args)
  }, [args])

  const uniforms = useMemo(() => {
    return {
      uTravelLength: new Uniform(options.length),
      uTime: new Uniform(0),
      uFade: new Uniform(fade),
      ...options.distortion.uniforms,
    }
  }, [])

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.uFade.value = fade
    }
  }, [fade])

  return (
    <mesh ref={meshRef} frustumCulled={false} {...meshProps}>
      <instancedBufferGeometry
        instanceCount={args.lightPairsPerRoadWay * 2}
        index={objData.index}
        attributes={{
          ...objData.attributes,
          ...attributes,
        }}
      />

      <shaderMaterial
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
      />
    </mesh>
  )
})
