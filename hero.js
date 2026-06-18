// ===== Desire Group — Motion-driven hero animations =====
// Loaded as an ES module. If the CDN import fails (offline/blocked),
// the inline fallback timer in <head> reveals the hero via CSS.
import { animate, stagger } from "https://cdn.jsdelivr.net/npm/motion@12/+esm";

// Motion is here — cancel the "reveal anyway" fallback.
clearTimeout(window.__motionFallback);

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const els = document.querySelectorAll(".hero .anim");

if (reduce) {
  els.forEach((el) => (el.style.opacity = "1"));
} else {
  // Staggered entrance for header, headline, ring, and scroll cue.
  animate(
    els,
    { opacity: [0, 1], y: [22, 0] },
    { delay: stagger(0.12, { start: 0.1 }), duration: 0.85, easing: [0.22, 1, 0.36, 1] }
  );

  // Slow, continuous rotation of the chrome ring so its reflections shimmer.
  const ring = document.querySelector(".ring");
  if (ring) {
    animate(ring, { rotate: [0, 360] }, { duration: 48, repeat: Infinity, easing: "linear" });
  }
}
