'use client'

import { useRef, useMemo, forwardRef } from 'react'
import { PlaneGeometry } from 'three'
import { Uniform } from 'three'
import { useMeshHandle, type HandleRef } from '@/components/sceneWithControls/hooks/useMeshHandle'
import { fragmentShader, vertexShader } from './shades'
import { getAttributes, type StickArgs } from './attributes'
import { options } from '@/components/sceneWithControls/config'
import type { MeshProps } from '@react-three/fiber'
import type { Mesh, ShaderMaterial } from 'three'

type LightsSticksProps = {
  meshProps: MeshProps
  args: StickArgs
}

type UniformsKeys = 'uTravelLength' | 'uTime'

export type LightsSticksRef = HandleRef<UniformsKeys>

export default forwardRef<LightsSticksRef, LightsSticksProps>(function CarLight(
  { meshProps, args },
  ref
) {
  const meshRef = useRef<Mesh<PlaneGeometry, ShaderMaterial>>(null)

  useMeshHandle(ref, meshRef)

  // Builds instanced data for the packing
  const objData = useMemo(() => {
    const tube = new PlaneGeometry(1, 1)
    return {
      index: tube.index,
      attributes: {
        ...tube.attributes,
      },
    }
  }, [])

  const attributes = useMemo(() => {
    return getAttributes(args)
  }, [args])

  const uniforms = useMemo(() => {
    return {
      uTravelLength: new Uniform(options.length),
      uTime: new Uniform(0),
      ...options.distortion.uniforms,
    }
  }, [])

  return (
    <mesh ref={meshRef} frustumCulled={false} {...meshProps}>
      <instancedBufferGeometry
        instanceCount={options.totalSideLightSticks}
        index={objData.index}
        attributes={{
          ...objData.attributes,
          ...attributes,
        }}
      />

      <shaderMaterial
        side={2}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
      />
    </mesh>
  )
})
