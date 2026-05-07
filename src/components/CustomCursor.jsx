import React from "react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ring1Ref = useRef(null);
  const ring2Ref = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring1 = ring1Ref.current;
    const ring2 = ring2Ref.current;
    if (!dot || !ring1 || !ring2) return;

    let mouseX = window.innerWidth / 8;
    let mouseY = window.innerHeight / 8;
    let r1X = mouseX,
      r1Y = mouseY;
    let r2X = mouseX,
      r2Y = mouseY;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.set(dot, { x: mouseX - 4, y: mouseY - 4 });
    };

    const loop = () => {
      r1X += (mouseX - r1X) * 0.18;
      r1Y += (mouseY - r1Y) * 0.18;
      r2X += (mouseX - r2X) * 0.08;
      r2Y += (mouseY - r2Y) * 0.08;
      gsap.set(ring1, { x: r1X - 14, y: r1Y - 14 });
      gsap.set(ring2, { x: r2X - 22, y: r2Y - 22 });
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    const onEnter = (e) => {
      const isInteractive =
        e.target.tagName === "BUTTON" ||
        e.target.closest("button") ||
        e.target.tagName === "A" ||
        e.target.closest("a");
      if (isInteractive) {
        gsap.to(ring1, {
          scale: 1.7,
          opacity: 0.9,
          duration: 0.3,
          ease: "power2.out",
        });
        gsap.to(ring2, {
          scale: 1.5,
          opacity: 0.5,
          duration: 0.4,
          ease: "power2.out",
        });
        gsap.to(dot, { scale: 0, opacity: 0, duration: 0.2 });
      }
    };
    const onLeave = () => {
      gsap.to(ring1, {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
      });
      gsap.to(ring2, {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      });
      gsap.to(dot, { scale: 1, opacity: 1, duration: 0.2 });
    };

    const attachListeners = () => {
      document.querySelectorAll('a, button, [role="button"]').forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
    };
    attachListeners();

    const observer = new MutationObserver(attachListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener("mousemove", onMove);
    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* Gold dot — snaps to cursor */}
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 15,
          height: 15,
          borderRadius: "50%",
          background: "var(--gold, #c98810)",
          pointerEvents: "none",
          zIndex: 99999,
          willChange: "transform",
        }}
      />

      {/* Inner ring — faster lag */}
      <div
        ref={ring1Ref}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 33,
          height: 33,
          borderRadius: "50%",
          border: "1.5px solid rgba(201,136,16,0.85)",
          pointerEvents: "none",
          zIndex: 99998,
          willChange: "transform",
          background: "transparent",
        }}
      />

      {/* Outer ring — slower lag */}
      <div
        ref={ring2Ref}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 49,
          height: 49,
          borderRadius: "50%",
          border: "1px solid rgba(201,136,16,0.35)",
          pointerEvents: "none",
          zIndex: 99997,
          willChange: "transform",
          background: "transparent",
        }}
      />
    </>
  );
}
