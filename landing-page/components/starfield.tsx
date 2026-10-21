'use client'

import { useEffect, useRef } from 'react'

type Star = { x: number; y: number; r: number; a: number; s: number; hue: number }
type Comet = { x: number; y: number; vx: number; vy: number; life: number }

// Twinkling stars + an occasional comet, echoing the shooting star in the logo.
export function Starfield({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const hues = [320, 280, 210, 190, 0]
    let stars: Star[] = []
    let comet: Comet | null = null
    let w = 0, h = 0, raf = 0, last = 0, nextComet = 2500
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.round((w * h) / 5200)
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.2 + 0.2,
        a: Math.random() * Math.PI * 2,
        s: Math.random() * 0.0016 + 0.0004,
        hue: hues[Math.floor(Math.random() * hues.length)],
      }))
    }

    const draw = (t: number) => {
      const dt = last ? t - last : 16
      last = t
      ctx.clearRect(0, 0, w, h)
      for (const s of stars) {
        const tw = reduce ? 0.7 : 0.45 + 0.55 * Math.abs(Math.sin(s.a + t * s.s))
        ctx.fillStyle = s.hue === 0 ? `rgba(255,255,255,${tw})` : `hsla(${s.hue},100%,82%,${tw})`
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
      }
      if (!reduce) {
        nextComet -= dt
        if (!comet && nextComet <= 0) {
          comet = { x: w * (0.35 + Math.random() * 0.6), y: -20, vx: -0.55 - Math.random() * 0.3, vy: 0.32 + Math.random() * 0.15, life: 1 }
          nextComet = 6000 + Math.random() * 6000
        }
        if (comet) {
          comet.x += comet.vx * dt
          comet.y += comet.vy * dt
          comet.life -= dt / 2200
          const tail = 140
          const g = ctx.createLinearGradient(comet.x, comet.y, comet.x - comet.vx * tail, comet.y - comet.vy * tail)
          g.addColorStop(0, `rgba(255,220,250,${0.9 * comet.life})`)
          g.addColorStop(0.4, `rgba(236,72,153,${0.35 * comet.life})`)
          g.addColorStop(1, 'rgba(124,58,237,0)')
          ctx.strokeStyle = g
          ctx.lineWidth = 2
          ctx.lineCap = 'round'
          ctx.beginPath()
          ctx.moveTo(comet.x, comet.y)
          ctx.lineTo(comet.x - comet.vx * tail, comet.y - comet.vy * tail)
          ctx.stroke()
          if (comet.life <= 0 || comet.x < -200 || comet.y > h + 200) comet = null
        }
      }
      raf = requestAnimationFrame(draw)
    }

    resize()
    raf = requestAnimationFrame(draw)
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [])

  return <canvas ref={ref} className={className} aria-hidden="true" />
}
