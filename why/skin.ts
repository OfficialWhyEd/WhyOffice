import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import type { Plugin } from 'vite';

/*
 * WhyOffice skin. The office's own stylesheets stay as upstream wrote them (so updates merge
 * cleanly); this plugin rewrites them on the way into the bundle: hairlines instead of the thick
 * cartoon outlines, no drop shadows, tighter corners, lighter weights, the Why palette, and
 * why/why.css appended after the base tokens.
 */

const WHY_CSS = resolve(import.meta.dirname, 'why.css');

// Warm cartoon tints to the Why neutrals (bone, ash, electric blue). The rest of the pastels stay:
// they carry status (pink = error, yellow = warning, green = done).
const HEX: Record<string, string> = {
  '#2b2d42': '#0b0b0c',
  '#ff8a5b': '#1f3bff',
  '#fffaf3': '#f4f2ec',
  '#fff1de': '#e8e5dd',
  '#ffe3d6': '#e3e7ff',
  '#ffe8cc': '#ecebe6',
  '#ffd6a5': '#dfe3ff',
  '#f1e4d3': '#e4e1da',
  '#f3ebe0': '#ebe8e1',
  '#ebe1d4': '#e2dfd8',
  '#ddd0bf': '#cfccc4',
  '#7a6f65': '#6b6a66',
  '#a39a91': '#9a9893',
  '#bfe3ff': '#0b0b0c',
};

export function skinCss(css: string): string {
  return css
    .replace(/\b\d+(?:\.\d+)?px (solid|dashed) var\(--(ink|border)\)/g, '1px $1 var(--line)')
    .replace(/\b0 \d+px 0 var\(--(ink|border)\)/g, '0 0 0 transparent')
    .replace(/0 2px 0 #999/g, '0 0 0 transparent')
    .replace(/border-radius:\s*(\d+)px/g, (_, n: string) => {
      const v = Number(n);
      return `border-radius: ${v >= 8 && v < 100 ? Math.max(4, Math.round(v * 0.45)) : v}px`;
    })
    .replace(/font-weight:\s*900/g, 'font-weight: 700')
    .replace(/font-weight:\s*800/g, 'font-weight: 600')
    .replace(/font:\s*900 /g, 'font: 700 ')
    .replace(/font:\s*800 /g, 'font: 600 ')
    .replace(/#[0-9a-fA-F]{6}\b/g, (h) => HEX[h.toLowerCase()] ?? h)
    .replace(/rgba\(43,\s*45,\s*66/g, 'rgba(11, 11, 12')
    .replace(/'Nunito'|\bNunito\b/g, "'Archivo'");
}

// The 3D office in Why colors: bone walls, pale concrete, black steel, one electric blue. Each floor
// keeps its own trim so floors still tell apart, but nothing warm or candy.
const FLOORS = `[
  { name: 'Bone', wall: '#f1efe9', trim: '#0b0b0c', floor: '#d9d6cf', floorAlt: '#d1cec6', seam: '#b9b5ad' },
  { name: 'Volt', wall: '#eef0f6', trim: '#1f3bff', floor: '#cfd2d8', floorAlt: '#c6c9d0', seam: '#aeb2ba' },
  { name: 'Ash', wall: '#e6e5e1', trim: '#3a3a3c', floor: '#bdbbb6', floorAlt: '#b3b1ac', seam: '#9c9a95' },
  { name: 'Moss', wall: '#eceee8', trim: '#3d5a40', floor: '#c9cbc2', floorAlt: '#bfc2b8', seam: '#a6a99f' },
  { name: 'Ink', wall: '#e2e1de', trim: '#0b0b0c', floor: '#55555a', floorAlt: '#4c4c51', seam: '#3a3a3e' },
  { name: 'Signal', wall: '#f2efea', trim: '#c8102e', floor: '#cfcbc4', floorAlt: '#c6c2ba', seam: '#ada9a1' },
  { name: 'Steel', wall: '#e9edf1', trim: '#4b5d73', floor: '#bfc6ce', floorAlt: '#b5bcc5', seam: '#9ba3ad' },
  { name: 'Stone', wall: '#efebe3', trim: '#5e584f', floor: '#cbc5ba', floorAlt: '#c1bbb0', seam: '#a8a297' },
  { name: 'Cobalt', wall: '#e8ebff', trim: '#1f3bff', floor: '#b9bcc6', floorAlt: '#b0b3bd', seam: '#979aa5' },
  { name: 'Graphite', wall: '#dedede', trim: '#1a1a1c', floor: '#8e8e92', floorAlt: '#858589', seam: '#6c6c70' },
]`;

const OFFICE: Record<string, string> = {
  desk: "'#f4f2ec'",
  deskLeg: "'#0b0b0c'",
  wood: "'#4a4541'",
  cork: "'#bdb6aa'",
  chairs: "['#0b0b0c', '#1f3bff', '#e8e5dd', '#3a3a3c', '#9aa3ad', '#1f3bff']",
  rugs: "['#d9d6cf', '#2a2a2c', '#c9cdd6', '#e8e5dd']",
  plant: "'#4f7a52'",
  plantDark: "'#2f5232'",
  pot: "'#0b0b0c'",
  ink: "'#0b0b0c'",
  exterior: "'#1a1a1c'",
};

function skinWorld(file: string, code: string): string | null {
  if (file.endsWith('/src/shared/floors.ts')) return code.replace(/(FLOOR_PALETTES: FloorPalette\[\] = )\[[\s\S]*?\n\];/, `$1${FLOORS};`);
  if (file.endsWith('/src/client/world/office/materials.ts')) {
    return code.replace(/^(\s+)(\w+): ([^\n]+),$/gm, (line, sp: string, key: string) => (key in OFFICE ? `${sp}${key}: ${OFFICE[key]},` : line));
  }
  if (file.endsWith('/src/client/world/tower.ts')) return code.replace("flat('#e07a5f')", "flat('#1a1a1c')");
  if (file.endsWith('/src/client/world/sky.ts') || file.endsWith('/src/client/core/scene.ts')) {
    // Daylight that doesn't tint the room: neutral sky and ground bounce, white sun.
    return code
      .replace(/'#fff5e6'/g, "'#f3f5f8'")
      .replace(/'#c9a27a'/g, "'#9a9690'")
      .replace(/'#fff1d6'/g, "'#ffffff'")
      .replace(/'#fff2de'/g, "'#f6f4ef'");
  }
  // The building itself (walls, rugs, fixtures, the meeting room, the loft): candy colors fall back
  // to the same lightness in grey. The Why blue stays.
  if (file.includes('/src/client/world/office/')) return code.replace(/'#[0-9a-fA-F]{6}'/g, (q) => `'${grade(q.slice(1, -1))}'`);
  return null;
}

function grade(hex: string): string {
  if (hex.toLowerCase() === '#1f3bff') return hex;
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => v / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2;
  const s = max === min ? 0 : (max - min) / (1 - Math.abs(2 * l - 1));
  if (s < 0.3) return hex;
  // Mix toward the grey of the same lightness, leaving a trace of the hue.
  const k = 0.2;
  const out = [r, g, b].map((v) => Math.round((l + (v - l) * k) * 255));
  return `#${out.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

const font = (f: string) => `url(data:font/woff2;base64,${readFileSync(resolve(import.meta.dirname, f)).toString('base64')}) format('woff2')`;
const whyCss = () =>
  readFileSync(WHY_CSS, 'utf8')
    .replace("url('/fonts/Archivo.ttf') format('truetype')", font('Archivo-latin.woff2'))
    .replace("url('/fonts/GeistMono-Medium.woff2') format('woff2')", font('GeistMono-Medium.woff2'));

export function whySkin(): Plugin {
  return {
    name: 'why-skin',
    enforce: 'pre',
    transform(code, id) {
      const file = id.split('?')[0].replace(/\\/g, '/');
      const world = skinWorld(file, code);
      if (world !== null) return { code: world, map: null };
      if (!file.includes('/src/client/')) return null;
      if (file.endsWith('.css')) {
        // @import'ed sheets never pass through transform on their own: inline them here.
        const inlined = code.replace(/@import\s+'(\.\/[^']+\.css)';/g, (_, rel: string) => readFileSync(resolve(dirname(file), rel), 'utf8'));
        const tail = /\/(style|lite|login)\.css$/.test(file) ? `\n${whyCss()}` : '';
        return { code: skinCss(inlined) + tail, map: null };
      }
      if (/\.(ts|html)$/.test(file) && /Nunito|Agent Office|#ff8a5b|0xff8a5b/i.test(code)) {
        return {
          code: code
            .replace(/\bNunito\b/g, 'Archivo')
            .replace(/Agent Office/g, 'WhyOffice')
            .replace(/#ff8a5b/gi, '#1f3bff')
            .replace(/0xff8a5b/gi, '0x1f3bff'),
          map: null,
        };
      }
      return null;
    },
    transformIndexHtml(html) {
      return html.replace(/Agent Office/g, 'WhyOffice');
    },
  };
}
