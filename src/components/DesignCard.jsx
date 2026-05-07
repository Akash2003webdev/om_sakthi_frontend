import React from 'react'
import { useState, useRef } from 'react'
import { Eye, ArrowUpRight } from 'lucide-react'

export default function DesignCard({ design, onClick }) {
  const [hovered, setHovered] = useState(false)
  const cardRef = useRef(null)

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top)  / rect.height - 0.5
    cardRef.current.style.transform = `perspective(900px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-6px)`
  }
  const handleMouseLeave = () => {
    cardRef.current.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg) translateY(0px)'
    setHovered(false)
  }

  return (
    <article
      ref={cardRef}
      className="design-card"
      style={{ transition: 'transform 0.35s cubic-bezier(0.23,1,0.32,1)', cursor: 'pointer' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => onClick(design)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick(design)}
      aria-label={`View ${design.title} — ${design.id}`}
    >
      {/* ── Image ── */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '4/5', background: 'var(--surface2)' }}>
        <img
          src={design.image}
          alt={design.title}
          className="w-full h-full object-cover"
          style={{ transform: hovered ? 'scale(1.07)' : 'scale(1)', transition: 'transform 0.6s cubic-bezier(0.23,1,0.32,1)' }}
          loading="lazy"
          draggable={false}
        />

        {/* Hover overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(8,6,10,0.60)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: '0.5rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.2)',
            backdropFilter: 'blur(4px)',
          }}>
            <Eye size={16} color="#fff" />
          </div>
          <div style={{
            width: 40, height: 40, borderRadius: '0.5rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--gold)',
          }}>
            <ArrowUpRight size={16} color="#0a0705" />
          </div>
        </div>

        {/* Tag */}
        {design.tag && <div className="tag-badge">{design.tag}</div>}
      </div>

      {/* ── Info ── */}
      <div className="card-info">
        <div className="flex items-start justify-between gap-2">
          <div style={{ minWidth: 0 }}>
            <p className="label mb-1" style={{ color: 'rgba(201,136,16,0.75)', fontSize: '0.6875rem' }}>{design.id}</p>
            <h3 className="font-display font-semibold text-sm leading-tight" style={{ color: 'var(--text)' }}>
              {design.title}
            </h3>
          </div>
          <div style={{
            width: 28, height: 28, borderRadius: '0.375rem', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid var(--border)',
            transition: 'all 0.2s ease',
          }}>
            <ArrowUpRight size={13} style={{ color: 'var(--text4)' }} />
          </div>
        </div>
      </div>
    </article>
  )
}
