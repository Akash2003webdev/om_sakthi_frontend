import React from "react";
import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Phone, MapPin, Mail, Clock, CheckCircle } from "lucide-react";
import { submitEnquiry } from "../api";
import { sendEnquiryEmail } from "../utils/email";
import { SHOP_PHONE, SHOP_ADDRESS, WHATSAPP_NUMBER } from "../data";
import { useReveal } from "../hooks/useAnimations";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [status, setStatus] = useState("idle");
  const heroRef = useReveal({ y: 30 });
  const formRef = useRef(null);
  const infoRef = useRef(null);

  useEffect(() => {
    [formRef, infoRef].forEach((ref, i) => {
      if (!ref.current) return;
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          delay: i * 0.15,
          scrollTrigger: { trigger: ref.current, start: "top 82%", once: true },
        },
      );
    });
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await submitEnquiry({ ...form, designId: "General Enquiry" });
      try {
        await sendEnquiryEmail({ ...form, designId: "General Enquiry" });
      } catch (_) {}
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

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
            <span>✦</span> Reach Us
          </div>
          <h1 className="heading-xl mb-5" style={{ color: "var(--text)" }}>
            Get in <span className="text-gold-gradient">Touch</span>
          </h1>
          <p
            className="font-body text-lg max-w-xl mx-auto"
            style={{ color: "var(--text3)" }}
          >
            Reach out via WhatsApp, call us, or fill the form below. We respond
            within 24 hours.
          </p>
        </div>
      </section>

      <section className="container-xl section-pad">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
          {/* Info */}
          <div ref={infoRef} className="opacity-0 flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href={`tel:${SHOP_PHONE}`}
                className="glass-gold p-6 group transition-all"
              >
                <div
                  className="w-10 h-10 flex items-center justify-center mb-4 text-gold-400 transition-all"
                  style={{ border: "1px solid rgba(201,136,16,0.2)" }}
                >
                  <Phone size={18} />
                </div>
                <div
                  className="font-body text-xs tracking-widest uppercase mb-1"
                  style={{ color: "var(--text4)" }}
                >
                  Call Us
                </div>
                <div
                  className="font-display text-base transition-colors"
                  style={{ color: "var(--text)" }}
                >
                  {SHOP_PHONE}
                </div>
              </a>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-6 group transition-all"
                style={{
                  background: "rgba(37,211,102,0.06)",
                  border: "1px solid rgba(37,211,102,0.15)",
                }}
              >
                <div
                  className="w-10 h-10 flex items-center justify-center mb-4 transition-all"
                  style={{
                    color: "#25D366",
                    border: "1px solid rgba(37,211,102,0.3)",
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.122.553 4.107 1.518 5.832L.057 23.743a.5.5 0 00.609.637l6.163-1.615A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.88 0-3.654-.493-5.193-1.358l-.372-.215-3.859 1.011 1.032-3.754-.238-.386A9.951 9.951 0 012 12c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10z" />
                  </svg>
                </div>
                <div
                  className="font-body text-xs tracking-widest uppercase mb-1"
                  style={{ color: "var(--text4)" }}
                >
                  WhatsApp
                </div>
                <div
                  className="font-display text-base"
                  style={{ color: "#25D366" }}
                >
                  Chat Now →
                </div>
              </a>
            </div>

            <div className="glass p-6">
              <div className="flex items-start gap-4">
                <MapPin size={18} className="text-gold-400 shrink-0 mt-1" />
                <div>
                  <div
                    className="font-body text-xs tracking-widest uppercase mb-1"
                    style={{ color: "var(--text4)" }}
                  >
                    Find Us
                  </div>
                  <div
                    className="font-body text-sm leading-relaxed"
                    style={{ color: "var(--text2)" }}
                  >
                    {SHOP_ADDRESS}
                  </div>
                </div>
              </div>
            </div>

            <div className="glass p-6">
              <div className="flex items-start gap-4">
                <Clock size={18} className="text-gold-400 shrink-0 mt-1" />
                <div className="w-full">
                  <div
                    className="font-body text-xs tracking-widest uppercase mb-2"
                    style={{ color: "var(--text4)" }}
                  >
                    Working Hours
                  </div>
                  {[
                    { day: "Mon – Sat", time: "9:00 AM – 8:00 PM" },
                    { day: "Sunday", time: "10:00 AM – 2:00 PM" },
                  ].map((h, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between font-body text-sm py-1"
                    >
                      <span style={{ color: "var(--text3)" }}>{h.day}</span>
                      <span style={{ color: "#e4a420" }}>{h.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div
              className="overflow-hidden"
              style={{ height: "240px", border: "1px solid var(--border)" }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3936.797422500543!2d77.91814057450193!3d9.351186783863525!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b06cb029d303019%3A0xe74dc120f87935bb!2sOm%20sakthi%20printers!5e0!3m2!1sen!2sus!4v1776067387786!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  filter: "invert(90%) hue-rotate(180deg) saturate(0.8)",
                }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Location"
              />
            </div>
          </div>

          {/* Form */}
          <div ref={formRef} className="opacity-0">
            <div className="mb-8">
              <h2
                className="font-display text-3xl mb-2"
                style={{ color: "var(--text)" }}
              >
                Send an Enquiry
              </h2>
              <p
                className="font-body text-sm"
                style={{ color: "var(--text4)" }}
              >
                We'll respond within 24 hours.
              </p>
            </div>

            {status === "success" ? (
              <div className="flex flex-col items-center gap-4 py-16 text-center glass-gold p-8">
                <CheckCircle size={48} className="text-gold-400" />
                <h3
                  className="font-display text-2xl"
                  style={{ color: "var(--text)" }}
                >
                  Message Received!
                </h3>
                <p
                  className="font-body text-sm max-w-xs"
                  style={{ color: "var(--text3)" }}
                >
                  Our team will contact you within 24 hours. For faster
                  response, message on WhatsApp.
                </p>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold mt-2"
                >
                  <span>Open WhatsApp</span>
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label
                    className="block text-xs tracking-widest uppercase mb-2 font-body"
                    style={{ color: "var(--text4)" }}
                  >
                    Full Name *
                  </label>
                  <input
                    className="form-input"
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label
                    className="block text-xs tracking-widest uppercase mb-2 font-body"
                    style={{ color: "var(--text4)" }}
                  >
                    Phone Number *
                  </label>
                  <input
                    className="form-input"
                    placeholder="+91 98765 43210"
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label
                    className="block text-xs tracking-widest uppercase mb-2 font-body"
                    style={{ color: "var(--text4)" }}
                  >
                    Message *
                  </label>
                  <textarea
                    className="form-input resize-none"
                    rows={5}
                    placeholder="What can we help you with? (type of print, quantity, deadline...)"
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    required
                  />
                </div>
                {status === "error" && (
                  <p className="text-red-400 text-sm font-body">
                    Something went wrong. Please WhatsApp us directly.
                  </p>
                )}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="btn-gold w-full"
                >
                  <span>
                    {status === "loading" ? "Sending..." : "Send Message"}
                  </span>
                </button>
                <p
                  className="font-body text-xs text-center"
                  style={{ color: "var(--text4)" }}
                >
                  Or WhatsApp us directly for instant response
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
