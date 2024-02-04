import _ from 'lodash'
import { Color, InstancedBufferAttribute } from 'three'

export type StickArgs = {
  color: string[]
  totalSideLightSticks: number
  length: number
  lightStickWidth: number[]
  lightStickHeight: number[]
}

export function getAttributes(args: StickArgs) {
  const { length, color, lightStickWidth, lightStickHeight, totalSideLightSticks } = args

  const colors = color.map(c => new Color(c))
  const stickOffset = length / (totalSideLightSticks - 1)

  const aMetrics = []
  const aOffset = []
  const aColor = []

  for (let i = 0; i < totalSideLightSticks; i++) {
    const width = _.random(lightStickWidth[0], lightStickWidth[1])
    const height = _.random(lightStickHeight[0], lightStickHeight[1])
    aMetrics.push(width)
    aMetrics.push(height)

    aOffset.push((i - 1) * stickOffset * 2 + stickOffset * Math.random())

    const color = _.sample(colors) || colors[0]
    aColor.push(color.r)
    aColor.push(color.g)
    aColor.push(color.b)
  }

  return {
    aOffset: new InstancedBufferAttribute(new Float32Array(aOffset), 1, false),
    aMetrics: new InstancedBufferAttribute(new Float32Array(aMetrics), 2, false),
    aColor: new InstancedBufferAttribute(new Float32Array(aColor), 3, false),
  }
}
