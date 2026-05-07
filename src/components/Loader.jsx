import React from 'react'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function Loader({ onComplete }) {
  const loaderRef   = useRef(null)
  const progressRef = useRef(null)
  const countRef    = useRef(null)
  const contentRef  = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline()

    // Count up + bar fill
    tl.to(progressRef.current, { width: '100%', duration: 1.6, ease: 'power2.inOut' })
      .to(countRef.current,    { textContent: 100, duration: 1.6, snap: { textContent: 1 }, ease: 'power2.inOut' }, '<')
      .to(contentRef.current,  { opacity: 0, y: -16, duration: 0.35, ease: 'power2.in' })
      .to(loaderRef.current,   { yPercent: -100, duration: 0.85, ease: 'power4.inOut', onComplete })
  }, [])

  return (
    <div ref={loaderRef} className="loader" style={{ gap: '2rem' }}>
      {/* Gold radial glow */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 50% 40% at 50% 50%, rgba(201,136,16,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div ref={contentRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', position: 'relative' }}>

        {/* Symbol */}
        <img src="/favicon.svg" alt="Om Sakthi Logo" style={{ width: 150, height: 150, borderRadius: '50%', animation: 'float 3s ease-in-out infinite' }} />

        {/* Name */}
        <div style={{ textAlign: 'center' }}>
          <div className="font-display font-semibold tracking-[0.16em] uppercase" style={{ fontSize: '1.375rem', color: 'var(--text)', marginBottom: '0.25rem' }}>
            Om Sakthi
          </div>
          <div className="label" style={{ letterSpacing: '0.4em', color: 'var(--text4)' }}>Printers · Sattur</div>
        </div>

        {/* Progress */}
        <div style={{ width: '16rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span className="label" style={{ color: 'var(--text4)', fontSize: '0.6875rem' }}>Loading</span>
            <span className="font-body text-xs" style={{ color: 'var(--text4)' }}>
              <span ref={countRef}>0</span>%
            </span>
          </div>
          <div style={{ height: '1.5px', background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
            <div ref={progressRef} style={{ height: '100%', width: '0%', borderRadius: 99, background: 'linear-gradient(90deg, #c98810, #f3d98a)' }} />
          </div>
        </div>
      </div>
    </div>
  )
}
