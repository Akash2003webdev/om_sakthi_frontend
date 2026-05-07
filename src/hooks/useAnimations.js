import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Hook: fade + slide up on scroll
export function useReveal(options = {}) {
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    gsap.fromTo(
      el,
      { opacity: 0, y: options.y ?? 50 },
      {
        opacity: 1,
        y: 0,
        duration: options.duration ?? 0.9,
        ease: options.ease ?? 'power3.out',
        delay: options.delay ?? 0,
        scrollTrigger: {
          trigger: el,
          start: options.start ?? 'top 85%',
          once: true,
        },
      }
    )
    return () => ScrollTrigger.getAll().forEach(t => {
      if (t.vars?.trigger === el) t.kill()
    })
  }, [])
  return ref
}

// Hook: stagger children on scroll
export function useStagger(selector = '.stagger-item', options = {}) {
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current) return
    const items = ref.current.querySelectorAll(selector)
    if (!items.length) return
    gsap.fromTo(
      items,
      { opacity: 0, y: options.y ?? 40 },
      {
        opacity: 1,
        y: 0,
        duration: options.duration ?? 0.7,
        stagger: options.stagger ?? 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 80%',
          once: true,
        },
      }
    )
  }, [selector])
  return ref
}

// Hook: parallax on scroll
export function useParallax(speed = 0.3) {
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    const tl = gsap.to(el, {
      yPercent: speed * 100,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })
    return () => tl.kill()
  }, [speed])
  return ref
}

// Hook: horizontal scroll section
export function useHorizontalScroll() {
  const trackRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    const track = trackRef.current
    const container = containerRef.current
    if (!track || !container) return

    const totalWidth = track.scrollWidth
    const viewWidth = container.offsetWidth
    const scrollDist = totalWidth - viewWidth

    const tl = gsap.to(track, {
      x: -scrollDist,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: () => `+=${scrollDist}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    })

    return () => tl.kill()
  }, [])

  return { trackRef, containerRef }
}

// Hook: text split + char animate
export function useTextReveal() {
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    const text = el.textContent
    el.innerHTML = text
      .split('')
      .map((ch) => `<span class="char" style="display:inline-block">${ch === ' ' ? '&nbsp;' : ch}</span>`)
      .join('')

    gsap.from(el.querySelectorAll('.char'), {
      opacity: 0,
      y: 60,
      rotateX: -45,
      stagger: 0.025,
      duration: 0.6,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
    })
  }, [])
  return ref
}
