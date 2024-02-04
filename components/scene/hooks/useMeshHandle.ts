import { useImperativeHandle } from 'react'
import type { Mesh, ShaderMaterial, BufferGeometry } from 'three'
import type { ForwardedRef, RefObject } from 'react'

type Values<T> = Array<{ key: T; value: any }>
type MeshRef = RefObject<Mesh<BufferGeometry, ShaderMaterial>>

export type HandleRef<T> = {
  updateUniforms: (values: Values<T>) => void
}

export function useMeshHandle<T extends string>(ref: ForwardedRef<HandleRef<T>>, meshRef: MeshRef) {
  useImperativeHandle(ref, () => ({
    updateUniforms(values) {
      values.forEach(({ key, value }) => {
        if (meshRef.current) {
          meshRef.current.material.uniforms[key].value = value
        }
      })
    },
  }))

  return
}
