// ===== Interactive 3D chrome ring (Three.js) =====
// Vanilla-JS equivalent of the React <Interactive3D /> component, embedded
// in the static page. Renders a metallic torus with environment reflections,
// gentle auto-spin, pointer parallax, and drag-to-rotate.
//
// If WebGL or the CDN is unavailable, the import simply fails and the CSS
// fallback ring (.ring-tilt) stays visible — nothing breaks.
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { RoomEnvironment } from "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/environments/RoomEnvironment.js";

const mount = document.getElementById("scene3d");
if (mount && typeof WebGLRenderingContext !== "undefined") {
  try {
    init(mount);
  } catch (err) {
    console.warn("3D ring unavailable, using CSS fallback:", err);
  }
}

function init(mount) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const W = () => mount.clientWidth || 1;
  const H = () => mount.clientHeight || 1;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W(), H());
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  mount.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, W() / H(), 0.1, 100);
  camera.position.set(0, 0, 6.2);

  // Studio environment → realistic chrome reflections (no external HDR needed).
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  // Extra directional definition.
  const key = new THREE.DirectionalLight(0xffffff, 2.0);
  key.position.set(3, 4, 5);
  scene.add(key, new THREE.AmbientLight(0xffffff, 0.25));

  // Chrome torus.
  const torus = new THREE.Mesh(
    new THREE.TorusGeometry(1.25, 0.42, 64, 240),
    new THREE.MeshStandardMaterial({ color: 0xdfe2e6, metalness: 1.0, roughness: 0.16, envMapIntensity: 1.4 })
  );
  scene.add(torus);

  // ---- Interaction state ----
  let autoY = 0.4;          // accumulated auto-spin around Y
  let yOffset = 0;          // pointer parallax (Y)
  let tiltX = 1.0;          // tilt around X (base ~the reference angle)
  let dragging = false, lastX = 0, lastY = 0;

  const hero = document.querySelector(".hero");
  hero.addEventListener("pointermove", (e) => {
    if (dragging) return;
    const r = hero.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    yOffset = nx * 0.6;
    tiltX = 1.0 + ny * 0.5;
  });

  const canvas = renderer.domElement;
  canvas.style.touchAction = "none";
  canvas.addEventListener("pointerdown", (e) => {
    dragging = true; lastX = e.clientX; lastY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener("pointerup", () => (dragging = false));
  canvas.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    autoY += (e.clientX - lastX) * 0.01;
    tiltX += (e.clientY - lastY) * 0.01;
    lastX = e.clientX; lastY = e.clientY;
  });

  window.addEventListener("resize", () => {
    camera.aspect = W() / H();
    camera.updateProjectionMatrix();
    renderer.setSize(W(), H());
  });

  // Hand off from the CSS fallback to the live 3D scene.
  mount.closest(".ring-stage")?.classList.add("three-ready");

  const clock = new THREE.Clock();
  (function loop() {
    requestAnimationFrame(loop);
    const dt = Math.min(clock.getDelta(), 0.05);
    if (!dragging && !reduce) autoY += dt * 0.3;
    torus.rotation.y += (autoY + yOffset - torus.rotation.y) * 0.07;
    torus.rotation.x += (tiltX - torus.rotation.x) * 0.07;
    renderer.render(scene, camera);
  })();
}
