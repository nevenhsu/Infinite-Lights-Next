import { useControls } from 'leva'
import { options } from '@/components/sceneWithControls/config'

export default function useMyControls() {
  const colors = useControls('Road Colors', {
    roadColor: { value: options.colors.roadColor },
    islandColor: { value: options.colors.islandColor },
    shoulderLines: { value: options.colors.shoulderLines },
    brokenLines: { value: options.colors.brokenLines },
  })

  const leftCarColors = useControls('Left Car Colors', {
    leftCarColor1: { value: options.colors.leftCars[0] },
    leftCarColor2: { value: options.colors.leftCars[1] },
    leftCarColor3: { value: options.colors.leftCars[2] },
  })

  const rightCarColors = useControls('Right Cars Colors', {
    rightCarColor1: { value: options.colors.rightCars[0] },
    rightCarColor2: { value: options.colors.rightCars[1] },
    rightCarColor3: { value: options.colors.rightCars[2] },
  })

  const stickColors = useControls('Stick Colors', {
    stickColor1: { value: options.colors.sticks[0] },
    stickColor2: { value: options.colors.sticks[1] },
    stickColor3: { value: options.colors.sticks[2] },
  })

  const basic = useControls('Basic', {
    lightPairsPerRoadWay: { value: options.lightPairsPerRoadWay, min: 1, max: 100, step: 1 },
    totalSideLightSticks: { value: options.totalSideLightSticks, min: 50, max: 100, step: 1 },
  })

  const road = useControls('Road', {
    roadWidth: { value: options.roadWidth, min: 1, max: 12, step: 1 },
    lanesPerRoad: { value: options.lanesPerRoad, min: 1, max: 10, step: 1 },
    shoulderLinesWidthPercentage: { value: options.shoulderLinesWidthPercentage, min: 0, max: 1 },
    brokenLinesWidthPercentage: { value: options.brokenLinesWidthPercentage, min: 0, max: 1 },
    brokenLinesLengthPercentage: { value: options.brokenLinesLengthPercentage, min: 0, max: 1 },
  })

  const camera = useControls('Camera', {
    fov: { value: options.fov, min: 45, max: 120 },
    fovSpeedUp: { value: options.fovSpeedUp, min: 60, max: 170 },
  })

  const lights = useControls('Lights', {
    speedUp: { value: options.speedUp, min: 1, max: 20 },
    carLightsFade: { value: options.carLightsFade, min: 0, max: 0.95 },
    movingAwaySpeed: { value: options.movingAwaySpeed, min: 10, max: 500 },
    movingCloserSpeed: { value: options.movingCloserSpeed, min: -500, max: -10 },
  })

  const lightSticks = useControls('Light Sticks', {
    lightStickWidth: { value: options.lightStickWidth, min: 0.01, max: 0.1 },
    lightStickHeight: { value: options.lightStickHeight, min: 0.1, max: 2 },
  })

  const car = useControls('Car', {
    carShiftX: { value: options.carShiftX, min: -1, max: 1 },
    carLightsLength: { value: options.carLightsLength, min: 10, max: 300 },
    carLightsRadius: { value: options.carLightsRadius, min: 0.01, max: 1 },
    carWidthPercentage: { value: options.carWidthPercentage, min: 0.01, max: 1 },
    carFloorSeparation: { value: options.carFloorSeparation, min: 0, max: 1 },
  })

  return {
    ...colors,
    ...leftCarColors,
    ...rightCarColors,
    ...stickColors,
    ...basic,
    ...road,
    ...camera,
    ...lights,
    ...lightSticks,
    ...car,
  }
}
