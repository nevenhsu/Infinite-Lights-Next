'use client'

import { Leva } from 'leva'
import { Vector2, Vector3 } from 'three'
import { useEffect, forwardRef, useImperativeHandle, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import useMyControls from './hooks/useMyControls'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import Road, { type RoadRef } from '@/components/sceneWithControls/models/Road'
import CarLight, { type CarLightRef } from '@/components/sceneWithControls/models/CarLight'
import LightsSticks, {
  type LightsSticksRef,
} from '@/components/sceneWithControls/models/LightsSticks'
import { isPerspectiveCamera, lerp } from '@/components/sceneWithControls/utils/helpers'
import { options } from '@/components/sceneWithControls/config'

export type MyCanvasRef = { speedUp: () => void; speedDown: () => void }

const Scene = forwardRef<MyCanvasRef, {}>(function Scene(props, ref) {
  const carLightRRef = useRef<CarLightRef>(null)
  const carLightLRef = useRef<CarLightRef>(null)
  const roadRRef = useRef<RoadRef>(null)
  const roadLRef = useRef<RoadRef>(null)
  const islandRef = useRef<RoadRef>(null)
  const sticksRef = useRef<LightsSticksRef>(null)

  const c = useMyControls()

  const { camera } = useThree()

  const stateRef = useRef({
    speedUpTarget: 0,
    speedUp: 0,
    timeOffset: 0,
    fovTarget: options.fov,
    fov: options.fov,
  })

  useImperativeHandle(ref, () => ({
    speedUp() {
      stateRef.current.speedUpTarget = c.speedUp
      stateRef.current.fovTarget = c.fovSpeedUp
      return
    },
    speedDown() {
      stateRef.current.speedUpTarget = 0
      stateRef.current.fovTarget = c.fov
      return
    },
  }))

  useEffect(() => {
    stateRef.current.fovTarget = c.fov
  }, [c.fov])

  useFrame((state, delta) => {
    let { speedUp, speedUpTarget, timeOffset, fovTarget } = stateRef.current
    const coefficient = -60 * Math.log2(1 - 0.1)
    const lerpT = Math.exp(-coefficient * delta)

    speedUp += lerp(speedUp, speedUpTarget, lerpT, 0.00001)
    timeOffset += speedUp * delta
    const time = state.clock.elapsedTime + timeOffset

    carLightRRef.current?.updateUniforms([{ key: 'uTime', value: time }])
    carLightLRef.current?.updateUniforms([{ key: 'uTime', value: time }])
    islandRef.current?.updateUniforms([{ key: 'uTime', value: time }])
    roadRRef.current?.updateUniforms([{ key: 'uTime', value: time }])
    roadLRef.current?.updateUniforms([{ key: 'uTime', value: time }])
    sticksRef.current?.updateUniforms([{ key: 'uTime', value: time }])

    let updateCamera = false
    if (isPerspectiveCamera(camera)) {
      const fovChange = lerp(camera.fov, fovTarget, lerpT)
      if (fovChange) {
        camera.fov += fovChange * delta * 6
        updateCamera = true
      }
    }

    if (options.distortion.getJS) {
      const distortion = options.distortion.getJS(0.025, time)

      camera.lookAt(
        new Vector3(
          camera.position.x + distortion.x,
          camera.position.y + distortion.y,
          camera.position.z + distortion.z
        )
      )
      updateCamera = true
    }

    if (updateCamera) {
      camera.updateProjectionMatrix()
    }

    // Update state
    stateRef.current = { ...stateRef.current, speedUp, timeOffset }
  })

  return (
    <>
      {/* Right Road */}
      <Road
        ref={roadRRef}
        side={1}
        isRoad
        roadColor={c.roadColor}
        roadWidth={c.roadWidth}
        uniformArgs={{
          lanesPerRoad: c.lanesPerRoad,
          shoulderLinesWidthPercentage: c.shoulderLinesWidthPercentage,
          brokenLinesLengthPercentage: c.brokenLinesLengthPercentage,
          brokenLinesWidthPercentage: c.brokenLinesWidthPercentage,
          shoulderLinesColor: c.shoulderLines,
          brokenLinesColor: c.brokenLines,
        }}
      />
      {/* Left Road */}
      <Road
        ref={roadLRef}
        side={-1}
        isRoad
        roadColor={c.roadColor}
        roadWidth={c.roadWidth}
        uniformArgs={{
          lanesPerRoad: c.lanesPerRoad,
          shoulderLinesWidthPercentage: c.shoulderLinesWidthPercentage,
          brokenLinesLengthPercentage: c.brokenLinesLengthPercentage,
          brokenLinesWidthPercentage: c.brokenLinesWidthPercentage,
          shoulderLinesColor: c.shoulderLines,
          brokenLinesColor: c.brokenLines,
        }}
      />
      {/* Island */}
      <Road
        ref={islandRef}
        side={0}
        isRoad={false}
        roadColor={c.islandColor}
        roadWidth={c.roadWidth}
      />

      {/* light Sticks */}
      <LightsSticks
        ref={sticksRef}
        meshProps={{ position: [-(c.roadWidth + options.islandWidth / 2), 0, 0] }}
        args={{
          color: [c.stickColor1, c.stickColor2, c.stickColor3],
          totalSideLightSticks: c.totalSideLightSticks,
          length: options.length,
          lightStickWidth: c.lightStickWidth,
          lightStickHeight: c.lightStickHeight,
        }}
      />
      {/* Left lights */}
      <CarLight
        ref={carLightLRef}
        meshProps={{ position: [-c.roadWidth / 2 - options.islandWidth / 2, 0, 0] }}
        fade={new Vector2(0, 1 - c.carLightsFade)}
        args={{
          color: [c.leftCarColor1, c.leftCarColor2, c.leftCarColor3],
          roadWidth: c.roadWidth,
          lanesPerRoad: c.lanesPerRoad,
          movingSpeed: c.movingAwaySpeed,
          lightPairsPerRoadWay: c.lightPairsPerRoadWay,
          carLightsRadius: c.carLightsRadius,
          carLightsLength: c.carLightsLength,
          carWidthPercentage: c.carWidthPercentage,
          carShiftX: c.carShiftX,
          carFloorSeparation: c.carFloorSeparation,
        }}
      />
      {/* Right lights */}
      <CarLight
        ref={carLightRRef}
        meshProps={{ position: [c.roadWidth / 2 + options.islandWidth / 2, 0, 0] }}
        fade={new Vector2(1, c.carLightsFade)}
        args={{
          color: [c.rightCarColor1, c.rightCarColor2, c.rightCarColor3],
          roadWidth: c.roadWidth,
          lanesPerRoad: c.lanesPerRoad,
          movingSpeed: c.movingCloserSpeed,
          lightPairsPerRoadWay: c.lightPairsPerRoadWay,
          carLightsRadius: c.carLightsRadius,
          carLightsLength: c.carLightsLength,
          carWidthPercentage: c.carWidthPercentage,
          carShiftX: c.carShiftX,
          carFloorSeparation: c.carFloorSeparation,
        }}
      />

      <EffectComposer>
        <Bloom luminanceThreshold={0.2} />
      </EffectComposer>
    </>
  )
})

export default forwardRef<MyCanvasRef, {}>(function MyCanvas(props, ref) {
  return (
    <>
      <Canvas camera={{ position: [0, 8, -4], rotation: [0, 0, 0], fov: options.fov }}>
        <Scene ref={ref} />
      </Canvas>
      <Leva collapsed />
    </>
  )
})
