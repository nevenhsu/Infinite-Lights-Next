import _ from 'lodash'
import type { Camera } from '@react-three/fiber'
import type { PerspectiveCamera } from 'three'

export function isPerspectiveCamera(camera: Camera): camera is PerspectiveCamera {
  return _.get(camera, 'isPerspectiveCamera', false)
}

export function lerp(current: number, target: number, speed = 0.1, limit = 0.001) {
  let change = (target - current) * speed
  if (Math.abs(change) < limit) {
    change = target - current
  }
  return change
}
