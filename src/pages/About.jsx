import React from "react";
import { useReveal, useStagger } from "../hooks/useAnimations";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Shield, Award, Heart, Leaf } from "lucide-react";
import { useLang } from "../context/LangContext";

gsap.registerPlugin(ScrollTrigger);

const TESTIMONIALS = [
  {
    name: "Priya Sundaram",
    role: "Wedding Client",
    text: "The wedding cards were absolutely stunning. Every guest was asking where we got them printed!",
    stars: 5,
  },
  {
    name: "Rajan Business Centre",
    role: "Corporate Client",
    text: "We've been ordering visiting cards for 3 years. Quality is consistent and delivery is always on time.",
    stars: 5,
  },
  {
    name: "Murugan Traders",
    role: "Banner Client",
    text: "Great quality flex banners at very reasonable rates. Colours are vibrant even after months outdoor.",
    stars: 5,
  },
];

export default function About() {
  const { t } = useLang();
  const heroRef = useReveal({ y: 30 });
  const storyRef = useRef(null);
  const valuesRef = useStagger(".val-item");

  const VALUES = [
    {
      icon: <Shield size={20} />,
      title: t.about_val1_title,
      desc: t.about_val1_desc,
    },
    {
      icon: <Award size={20} />,
      title: t.about_val2_title,
      desc: t.about_val2_desc,
    },
    {
      icon: <Heart size={20} />,
      title: t.about_val3_title,
      desc: t.about_val3_desc,
    },
    {
      icon: <Leaf size={20} />,
      title: t.about_val4_title,
      desc: t.about_val4_desc,
    },
  ];

  useEffect(() => {
    if (!storyRef.current) return;
    gsap.fromTo(
      storyRef.current,
      { opacity: 0, x: 40 },
      {
        opacity: 1,
        x: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: storyRef.current,
          start: "top 80%",
          once: true,
        },
      },
    );
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <main className="section-bg min-h-screen">
      <section
        className="relative section-pad overflow-hidden"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at top center, rgba(201,136,16,0.07) 0%, transparent 60%)",
          }}
        />
        <div
          ref={heroRef}
          className="relative max-w-4xl mx-auto text-center px-6 opacity-0"
        >
          <div className="eyebrow mb-5" style={{ display: "inline-flex" }}>
            <span>✦</span> {t.about_eyebrow}
          </div>
          <h1 className="heading-xl mb-5" style={{ color: "var(--text)" }}>
            {t.about_heading1}{" "}
            <span className="text-gold-gradient">{t.about_heading2}</span>
          </h1>
          <p
            className="font-body text-lg max-w-xl mx-auto"
            style={{ color: "var(--text3)" }}
          >
            {t.about_sub}
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="section-pad">
        <div className="container-xl grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative h-[480px]">
            <div className="absolute top-0 left-0 w-[65%] h-[70%] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80"
                alt="Printing press"
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className="absolute bottom-0 right-0 w-[55%] h-[60%] overflow-hidden"
              style={{ border: "4px solid var(--bg)" }}
            >
              <img
                src="https://images.unsplash.com/photo-1626785774573-4b799315345d?w=500&q=80"
                alt="Design work"
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className="absolute top-1/2 right-6 -translate-y-1/2 w-24 h-24 flex flex-col items-center justify-center z-10"
              style={{
                background: "var(--surface)",
                border: "1px solid rgba(201,136,16,0.3)",
              }}
            >
              <span
                className="font-display text-2xl font-bold"
                style={{ color: "#e4a420" }}
              >
                18+
              </span>
              <span
                className="font-body text-xs tracking-widest uppercase"
                style={{ color: "var(--text4)" }}
              >
                {t.about_stat3}
              </span>
            </div>
            <div
              className="absolute -bottom-3 -left-3 w-16 h-16"
              style={{
                borderLeft: "1px solid rgba(201,136,16,0.2)",
                borderBottom: "1px solid rgba(201,136,16,0.2)",
              }}
            />
          </div>

          <div ref={storyRef} className="opacity-0">
            <div
              className="font-accent text-xs tracking-[0.4em] uppercase mb-4"
              style={{ color: "rgba(201,136,16,0.6)" }}
            >
              {t.about_est}
            </div>
            <h2
              className="font-display text-4xl font-semibold mb-6 leading-tight"
              style={{ color: "var(--text)" }}
            >
              {t.about_story_heading1}
              <br />
              <span className="text-gold-gradient">
                {t.about_story_heading2}
              </span>
            </h2>
            <div
              className="space-y-4 font-body text-base leading-relaxed"
              style={{ color: "var(--text3)" }}
            >
              <p>{t.about_p1}</p>
              <p>{t.about_p2}</p>
              <p>{t.about_p3}</p>
            </div>
            <div
              className="grid grid-cols-3 gap-6 mt-8 pt-8"
              style={{ borderTop: "1px solid var(--border)" }}
            >
              {[
                { num: "5000+", label: t.about_stat1 },
                { num: "200+", label: t.about_stat2 },
                { num: "18+", label: t.about_stat3 },
              ].map((stat, i) => (
                <div key={i}>
                  <div
                    className="font-display text-2xl font-bold mb-1"
                    style={{ color: "#e4a420" }}
                  >
                    {stat.num}
                  </div>
                  <div
                    className="font-body text-xs tracking-wide"
                    style={{ color: "var(--text4)" }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section
        className="section-pad"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <div className="container-xl">
          <div className="text-center mb-14">
            <div className="eyebrow mb-5" style={{ display: "inline-flex" }}>
              <span>✦</span> {t.about_values_eyebrow}
            </div>
            <h2 className="heading-lg" style={{ color: "var(--text)" }}>
              {t.about_values_heading}
            </h2>
          </div>
          <div
            ref={valuesRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {VALUES.map((val, i) => (
              <div key={i} className="val-item glass-gold p-7 group">
                <div
                  className="w-11 h-11 flex items-center justify-center mb-5 transition-all group-hover:border-gold-400/60"
                  style={{
                    border: "1px solid rgba(201,136,16,0.2)",
                    color: "var(--gold)",
                  }}
                >
                  {val.icon}
                </div>
                <h3
                  className="font-display text-lg mb-2"
                  style={{ color: "var(--text)" }}
                >
                  {val.title}
                </h3>
                <p
                  className="font-body text-sm leading-relaxed"
                  style={{ color: "var(--text3)" }}
                >
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        className="section-pad"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <div className="container-xl">
          <div className="text-center mb-14">
            <div className="eyebrow mb-5" style={{ display: "inline-flex" }}>
              <span>✦</span> {t.about_testi_eyebrow}
            </div>
            <h2 className="heading-lg" style={{ color: "var(--text)" }}>
              {t.about_testi_heading}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((item, i) => (
              <div key={i} className="glass p-7">
                <div className="flex gap-0.5 mb-4">
                  {Array(item.stars)
                    .fill(0)
                    .map((_, si) => (
                      <span
                        key={si}
                        style={{ color: "var(--gold)" }}
                        className="text-sm"
                      >
                        ★
                      </span>
                    ))}
                </div>
                <p
                  className="font-accent text-base leading-relaxed italic mb-5"
                  style={{ color: "var(--text3)" }}
                >
                  "{item.text}"
                </p>
                <div>
                  <div
                    className="font-body text-sm font-medium"
                    style={{ color: "var(--text2)" }}
                  >
                    {item.name}
                  </div>
                  <div
                    className="font-body text-xs"
                    style={{ color: "var(--text4)" }}
                  >
                    {item.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
