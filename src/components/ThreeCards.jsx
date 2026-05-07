import React from 'react'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// Real invitation-style card images (portrait ratio)
const CARD_IMAGES = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=560&fit=crop&q=85', // wedding invitation
  'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=400&h=560&fit=crop&q=85', // gold card
  'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&h=560&fit=crop&q=85', // floral invite
]

export default function ThreeCards() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene  = new THREE.Scene()
    const width  = mount.clientWidth
    const height = mount.clientHeight

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100)
    camera.position.z = 5.5

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.shadowMap.enabled = true
    mount.appendChild(renderer.domElement)

    // ── Load textures from URLs ──
    const loader  = new THREE.TextureLoader()
    const cards   = []
    const cardGeo = new THREE.BoxGeometry(1.35, 2.0, 0.03, 1, 1, 1)

    const positions = [
      { x: -2.0, y:  0.25, z: -0.3, ry:  0.28, rx: 0.05 },
      { x:  0.0, y:  0.0,  z:  0.6, ry:  0.0,  rx: 0.0  },
      { x:  2.0, y: -0.2,  z: -0.3, ry: -0.28, rx: -0.03 },
    ]

    CARD_IMAGES.forEach((url, i) => {
      loader.load(url, (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace

        // Front face = photo texture
        const frontMat = new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.35,
          metalness: 0.1,
        })

        // Back face = dark gold
        const backMat = new THREE.MeshStandardMaterial({
          color: 0x1a1008,
          roughness: 0.6,
          metalness: 0.3,
        })

        // Edges = gold
        const edgeMat = new THREE.MeshStandardMaterial({
          color: 0xc98810,
          roughness: 0.3,
          metalness: 0.6,
        })

        // BoxGeometry face order: +x, -x, +y, -y, +z(front), -z(back)
        const materials = [edgeMat, edgeMat, edgeMat, edgeMat, frontMat, backMat]
        const mesh = new THREE.Mesh(cardGeo, materials)
        mesh.position.set(positions[i].x, positions[i].y, positions[i].z)
        mesh.rotation.set(positions[i].rx, positions[i].ry, 0)
        mesh.castShadow    = true
        mesh.receiveShadow = true
        scene.add(mesh)

        // Gold border frame on front face
        const frameGeo = new THREE.EdgesGeometry(new THREE.PlaneGeometry(1.15, 1.8))
        const frameMat = new THREE.LineBasicMaterial({ color: 0xe4a420, transparent: true, opacity: 0.5 })
        const frame    = new THREE.LineSegments(frameGeo, frameMat)
        frame.position.set(0, 0, 0.022)
        mesh.add(frame)

        cards[i] = { mesh, baseY: positions[i].y, offset: i * Math.PI * 0.65 }
      },
      undefined,
      () => {
        // Fallback if image fails to load: gold gradient card
        const mat = new THREE.MeshStandardMaterial({ color: i === 1 ? 0xc98810 : 0x1a1008, metalness: 0.4, roughness: 0.4 })
        const mesh = new THREE.Mesh(cardGeo, mat)
        mesh.position.set(positions[i].x, positions[i].y, positions[i].z)
        mesh.rotation.set(positions[i].rx, positions[i].ry, 0)
        scene.add(mesh)
        cards[i] = { mesh, baseY: positions[i].y, offset: i * Math.PI * 0.65 }
      })
    })

    // ── Lighting ──
    const ambient = new THREE.AmbientLight(0xfff8ee, 0.7)
    scene.add(ambient)

    const keyLight = new THREE.DirectionalLight(0xfff5dd, 1.4)
    keyLight.position.set(3, 4, 5)
    scene.add(keyLight)

    const goldLight = new THREE.PointLight(0xc98810, 2.5, 12)
    goldLight.position.set(-1, 2, 4)
    scene.add(goldLight)

    const rimLight = new THREE.PointLight(0xe4a420, 1.2, 8)
    rimLight.position.set(2, -1, 2)
    scene.add(rimLight)

    // ── Floating particles (gold dust) ──
    const particleCount = 60
    const pGeo = new THREE.BufferGeometry()
    const pPositions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      pPositions[i * 3]     = (Math.random() - 0.5) * 8
      pPositions[i * 3 + 1] = (Math.random() - 0.5) * 5
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 3
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3))
    const pMat = new THREE.PointsMaterial({ color: 0xc98810, size: 0.025, transparent: true, opacity: 0.5 })
    const particles = new THREE.Points(pGeo, pMat)
    scene.add(particles)

    // ── Mouse tracking ──
    let mouseX = 0, mouseY = 0
    const onMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth  - 0.5) * 2
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouseMove)

    // ── Animation loop ──
    let frameId
    const animate = () => {
      frameId = requestAnimationFrame(animate)
      const t = Date.now() * 0.001

      cards.forEach((c) => {
        if (!c) return
        c.mesh.rotation.y += (mouseX * 0.25 - c.mesh.rotation.y + positions[cards.indexOf(c)].ry) * 0.05
        c.mesh.rotation.x += (-mouseY * 0.15 - c.mesh.rotation.x + positions[cards.indexOf(c)].rx) * 0.05
        c.mesh.position.y = c.baseY + Math.sin(t * 0.8 + c.offset) * 0.1
      })

      // Drift particles slowly
      particles.rotation.y = t * 0.02
      particles.rotation.x = t * 0.01

      // Animate gold light
      goldLight.intensity = 2.0 + Math.sin(t * 1.5) * 0.5

      renderer.render(scene, camera)
    }
    animate()

    // ── Resize ──
    const onResize = () => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute', inset: 0,
        // ── KEY FIX: none so hero buttons/links are clickable ──
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  )
}
