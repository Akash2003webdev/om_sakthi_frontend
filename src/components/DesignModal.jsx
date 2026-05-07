import React from 'react'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { X, Share2, Check } from 'lucide-react'
import EnquiryModal from './EnquiryModal'
import { WHATSAPP_NUMBER } from '../data'

export default function DesignModal({ design, onClose }) {
  const [showEnquiry, setShowEnquiry] = useState(false)
  const [copied, setCopied] = useState(false)
  const backdropRef = useRef(null)
  const modalRef = useRef(null)

  useEffect(() => {
    gsap.from(backdropRef.current, { opacity: 0, duration: 0.3 })
    gsap.from(modalRef.current, { scale: 0.92, opacity: 0, duration: 0.5, ease: 'power3.out' })
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const close = () => {
    gsap.to(modalRef.current, { scale: 0.92, opacity: 0, duration: 0.3 })
    gsap.to(backdropRef.current, { opacity: 0, duration: 0.3, onComplete: onClose })
  }

  const copyId = () => {
    navigator.clipboard?.writeText(`Design ID: ${design.id} — ${design.title}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi, I liked your design (Design ID: ${design.id}). I want to order.`
  )}`

  if (showEnquiry) return <EnquiryModal design={design} onClose={() => setShowEnquiry(false)} />

  return (
    <div ref={backdropRef} className="modal-backdrop"
      onClick={(e) => e.target === backdropRef.current && close()}>
      <div ref={modalRef}
        className="w-full max-w-4xl mx-4 flex flex-col md:flex-row overflow-hidden"
        style={{ background: 'var(--surface)', border: '1px solid rgba(201,136,16,0.15)', maxHeight: '90vh' }}>

        {/* Image Panel */}
        <div className="md:w-1/2 relative overflow-hidden min-h-[280px]">
          <img src={design.image} alt={design.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, transparent 50%, rgba(0,0,0,0.5))' }} />
          {design.tag && (
            <div className="absolute top-4 left-4 px-3 py-1 text-xs tracking-widest uppercase font-body font-semibold"
              style={{ background: 'rgba(201,136,16,0.9)', color: '#0a0705' }}>
              {design.tag}
            </div>
          )}
          {/* Category badge */}
          <div className="absolute bottom-4 left-4 px-3 py-1.5 text-xs tracking-widest uppercase font-body backdrop-blur-sm"
            style={{ background: 'rgba(0,0,0,0.5)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.15)' }}>
            {design.category === 'wedding' ? '💍 Wedding Card' : design.category === 'visiting' ? '🪪 Visiting Card' : '🖼️ Banner'}
          </div>
        </div>

        {/* Info Panel */}
        <div className="md:w-1/2 p-8 flex flex-col justify-between overflow-y-auto relative">
          <div>
            <button onClick={close} className="absolute top-5 right-5 transition-colors z-10" style={{ color: 'var(--text4)' }}>
              <X size={20} />
            </button>

            {/* Design ID badge */}
            <div className="inline-flex items-center gap-3 px-4 py-2.5 mb-6"
              style={{ background: 'rgba(201,136,16,0.08)', border: '1px solid rgba(201,136,16,0.25)' }}>
              <div>
                <div className="text-xs tracking-widest uppercase font-body" style={{ color: 'var(--text4)' }}>Design ID</div>
                <div className="font-display font-semibold text-lg" style={{ color: '#e4a420' }}>{design.id}</div>
              </div>
            </div>

            <h2 className="font-display text-3xl font-semibold mb-3 leading-tight" style={{ color: 'var(--text)' }}>{design.title}</h2>
            <p className="font-body text-sm leading-relaxed mb-6" style={{ color: 'var(--text3)' }}>{design.description}</p>

            {/* Info note */}
            <div className="p-4 mb-6" style={{ background: 'var(--glass-gold)', border: '1px solid rgba(201,136,16,0.15)' }}>
              <p className="font-body text-xs leading-relaxed" style={{ color: 'var(--text3)' }}>
                💡 Use Design ID <strong style={{ color: '#e4a420' }}>{design.id}</strong> when ordering on WhatsApp or via the form — our team will pick the exact design for you.
              </p>
            </div>

            <div className="divider mb-6" />
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button onClick={() => setShowEnquiry(true)} className="btn-gold w-full text-center">
              <span>Order This Design</span>
            </button>

            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-3.5 font-body text-sm tracking-widest uppercase transition-all"
              style={{ border: '1px solid rgba(37,211,102,0.35)', background: 'rgba(37,211,102,0.06)', color: '#25D366' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.122.553 4.107 1.518 5.832L.057 23.743a.5.5 0 00.609.637l6.163-1.615A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.88 0-3.654-.493-5.193-1.358l-.372-.215-3.859 1.011 1.032-3.754-.238-.386A9.951 9.951 0 012 12c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10z"/>
              </svg>
              Order via WhatsApp
            </a>

            <button onClick={copyId}
              className="flex items-center justify-center gap-2 py-2.5 font-body text-xs tracking-wider uppercase transition-colors"
              style={{ color: copied ? '#e4a420' : 'var(--text4)' }}>
              {copied ? <Check size={13} /> : <Share2 size={13} />}
              {copied ? 'Copied!' : 'Copy Design ID'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
