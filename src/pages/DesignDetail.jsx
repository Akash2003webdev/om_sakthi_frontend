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
  ZoomIn,
  ChevronRight,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";

const WA = (id, title) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi, I liked your design (Design ID: ${id} — ${title}). I want to order.`)}`;

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

  useEffect(() => {
    if (!designsLoaded) return;
    if (!design) {
      navigate("/gallery", { replace: true });
      return;
    }
    window.scrollTo(0, 0);

    gsap.fromTo(
      heroRef.current,
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.8 }
    );
    gsap.fromTo(
      infoRef.current,
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, duration: 0.8, delay: 0.2 }
    );

    initThreeScene();
  }, [design, id, navigate, designsLoaded]);

  function initThreeScene() {
    const canvas = canvasRef.current;
    if (!canvas || !design) return;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.z = 4;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const loader = new THREE.TextureLoader();
    const imagesList = design.images || [design.image];

    Promise.all(
      imagesList.map(
        (url) =>
          new Promise((res) =>
            loader.load(url, res, undefined, () => res(null))
          )
      )
    ).then((textures) => {
      const validTextures = textures.filter(Boolean);
      if (!validTextures.length) return;
      const cards = [];
      const cardGeo = new THREE.BoxGeometry(1.6, 2.2, 0.05);

      validTextures.forEach((tex, i) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        const frontMat = new THREE.MeshStandardMaterial({
          map: tex,
          roughness: 0.4,
          metalness: 0.1,
        });
        const backMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
        const edgeMat = new THREE.MeshStandardMaterial({
          color: 0xc98810,
          metalness: 0.8,
          roughness: 0.2,
        });
        const mesh = new THREE.Mesh(cardGeo, [
          edgeMat,
          edgeMat,
          edgeMat,
          edgeMat,
          frontMat,
          backMat,
        ]);
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

      let frameId;
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

      return () => {
        cancelAnimationFrame(frameId);
        canvas.removeEventListener("mousemove", onMove);
        renderer.dispose();
      };
    });
  }

  const copyId = () => {
    navigator.clipboard?.writeText(design.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!design) return null;

  const imagesList = design.images || [design.image];
  const related = DESIGNS.filter(
    (d) => d.category === design?.category && d.id !== id
  ).slice(0, 4);

  return (
    <main
      className="min-h-screen pt-24 pb-32"
      style={{ background: "var(--bg)", color: "var(--text)" }}
    >
      {/* Top Navigation */}
      <div className="container-xl px-6 mb-8">
        <div className="flex items-center justify-between">
          <nav className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold opacity-50">
            <Link
              to="/gallery"
              className="hover:text-[var(--gold-main)] transition-colors"
            >
              Gallery
            </Link>
            <ChevronRight size={12} />
            <span className="text-[var(--gold-main)]">{design.id}</span>
          </nav>
          <button
            onClick={copyId}
            className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full transition-all"
            style={{
              background: "var(--glass)",
              border: "1px solid var(--border)",
              color: "var(--text3)",
            }}
          >
            {copied ? t.detail_copied : t.detail_share}
            <Share2 size={12} />
          </button>
        </div>
      </div>

      <div className="container-xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* LEFT: Showcase */}
          <div ref={heroRef} className="lg:col-span-7 space-y-8">
            <div
              className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden group shadow-2xl"
              style={{
                background: "var(--surface2)",
                border: "1px solid var(--border)",
              }}
            >
              {imagesList.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${
                    i === activeImg
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-105"
                  }`}
                  alt=""
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
              <button
                onClick={() => setLightbox(true)}
                className="absolute bottom-6 right-6 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all"
              >
                <ZoomIn size={20} />
              </button>
              {imagesList.length > 1 && (
                <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 flex justify-between">
                  <button
                    onClick={() =>
                      setActiveImg(
                        (p) => (p - 1 + imagesList.length) % imagesList.length
                      )
                    }
                    className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-lg border border-white/10 flex items-center justify-center hover:bg-[var(--gold-main)] transition-all"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <button
                    onClick={() =>
                      setActiveImg((p) => (p + 1) % imagesList.length)
                    }
                    className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-lg border border-white/10 flex items-center justify-center hover:bg-[var(--gold-main)] transition-all"
                  >
                    <ArrowRight size={20} />
                  </button>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {imagesList.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {imagesList.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                      i === activeImg
                        ? "border-[var(--gold-main)]"
                        : "border-transparent opacity-40"
                    }`}
                  >
                    <img src={img} className="w-full h-full object-cover" alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Content */}
          <div ref={infoRef} className="lg:col-span-5 space-y-10">
            <div>
              <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight mb-6">
                {design.title}
              </h1>
              <p className="text-lg opacity-60 font-body leading-relaxed max-w-md">
                {design.description}
              </p>
            </div>

            {/* Spec Cards */}
            <div className="grid grid-cols-2 gap-4">
              <SpecBox label={t.detail_dimensions} value={design.details?.size} />
              <SpecBox label={t.detail_finish} value={design.details?.finish} />
              <SpecBox label={t.detail_quantity} value={design.details?.minQty} />
              <SpecBox label="Est. Delivery" value={design.details?.delivery} />
            </div>

            {/* 3D Preview */}
            <div
              className="p-1 rounded-[2rem]"
              style={{
                background:
                  "linear-gradient(135deg, rgba(201,136,16,0.15), transparent)",
                border: "1px solid var(--border)",
              }}
            >
              <div
                className="rounded-[1.9rem] overflow-hidden"
                style={{ background: "var(--nav-bg)" }}
              >
                <div
                  className="px-6 py-4 flex items-center justify-between"
                  style={{
                    borderBottom: "1px solid var(--border)",
                    background: "var(--glass)",
                  }}
                >
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--gold-main)]">
                    Live 3D View
                  </span>
                  <div className="flex gap-1">
                    <div className="w-1 h-1 rounded-full bg-[var(--gold-main)] animate-bounce" />
                    <div className="w-1 h-1 rounded-full bg-[var(--gold-main)] animate-bounce delay-100" />
                  </div>
                </div>
                <canvas
                  ref={canvasRef}
                  className="w-full h-[280px] cursor-grab active:cursor-grabbing"
                />
              </div>
            </div>

            {/* Trust Badges */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm opacity-80">
                <ShieldCheck size={18} className="text-[var(--gold-main)]" />
                <span>100% Quality Check Guaranteed</span>
              </div>
              <div className="flex items-center gap-3 text-sm opacity-80">
                <MessageSquare size={18} className="text-[var(--gold-main)]" />
                <span>{t.detail_whatsapp}</span>
              </div>
            </div>
          </div>

        </div>

        {/* RELATED SECTION */}
        <section
          className="mt-32 pt-20"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <div className="flex items-center justify-between mb-12">
            <h2 className="font-display text-3xl font-bold">Similar Creations</h2>
            <Link
              to="/gallery"
              className="text-sm font-bold text-[var(--gold-main)] border-b border-[var(--gold-main)] pb-1"
            >
              View Gallery
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((d) => (
              <div
                key={d.id}
                onClick={() => {
                  navigate(`/design/${d.id}`);
                  window.scrollTo(0, 0);
                }}
                className="group cursor-pointer flex flex-col"
              >
                <div
                  className="aspect-[3/4] w-full rounded-3xl overflow-hidden mb-4"
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <img
                    src={d.image}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={d.title}
                  />
                </div>
                <h4 className="font-bold opacity-80 group-hover:text-[var(--gold-main)] transition-colors truncate">
                  {d.title}
                </h4>
                <p className="text-[10px] opacity-40 uppercase tracking-widest mt-1">
                  {d.id}
                </p>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* FIXED ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-[600] p-4 md:p-6 pointer-events-none">
        <div className="container-xl flex justify-center">
          <div
            className="w-full max-w-2xl backdrop-blur-2xl p-2 md:p-3 rounded-[2rem] shadow-2xl pointer-events-auto flex items-center gap-3"
            style={{
              background: "var(--glass)",
              border: "1px solid var(--border)",
            }}
          >
            <button
              onClick={() => setShowEnquiry(true)}
              className="flex-[2] bg-[var(--gold-main)] text-black h-14 md:h-16 rounded-[1.5rem] font-bold text-sm md:text-base hover:bg-[var(--gold-light)] transition-all shadow-lg active:scale-95"
            >
              {t.enquire_btn}
            </button>
            <a
              href={WA(design.id, design.title)}
              target="_blank"
              rel="noreferrer"
              className="flex-1 bg-[#25D366] text-white h-14 md:h-16 rounded-[1.5rem] flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-95 shadow-lg"
            >
              <MessageSquare size={18} />
              <span className="hidden md:inline">WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[1000] bg-black/98 flex items-center justify-center p-6 cursor-zoom-out"
          onClick={() => setLightbox(false)}
        >
          <img
            src={imagesList[activeImg]}
            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
            alt=""
          />
        </div>
      )}

      {/* Enquiry Modal */}
      {showEnquiry && (
        <EnquiryModal design={design} onClose={() => setShowEnquiry(false)} />
      )}
    </main>
  );
}

const SpecBox = ({ label, value }) => (
  <div className="p-5 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
    <p className="text-[9px] uppercase tracking-[0.2em] font-bold opacity-40 mb-2">
      {label}
    </p>
    <p className="text-sm font-bold">{value || "Standard"}</p>
  </div>
);
