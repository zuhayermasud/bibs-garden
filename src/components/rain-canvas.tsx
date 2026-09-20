'use client'

import { useEffect, useRef } from 'react'

interface RainCanvasProps {
  className?: string
  /** Characters from faintest to strongest */
  chars?: string
  color?: string
  /** Character cell height in CSS px */
  cellSize?: number
  /** New drops per second */
  dropRate?: number
  /** Minimum ms between drops made by the pointer */
  pointerCooldown?: number
  /** Ring expansion in px per second */
  speed?: number
  /** Ring thickness in px */
  ringWidth?: number
  /** Seconds a ripple takes to fade out */
  lifetime?: number
  maxRipples?: number
}

type Ripple = { x: number; y: number; age: number }

/** ASCII rain drops: drops land on a character grid and spread into fading, overlapping rings. */
const RainCanvas = ({
  className,
  chars = ' .:-=+*#%@',
  color = '#000',
  cellSize = 11,
  dropRate = 1.5,
  pointerCooldown = 500,
  speed = 120,
  ringWidth = 9,
  lifetime = 5,
  maxRipples = 40,
}: RainCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const cellW = cellSize * 0.6
    const cellH = cellSize
    const ripples: Ripple[] = []
    let cols = 0
    let rows = 0
    let width = 0
    let height = 0
    let field = new Float32Array(0)
    let frame = 0
    let last = 0
    let dropBudget = 0
    let visible = true

    const drop = (x = Math.random() * width, y = Math.random() * height) => {
      if (ripples.length >= maxRipples) ripples.shift()
      ripples.push({ x, y, age: 0 })
    }

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cols = Math.ceil(width / cellW)
      rows = Math.ceil(height / cellH)
      field = new Float32Array(cols * rows)
      ctx.font = `${cellSize}px ui-monospace, "Geist Mono", monospace`
      ctx.textBaseline = 'top'
      ctx.fillStyle = color
    }

    const render = () => {
      field.fill(0)
      const reach = ringWidth * 3

      for (const { x, y, age } of ripples) {
        const radius = age * speed
        const fade = 1 - age / lifetime
        const outer = radius + reach
        const c0 = Math.max(0, Math.floor((x - outer) / cellW))
        const c1 = Math.min(cols - 1, Math.ceil((x + outer) / cellW))
        const r0 = Math.max(0, Math.floor((y - outer) / cellH))
        const r1 = Math.min(rows - 1, Math.ceil((y + outer) / cellH))

        for (let r = r0; r <= r1; r++) {
          const dy = (r + 0.5) * cellH - y
          for (let c = c0; c <= c1; c++) {
            const dx = (c + 0.5) * cellW - x
            const off = (Math.hypot(dx, dy) - radius) / ringWidth
            if (Math.abs(off) > 3) continue
            field[r * cols + c] += Math.exp(-off * off) * fade
          }
        }
      }

      ctx.clearRect(0, 0, width, height)
      const top = chars.length - 1
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = Math.min(top, Math.round(field[r * cols + c] * top))
          if (i > 0) ctx.fillText(chars[i], c * cellW, r * cellH)
        }
      }
    }

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1)
      last = now

      dropBudget += dt * dropRate
      while (dropBudget >= 1) {
        drop()
        dropBudget -= 1
      }
      for (const ripple of ripples) ripple.age += dt
      while (ripples.length && ripples[0].age >= lifetime) ripples.shift()

      render()
      frame = requestAnimationFrame(tick)
    }

    const start = () => {
      if (frame || reducedMotion.matches || !visible) return
      last = performance.now()
      frame = requestAnimationFrame(tick)
    }

    const stop = () => {
      cancelAnimationFrame(frame)
      frame = 0
    }

    // Reduced motion gets a still frame of mid-fall ripples instead of the loop
    const paintStill = () => {
      ripples.length = 0
      for (let i = 0; i < 8; i++) {
        drop()
        ripples[i].age = Math.random() * lifetime * 0.6
      }
      render()
    }

    const sync = () => {
      stop()
      if (reducedMotion.matches) paintStill()
      else start()
    }

    let lastPointerDrop = 0
    const onPointerMove = (event: PointerEvent) => {
      const now = performance.now()
      if (now - lastPointerDrop < pointerCooldown || reducedMotion.matches) return
      lastPointerDrop = now
      const rect = canvas.getBoundingClientRect()
      drop(event.clientX - rect.left, event.clientY - rect.top)
    }

    const resizeObserver = new ResizeObserver(() => {
      resize()
      if (reducedMotion.matches) paintStill()
    })
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
      else stop()
    })

    resize()
    resizeObserver.observe(canvas)
    visibilityObserver.observe(canvas)
    reducedMotion.addEventListener('change', sync)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerdown', onPointerMove)
    sync()

    return () => {
      stop()
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
      reducedMotion.removeEventListener('change', sync)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerdown', onPointerMove)
    }
  }, [chars, color, cellSize, dropRate, pointerCooldown, speed, ringWidth, lifetime, maxRipples])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}

export { RainCanvas }
