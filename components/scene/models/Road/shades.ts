import { options } from "@/components/scene/config";

const roadMarkVars = `
uniform float uLanes;
uniform vec3 uBrokenLinesColor;
uniform vec3 uShoulderLinesColor;
uniform float uShoulderLinesWidthPercentage;
uniform float uBrokenLinesWidthPercentage;
uniform float uBrokenLinesLengthPercentage;
highp float random(vec2 co)
{
    highp float a = 12.9898;
    highp float b = 78.233;
    highp float c = 43758.5453;
    highp float dt= dot(co.xy ,vec2(a,b));
    highp float sn= mod(dt,3.14);
    return fract(sin(sn) * c);
}
`;

const roadMarkFragment = `
uv.y = mod(uv.y + uTime * 0.1, 1.);
float brokenLineWidth = 1. / uLanes * uBrokenLinesWidthPercentage;

// How much % of the lane's space is empty
float laneEmptySpace = 1. - uBrokenLinesLengthPercentage;

// Horizontal * vertical offset
float brokenLines = step(1. - brokenLineWidth * uLanes, fract(uv.x * uLanes)) * step(laneEmptySpace, fract(uv.y * 100.));

// Remove right-hand lines on the right-most lane
brokenLines *= step(uv.x * uLanes, uLanes - 1.);
color = mix(color, uBrokenLinesColor, brokenLines);

float shoulderLinesWidth = 1. / uLanes * uShoulderLinesWidthPercentage;
float shoulderLines = step(1. - shoulderLinesWidth, uv.x) + step(uv.x, shoulderLinesWidth);
color = mix(color, uBrokenLinesColor, shoulderLines);

vec2 noiseFreq = vec2(4., 8000.);
float roadNoise = random(floor(uv * noiseFreq) / noiseFreq) * 0.012 - 0.01; 
color += roadNoise;
`;

const roadBaseFragment = (isRoad: boolean) => `
uniform vec3 uColor;
uniform float uTime;
varying vec2 vUv; 

${isRoad ? roadMarkVars : ""}

void main(){
  vec2 uv = vUv;
  vec3 color = vec3(uColor);

  ${isRoad ? roadMarkFragment : ""}

  gl_FragColor = vec4(color, 1.);
}
`;

export const roadFragment = roadBaseFragment(true);
export const islandFragment = roadBaseFragment(false);

export const vertexShader = `
uniform float uTravelLength;
uniform float uTime;
varying vec2 vUv; 

${options.distortion.getDistortion}

void main() {
  vec3 transformed = position.xyz;
  vec3 distortion  = getDistortion((transformed.y + uTravelLength / 2.) / uTravelLength);

  transformed.x += distortion.x;
  transformed.z += distortion.y;
  transformed.y += -1. * distortion.z;  
  
  vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.);
  gl_Position = projectionMatrix * mvPosition;
  vUv = uv;
}
`;
