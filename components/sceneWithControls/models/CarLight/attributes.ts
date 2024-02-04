import _ from 'lodash'
import { Color, InstancedBufferAttribute } from 'three'

export type CarLightArgs = {
  color: string[]
  roadWidth: number
  lanesPerRoad: number
  lightPairsPerRoadWay: number
  movingSpeed: number[]
  carLightsRadius: number[]
  carLightsLength: number[]
  carWidthPercentage: number[]
  carShiftX: number[]
  carFloorSeparation: number[]
}

export function getAttributes(args: CarLightArgs) {
  const {
    color,
    roadWidth,
    lanesPerRoad,
    movingSpeed,
    lightPairsPerRoadWay,
    carLightsRadius,
    carLightsLength,
    carWidthPercentage,
    carShiftX,
    carFloorSeparation,
  } = args

  const aOffset = []
  const aMetrics = []
  const aColor = []

  const laneWidth = roadWidth / lanesPerRoad
  const colors = color.map(c => new Color(c))

  for (let i = 0; i < lightPairsPerRoadWay; i++) {
    const radius = _.random(carLightsRadius[0], carLightsRadius[1])
    const length = _.random(carLightsLength[0], carLightsLength[1])
    const speed = _.random(movingSpeed[0], movingSpeed[1])

    // Get lane index
    const carLane = i % lanesPerRoad

    const carWidth = _.random(carWidthPercentage[0], carWidthPercentage[1]) * laneWidth
    const carShift = _.random(carShiftX[0], carShiftX[1]) * laneWidth // Drunk Driving
    const offsetX = carLane * laneWidth - roadWidth / 2 + laneWidth / 2 + carShift

    const offsetY = _.random(carFloorSeparation[0], carFloorSeparation[1])

    const offsetZ = -_.random(length)

    aOffset.push(offsetX - carWidth / 2)
    aOffset.push(offsetY)
    aOffset.push(offsetZ)

    aOffset.push(offsetX + carWidth / 2)
    aOffset.push(offsetY)
    aOffset.push(offsetZ)

    aMetrics.push(radius)
    aMetrics.push(length)
    aMetrics.push(speed)

    aMetrics.push(radius)
    aMetrics.push(length)
    aMetrics.push(speed)

    const color = _.sample(colors) || colors[0]
    aColor.push(color.r)
    aColor.push(color.g)
    aColor.push(color.b)

    aColor.push(color.r)
    aColor.push(color.g)
    aColor.push(color.b)
  }

  return {
    aOffset: new InstancedBufferAttribute(new Float32Array(aOffset), 3, false),
    aMetrics: new InstancedBufferAttribute(new Float32Array(aMetrics), 3, false),
    aColor: new InstancedBufferAttribute(new Float32Array(aColor), 3, false),
  }
}
