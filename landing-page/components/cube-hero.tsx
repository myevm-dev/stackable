'use client'

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import { useEffect } from 'react'
import './cube-hero.scss'

// Cube id = row, column, z-layer. Each entry lists the shadow overlays drawn on that cube's top face,
// exactly as in the original markup: [flip, y, z] target ids (null = none).
type Shadows = { flip?: string; y?: string; z?: string }
const CUBES: [string, Shadows][] = [
  // middle layer
  ['111', { z: '112' }],
  ['121', {}],
  ['131', { z: '132' }],
  ['211', { flip: '111', y: '111', z: '212' }],
  ['221', { flip: '121', y: '121' }],
  ['231', { flip: '131', y: '131' }],
  ['311', { flip: '211', y: '211', z: '312' }],
  ['321', { flip: '221', y: '221', z: '322' }],
  ['331', { flip: '231', y: '231', z: '332' }],
  // top layer
  ['112', {}],
  ['122', {}],
  ['132', {}],
  ['212', { flip: '112', y: '112' }],
  ['222', { flip: '122', y: '122' }],
  ['232', { flip: '132', y: '132' }],
  ['312', { flip: '212', y: '212' }],
  ['322', { flip: '222', y: '222' }],
  ['332', { flip: '232', y: '232' }],
  // bottom layer
  ['113', { z: '111' }],
  ['123', { z: '121' }],
  ['133', {}],
  ['213', { flip: '113', y: '113', z: '211' }],
  ['223', { y: '123', z: '221' }],
  ['233', { y: '133', z: '231' }],
  ['313', { flip: '213', y: '213', z: '311' }],
  ['323', { flip: '223', y: '223', z: '321' }],
  ['333', { flip: '233', y: '233', z: '331' }],
]
const LARGE_SHADOWS = ['113', '123', '133', '213', '223', '233', '313', '323', '333']

function Cube({ id, shadows }: { id: string; shadows: Shadows }) {
  return (
    <div className="cube" data-cube={id}>
      <div className="cube-wrap">
        <div className="cube-top">
          {shadows.flip && <div className="shadow-flip" data-cube={shadows.flip} />}
          {shadows.y && <div className="shadow-y" data-cube={shadows.y} />}
          {shadows.z && <div className="shadow-z" data-cube={shadows.z} />}
        </div>
        <div className="cube-bottom" />
        <div className="cube-front-left" />
        <div className="cube-front-right" />
        <div className="cube-back-left" />
        <div className="cube-back-right" />
      </div>
    </div>
  )
}

export function CubeHero() {
  const reduce = useReducedMotion()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.6 })
  const sy = useSpring(my, { stiffness: 60, damping: 18, mass: 0.6 })
  const rotateY = useTransform(sx, [-1, 1], [-9, 9])
  const rotateX = useTransform(sy, [-1, 1], [7, -7])

  useEffect(() => {
    if (reduce) return
    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1)
      my.set((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [mx, my, reduce])

  return (
    <div className="cube-stage" role="img" aria-label="Animated stack of 27 blocks flipping into place">
      <motion.div className="tilt" style={{ rotateX, rotateY }}>
        <div className="cubes">
          {CUBES.map(([id, s]) => (
            <Cube key={id} id={id} shadows={s} />
          ))}
          <div className="large-shadows">
            {LARGE_SHADOWS.map((id) => (
              <div key={id} className="large-shadow" data-cube={id} />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
