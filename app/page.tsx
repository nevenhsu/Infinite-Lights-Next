'use client'

import { useRef } from 'react'
import MyCanvas, { type MyCanvasRef } from '@/components/sceneWithControls/MyCanvas'
import classes from './page.module.css'

export default function Page() {
  const canvasRef = useRef<MyCanvasRef>(null)

  return (
    <div
      className={classes.root}
      onMouseDown={() => canvasRef.current?.speedUp()}
      onMouseUp={() => canvasRef.current?.speedDown()}
      onTouchStart={() => canvasRef.current?.speedUp()}
      onTouchEnd={() => canvasRef.current?.speedDown()}
    >
      <MyCanvas ref={canvasRef} />
      <div className={`${classes.overlay} absolute-center`}>
        <h1>Infinite Lights</h1>
        <p>Click or touch to speed up the lights</p>
      </div>
      <a
        className={classes.link}
        href="https://github.com/nevenhsu/Infinite-Lights-Next"
        target="_blank"
      >
        Github
      </a>
    </div>
  )
}
