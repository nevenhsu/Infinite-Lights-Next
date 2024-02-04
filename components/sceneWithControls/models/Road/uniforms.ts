import { Uniform, Color } from 'three'

export type RoadUniformArgs = {
  lanesPerRoad: number
  shoulderLinesWidthPercentage: number
  brokenLinesLengthPercentage: number
  brokenLinesWidthPercentage: number
  shoulderLinesColor: string
  brokenLinesColor: string
}

export function getColor(color: string) {
  return new Uniform(new Color(color))
}

export function getUniforms(args: RoadUniformArgs) {
  return {
    uLanes: new Uniform(args.lanesPerRoad),
    uShoulderLinesColor: new Uniform(new Color(args.shoulderLinesColor)),
    uBrokenLinesColor: new Uniform(new Color(args.brokenLinesColor)),
    uShoulderLinesWidthPercentage: new Uniform(args.shoulderLinesWidthPercentage),
    uBrokenLinesLengthPercentage: new Uniform(args.brokenLinesLengthPercentage),
    uBrokenLinesWidthPercentage: new Uniform(args.brokenLinesWidthPercentage),
  }
}
