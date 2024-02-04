import _ from "lodash";
import { useRef, useMemo, forwardRef } from "react";
import {
  TubeGeometry,
  LineCurve3,
  Vector3,
  InstancedBufferAttribute,
} from "three";
import { Uniform, Color } from "three";
import {
  useMeshHandle,
  type HandleRef,
} from "@/components/scene/hooks/useMeshHandle";
import { fragmentShader, vertexShader } from "./shades";
import { options } from "@/components/scene/config";
import type { MeshProps } from "@react-three/fiber";
import type { Mesh, Vector2, ShaderMaterial } from "three";

type CarLightProps = {
  meshProps: MeshProps;
  fade: Vector2;
  color: Array<string | number>;
  side: number; // 1: right, -1: left
};

type UniformsKeys = "uColor" | "uTravelLength" | "uTime" | "uSpeed";

export type CarLightRef = HandleRef<UniformsKeys>;

export default forwardRef<CarLightRef, CarLightProps>(function CarLight(
  { meshProps, fade, color, side },
  ref
) {
  const meshRef = useRef<Mesh<TubeGeometry, ShaderMaterial>>(null);

  useMeshHandle(ref, meshRef);

  // Builds instanced data for the packing
  const objData = useMemo(() => {
    const curve = new LineCurve3(new Vector3(0, 0, 0), new Vector3(0, 0, -1));
    const tube = new TubeGeometry(curve, 40, 1, 8, false);

    const aOffset = [];
    const aMetrics = [];
    const aColor = [];

    const laneWidth = options.roadWidth / options.lanesPerRoad;
    const colors = color.map((c) => new Color(c));
    const movingSpeed =
      side > 0 ? options.movingCloserSpeed : options.movingAwaySpeed;

    for (let i = 0; i < options.lightPairsPerRoadWay; i++) {
      const radius = _.random(
        options.carLightsRadius[0],
        options.carLightsRadius[1]
      );
      const length = _.random(
        options.carLightsLength[0],
        options.carLightsLength[1]
      );
      const speed = _.random(movingSpeed[0], movingSpeed[1]);

      // Get lane index
      const carLane = i % 3;

      const carWidth =
        _.random(options.carWidthPercentage[0], options.carWidthPercentage[1]) *
        laneWidth;
      const carShiftX =
        _.random(options.carShiftX[0], options.carShiftX[1]) * laneWidth; // Drunk Driving
      const offsetX =
        carLane * laneWidth - options.roadWidth / 2 + laneWidth / 2 + carShiftX;

      const offsetY = _.random(
        options.carFloorSeparation[0],
        options.carFloorSeparation[1]
      );

      const offsetZ = -_.random(options.length);

      aOffset.push(offsetX - carWidth / 2);
      aOffset.push(offsetY);
      aOffset.push(offsetZ);

      aOffset.push(offsetX + carWidth / 2);
      aOffset.push(offsetY);
      aOffset.push(offsetZ);

      aMetrics.push(radius);
      aMetrics.push(length);
      aMetrics.push(speed);

      aMetrics.push(radius);
      aMetrics.push(length);
      aMetrics.push(speed);

      const color = _.sample(colors) || colors[0];
      aColor.push(color.r);
      aColor.push(color.g);
      aColor.push(color.b);

      aColor.push(color.r);
      aColor.push(color.g);
      aColor.push(color.b);
    }

    return {
      index: tube.index,
      attributes: {
        aOffset: new InstancedBufferAttribute(
          new Float32Array(aOffset),
          3,
          false
        ),
        aMetrics: new InstancedBufferAttribute(
          new Float32Array(aMetrics),
          3,
          false
        ),
        aColor: new InstancedBufferAttribute(
          new Float32Array(aColor),
          3,
          false
        ),
        ...tube.attributes,
      },
    };
  }, []);

  const uniforms = useMemo(() => {
    return {
      uTravelLength: new Uniform(options.length),
      uTime: new Uniform(0),
      uFade: new Uniform(fade),
      ...options.distortion.uniforms,
    };
  }, []);

  return (
    <mesh ref={meshRef} frustumCulled={false} {...meshProps}>
      <instancedBufferGeometry
        instanceCount={options.lightPairsPerRoadWay * 2}
        {...objData}
      />

      <shaderMaterial
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
      />
    </mesh>
  );
});
