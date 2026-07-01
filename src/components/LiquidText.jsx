"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";

// GLSL Vertex Shader
const vertexShader = `
  varying vec2 v_uv;
  void main() {
    v_uv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// GLSL Fragment Shader for Liquid Distortion & RGB Split
const fragmentShader = `
  uniform sampler2D u_texture;
  uniform vec2 u_mouse;
  uniform vec2 u_prevMouse;
  uniform float u_hoverStrength;
  uniform float u_waveIntensity;
  uniform float u_waveRadius;
  uniform float u_waveSpeed;
  uniform float u_time;

  varying vec2 v_uv;

  void main() {
    vec2 uv = v_uv;
    
    // Direction and distance from cursor
    vec2 dir = uv - u_mouse;
    float dist = length(dir);
    
    // Mouse velocity vector
    vec2 velocity = u_mouse - u_prevMouse;
    
    // Smoothly calculate influence based on proximity to waveRadius
    float influence = smoothstep(u_waveRadius, 0.0, dist);
    
    // Liquid displacement: cursor drag + radial outward push
    vec2 drag = velocity * influence * u_hoverStrength * 3.5;
    vec2 radialPush = normalize(dir) * (1.0 - smoothstep(0.0, u_waveRadius, dist)) * 0.03 * u_hoverStrength;
    
    // Sinusoidal ripple waves flowing outward from the cursor
    float ripple = sin(dist * 35.0 - u_time * u_waveSpeed) * 0.012 * influence * u_waveIntensity * u_hoverStrength;
    
    // Total displacement applied to the coordinates
    vec2 displacement = drag + radialPush + normalize(dir) * ripple;
    
    // RGB Split / Chromatic Aberration based on displacement intensity
    vec2 uvR = uv + displacement * 1.0;
    vec2 uvG = uv + displacement * 1.06;
    vec2 uvB = uv + displacement * 1.12;
    
    vec4 color = vec4(0.0);
    
    // Sample texture channels with safety checks to prevent edge wrapping
    if (uvR.x >= 0.0 && uvR.x <= 1.0 && uvR.y >= 0.0 && uvR.y <= 1.0) {
      color.r = texture2D(u_texture, uvR).r;
    }
    if (uvG.x >= 0.0 && uvG.x <= 1.0 && uvG.y >= 0.0 && uvG.y <= 1.0) {
      color.g = texture2D(u_texture, uvG).g;
    }
    if (uvB.x >= 0.0 && uvB.x <= 1.0 && uvB.y >= 0.0 && uvB.y <= 1.0) {
      color.b = texture2D(u_texture, uvB).b;
    }
    
    // Safely combine transparency/alpha layers
    float alphaR = (uvR.x >= 0.0 && uvR.x <= 1.0 && uvR.y >= 0.0 && uvR.y <= 1.0) ? texture2D(u_texture, uvR).a : 0.0;
    float alphaG = (uvG.x >= 0.0 && uvG.x <= 1.0 && uvG.y >= 0.0 && uvG.y <= 1.0) ? texture2D(u_texture, uvG).a : 0.0;
    float alphaB = (uvB.x >= 0.0 && uvB.x <= 1.0 && uvB.y >= 0.0 && uvB.y <= 1.0) ? texture2D(u_texture, uvB).a : 0.0;
    
    color.a = max(max(alphaR, alphaG), alphaB);
    
    gl_FragColor = color;
  }
`;

/**
 * Premium WebGL Liquid/Water Typography component for Next.js
 */
export default function LiquidText({
  text = "LIQUID",
  fontSize = 90,
  fontWeight = "bold",
  fontFamily = "sans-serif",
  color = "#ffffff",
  waveIntensity = 1.0,
  waveRadius = 0.25,
  waveSpeed = 4.0,
  hoverStrength = 1.0,
  className = "",
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    // Check if WebGL is supported
    try {
      const canvas = document.createElement("canvas");
      const support = !!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
      if (!support) {
        setHasWebGL(false);
        return;
      }
    } catch (e) {
      setHasWebGL(false);
      return;
    }

    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    // --- Create 2D canvas to draw the text texture ---
    const canvas2d = document.createElement("canvas");
    const ctx2d = canvas2d.getContext("2d");
    if (!ctx2d) return;

    // Define temporary context properties to measure text
    ctx2d.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    const metrics = ctx2d.measureText(text);
    const textWidth = Math.ceil(metrics.width);
    const textHeight = Math.ceil(fontSize * 1.0);

    // Reduced padding to minimize extra vertical gap while allowing warp room
    const paddingX = fontSize * 0.15;
    const paddingY = fontSize * 0.15;

    const totalWidth = textWidth + paddingX * 2;
    const totalHeight = textHeight + paddingY * 2;

    // Retina/DPR scaling for sharp typography
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas2d.width = totalWidth * dpr;
    canvas2d.height = totalHeight * dpr;
    ctx2d.scale(dpr, dpr);

    // Redraw text with high quality
    ctx2d.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx2d.textBaseline = "middle";
    ctx2d.textAlign = "center";
    ctx2d.fillStyle = color;
    ctx2d.fillText(text, totalWidth / 2, totalHeight / 2);

    // Set sizing styles on container
    container.style.width = `${totalWidth}px`;
    container.style.height = `${totalHeight}px`;

    // --- Set up Three.js WebGL Scene ---
    const width = totalWidth;
    const height = totalHeight;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(dpr);

    const scene = new THREE.Scene();
    
    // Orthographic Camera mapping 1:1 with canvas pixel size
    const camera = new THREE.OrthographicCamera(
      width / -2,
      width / 2,
      height / 2,
      height / -2,
      1,
      1000
    );
    camera.position.z = 10;

    // Text texture from 2D Canvas
    const texture = new THREE.CanvasTexture(canvas2d);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;

    // Shader Uniforms
    const uniforms = {
      u_texture: { value: texture },
      u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
      u_prevMouse: { value: new THREE.Vector2(0.5, 0.5) },
      u_hoverStrength: { value: 0.0 },
      u_waveIntensity: { value: waveIntensity },
      u_waveRadius: { value: waveRadius },
      u_waveSpeed: { value: waveSpeed },
      u_time: { value: 0 },
    };

    // Create Shader Material
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });

    // Match Plane size with full screen orthographic layout
    const geometry = new THREE.PlaneGeometry(width, height);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // --- Interactive Mouse Physics & Damping ---
    let targetMouse = { x: 0.5, y: 0.5 };
    let currentMouse = { x: 0.5, y: 0.5 };
    let prevMouse = { x: 0.5, y: 0.5 };
    let velocity = 0;
    
    let targetStrength = 0;
    let currentStrength = 0;
    let strengthTween = null;

    const handlePointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      // WebGL y coordinate is inverted
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      targetMouse.x = x;
      targetMouse.y = y;
    };

    const handlePointerEnter = () => {
      if (strengthTween) strengthTween.kill();
      strengthTween = gsap.to({ val: currentStrength }, {
        val: 1.0,
        duration: 0.5,
        ease: "power2.out",
        onUpdate: function () {
          targetStrength = this.targets()[0].val;
        }
      });
    };

    const handlePointerLeave = () => {
      if (strengthTween) strengthTween.kill();
      strengthTween = gsap.to({ val: currentStrength }, {
        val: 0.0,
        duration: 0.8,
        ease: "power2.out",
        onUpdate: function () {
          targetStrength = this.targets()[0].val;
        }
      });
      // Gently ease mouse target back to center
      gsap.to(targetMouse, { x: 0.5, y: 0.5, duration: 0.8, ease: "power2.out" });
    };

    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerenter", handlePointerEnter);
    container.addEventListener("pointerleave", handlePointerLeave);

    // --- Animation loop ---
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      uniforms.u_time.value = elapsedTime;

      // Spring physics / Damping interpolation
      currentMouse.x += (targetMouse.x - currentMouse.x) * 0.08;
      currentMouse.y += (targetMouse.y - currentMouse.y) * 0.08;

      // Calculate speed/velocity of mouse movement
      const dx = currentMouse.x - prevMouse.x;
      const dy = currentMouse.y - prevMouse.y;
      velocity = Math.sqrt(dx * dx + dy * dy);

      // Smoothly update hover strength uniform
      currentStrength += (targetStrength - currentStrength) * 0.1;
      
      // Enhance distortion strength dynamically if cursor moves quickly
      const dynamicStrength = currentStrength * (1.0 + velocity * 12.0 * hoverStrength);
      uniforms.u_hoverStrength.value = Math.min(dynamicStrength, 2.0);

      // Set mouse positions in shader
      uniforms.u_mouse.value.set(currentMouse.x, currentMouse.y);
      uniforms.u_prevMouse.value.set(prevMouse.x, prevMouse.y);

      // Save history for velocity calculation next frame
      prevMouse.x = currentMouse.x;
      prevMouse.y = currentMouse.y;

      renderer.render(scene, camera);
    };

    animate();

    // --- Cleanup resources ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerenter", handlePointerEnter);
      container.removeEventListener("pointerleave", handlePointerLeave);
      
      if (strengthTween) strengthTween.kill();

      // Dispose WebGL context & objects to prevent memory leaks
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, [text, fontSize, fontWeight, fontFamily, color, waveIntensity, waveRadius, waveSpeed, hoverStrength]);

  // Graceful fallback for environments without WebGL
  if (!hasWebGL) {
    return (
      <span
        style={{
          fontSize: `${fontSize}px`,
          fontWeight: fontWeight,
          fontFamily: fontFamily,
          color: color,
        }}
        className={`inline-block select-none cursor-default ${className}`}
      >
        {text}
      </span>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative inline-block select-none overflow-hidden max-w-full ${className}`}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
