import _ from "lodash";
import { useRef, useMemo, forwardRef } from "react";
import { PlaneGeometry, InstancedBufferAttribute } from "three";
import { Uniform, Color } from "three";
import {
  useMeshHandle,
  type HandleRef,
} from "@/components/scene/hooks/useMeshHandle";
import { fragmentShader, vertexShader } from "./shades";
import { options } from "@/components/scene/config";
import type { MeshProps } from "@react-three/fiber";
import type { Mesh, ShaderMaterial } from "three";

type LightsSticksProps = {
  meshProps: MeshProps;
};

type UniformsKeys = "uTravelLength" | "uTime";

export type LightsSticksRef = HandleRef<UniformsKeys>;

export default forwardRef<LightsSticksRef, LightsSticksProps>(function CarLight(
  { meshProps },
  ref
) {
  const meshRef = useRef<Mesh<PlaneGeometry, ShaderMaterial>>(null);

  useMeshHandle(ref, meshRef);

  // Builds instanced data for the packing
  const objData = useMemo(() => {
    const tube = new PlaneGeometry(1, 1);

    const totalSticks = options.totalSideLightSticks;
    const stickOffset = options.length / (totalSticks - 1);
    const colors = options.colors.sticks.map((c) => new Color(c));

    const aMetrics = [];
    const aOffset = [];
    const aColor = [];

    for (let i = 0; i < totalSticks; i++) {
      const width = _.random(
        options.lightStickWidth[0],
        options.lightStickWidth[1]
      );
      const height = _.random(
        options.lightStickHeight[0],
        options.lightStickHeight[1]
      );
      aMetrics.push(width);
      aMetrics.push(height);

      aOffset.push((i - 1) * stickOffset * 2 + stickOffset * Math.random());

      const color = _.sample(colors) || colors[0];
      aColor.push(color.r);
      aColor.push(color.g);
      aColor.push(color.b);
    }

    return {
      index: tube.index,
      attributes: {
        aOffset: new InstancedBufferAttribute(
          new Float32Array(aOffset),
          1,
          false
        ),
        aMetrics: new InstancedBufferAttribute(
          new Float32Array(aMetrics),
          2,
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
      ...options.distortion.uniforms,
    };
  }, []);

  return (
    <mesh ref={meshRef} frustumCulled={false} {...meshProps}>
      <instancedBufferGeometry
        instanceCount={options.totalSideLightSticks}
        {...objData}
      />

      <shaderMaterial
        side={2}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
      />
    </mesh>
  );
});
