"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "@/context/ThemeContext";
import { usePathname } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

/* ─── Atmosphere glow shaders ─────────────────────────────────── */
const atmVert = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const atmFrag = `
  varying vec3 vNormal;
  uniform vec3 uColor;
  void main() {
    float intensity = pow(0.72 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.5);
    gl_FragColor = vec4(uColor * intensity, intensity * 0.85);
  }
`;

export default function ThreeCanvas() {
  const { theme } = useTheme();
  const pathname = usePathname();
  const canvasRef  = useRef(null);
  const themeRef   = useRef(theme);

  // Keep themeRef in sync so the animation loop reads latest theme
  useEffect(() => { themeRef.current = theme; }, [theme]);

  useEffect(() => {
    if (pathname !== "/") return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    /* ── Renderer ─────────────────────────────────────────────── */
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,          // transparent background
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    renderer.setClearColor(0x000000, 0);  // fully transparent

    /* ── Scene / Camera ───────────────────────────────────────── */
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 4.8);

    /* ── Lighting ─────────────────────────────────────────────── */
    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xffffff, 2.8);
    sun.position.set(5, 3, 5);
    scene.add(sun);

    const backLight = new THREE.DirectionalLight(0xff4400, 0.7);
    backLight.position.set(-5, -2, -4);
    scene.add(backLight);

    /* ── Textures ─────────────────────────────────────────────── */
    const loader  = new THREE.TextureLoader();
    loader.crossOrigin = "anonymous";

    const dayMap    = loader.load("https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg");
    const nightMap  = loader.load("https://unpkg.com/three-globe/example/img/earth-night.jpg");
    const bumpMap   = loader.load("https://unpkg.com/three-globe/example/img/earth-topology.png");

    /* ── Earth pivot group (handles drag / scroll offset) ─────── */
    const pivot = new THREE.Group();
    pivot.rotation.y = 0;       // no initial pivot Y rotation
    pivot.rotation.x = 0.35;   // slight upward tilt for latitude
    pivot.position.x = 2.8;    // fully right side
    scene.add(pivot);

    /* ── Earth sphere ─────────────────────────────────────────── */
    const earthGeo = new THREE.SphereGeometry(1, 64, 64);
    const earthMat = new THREE.MeshStandardMaterial({
      map:         dayMap,
      bumpMap:     bumpMap,
      bumpScale:   0.05,
      roughness:   0.55,
      metalness:   0.05,
      transparent: true,
      opacity:     0.5,    // semi-transparent globe
    });
    const earth = new THREE.Mesh(earthGeo, earthMat);
    // Correct rotation to put India (lon≈79°E) facing the camera.
    // Derived from Three.js vertex formula: India's local z = sin(azimuth)*sin(polar) ≈ -0.906
    // Need rotation.y = -2.947 so world_z = -x*sin(r)+z*cos(r) becomes +0.92 (facing +Z)
    earth.rotation.y = -2.947;
    pivot.add(earth);

    /* Clouds removed per user request */

    /* ── Atmosphere glow ──────────────────────────────────────── */
    const atmGeo = new THREE.SphereGeometry(1.08, 64, 64);
    const atmMat = new THREE.ShaderMaterial({
      vertexShader:   atmVert,
      fragmentShader: atmFrag,
      uniforms: {
        uColor: { value: new THREE.Color(0x2e80ff) },
      },
      blending:    THREE.AdditiveBlending,
      side:        THREE.BackSide,
      transparent: true,
      depthWrite:  false,
    });
    const atmosphere = new THREE.Mesh(atmGeo, atmMat);
    pivot.add(atmosphere);

    /* ── India location pin ───────────────────────────────────── */
    const lat = 22.5937, lon = 78.9629, r = 1.025;
    // THREE.js SphereGeometry vertex formula:
    //   x = -cos(phiAzimuthal) * sin(thetaPolar)
    //   y =  cos(thetaPolar)
    //   z =  sin(phiAzimuthal) * sin(thetaPolar)
    // where thetaPolar = (90-lat)*π/180, phiAzimuthal = (lon+180)*π/180
    const thetaPolar    = (90 - lat) * (Math.PI / 180);   // colatitude
    const phiAzimuthal  = (lon + 180) * (Math.PI / 180);  // longitude offset
    const px = -(r * Math.cos(phiAzimuthal) * Math.sin(thetaPolar));  // CORRECT
    const py =   r * Math.cos(thetaPolar);
    const pz =   r * Math.sin(phiAzimuthal) * Math.sin(thetaPolar);   // CORRECT

    // Outward normal direction (from earth center toward surface point)
    const normal = new THREE.Vector3(px, py, pz).normalize();

    // ── Pin group — all children rotate with the earth ─────────
    const pinGroup = new THREE.Group();
    earth.add(pinGroup);

    // 1. Glowing dot on surface
    const pinDot = new THREE.Mesh(
      new THREE.SphereGeometry(0.025, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xc19c5c })
    );
    pinDot.position.set(px, py, pz);
    pinGroup.add(pinDot);

    // 2. Thin vertical spike rising above surface (height: 0.08 units)
    const spikeHeight = 0.08;
    const spikeMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.004, 0.004, spikeHeight, 8),
      new THREE.MeshBasicMaterial({ color: 0xc19c5c })
    );
    // Position spike center halfway along the outward normal
    spikeMesh.position.set(
      px + normal.x * spikeHeight * 0.5,
      py + normal.y * spikeHeight * 0.5,
      pz + normal.z * spikeHeight * 0.5
    );
    // Align spike cylinder with the outward normal
    spikeMesh.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0), // cylinder default axis
      normal
    );
    pinGroup.add(spikeMesh);

    // 3. Pulsing ring — oriented perpendicular to the outward normal
    const ringGeo = new THREE.RingGeometry(0.025, 0.07, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xc19c5c,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.set(px, py, pz);
    // Align ring plane to be perpendicular to the outward normal
    ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
    pinGroup.add(ring);


    /* ── Intro spin-down animation ────────────────────────────── */
    // spinSpeed starts fast and decelerates to a gentle idle
    const spin = { speed: 0.035 };
    gsap.to(spin, {
      speed: 0.0018,
      duration: 3.5,
      ease: "power2.out",
      delay: 0.3,
    });

    /* ── Drag-to-rotate — only active at home (scrollY < 60) ──── */
    let isDragging = false;
    let prevX = 0, prevY = 0;
    const velocity = { x: 0, y: 0 };

    // Helper: drag allowed only when page is not scrolled
    const dragAllowed = () => window.scrollY < 60;

    const onPointerDown = (e) => {
      if (!dragAllowed()) return;
      isDragging = true;
      prevX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
      prevY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
      velocity.x = 0;
      velocity.y = 0;
      canvas.style.cursor = "grabbing";
    };
    const onPointerMove = (e) => {
      if (!isDragging) return;
      const cx = e.clientX ?? e.touches?.[0]?.clientX ?? prevX;
      const cy = e.clientY ?? e.touches?.[0]?.clientY ?? prevY;
      const dx = cx - prevX;
      const dy = cy - prevY;
      pivot.rotation.y += dx * 0.006;
      pivot.rotation.x += dy * 0.006;
      pivot.rotation.x = Math.max(-1.2, Math.min(1.2, pivot.rotation.x));
      velocity.x = dx * 0.006;
      velocity.y = dy * 0.006;
      prevX = cx;
      prevY = cy;
    };
    const onPointerUp = () => {
      isDragging = false;
      canvas.style.cursor = dragAllowed() ? "grab" : "default";
    };

    // Update cursor style on scroll
    const onScroll = () => {
      if (isDragging) { isDragging = false; velocity.x = 0; velocity.y = 0; }
      canvas.style.cursor = dragAllowed() ? "grab" : "default";
    };

    // All events on window — bypasses z-index stacking of main content
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup",   onPointerUp);
    window.addEventListener("touchstart",  onPointerDown, { passive: true });
    window.addEventListener("touchmove",   onPointerMove, { passive: true });
    window.addEventListener("touchend",    onPointerUp);
    window.addEventListener("scroll",      onScroll, { passive: true });

    /* ── GSAP scroll-driven repositioning ─────────────────────── */
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: "body", start: "top top", end: "bottom bottom", scrub: 1.4,
      },
    });
    scrollTl
      .to(pivot.position, { x: 2.5, y: -0.2, duration: 1 })
      .to(pivot.scale,    { x: 0.65, y: 0.65, z: 0.65, duration: 1 }, "<")
      .to(pivot.position, { x: -1.5, y: -0.3, duration: 1 })
      .to(pivot.scale,    { x: 0.78, y: 0.78, z: 0.78, duration: 1 }, "<")
      .to(pivot.position, { x: 0.0, y: 0.2, duration: 1 })
      .to(pivot.scale,    { x: 0.48, y: 0.48, z: 0.48, duration: 1 }, "<");

    /* ── Resize handler ───────────────────────────────────────── */
    const onResize = () => {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    /* ── Animation loop ───────────────────────────────────────── */
    let rafId;
    let ringPulse = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const dt = clock.getDelta();

      // Switch texture based on theme
      const activeMap = themeRef.current === "dark" ? nightMap : dayMap;
      if (earthMat.map !== activeMap) {
        earthMat.map = activeMap;
        earthMat.needsUpdate = true;
        earthMat.roughness = themeRef.current === "dark" ? 0.4 : 0.55;
      }

      // Atmosphere color based on theme
      const atmColor = themeRef.current === "dark" ? 0x1a6fe8 : 0x4a8ef0;
      atmMat.uniforms.uColor.value.set(atmColor);

      // Auto spin on the EARTH mesh (keeps drag-via-pivot separate)
      if (!isDragging) {
        earth.rotation.y += spin.speed;
        // Inertia — apply remaining velocity and decay
        if (Math.abs(velocity.x) > 0.0001 || Math.abs(velocity.y) > 0.0001) {
          pivot.rotation.y += velocity.x;
          pivot.rotation.x += velocity.y;
          velocity.x *= 0.92;
          velocity.y *= 0.92;
        }
      }

      // Pulsing ring around India
      ringPulse += dt * 5;
      const s = 1 + Math.sin(ringPulse) * 0.5;
      ring.scale.set(s, s, 1);
      ringMat.opacity = 0.9 - (Math.sin(ringPulse) * 0.5 + 0.5) * 0.6;

      renderer.render(scene, camera);
    };
    animate();

    /* ── Cleanup ──────────────────────────────────────────────── */
    return () => {
      cancelAnimationFrame(rafId);
      renderer.dispose();
      ScrollTrigger.getAll().forEach(t => t.kill());
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup",   onPointerUp);
      window.removeEventListener("touchstart",  onPointerDown);
      window.removeEventListener("touchmove",   onPointerMove);
      window.removeEventListener("touchend",    onPointerUp);
      window.removeEventListener("scroll",      onScroll);
      window.removeEventListener("resize",      onResize);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]); // run on pathname change

  if (pathname !== "/") return null;

  return (
    <div
      className="fixed inset-0 z-0 transition-colors duration-500"
      style={{
        background:
          theme === "dark"
            ? "radial-gradient(ellipse 90% 90% at 70% 50%, #0d1525 0%, #070708 100%)"
            : "radial-gradient(ellipse 90% 90% at 70% 50%, #e8ecf5 0%, #d5d5de 100%)",
        pointerEvents: "none",
      }}
    >
      {/* Canvas — transparent, pointer-events none (drag handled at window level) */}
      <canvas
        ref={canvasRef}
        style={{
          position:      "absolute",
          inset:         0,
          width:         "100%",
          height:        "100%",
          pointerEvents: "none",
          cursor:        "grab",
        }}
      />

      {/* Left-side fade so text stays readable */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            theme === "dark"
              ? "linear-gradient(to right, #070708 30%, rgba(7,7,8,0.6) 52%, transparent 72%)"
              : "linear-gradient(to right, #d5d5de 25%, rgba(213,213,222,0.6) 50%, transparent 70%)",
        }}
      />
    </div>
  );
}
