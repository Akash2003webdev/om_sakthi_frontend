import React from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Search, X } from "lucide-react";
import DesignCard from "../components/DesignCard";
import { fetchDesigns, fetchCategories } from "../data";
import { useReveal } from "../hooks/useAnimations";

gsap.registerPlugin(ScrollTrigger);

export default function Gallery() {
  const navigate = useNavigate();
  const [DESIGNS, setDESIGNS] = useState([]);
  const [CATEGORIES, setCATEGORIES] = useState([{ id: "all", label: "All" }]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(12);
  const gridRef = useRef(null);
  const heroRef = useReveal({ y: 24 });

  useEffect(() => {
    fetchDesigns().then((data) => setDESIGNS(data));
    fetchCategories().then((data) => {
      if (data && data.length > 0) setCATEGORIES(data);
    });
  }, []);

  const filtered = DESIGNS.filter((d) => {
    const matchCat = activeCategory === "all" || d.category === activeCategory;
    const matchSearch =
      !search ||
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.id.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  useEffect(() => {
    if (!gridRef.current) return;
    const items = gridRef.current.querySelectorAll(".g-item");
    gsap.fromTo(
      items,
      { opacity: 0, y: 16, scale: 0.98 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.45,
        stagger: 0.045,
        ease: "power2.out",
      },
    );
  }, [activeCategory, search]);

  return (
    <main className="section-bg min-h-screen">
      {/* ── Header ── */}
      <section
        className="relative overflow-hidden"
        style={{
          paddingTop: "7rem",
          paddingBottom: "4rem",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(201,136,16,0.07) 0%, transparent 70%)",
          }}
        />
        <div
          ref={heroRef}
          className="container-xl relative text-center opacity-0"
        >
          <div className="eyebrow mb-5" style={{ display: "inline-flex" }}>
            ✦ Design Collection
          </div>
          <h1 className="heading-xl mb-5">
            Our <span className="text-gold-gradient">Gallery</span>
          </h1>
          <p className="body-lg mx-auto" style={{ maxWidth: "32rem" }}>
            {DESIGNS.length}+ premium designs. Click any card to view details
            and order instantly.
          </p>
        </div>
      </section>

      {/* ── Sticky Filter Bar ── */}
      <div
        className="sticky"
        style={{
          top: "60px",
          zIndex: 50,
          background: "var(--nav-bg)",
          borderBottom: "1px solid var(--border)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <div className="container-xl py-3.5 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Category chips */}
          <div className="flex items-center gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setVisibleCount(12);
                }}
                className={`chip ${activeCategory === cat.id ? "active" : ""}`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="sm:ml-auto flex items-center gap-3">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "var(--text4)", pointerEvents: "none" }}
              />
              <input
                className="form-input pl-9 pr-8"
                style={{
                  width: "13rem",
                  padding: "0.5rem 2rem 0.5rem 2.25rem",
                  fontSize: "0.875rem",
                }}
                placeholder="Search by name or ID…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2"
                  style={{
                    color: "var(--text4)",
                    cursor: "pointer",
                    padding: 0,
                    background: "none",
                    border: "none",
                  }}
                >
                  <X size={13} />
                </button>
              )}
            </div>
            <span
              className="font-body text-xs whitespace-nowrap"
              style={{ color: "var(--text4)" }}
            >
              {filtered.length} results
            </span>
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      <div
        className="container-xl"
        style={{ paddingTop: "3rem", paddingBottom: "3rem" }}
      >
        {filtered.length === 0 ? (
          <div
            className="text-center"
            style={{ paddingTop: "5rem", paddingBottom: "5rem" }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
            <h3 className="heading-sm mb-2">No designs found</h3>
            <p className="body-sm mb-6">
              Try a different search term or category
            </p>
            <button
              onClick={() => {
                setSearch("");
                setActiveCategory("all");
              }}
              className="btn btn-secondary btn-sm"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div
              ref={gridRef}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5"
            >
              {filtered.slice(0, visibleCount).map((design) => (
                <div key={design.id} className="g-item">
                  <DesignCard
                    design={design}
                    onClick={(d) => navigate(`/design/${d.id}`)}
                  />
                </div>
              ))}
            </div>

            {visibleCount < filtered.length && (
              <div className="text-center mt-12">
                <button
                  onClick={() => setVisibleCount((v) => v + 8)}
                  className="btn btn-secondary btn-lg"
                >
                  Load More Designs
                </button>
                <p className="body-sm mt-3">
                  Showing {Math.min(visibleCount, filtered.length)} of{" "}
                  {filtered.length} designs
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Custom Design CTA ── */}
      <div style={{ borderTop: "1px solid var(--border)" }}>
        <div
          className="container-xl"
          style={{ paddingTop: "3.5rem", paddingBottom: "3.5rem" }}
        >
          <div
            className="card-flat text-center"
            style={{ maxWidth: "36rem", margin: "0 auto", padding: "2.5rem" }}
          >
            <p
              className="font-accent text-lg italic mb-2"
              style={{ color: "var(--text3)" }}
            >
              "Don't see what you're looking for?"
            </p>
            <h3 className="heading-md mb-5">
              Request a{" "}
              <span className="text-gold-gradient">Custom Design</span>
            </h3>
            <a
              href={`https://wa.me/919876543210?text=${encodeURIComponent("Hi, I need a custom design. Can you help me create one?")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Request Custom Design
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
