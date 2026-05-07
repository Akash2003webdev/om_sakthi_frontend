import React from "react";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import EnquiryModal from "../components/EnquiryModal";
import { useReveal } from "../hooks/useAnimations";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useLang } from "../context/LangContext";

gsap.registerPlugin(ScrollTrigger);

export default function Services() {
  const { t } = useLang();
  const [showEnquiry, setShowEnquiry] = useState(false);
  const heroRef = useReveal({ y: 30 });
  const cardsRef = useRef(null);

  const FULL_SERVICES = [
    {
      id: "wedding",
      icon: "💍",
      title: "Wedding Card Printing",
      subtitle: "Make your big day unforgettable",
      description:
        "Our wedding cards are crafted with the finest materials and most exquisite designs. From traditional Tamil wedding motifs to modern minimalist styles, we bring your vision to life with stunning precision.",
      features: [
        "UV spot printing & foil stamping",
        "Embossing & debossing effects",
        "Matte, glossy & texture finishes",
        "Envelope & insert printing",
        "Bulk orders from 100 pcs",
        "3–5 day delivery",
      ],
      image: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQpo0WNONFWSn-YGp0eHh-L4Z5szNI2k00yvowq10_CFGGqh8ja70PAyRnZ6ezU5GGu9kvelfVe7Pl6sdNKROIdy3D4eOGnmaoarRiWx3fFa9ojSqSm4uE1xQ",
      popular: true,
    },
    {
      id: "visiting",
      icon: "🪪",
      title: "Visiting Cards",
      subtitle: "First impressions that last",
      description:
        "Premium business cards that make you stand out. We offer a wide range of finishes and materials including standard, thick, and luxury options to match your brand personality.",
      features: [
        "Standard & premium card stock",
        "Matte, gloss & silk lamination",
        "Spot UV & holographic foil",
        "Rounded corners available",
        "Both sides printing",
        "Quick turnaround 1–2 days",
      ],
      image: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcT3-8DModzmNqg1Cd59RHP86dB2cv-yaldQTE8iHUWfF_XxTEtCD10tMQoiL8kt3GjNnfkRs1Xs1SmvmW3nA_9mlqlKHTWF2InWeVV3Ppo",
      popular: false,
    },
    {
      id: "banner",
      icon: "🖼️",
      title: "Flex & Banner Printing",
      subtitle: "Make your brand visible",
      description:
        "High-resolution outdoor and indoor banners printed on premium flex material. Weather-resistant and vibrant — perfect for shop fronts, events, political campaigns, and festivals.",
      features: [
        "Outdoor & indoor flex material",
        "Any custom size available",
        "Weather-resistant inks",
        "Metal eyelet finishing",
        "High-res photo quality print",
        "Same-day printing available",
      ],
      image: "https://karkitechs.com/wp-content/uploads/2025/05/karkitechs.com_wedding_flex_1.webp",
      popular: false,
    },
    {
      id: "custom",
      icon: "🎨",
      title: "Custom Design Services",
      subtitle: "Your imagination, our expertise",
      description:
        "Our in-house design team creates custom artwork from scratch. Logos, brochures, flyers, menus, certificates, posters — we handle all your graphic design needs.",
      features: [
        "Logo design & branding",
        "Brochure & flyer design",
        "Menu cards & certificates",
        "Free design consultation",
        "Unlimited revisions",
        "Print-ready file delivery",
      ],
      image: "https://5.imimg.com/data5/SELLER/Default/2026/1/579227283/BU/MJ/HK/215787450/offset-printing-service.png",
      popular: false,
    },
  ];

  useEffect(() => {
    if (!cardsRef.current) return;
    const cards = cardsRef.current.querySelectorAll(".service-card");
    cards.forEach((card, i) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 60 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
          delay: i % 2 === 0 ? 0 : 0.15,
          scrollTrigger: { trigger: card, start: "top 85%", once: true },
        },
      );
    });
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <main className="section-bg min-h-screen">
      <section className="relative section-pad overflow-hidden" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at top center, rgba(201,136,16,0.07) 0%, transparent 60%)" }} />
        <div ref={heroRef} className="relative max-w-4xl mx-auto text-center px-6 opacity-0">
          <div className="eyebrow mb-5" style={{ display: "inline-flex" }}>
            <span>✦</span> {t.svc_page_eyebrow}
          </div>
          <h1 className="heading-xl mb-5" style={{ color: "var(--text)" }}>
            {t.svc_page_heading.split(" ").map((w, i, arr) =>
              i === arr.length - 1
                ? <span key={i} className="text-gold-gradient">{w}</span>
                : <span key={i}>{w} </span>
            )}
          </h1>
          <p className="font-body text-lg max-w-xl mx-auto leading-relaxed" style={{ color: "var(--text3)" }}>
            {t.svc_page_sub}
          </p>
        </div>
      </section>

      <section className="container-xl section-pad" ref={cardsRef}>
        <div className="flex flex-col gap-24">
          {FULL_SERVICES.map((svc, i) => (
            <div key={svc.id} className={`service-card grid grid-cols-1 md:grid-cols-2 gap-12 items-center`}>
              <div className={`relative overflow-hidden aspect-[4/3] ${i % 2 === 1 ? "md:order-2" : ""}`}>
                <img src={svc.image} alt={svc.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0"
                  style={{ background: "linear-gradient(to top right, rgba(0,0,0,0.3), transparent)" }} />
                {svc.popular && (
                  <div className="absolute top-4 left-4 px-3 py-1.5 text-xs tracking-widest uppercase font-body font-semibold"
                    style={{ background: "rgba(201,136,16,0.9)", color: "#0a0705" }}>
                    {t.svc_most_popular}
                  </div>
                )}
                <div className="absolute bottom-4 right-4 w-12 h-12"
                  style={{ borderRight: "1px solid rgba(201,136,16,0.3)", borderBottom: "1px solid rgba(201,136,16,0.3)" }} />
              </div>

              <div className={i % 2 === 1 ? "md:order-1" : ""}>
                <div className="text-5xl mb-5">{svc.icon}</div>
                <div className="font-accent text-xs tracking-[0.3em] uppercase mb-3"
                  style={{ color: "rgba(201,136,16,0.6)" }}>
                  {svc.subtitle}
                </div>
                <h2 className="heading-lg mb-4" style={{ color: "var(--text)" }}>{svc.title}</h2>
                <p className="font-body text-base leading-relaxed mb-7" style={{ color: "var(--text3)" }}>
                  {svc.description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8">
                  {svc.features.map((f, fi) => (
                    <div key={fi} className="flex items-center gap-2.5">
                      <CheckCircle size={13} style={{ color: "rgba(201,136,16,0.7)" }} className="shrink-0" />
                      <span className="font-body text-sm" style={{ color: "var(--text3)" }}>{f}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 flex-wrap">
                  <button onClick={() => setShowEnquiry(true)} className="btn-gold flex items-center gap-2">
                    <span>{t.svc_enquire}</span>
                    <ArrowRight size={13} />
                  </button>
                  <a
                    href={`https://wa.me/919751135325?text=${encodeURIComponent(`Hi, I'm interested in ${svc.title}. Can you help?`)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="btn-outline flex items-center gap-2"
                  >
                    <span>{t.svc_whatsapp}</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="section-pad" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="container-xl">
          <div className="text-center mb-16">
            <div className="eyebrow mb-5" style={{ display: "inline-flex" }}>
              <span>✦</span> {t.svc_process_eyebrow}
            </div>
            <h2 className="heading-lg" style={{ color: "var(--text)" }}>{t.svc_process_heading}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { num: "01", title: t.svc_step1_title, desc: t.svc_step1_desc },
              { num: "02", title: t.svc_step2_title, desc: t.svc_step2_desc },
              { num: "03", title: t.svc_step3_title, desc: t.svc_step3_desc },
              { num: "04", title: t.svc_step4_title, desc: t.svc_step4_desc },
            ].map((step, i) => (
              <div key={i} className="text-center relative">
                {i < 3 && (
                  <div className="hidden md:block absolute top-6 left-[60%] w-[80%] h-px"
                    style={{ background: "linear-gradient(90deg, rgba(201,136,16,0.3), transparent)" }} />
                )}
                <div className="w-14 h-14 flex items-center justify-center mx-auto mb-4"
                  style={{ border: "1px solid rgba(201,136,16,0.2)", background: "var(--glass-gold)" }}>
                  <span className="font-display text-lg font-semibold" style={{ color: "rgba(201,136,16,0.7)" }}>
                    {step.num}
                  </span>
                </div>
                <h3 className="font-display text-base mb-2" style={{ color: "var(--text2)" }}>{step.title}</h3>
                <p className="font-body text-xs leading-relaxed" style={{ color: "var(--text3)" }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {showEnquiry && <EnquiryModal design={null} onClose={() => setShowEnquiry(false)} />}
    </main>
  );
}
