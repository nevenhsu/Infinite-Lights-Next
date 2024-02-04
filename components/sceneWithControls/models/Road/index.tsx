'use client'

import _ from 'lodash'
import { useRef, useMemo, useEffect, forwardRef } from 'react'
import { Uniform } from 'three'
import { useMeshHandle, type HandleRef } from '@/components/sceneWithControls/hooks/useMeshHandle'
import { roadFragment, islandFragment, vertexShader } from './shades'
import { getUniforms, getColor, type RoadUniformArgs } from './uniforms'
import { options } from '@/components/sceneWithControls/config'
import type { Mesh, PlaneGeometry, ShaderMaterial } from 'three'

type UniformsKeys = 'uTime' | 'uTravelLength'

export type RoadRef = HandleRef<UniformsKeys>

type RoadProps = {
  side: number // 0: center, 1: right, -1: left
  roadWidth: number
  isRoad: boolean
  roadColor: string
  uniformArgs?: RoadUniformArgs
}

export default forwardRef<HandleRef<UniformsKeys>, RoadProps>(function Road(
  { side, roadWidth, isRoad, roadColor, uniformArgs },
  ref
) {
  const meshRef = useRef<Mesh<PlaneGeometry, ShaderMaterial>>(null)

  const originW = isRoad ? options.roadWidth : options.islandWidth
  const width = isRoad ? roadWidth : options.islandWidth

  useMeshHandle(ref, meshRef)

  const uniforms = useMemo(() => {
    let values: { [k: string]: any } = {
      uColor: getColor(isRoad ? options.colors.roadColor : options.colors.islandColor),
      uTravelLength: new Uniform(options.length),
      uTime: new Uniform(0),
      ...options.distortion.uniforms,
    }

    if (isRoad) {
      const uniforms = getUniforms({
        lanesPerRoad: options.lanesPerRoad,
        shoulderLinesWidthPercentage: options.shoulderLinesWidthPercentage,
        brokenLinesLengthPercentage: options.brokenLinesLengthPercentage,
        brokenLinesWidthPercentage: options.brokenLinesWidthPercentage,
        shoulderLinesColor: options.colors.shoulderLines,
        brokenLinesColor: options.colors.brokenLines,
      })

      values = {
        ...values,
        ...uniforms,
      }
    }

    return values
  }, [])

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.uColor.value = getColor(roadColor).value
    }
  }, [roadColor])

  useEffect(() => {
    if (isRoad && uniformArgs) {
      const uniforms = getUniforms(uniformArgs)
      _.forEach(uniforms, (value, key) => {
        if (meshRef.current) {
          meshRef.current.material.uniforms[key].value = value.value
        }
      })
    }
  }, [isRoad, uniformArgs])

  useEffect(() => {
    if (meshRef.current) {
      const x = width / originW
      meshRef.current.geometry.scale(x, 1, 1)
    }
  }, [isRoad, width])

  return (
    <mesh
      ref={meshRef}
      position={[(options.islandWidth / 2 + roadWidth / 2) * side, 0, -options.length / 2]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <planeGeometry args={[originW, options.length, 20, 100]} />
      <shaderMaterial
        side={2}
        fragmentShader={isRoad ? roadFragment : islandFragment}
        vertexShader={vertexShader}
        uniforms={uniforms}
      />
    </mesh>
  )
})
