import { distortion } from './distortion'
import { xyDistortion } from './xyDistortion'

export function getDistortion(name: 'distortion' | 'xyDistortion') {
  switch (name) {
    case 'distortion':
      return distortion
    case 'xyDistortion':
    default:
      return xyDistortion
  }
}
