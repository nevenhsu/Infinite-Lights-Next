import { getDistortion } from "./distortions";

type TwoNumbers = [number, number];

export const options = {
  // basic
  width: 20,
  length: 400,
  lightPairsPerRoadWay: 30,
  totalSideLightSticks: 50,

  // road
  roadWidth: 9,
  islandWidth: 2,
  lanesPerRoad: 3,

  // Percentage of the lane's width
  shoulderLinesWidthPercentage: 0.05,
  brokenLinesWidthPercentage: 0.1,
  brokenLinesLengthPercentage: 0.5,

  // camera
  fov: 90,
  fovSpeedUp: 150,

  // lights
  speedUp: 3,
  carLightsFade: 0.5,

  /**  --------------------------------------
  These ones have to be arrays of [min,max].
  ------------------------------------------- */
  lightStickWidth: [0.02, 0.05] as TwoNumbers,
  lightStickHeight: [0.3, 0.7] as TwoNumbers,

  movingAwaySpeed: [20, 50] as TwoNumbers,
  movingCloserSpeed: [-150, -230] as TwoNumbers,

  // car

  /**  --------------------------------------
  Anything below can be either a number or an array of [min,max]
  ------------------------------------------- */

  carShiftX: [-0.5, 0.5] as TwoNumbers, // How drunk the driver is.
  carLightsLength: [400 * 0.05, 400 * 0.2] as TwoNumbers, // Length of the lights. Best to be less than total length
  carLightsRadius: [0.03, 0.1] as TwoNumbers, // Radius of the tubes
  carWidthPercentage: [0.1, 0.5] as TwoNumbers, // Width is percentage of a lane. Numbers from 0 to 1
  carFloorSeparation: [0, 0.2] as TwoNumbers, // Self Explanatory

  colors: {
    roadColor: "#080808",
    islandColor: "#0a0a0a",
    shoulderLines: "#131318",
    brokenLines: "#131318",
    /***  Only these colors can be an array ***/
    leftCars: ["#7d0d1b", "#a90519", "#ff102a"],
    rightCars: ["#f1eece", "#e6e2b1", "#dfd98a"],
    sticks: ["#f1eece", "#f1eece", "#f1eece"],
  },

  distortion: getDistortion("xyDistortion"),
};
