"use strict";
"use client";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CosmicDustBackground = CosmicDustBackground;
const jsx_runtime_1 = require("react/jsx-runtime");
/**
 * CosmicDustBackground — Flowra Brand Edition
 * ─────────────────────────────────────────────
 * Adapted from the "Cosmic Dust" Three.js scene:
 * - Deep void background (Flowra obsidian)
 * - Dust motes in brand purple (#635BFF) and cyan (#00F0FF)
 * - Corner glow in violet/indigo
 * - Full postprocessing: UnrealBloom x2 + composite final pass
 *
 * Loads Three.js from node_modules (already installed).
 * Runs fully client-side. SSR-safe via mounted guard.
 */
const react_1 = require("react");
const next_themes_1 = require("next-themes");
function CosmicDustBackground({ className = "" }) {
    const canvasRef = (0, react_1.useRef)(null);
    const { resolvedTheme } = (0, next_themes_1.useTheme)();
    // Store uniforms in a ref so we can update them without recreating the whole scene
    const uniformsRef = (0, react_1.useRef)(null);
    const finalUniformsRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        // If the scene is already created and we just changed themes, update the uniforms
        if (uniformsRef.current && finalUniformsRef.current) {
            function hexToVec3(hex) {
                const n = parseInt(hex.slice(1), 16);
                return { x: ((n >> 16) & 255) / 255, y: ((n >> 8) & 255) / 255, z: (n & 255) / 255 };
            }
            const isLight = resolvedTheme === "light";
            const bg = isLight ? "#FAFAFB" : "#030509";
            const flameA = isLight ? "#635BFF" : "#635BFF";
            const flameB = isLight ? "#00D4E8" : "#00F0FF";
            const cool = isLight ? "#4B44CC" : "#4B44CC";
            const warm = isLight ? "#F59E0B" : "#00D4E8"; // Warm orange for light mode dust
            uniformsRef.current.uCool.value.copy(hexToVec3(cool));
            uniformsRef.current.uWarm.value.copy(hexToVec3(warm));
            finalUniformsRef.current.uBg.value.copy(hexToVec3(bg));
            finalUniformsRef.current.uFlameA.value.copy(hexToVec3(flameA));
            finalUniformsRef.current.uFlameB.value.copy(hexToVec3(flameB));
            return;
        }
        if (!canvasRef.current)
            return;
        const canvas = canvasRef.current;
        let animId;
        let disposed = false;
        (async () => {
            // Dynamic imports — Three.js lives in node_modules
            const THREE = await Promise.resolve().then(() => __importStar(require("three")));
            const { EffectComposer } = await Promise.resolve().then(() => __importStar(require("three/examples/jsm/postprocessing/EffectComposer.js")));
            const { RenderPass } = await Promise.resolve().then(() => __importStar(require("three/examples/jsm/postprocessing/RenderPass.js")));
            const { ShaderPass } = await Promise.resolve().then(() => __importStar(require("three/examples/jsm/postprocessing/ShaderPass.js")));
            const { UnrealBloomPass } = await Promise.resolve().then(() => __importStar(require("three/examples/jsm/postprocessing/UnrealBloomPass.js")));
            const { GammaCorrectionShader } = await Promise.resolve().then(() => __importStar(require("three/examples/jsm/shaders/GammaCorrectionShader.js")));
            const { CopyShader } = await Promise.resolve().then(() => __importStar(require("three/examples/jsm/shaders/CopyShader.js")));
            if (disposed)
                return;
            // ── Helpers ─────────────────────────────────────────────────
            function hexToVec3(hex) {
                const n = parseInt(hex.slice(1), 16);
                return new THREE.Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
            }
            // ── Flowra brand palette (initial load) ─────────────────────────
            const isLight = resolvedTheme === "light";
            const BG_COLOR = isLight ? "#FAFAFB" : "#030509";
            const FLAME_A = isLight ? "#635BFF" : "#635BFF";
            const FLAME_B = isLight ? "#00D4E8" : "#00F0FF";
            const DUST_COOL = isLight ? "#4B44CC" : "#4B44CC";
            const DUST_WARM = isLight ? "#F59E0B" : "#00D4E8";
            const FLAME_AMT = 0.18;
            const DUST_ALPHA = isLight ? 0.35 : 0.72; // Less intense in light mode
            // ── Layers ──────────────────────────────────────────────────
            const LAYERS = { NONE: 0, TORUS_SCENE: 1, BLOOM_SCENE: 2, ENTIRE_SCENE: 3 };
            // ── Renderer ────────────────────────────────────────────────
            const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.shadowMap.enabled = true;
            // ── Scene & camera ──────────────────────────────────────────
            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0x000000);
            scene.fog = new THREE.Fog(0x000000, 0, 22);
            const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 80);
            camera.position.set(0, 0, 3);
            camera.layers.enable(LAYERS.TORUS_SCENE);
            camera.layers.enable(LAYERS.BLOOM_SCENE);
            camera.layers.enable(LAYERS.ENTIRE_SCENE);
            scene.add(camera);
            // ── Dust geometry ───────────────────────────────────────────
            const count = 940;
            const positions = [];
            const sizes = [];
            for (let i = 0; i < count; i++) {
                positions.push(2 * Math.random() - 1, 2 * Math.random() - 1, 2 * Math.random() - 1);
                sizes.push(25 + 25 * Math.random());
            }
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
            geometry.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1));
            // ── Dust material (verbatim shaders adapted to brand colors) ─
            const uniforms = {
                iTime: { value: 0 },
                iShift: { value: new THREE.Vector3() },
                iAlpha: { value: 0 },
                iAnimation: { value: new THREE.Vector3(0, 0, 0) },
                iResolution: { value: { x: canvas.clientWidth * devicePixelRatio, y: canvas.clientHeight * devicePixelRatio } },
                uDepth: { value: 3.7 },
                uCool: { value: hexToVec3(DUST_COOL) },
                uWarm: { value: hexToVec3(DUST_WARM) },
            };
            uniformsRef.current = uniforms;
            const material = new THREE.ShaderMaterial({
                transparent: true,
                uniforms,
                vertexShader: /* glsl */ `
          attribute float size;
          uniform float iTime;
          uniform vec3 iShift;
          uniform vec2 iResolution;
          uniform vec3 iAnimation;
          uniform float uDepth;
          varying float transparency;
          varying float warmness;

          vec3 warp3d(vec3 pos, float t) {
            float curv = 0.9, a = 1.9, b = 0.25, b2 = 0.03, c = 0.02;
            pos *= 2.;
            pos.x += curv * sin(c * t + a * pos.y) + t * b2;
            pos.y += curv * cos(c * t + a * pos.x);
            pos.z += curv * cos(c * t + a * pos.y);
            pos.z += curv * sin(c * t + a * pos.x) + t * b;
            pos.z = abs(pos.z);
            return pos.xyz;
          }

          void main() {
            vec3 v = warp3d(position, iTime);
            v = uDepth * (2. * fract(v + iShift) - 1.) + iAnimation;
            vec4 vpos = modelViewMatrix * vec4(v, 1.);
            transparency = step(length(v), uDepth);
            warmness = step(.75, fract(size * 7.13));
            gl_PointSize = size * iResolution.y / 1000. / -vpos.z;
            gl_Position = projectionMatrix * vpos;
          }
        `,
                fragmentShader: /* glsl */ `
          varying float transparency;
          varying float warmness;
          uniform float iAlpha;
          uniform vec3 uCool;
          uniform vec3 uWarm;

          void main() {
            vec3 color = mix(uCool * .8, uWarm * .8, warmness);
            float tex = smoothstep(1., .3, length(2. * gl_PointCoord - 1.));
            gl_FragColor = vec4(tex * color, tex * transparency * iAlpha);
          }
        `,
            });
            const points = new THREE.Points(geometry, material);
            points.position.set(0, 0, -1);
            points.layers.enable(LAYERS.ENTIRE_SCENE);
            scene.add(points);
            // ── FinalPass composite shader ──────────────────────────────
            const FinalPass = {
                uniforms: {
                    iTime: { value: 0 },
                    tDiffuse: { value: null },
                    torusTexture: { value: null },
                    bloomTexture: { value: null },
                    haloTexture: { value: null },
                    uBg: { value: hexToVec3(BG_COLOR) },
                    uFlameA: { value: hexToVec3(FLAME_A) },
                    uFlameB: { value: hexToVec3(FLAME_B) },
                    uFlameAmt: { value: FLAME_AMT },
                },
                vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
        `,
                fragmentShader: /* glsl */ `
          uniform float iTime;
          uniform sampler2D tDiffuse;
          uniform sampler2D bloomTexture;
          uniform sampler2D torusTexture;
          uniform sampler2D haloTexture;
          uniform vec3 uBg;
          uniform vec3 uFlameA;
          uniform vec3 uFlameB;
          uniform float uFlameAmt;
          varying vec2 vUv;

          vec3 warp3d(vec3 pos, float t) {
            float curv=.8, a=1.9, b=0.7;
            pos *= 2.;
            pos.x += curv*sin(t+a*pos.y) + t*b;
            pos.y += curv*cos(t+a*pos.x);
            pos.y += curv*sin(t+a*pos.z) + t*b;
            pos.z += curv*cos(t+a*pos.y);
            pos.z += curv*sin(t+a*pos.x) + t*b;
            pos.x += curv*cos(t+a*pos.z);
            return 0.5 + 0.5*cos(pos.xyz + vec3(1,2,4));
          }

          void main() {
            vec2 uv = 2.*vUv - 1.;
            vec3 w = pow(warp3d(vec3(uv.x, sin(uv.y), uv.y), iTime*1.5), vec3(1.5));
            vec3 flame = 1.5*uFlameA*w.x;
            flame *= w.y;
            flame += uFlameB*w.z;
            flame *= smoothstep(0.25, 1., abs(uv.y));
            float md = smoothstep(-0.7, 1., -uv.y*uv.x);
            flame *= md*md;
            vec3 bg = uBg * (1.0 - 0.4*length(uv));
            vec3 halo = texture2D(haloTexture, vUv).xyz;
            gl_FragColor = vec4(
              bg
              + flame*uFlameAmt
              + texture2D(bloomTexture, vUv).xyz
              + texture2D(torusTexture, vUv).xyz
              + texture2D(tDiffuse, vUv).xyz
              + halo,
              1.0
            );
          }
        `,
            };
            // ── Composers ───────────────────────────────────────────────
            const w = canvas.clientWidth, h = canvas.clientHeight;
            const renderPass = new RenderPass(scene, camera);
            const torusComposer = new EffectComposer(renderer);
            torusComposer.renderToScreen = false;
            torusComposer.addPass(renderPass);
            torusComposer.addPass(new ShaderPass(GammaCorrectionShader));
            torusComposer.addPass(new UnrealBloomPass(new THREE.Vector2(w, h), 0.3, 0.3, 0));
            torusComposer.addPass(new ShaderPass(CopyShader));
            const bloomComposer = new EffectComposer(renderer);
            bloomComposer.renderToScreen = false;
            bloomComposer.addPass(renderPass);
            bloomComposer.addPass(new UnrealBloomPass(new THREE.Vector2(w, h), 0.5, 0.7, 0));
            bloomComposer.addPass(new ShaderPass(GammaCorrectionShader));
            const finalComposer = new EffectComposer(renderer);
            finalComposer.addPass(renderPass);
            const finalPass = new ShaderPass(FinalPass);
            finalPass.uniforms.bloomTexture.value = bloomComposer.renderTarget1.texture;
            finalPass.uniforms.torusTexture.value = torusComposer.renderTarget1.texture;
            finalComposer.addPass(finalPass);
            finalUniformsRef.current = finalPass.uniforms;
            // ── Resize handler ───────────────────────────────────────────
            function onResize() {
                const w = canvas.clientWidth, h = canvas.clientHeight;
                const dpr = window.devicePixelRatio;
                renderer.setPixelRatio(dpr);
                renderer.setSize(w, h, false);
                camera.aspect = w / h;
                camera.updateProjectionMatrix();
                [torusComposer, bloomComposer, finalComposer].forEach(c => {
                    c.setPixelRatio?.(dpr);
                    c.setSize(w, h);
                });
                uniforms.iResolution.value = { x: w * dpr, y: h * dpr };
            }
            onResize();
            const ro = new ResizeObserver(onResize);
            ro.observe(canvas);
            // ── Fade-in ──────────────────────────────────────────────────
            const FADE_DURATION = 2200;
            const fadeStart = performance.now();
            function appearIn() {
                const t = Math.min(1, (performance.now() - fadeStart) / FADE_DURATION);
                const e = t * t * t * (t * (t * 6 - 15) + 10); // smootherstep
                uniforms.iAlpha.value = e * DUST_ALPHA;
                if (t < 1 && !disposed)
                    requestAnimationFrame(appearIn);
            }
            appearIn();
            // ── Render loop ──────────────────────────────────────────────
            function render() {
                if (disposed)
                    return;
                animId = requestAnimationFrame(render);
                const now = performance.now() / 1000;
                uniforms.iTime.value = now;
                uniforms.iShift.value.add(camera.position.clone().multiplyScalar(0.0022 * 0.4));
                finalPass.uniforms.iTime.value = now;
                camera.layers.set(LAYERS.TORUS_SCENE);
                torusComposer.render();
                camera.layers.set(LAYERS.BLOOM_SCENE);
                bloomComposer.render();
                camera.layers.set(LAYERS.ENTIRE_SCENE);
                finalComposer.render();
            }
            render();
            // store cleanup refs on the canvas element
            canvas.__threeCleanup = () => {
                disposed = true;
                cancelAnimationFrame(animId);
                ro.disconnect();
                geometry.dispose();
                material.dispose();
                renderer.dispose();
            };
        })();
        return () => {
            disposed = true;
            cancelAnimationFrame(animId);
            const cleanup = canvas.__threeCleanup;
            if (cleanup)
                cleanup();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resolvedTheme]);
    return ((0, jsx_runtime_1.jsx)("canvas", { ref: canvasRef, className: `absolute inset-0 w-full h-full ${className}`, "aria-hidden": "true" }));
}
