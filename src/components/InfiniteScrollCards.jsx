/**
 * InfiniteScrollCards — Infinite auto-scrolling 3D card carousel
 * 
 * Features:
 * - CSS infinite scroll animation (no jank)
 * - 3D hover tilt per card (mouse perspective)
 * - Each card shows 2–3 images that cycle on hover
 * - Click → navigates to /design/:id
 * - Pauses on hover
 * - Gold shimmer border on hover
 */
import React from 'react'
import { useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

export default function InfiniteScrollCards({ designs = [] }) {
  const navigate   = useNavigate()
  const trackRef   = useRef(null)

  // Duplicate items for seamless infinite loop
  const items = [...designs, ...designs]

  return (
    <div
      // Pause on hover
      onMouseEnter={() => { if (trackRef.current) trackRef.current.style.animationPlayState = 'paused' }}
      onMouseLeave={() => { if (trackRef.current) trackRef.current.style.animationPlayState = 'running' }}
      style={{ overflow: 'hidden', width: '100%', position: 'relative', padding: '2rem 0' }}
    >
      {/* Left fade mask */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: '8rem', zIndex: 2,
        background: 'linear-gradient(to right, var(--bg) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />
      {/* Right fade mask */}
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: '8rem', zIndex: 2,
        background: 'linear-gradient(to left, var(--bg) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* Scrolling track */}
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          gap: '1.5rem',
          width: 'max-content',
          animation: 'infiniteScroll 32s linear infinite',
          willChange: 'transform',
        }}
      >
        {items.map((design, idx) => (
          <ScrollCard
            key={`${design.id}-${idx}`}
            design={design}
            onClick={() => navigate(`/design/${design.id}`)}
          />
        ))}
      </div>

      <style>{`
        @keyframes infiniteScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}

/* ── Individual Card ── */
function ScrollCard({ design, onClick }) {
  const cardRef       = useRef(null)
  const [imgIdx, setImgIdx] = useState(0)
  const [hovered, setHovered] = useState(false)
  const timerRef      = useRef(null)

  const images = design.images || [design.image]

  const handleMouseEnter = () => {
    setHovered(true)
    // Cycle through images every 800ms on hover
    let i = 1
    timerRef.current = setInterval(() => {
      setImgIdx(i % images.length)
      i++
    }, 800)
  }

  const handleMouseLeave = () => {
    setHovered(false)
    clearInterval(timerRef.current)
    setImgIdx(0)
    // Reset 3D tilt
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)'
    }
  }

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width  - 0.5   // -0.5 to +0.5
    const y = (e.clientY - rect.top)  / rect.height - 0.5
    card.style.transform = `perspective(800px) rotateY(${x * 18}deg) rotateX(${-y * 14}deg) scale(1.06)`
  }, [])

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={{
        width: '220px',
        height: '290px',
        borderRadius: '1.125rem',
        overflow: 'hidden',
        cursor: 'pointer',
        flexShrink: 0,
        position: 'relative',
        transition: 'transform 0.25s cubic-bezier(0.23,1,0.32,1), box-shadow 0.3s ease',
        boxShadow: hovered
          ? '0 24px 56px rgba(0,0,0,0.6), 0 0 0 1.5px rgba(201,136,16,0.55)'
          : '0 8px 24px rgba(0,0,0,0.4)',
        willChange: 'transform',
      }}
    >
      {/* Images — crossfade between them */}
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={design.title}
          draggable={false}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            opacity: i === imgIdx ? 1 : 0,
            transition: 'opacity 0.5s ease',
          }}
          loading="lazy"
        />
      ))}

      {/* Image dot indicators */}
      {images.length > 1 && (
        <div style={{
          position: 'absolute', bottom: '3.5rem', left: 0, right: 0,
          display: 'flex', justifyContent: 'center', gap: '5px', zIndex: 3,
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}>
          {images.map((_, i) => (
            <div key={i} style={{
              width: i === imgIdx ? 18 : 6, height: 6,
              borderRadius: 99,
              background: i === imgIdx ? '#e4a420' : 'rgba(255,255,255,0.4)',
              transition: 'all 0.3s ease',
            }} />
          ))}
        </div>
      )}

      {/* Bottom info overlay */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 2,
        background: 'linear-gradient(to top, rgba(8,6,10,0.92) 0%, rgba(8,6,10,0.6) 60%, transparent 100%)',
        padding: '1.25rem 1rem 0.875rem',
        transform: hovered ? 'translateY(0)' : 'translateY(4px)',
        transition: 'transform 0.3s ease',
      }}>
        <div style={{ fontSize: '0.625rem', fontFamily: 'DM Sans', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(201,136,16,0.85)', marginBottom: '0.2rem' }}>
          {design.id}
        </div>
        <div style={{ fontSize: '0.875rem', fontFamily: 'Playfair Display, serif', fontWeight: 600, color: '#f5f0ff', lineHeight: 1.3 }}>
          {design.title}
        </div>
        {/* View CTA — appears on hover */}
        <div style={{
          marginTop: '0.5rem',
          fontSize: '0.7rem', fontFamily: 'DM Sans', fontWeight: 600,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: '#e4a420',
          display: 'flex', alignItems: 'center', gap: '0.3rem',
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateY(0)' : 'translateY(4px)',
          transition: 'all 0.3s ease 0.05s',
        }}>
          View Details
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M7 17L17 7M17 7H7M17 7v10"/>
          </svg>
        </div>
      </div>

      {/* Tag badge */}
      {design.tag && (
        <div style={{
          position: 'absolute', top: '0.75rem', left: '0.75rem', zIndex: 3,
          padding: '0.2rem 0.55rem',
          borderRadius: '0.375rem',
          background: 'rgba(201,136,16,0.92)',
          fontSize: '0.6rem', fontWeight: 700, fontFamily: 'DM Sans',
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: '#0a0705',
        }}>
          {design.tag}
        </div>
      )}

      {/* Gold shimmer on top edge */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '2px', zIndex: 3,
        background: 'linear-gradient(90deg, transparent, #e4a420, #f3d98a, #e4a420, transparent)',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }} />
    </div>
  )
}
