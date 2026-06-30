/**
 * Genereert alle Kader-app-iconen uit de officiële SVG-definitie.
 * Gebruik: node scripts/genereer-iconen.mjs  (vanuit de app/-map)
 * Vereist: npm i -D @resvg/resvg-js
 */

import { Resvg } from '@resvg/resvg-js';
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = dirname(fileURLToPath(import.meta.url));
const ASSETS = resolve(__dir, '..', 'assets');

// ── SVG-helpers ────────────────────────────────────────────────────────────────

function gradientSvg(width, size = 60) {
  const marks = marksGroup(size);
  return `<svg width="${width}" height="${width}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1E3A8A"/>
      <stop offset="100%" stop-color="#2563EB"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${Math.round(size * 0.267)}" fill="url(#g)"/>
  ${marks}
</svg>`;
}

function transparentSvg(width, size = 60) {
  const marks = marksGroup(size);
  return `<svg width="${width}" height="${width}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  ${marks}
</svg>`;
}

function gradientOnlySvg(width, size = 60) {
  return `<svg width="${width}" height="${width}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1E3A8A"/>
      <stop offset="100%" stop-color="#2563EB"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#g)"/>
</svg>`;
}

// Officiële merkmarkeringen: vier hoeken + chart-polyline (geen eindpunt-dot)
function marksGroup(size) {
  const s = size;
  const sw = +(s * 0.0467).toFixed(2);   // stroke-width ~2.8 bij 60px
  const swp = +(s * 0.0367).toFixed(2);  // polyline stroke ~2.2 bij 60px
  const a = +(s * 0.233).toFixed(2);     // hoek-offset van rand (~14px bij 60)
  const b = +(s * 0.767).toFixed(2);     // tegenoverliggende zijde (~46px bij 60)

  // Polyline-punten: links onder → omhoog → slag → rechtsboven
  const pp = [
    [s * 0.3, s * 0.633],   // 18,38
    [s * 0.4, s * 0.517],   // 24,31
    [s * 0.5, s * 0.567],   // 30,34
    [s * 0.7, s * 0.333],   // 42,20
  ].map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

  return `<g stroke="white" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <path d="M${a} ${a*1.7} L${a} ${a} L${a*1.7} ${a}"/>
    <path d="M${b - a*0.7} ${a} L${b} ${a} L${b} ${a*1.7}"/>
    <path d="M${a} ${b - a*0.7} L${a} ${b} L${a*1.7} ${b}"/>
    <path d="M${b - a*0.7} ${b} L${b} ${b} L${b} ${b - a*0.7}"/>
  </g>
  <polyline points="${pp}" stroke="white" stroke-width="${swp}" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.92"/>`;
}

// ── Render ─────────────────────────────────────────────────────────────────────

function render(svg, outPath) {
  const resvg = new Resvg(svg);
  const png = resvg.render().asPng();
  writeFileSync(outPath, png);
  console.log(`✓ ${outPath.replace(ASSETS + '\\', '').replace(ASSETS + '/', '')}`);
}

console.log('Kader-iconen genereren…');

// 1. icon.png  1024×1024 — gradient + merkteken
render(gradientSvg(1024), resolve(ASSETS, 'icon.png'));

// 2. splash-icon.png  1024×1024 — merkteken op transparant
render(transparentSvg(1024), resolve(ASSETS, 'splash-icon.png'));

// 3. android-icon-foreground.png  1024×1024 — merkteken op transparant (safe zone)
render(transparentSvg(1024), resolve(ASSETS, 'android-icon-foreground.png'));

// 4. android-icon-background.png  1024×1024 — gradient zonder merkteken
render(gradientOnlySvg(1024), resolve(ASSETS, 'android-icon-background.png'));

// 5. android-icon-monochrome.png  1024×1024 — witte merkteken op transparant
render(transparentSvg(1024), resolve(ASSETS, 'android-icon-monochrome.png'));

// 6. favicon.png  196×196 — gradient + merkteken
render(gradientSvg(196), resolve(ASSETS, 'favicon.png'));

console.log('Klaar.');
