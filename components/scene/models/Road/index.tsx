import { useRef, useMemo, forwardRef } from "react";
import { Uniform, Color } from "three";
import {
  useMeshHandle,
  type HandleRef,
} from "@/components/scene/hooks/useMeshHandle";
import { roadFragment, islandFragment, vertexShader } from "./shades";
import { options } from "@/components/scene/config";
import type { Mesh, PlaneGeometry, ShaderMaterial } from "three";

type UniformsKeys = "uTime";

export type RoadRef = HandleRef<UniformsKeys>;

type RoadProps = {
  side: number; // 0: center, 1: right, -1: left
  isRoad: boolean;
};

export default forwardRef<HandleRef<UniformsKeys>, RoadProps>(function Road(
  { side, isRoad },
  ref
) {
  const meshRef = useRef<Mesh<PlaneGeometry, ShaderMaterial>>(null);

  useMeshHandle(ref, meshRef);

  const uniforms = useMemo(() => {
    let values: { [k: string]: any } = {
      uColor: new Uniform(
        new Color(
          isRoad ? options.colors.roadColor : options.colors.islandColor
        )
      ),
      uTravelLength: new Uniform(options.length),
      uTime: new Uniform(0),
      ...options.distortion.uniforms,
    };

    if (isRoad) {
      values = {
        ...values,
        uLanes: new Uniform(options.lanesPerRoad),
        uShoulderLinesColor: new Uniform(
          new Color(options.colors.shoulderLines)
        ),
        uShoulderLinesWidthPercentage: new Uniform(
          options.shoulderLinesWidthPercentage
        ),
        uBrokenLinesColor: new Uniform(new Color(options.colors.brokenLines)),
        uBrokenLinesLengthPercentage: new Uniform(
          options.brokenLinesLengthPercentage
        ),
        uBrokenLinesWidthPercentage: new Uniform(
          options.brokenLinesWidthPercentage
        ),
      };
    }

    return values;
  }, []);

  return (
    <mesh
      ref={meshRef}
      position={[
        (options.islandWidth / 2 + options.roadWidth / 2) * side,
        0,
        -options.length / 2,
      ]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <planeGeometry
        args={[
          isRoad ? options.roadWidth : options.islandWidth,
          options.length,
          20,
          100,
        ]}
      />
      <shaderMaterial
        side={2}
        fragmentShader={isRoad ? roadFragment : islandFragment}
        vertexShader={vertexShader}
        uniforms={uniforms}
      />
    </mesh>
  );
});
