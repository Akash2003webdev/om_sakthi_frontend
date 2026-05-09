import React from "react";
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { gsap } from "gsap";
import * as THREE from "three";
import { fetchDesigns, WHATSAPP_NUMBER } from "../data";
import EnquiryModal from "../components/EnquiryModal";
import { useLang } from "../context/LangContext";
import {
  ArrowLeft,
  ArrowRight,
  Share2,
  ChevronRight,
  MessageSquare,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";

const WA = (id, title) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi, I liked your design (Design ID: ${id} — ${title}). I want to order.`
  )}`;

export default function DesignDetail() {
  const { id } = useParams();
  const { t } = useLang();
  const navigate = useNavigate();

  const [DESIGNS, setDESIGNS] = useState([]);
  const [designsLoaded, setDesignsLoaded] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [copied, setCopied] = useState(false);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    fetchDesigns().then((data) => {
      setDESIGNS(data);
      setDesignsLoaded(true);
    });
  }, []);

  const design = DESIGNS.find((d) => d.id === id);

  const heroRef = useRef(null);
  const infoRef = useRef(null);
  const canvasRef = useRef(null);
  const threeCleanupRef = useRef(null);

  useEffect(() => {
    if (!designsLoaded) return;
    if (!design) {
      navigate("/gallery", { replace: true });
      return;
    }

    window.scrollTo(0, 0);
    setActiveImg(0);

    // Cleanup previous Three.js scene
    if (threeCleanupRef.current) {
      threeCleanupRef.current();
      threeCleanupRef.current = null;
    }

    // GSAP entry animations
    gsap.fromTo(
      heroRef.current,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
    );
    gsap.fromTo(
      infoRef.current,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.7, delay: 0.12, ease: "power3.out" }
    );

    // Init Three.js after a tick so canvas is laid out
    const timer = setTimeout(() => {
      threeCleanupRef.current = initThreeScene();
    }, 60);

    return () => {
      clearTimeout(timer);
      if (threeCleanupRef.current) {
        threeCleanupRef.current();
        threeCleanupRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [design, id, navigate, designsLoaded]);

  function initThreeScene() {
    const canvas = canvasRef.current;
    if (!canvas || !design) return null;

    const w = canvas.clientWidth || 380;
    const h = canvas.clientHeight || 240;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const loader = new THREE.TextureLoader();
    const imagesList = design.images || [design.image];

    let frameId = null;

    Promise.all(
      imagesList.map(
        (url) =>
          new Promise((res) => loader.load(url, res, undefined, () => res(null)))
      )
    ).then((textures) => {
      const validTextures = textures.filter(Boolean);
      if (!validTextures.length) return;

      const cards = [];
      const cardGeo = new THREE.BoxGeometry(1.6, 2.2, 0.05);

      validTextures.forEach((tex, i) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        const frontMat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.4, metalness: 0.1 });
        const backMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
        const edgeMat = new THREE.MeshStandardMaterial({ color: 0xc98810, metalness: 0.8, roughness: 0.2 });
        const mesh = new THREE.Mesh(cardGeo, [edgeMat, edgeMat, edgeMat, edgeMat, frontMat, backMat]);
        mesh.position.set(i * 0.1, i * -0.05, i * -0.1);
        scene.add(mesh);
        cards.push({ mesh, baseY: mesh.position.y });
      });

      scene.add(new THREE.AmbientLight(0xffffff, 1));
      const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
      keyLight.position.set(2, 4, 5);
      scene.add(keyLight);

      let mx = 0;
      let my = 0;

      const onMove = (e) => {
        const rect = canvas.getBoundingClientRect();
        mx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        my = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      };
      canvas.addEventListener("mousemove", onMove);

      const animate = () => {
        frameId = requestAnimationFrame(animate);
        const time = Date.now() * 0.001;
        cards.forEach(({ mesh, baseY }, i) => {
          mesh.rotation.y += (mx * 0.4 - mesh.rotation.y) * 0.05;
          mesh.rotation.x += (-my * 0.3 - mesh.rotation.x) * 0.05;
          mesh.position.y = baseY + Math.sin(time + i) * 0.05;
        });
        renderer.render(scene, camera);
      };
      animate();

      // Return cleanup
      threeCleanupRef.current = () => {
        if (frameId) cancelAnimationFrame(frameId);
        canvas.removeEventListener("mousemove", onMove);
        renderer.dispose();
      };
    });

    // Return immediate cleanup (in case textures not loaded yet)
    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      renderer.dispose();
    };
  }

  const copyId = () => {
    navigator.clipboard?.writeText(design?.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!designsLoaded) {
    return (
      <main
        className="min-h-screen pt-24 flex items-center justify-center"
        style={{ background: "var(--bg)", color: "var(--text)" }}
      >
        <div className="flex flex-col items-center gap-4 opacity-40">
          <div className="w-8 h-8 border-2 border-[var(--gold-main)] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm tracking-widest uppercase font-semibold">Loading</span>
        </div>
      </main>
    );
  }

  if (!design) return null;

  const imagesList = design.images || [design.image];
  const related = DESIGNS.filter(
    (d) => d.category === design.category && d.id !== id
  ).slice(0, 4);

  return (
    <main
      className="min-h-screen"
      style={{ background: "var(--bg)", color: "var(--text)", paddingTop: "80px", paddingBottom: "120px" }}
    >
      {/* ─── BREADCRUMB ──────────────────────────────────────── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.75rem",
          }}
        >
          {/* Left: back nav */}
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              fontWeight: 700,
              opacity: 0.4,
            }}
          >
            <Link
              to="/gallery"
              style={{
                color: "inherit",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseOver={(e) => (e.target.style.color = "var(--gold-main)")}
              onMouseOut={(e) => (e.target.style.color = "inherit")}
            >
              Gallery
            </Link>
            <ChevronRight size={12} />
            <span style={{ color: "var(--gold-main)", opacity: 1 }}>{design.id}</span>
          </nav>

          {/* Right: share button */}
          <button
            onClick={copyId}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              fontWeight: 700,
              padding: "8px 16px",
              borderRadius: "100px",
              background: "var(--glass)",
              border: "1px solid var(--border)",
              color: "var(--text3)",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {copied ? <CheckCircle2 size={12} /> : <Share2 size={12} />}
            {copied ? (t.detail_copied || "Copied!") : (t.detail_share || "Share ID")}
          </button>
        </div>

        {/* ─── MAIN 2-COLUMN GRID ────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 400px",
            gap: "3rem",
            alignItems: "start",
          }}
          className="detail-grid"
        >
          {/* ── LEFT COLUMN ──────────────────────────────────── */}
          <div ref={heroRef} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

            {/* Main image viewer */}
            <div
              onClick={() => setLightbox(true)}
              style={{
                position: "relative",
                borderRadius: "28px",
                overflow: "hidden",
                background: "var(--surface2)",
                border: "1px solid var(--border)",
                aspectRatio: "4 / 5",
                cursor: "zoom-in",
              }}
            >
              {imagesList.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={design.title}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "opacity 0.8s ease, transform 0.8s ease",
                    opacity: i === activeImg ? 1 : 0,
                    transform: i === activeImg ? "scale(1)" : "scale(1.04)",
                  }}
                />
              ))}

              {/* Bottom gradient */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 55%)",
                  pointerEvents: "none",
                }}
              />

              {/* Arrow buttons */}
              {imagesList.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImg((p) => (p - 1 + imagesList.length) % imagesList.length);
                    }}
                    style={{
                      position: "absolute",
                      left: "16px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                      background: "rgba(0,0,0,0.35)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: "white",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "background 0.2s",
                      backdropFilter: "blur(8px)",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = "var(--gold-main)")}
                    onMouseOut={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.35)")}
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImg((p) => (p + 1) % imagesList.length);
                    }}
                    style={{
                      position: "absolute",
                      right: "16px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                      background: "rgba(0,0,0,0.35)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: "white",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "background 0.2s",
                      backdropFilter: "blur(8px)",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = "var(--gold-main)")}
                    onMouseOut={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.35)")}
                  >
                    <ArrowRight size={18} />
                  </button>
                </>
              )}

              {/* Image counter */}
              <div
                style={{
                  position: "absolute",
                  bottom: "16px",
                  left: "16px",
                  padding: "5px 12px",
                  borderRadius: "100px",
                  background: "rgba(0,0,0,0.5)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.75)",
                  backdropFilter: "blur(8px)",
                }}
              >
                {activeImg + 1} / {imagesList.length}
              </div>

            </div>

            {/* Thumbnail strip */}
            {imagesList.length > 1 && (
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  overflowX: "auto",
                  paddingBottom: "4px",
                }}
              >
                {imagesList.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    style={{
                      flexShrink: 0,
                      width: "76px",
                      height: "76px",
                      borderRadius: "16px",
                      overflow: "hidden",
                      border: `2px solid ${i === activeImg ? "var(--gold-main)" : "transparent"}`,
                      opacity: i === activeImg ? 1 : 0.4,
                      cursor: "pointer",
                      padding: 0,
                      background: "var(--surface2)",
                      transition: "all 0.25s",
                    }}
                  >
                    <img
                      src={img}
                      alt=""
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT COLUMN ─────────────────────────────────── */}
          <div
            ref={infoRef}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.75rem",
              position: "sticky",
              top: "96px",
            }}
          >
            {/* Category tag + Title + Description */}
            <div>
              {design.category && (
                <div
                  style={{
                    display: "inline-block",
                    marginBottom: "12px",
                    padding: "4px 14px",
                    borderRadius: "100px",
                    background: "rgba(201,136,16,0.12)",
                    border: "1px solid rgba(201,136,16,0.25)",
                    fontSize: "10px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--gold-main)",
                    fontWeight: 700,
                  }}
                >
                  {design.category}
                </div>
              )}

              <h1
                style={{
                  fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
                  fontWeight: 700,
                  lineHeight: 1.2,
                  letterSpacing: "-0.02em",
                  marginBottom: "1rem",
                }}
              >
                {design.title}
              </h1>

              <p
                style={{
                  fontSize: "14px",
                  lineHeight: 1.75,
                  color: "var(--text2)",
                  maxWidth: "360px",
                }}
              >
                {design.description}
              </p>
            </div>

            {/* Spec cards — 2×2 grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
              }}
            >
              <SpecBox label={t.detail_dimensions || "Dimensions"} value={design.details?.size} />
              <SpecBox label={t.detail_finish || "Finish"} value={design.details?.finish} />
              <SpecBox label={t.detail_quantity || "Min. Qty"} value={design.details?.minQty} />
              <SpecBox label="Est. Delivery" value={design.details?.delivery} />
            </div>

            {/* 3D Preview card */}
            <div
              style={{
                borderRadius: "24px",
                overflow: "hidden",
                border: "1px solid var(--border)",
                background: "var(--surface)",
              }}
            >
              {/* 3D header */}
              <div
                style={{
                  padding: "12px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid var(--border)",
                  background: "var(--glass)",
                }}
              >
                <span
                  style={{
                    fontSize: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                    fontWeight: 700,
                    color: "var(--gold-main)",
                  }}
                >
                  Live 3D View
                </span>
                <div style={{ display: "flex", gap: "4px" }}>
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: "5px",
                        height: "5px",
                        borderRadius: "50%",
                        background: "var(--gold-main)",
                        opacity: 0.6,
                        animation: `bounce 1s ${i * 0.15}s infinite`,
                      }}
                    />
                  ))}
                </div>
              </div>

              <canvas
                ref={canvasRef}
                style={{
                  width: "100%",
                  height: "240px",
                  display: "block",
                  cursor: "grab",
                }}
              />
            </div>

            {/* Trust signals */}
            <div
              style={{
                padding: "16px 20px",
                borderRadius: "18px",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {[
                { icon: <ShieldCheck size={16} />, text: "100% quality check guaranteed" },
                { icon: <MessageSquare size={16} />, text: t.detail_whatsapp || "WhatsApp support within 2 hours" },
                { icon: <RefreshCw size={16} />, text: "Free customisation consultation" },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontSize: "13px",
                    color: "var(--text2)",
                  }}
                >
                  <span style={{ color: "var(--gold-main)", flexShrink: 0 }}>{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>

            {/* Design ID badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 18px",
                borderRadius: "14px",
                background: "rgba(201,136,16,0.06)",
                border: "1px solid rgba(201,136,16,0.15)",
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  color: "var(--text3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  fontWeight: 600,
                }}
              >
                Design ID
              </span>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "var(--gold-main)",
                  letterSpacing: "0.05em",
                }}
              >
                {design.id}
              </span>
            </div>
          </div>
        </div>

        {/* ─── RELATED DESIGNS ───────────────────────────────── */}
        {related.length > 0 && (
          <section
            style={{
              marginTop: "5rem",
              paddingTop: "3rem",
              borderTop: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "2rem",
              }}
            >
              <h2
                style={{
                  fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                }}
              >
                Similar Creations
              </h2>
              <Link
                to="/gallery"
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "var(--gold-main)",
                  textDecoration: "none",
                  borderBottom: "1px solid var(--gold-main)",
                  paddingBottom: "2px",
                }}
              >
                View Gallery →
              </Link>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "1.25rem",
              }}
              className="related-grid"
            >
              {related.map((d) => (
                <RelatedCard
                  key={d.id}
                  design={d}
                  onClick={() => {
                    navigate(`/design/${d.id}`);
                    window.scrollTo(0, 0);
                  }}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ─── FIXED BOTTOM ACTION BAR ───────────────────────── */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 600,
          padding: "12px 1.5rem 16px",
          background: "rgba(13,13,13,0.9)",
          borderTop: "1px solid var(--border)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
        }}
      >
        <div
          style={{
            maxWidth: 640,
            margin: "0 auto",
            display: "flex",
            gap: "12px",
            alignItems: "center",
          }}
        >
          <button
            onClick={() => setShowEnquiry(true)}
            style={{
              flex: 2,
              height: "52px",
              borderRadius: "14px",
              background: "var(--gold-main)",
              border: "none",
              fontWeight: 700,
              fontSize: "15px",
              color: "#0d0d0d",
              cursor: "pointer",
              letterSpacing: "0.03em",
              transition: "background 0.2s, transform 0.1s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "var(--gold-light)")}
            onMouseOut={(e) => (e.currentTarget.style.background = "var(--gold-main)")}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {t.enquire_btn || "Enquire Now"}
          </button>

          <a
            href={WA(design.id, design.title)}
            target="_blank"
            rel="noreferrer"
            style={{
              flex: 1,
              height: "52px",
              borderRadius: "14px",
              background: "#25D366",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              fontWeight: 700,
              fontSize: "14px",
              color: "white",
              textDecoration: "none",
              transition: "opacity 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <MessageSquare size={18} />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      {/* ─── LIGHTBOX ─────────────────────────────────────── */}
      {lightbox && (
        <div
          onClick={() => setLightbox(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(0,0,0,0.97)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            cursor: "zoom-out",
          }}
        >
          {/* Image */}
          <img
            src={imagesList[activeImg]}
            alt={design.title}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "calc(100% - 140px)",
              maxHeight: "90vh",
              objectFit: "contain",
              borderRadius: "16px",
              cursor: "default",
              userSelect: "none",
            }}
          />

          {/* Close button */}
          <button
            onClick={() => setLightbox(false)}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "white",
              cursor: "pointer",
              fontSize: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
            onMouseOut={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
          >
            ✕
          </button>

          {/* Prev arrow */}
          {imagesList.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveImg((p) => (p - 1 + imagesList.length) % imagesList.length);
              }}
              style={{
                position: "absolute",
                left: "20px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "var(--gold-main)")}
              onMouseOut={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
            >
              <ArrowLeft size={22} />
            </button>
          )}

          {/* Next arrow */}
          {imagesList.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveImg((p) => (p + 1) % imagesList.length);
              }}
              style={{
                position: "absolute",
                right: "20px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "var(--gold-main)")}
              onMouseOut={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
            >
              <ArrowRight size={22} />
            </button>
          )}

          {/* Counter */}
          {imagesList.length > 1 && (
            <div
              style={{
                position: "absolute",
                bottom: "24px",
                left: "50%",
                transform: "translateX(-50%)",
                padding: "6px 16px",
                borderRadius: "100px",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                fontSize: "12px",
                color: "rgba(255,255,255,0.6)",
                letterSpacing: "0.1em",
              }}
            >
              {activeImg + 1} / {imagesList.length}
            </div>
          )}
        </div>
      )}

      {/* ─── ENQUIRY MODAL ────────────────────────────────── */}
      {showEnquiry && (
        <EnquiryModal design={design} onClose={() => setShowEnquiry(false)} />
      )}

      {/* ─── RESPONSIVE STYLES ────────────────────────────── */}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.6; }
          40% { transform: translateY(-4px); opacity: 1; }
        }

        /* Mobile: stack columns */
        @media (max-width: 900px) {
          .detail-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .detail-grid > div:last-child {
            position: static !important;
          }
          .related-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media (max-width: 480px) {
          .related-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 0.75rem !important;
          }
        }

        /* Scrollbar hide for thumbnails */
        ::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; }
      `}</style>
    </main>
  );
}

/* ── Sub-components ───────────────────────────────────────── */

function SpecBox({ label, value }) {
  return (
    <div
      style={{
        padding: "14px 16px",
        borderRadius: "18px",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        transition: "border-color 0.2s",
      }}
      onMouseOver={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
      onMouseOut={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
    >
      <p
        style={{
          fontSize: "9px",
          textTransform: "uppercase",
          letterSpacing: "0.2em",
          fontWeight: 700,
          color: "var(--text3)",
          marginBottom: "6px",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: "13px",
          fontWeight: 700,
          color: "var(--text)",
          lineHeight: 1.3,
        }}
      >
        {value || "Standard"}
      </p>
    </div>
  );
}

function RelatedCard({ design, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseOver={() => setHovered(true)}
      onMouseOut={() => setHovered(false)}
      style={{ cursor: "pointer" }}
    >
      <div
        style={{
          aspectRatio: "3 / 4",
          borderRadius: "20px",
          overflow: "hidden",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          marginBottom: "12px",
        }}
      >
        <img
          src={design.image}
          alt={design.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transition: "transform 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            transform: hovered ? "scale(1.08)" : "scale(1)",
          }}
        />
      </div>

      <h4
        style={{
          fontSize: "13px",
          fontWeight: 600,
          color: hovered ? "var(--gold-main)" : "rgba(240,237,230,0.8)",
          marginBottom: "4px",
          transition: "color 0.25s",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {design.title}
      </h4>

      <p
        style={{
          fontSize: "10px",
          color: "var(--text3)",
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          fontWeight: 600,
        }}
      >
        {design.id}
      </p>
    </div>
  );
}
