import React from "react";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { useLang } from "../context/LangContext";
import { useTheme } from "../context/ThemeContext";
import { useAdmin } from "../context/AdminContext";
import {
  Menu,
  X,
  Moon,
  Sun,
  Globe,
  MessageCircle,
  LayoutDashboard,
} from "lucide-react";
import AdminLoginModal from "./AdminLoginModal";

export default function Navbar() {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const longPressTimer = useRef(null);
  const { isAdmin } = useAdmin();

  const handleLogoMouseDown = () => {
    longPressTimer.current = setTimeout(() => {
      if (!isAdmin) setShowAdminLogin(true);
    }, 800);
  };
  const handleLogoMouseUp = () => clearTimeout(longPressTimer.current);
  const handleLogoTouchStart = () => {
    longPressTimer.current = setTimeout(() => {
      if (!isAdmin) setShowAdminLogin(true);
    }, 800);
  };
  const handleLogoTouchEnd = () => clearTimeout(longPressTimer.current);

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);
  const { t, lang, toggle: toggleLang } = useLang();
  const { dark, toggle: toggleTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.5 },
    );
  }, []);

  // Close menu on route change & handle body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [open]);

  // Route maarumbothu menu close aaga
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const links = [
    { path: "/", label: t.nav_home },
    { path: "/gallery", label: t.nav_gallery },
    { path: "/services", label: t.nav_services },
    { path: "/about", label: t.nav_about },
    { path: "/contact", label: t.nav_contact },
  ];

  const isActive = (path) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  return (
    <>
      <header
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-[500] transition-all duration-300 ${
          scrolled
            ? "h-[64px] bg-[var(--nav-bg)] shadow-md"
            : "h-[80px] bg-transparent"
        }`}
        style={{
          borderBottom: scrolled
            ? "1px solid var(--border)"
            : "1px solid transparent",
        }}
      >
        <div className="container-xl mx-auto px-4 h-full flex items-center justify-between">
          {/* ── Logo ── */}
          <Link
            to="/"
            className="flex items-center gap-2.5 shrink-0 z-[510]"
            onMouseDown={handleLogoMouseDown}
            onMouseUp={handleLogoMouseUp}
            onMouseLeave={handleLogoMouseUp}
            onTouchStart={handleLogoTouchStart}
            onTouchEnd={handleLogoTouchEnd}
            style={{ userSelect: "none", WebkitUserSelect: "none" }}
          >
            <img
              src="/favicon.svg"
              alt="Om Sakthi Logo"
              style={{ width: 50, height: 50, borderRadius: '50%', display: 'block' }}
            />
            <div className="leading-none">
              <div className="font-display font-semibold text-lg text-gold-gradient">
                Om Sakthi
              </div>
              <div
                className="font-body text-[10px] tracking-widest uppercase opacity-80"
                style={{ color: "var(--text-main)" }}
              >
                Printers
              </div>
            </div>
          </Link>

          {/* ── Desktop Nav Links ── */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link text-sm font-medium transition-colors ${isActive(link.path) ? "text-[var(--gold-light)]" : "text-[var(--text-main)] hover:text-[var(--gold-main)]"}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* ── Right Controls ── */}
          <div className="flex items-center gap-3">
            {/* Desktop Language Toggle */}
            <button
              onClick={toggleLang}
              className="hidden md:flex items-center gap-1.5 text-xs font-bold uppercase text-[var(--text-main)] hover:text-[var(--gold-main)] transition-colors px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--glass)]"
            >
              {lang === "en" ? "தமிழ்" : "EN"}
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-[var(--border)] bg-[var(--glass)] text-[var(--text-main)]"
            >
              {dark ? (
                <Sun size={18} className="text-yellow-400" />
              ) : (
                <Moon size={18} />
              )}
            </button>

            {/* WhatsApp CTA - Hidden on Mobile, Visible on Desktop */}
            <a
              href="https://wa.me/919751135325"
              target="_blank"
              rel="noreferrer"
              className="hidden md:flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-all"
            >
              <MessageCircle size={16} /> WhatsApp
            </a>

            {/* Hamburger for Mobile */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 z-[510] text-[var(--text-main)] focus:outline-none"
            >
              {open ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* ── Mobile Drawer Overlay ── */}
        <div
          className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
          onClick={() => setOpen(false)}
          style={{ zIndex: 501 }}
        />

        {/* ── Mobile Sidebar Drawer ── */}
        <div
          className={`fixed top-0 right-0 h-screen w-[80%] max-w-[300px] bg-[var(--nav-bg)] shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden z-[505] ${open ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex flex-col h-full pt-24 px-6 pb-8">
            <div className="flex flex-col gap-2">
              <p className="text-[10px] uppercase tracking-widest text-[var(--text-main)] opacity-50 mb-2 px-3">
                Navigation
              </p>
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setOpen(false)}
                  className={`text-lg font-medium py-3 px-4 rounded-xl transition-all ${
                    isActive(link.path)
                      ? "bg-[var(--glass-gold)] text-[var(--gold-light)] border-l-4 border-[var(--gold-main)]"
                      : "text-[var(--text-main)]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="mt-auto pt-6 border-t border-[var(--border)] flex flex-col gap-4">
              {/* Language Switch in Mobile Menu */}
              <button
                onClick={() => {
                  toggleLang();
                  setOpen(false);
                }}
                className="flex items-center justify-between w-full p-4 rounded-xl bg-[var(--glass)] border border-[var(--border)] text-sm text-[var(--text-main)]"
              >
                <span className="flex items-center gap-2">
                  <Globe size={18} /> Language
                </span>
                <span className="font-bold text-[var(--gold-main)]">
                  {lang === "en" ? "தமிழ்" : "English"}
                </span>
              </button>

              {/* WhatsApp in Mobile Menu - Optional: Keep or Remove based on preference */}
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full p-4 rounded-xl bg-green-600 text-white font-bold shadow-lg shadow-green-900/20"
              >
                <MessageCircle size={20} /> WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </header>
      {showAdminLogin && (
        <AdminLoginModal onClose={() => setShowAdminLogin(false)} />
      )}
    </>
  );
}
