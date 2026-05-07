import React from 'react'
import { Link } from 'react-router-dom'
import { Phone, MapPin, Mail, Clock } from 'lucide-react'
import { SHOP_PHONE, SHOP_ADDRESS, WHATSAPP_NUMBER } from '../data'
import { useLang } from '../context/LangContext'

const WA = `https://wa.me/${WHATSAPP_NUMBER}`

export default function Footer() {
  const year = new Date().getFullYear()
  const { t } = useLang()

  return (
    <footer style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>

      <div className="container-xl" style={{ paddingTop: '4rem', paddingBottom: '3rem' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Brand col */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-5" style={{ width: 'fit-content' }}>
              <img src="/favicon.svg" alt="Om Sakthi Logo" style={{ width: 40, height: 40, borderRadius: '50%', display: 'block' }} />
              <div>
                <div className="font-display font-semibold text-base leading-tight text-gold-gradient">Om Sakthi Printers</div>
                <div className="font-body text-xs tracking-widest uppercase" style={{ color: 'var(--text4)', fontSize: 10 }}>Sattur, Tamil Nadu</div>
              </div>
            </Link>

            <p className="body-sm mb-6" style={{ maxWidth: '22rem' }}>
              {t.footer_tagline}
            </p>

            <a href={WA} target="_blank" rel="noopener noreferrer"
              className="btn btn-sm"
              style={{ background: 'rgba(37,211,102,0.10)', border: '1.5px solid rgba(37,211,102,0.3)', color: '#25D366' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.122.553 4.107 1.518 5.832L.057 23.743a.5.5 0 00.609.637l6.163-1.615A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.88 0-3.654-.493-5.193-1.358l-.372-.215-3.859 1.011 1.032-3.754-.238-.386A9.951 9.951 0 012 12c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10z"/>
              </svg>
              {t.footer_whatsapp}
            </a>
          </div>

          {/* Nav col */}
          <div>
            <h4 className="label mb-5" style={{ color: 'rgba(201,136,16,0.7)' }}>{t.footer_pages}</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                {to:'/',label:t.footer_home},
                {to:'/gallery',label:t.footer_gallery},
                {to:'/services',label:t.footer_services},
                {to:'/about',label:t.footer_about},
                {to:'/contact',label:t.footer_contact_link}
              ].map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="body-sm hover-line" style={{ display: 'inline-block', color: 'var(--text3)', transition: 'color 0.2s' }}
                    onMouseEnter={e=>e.target.style.color='var(--gold-light)'}
                    onMouseLeave={e=>e.target.style.color='var(--text3)'}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact col */}
          <div>
            <h4 className="label mb-5" style={{ color: 'rgba(201,136,16,0.7)' }}>{t.footer_contact}</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { icon: MapPin, content: SHOP_ADDRESS,                        href: null },
                { icon: Phone,  content: SHOP_PHONE,                          href: `tel:${SHOP_PHONE}` },
                { icon: Mail,   content: 'omsakhtiprinters@gmail.com',        href: 'mailto:omsakhtiprinters@gmail.com' },
                { icon: Clock,  content: t.footer_hours,                      href: null },
              ].map(({ icon: Icon, content, href }, i) => {
                const Inner = (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem' }}>
                    <Icon size={13} style={{ color: 'var(--gold)', marginTop: '0.2rem', flexShrink: 0 }} />
                    <span className="body-sm" style={{ color: 'var(--text3)', lineHeight: 1.55 }}>{content}</span>
                  </div>
                )
                return href
                  ? <li key={i}><a href={href} style={{ textDecoration: 'none' }}
                      onMouseEnter={e=>e.currentTarget.querySelector('span').style.color='var(--gold-light)'}
                      onMouseLeave={e=>e.currentTarget.querySelector('span').style.color='var(--text3)'}>{Inner}</a></li>
                  : <li key={i}>{Inner}</li>
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid var(--border)' }}>
        <div className="container-xl" style={{ paddingTop: '1.25rem', paddingBottom: '1.25rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
          <p className="label" style={{ color: 'var(--text4)', letterSpacing: '0.03em', fontWeight: 400, fontSize: '0.75rem', textTransform: 'none' }}>
            © {year} {t.footer_copy}
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Wedding Card Printing Sattur', 'Best Printers Sattur'].map((item, i) => (
              <span key={i} style={{ fontSize: '0.6875rem', color: 'var(--text4)', opacity: 0.6 }}>{item}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
