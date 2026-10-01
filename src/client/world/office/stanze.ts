import * as THREE from 'three';
import { FLOOR, SLAB, WALL_T, type Opening } from '../../../shared/layout';
import defs from '../../../../why/stanze.json';
import { mesh, toon } from '../toon';
import type { Collider } from '../types';
import type { Fixture } from './fixture';
import { box } from './materials';

// Le stanze di WhyOffice. Ogni voce di why/stanze.json diventa una stanza attaccata a un muro
// dell'ufficio, con una porta (un'apertura nel muro). Qui si costruisce la forma, i muri, le luci e
// gli oggetti. I video sui muri li mette features/stanze (qui ci sono solo gli schermi vuoti).

export type Lato = 'ovest' | 'nord';
export type MuroStanza = 'sinistra' | 'fondo' | 'destra';

export interface StanzaDef {
  id: string;
  nome: string;
  porta: { lato: Lato; u: number };
  forma: { larghezza: number; profondita: number; altezza?: number };
  colori?: { muri?: string; pavimento?: string; linea?: string };
  muri?: Partial<Record<MuroStanza, { tipo: 'video' | 'vuoto'; quanti?: number }>>;
  video?: { da?: 'galleria'; ordine?: 'nuovi' | 'numero' };
  oggetti?: { tipo: 'panca' | 'cubo'; x: number; z: number; lunga?: number }[];
}

export const STANZE: readonly StanzaDef[] = (defs as { stanze: StanzaDef[] }).stanze;

/** Uno schermo sul muro di una stanza: il video lo mette features/stanze. */
export interface Schermo {
  mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
  muro: MuroStanza;
  /** Larghezza e altezza di base, in metri. */
  w: number;
  h: number;
}
export interface StanzaVista {
  def: StanzaDef;
  group: THREE.Group;
  /** Il centro della stanza nel mondo. */
  centro: THREE.Vector3;
  schermi: Schermo[];
}

declare module '../types' {
  interface OfficeHandles {
    stanze: StanzaVista[];
  }
}

const PORTA_LARGA = 1.8;
const PORTA_ALTA = 2.7;

/** Dove sta la porta nel muro dell'ufficio, e come gira la stanza: il suo davanti (+x locale) esce dal muro. */
function inquadra(d: StanzaDef) {
  const u = d.porta.u;
  return d.porta.lato === 'ovest'
    ? { x: FLOOR.minX - WALL_T, z: u, rot: Math.PI, muro: 'west' as const }
    : { x: u, z: FLOOR.minZ - WALL_T, rot: Math.PI / 2, muro: 'north' as const };
}

/** Le porte nei muri dell'ufficio (si aggiungono ai buchi delle finestre). */
export function apertureStanze(): Opening[] {
  return controlla().map((d) => ({ wall: inquadra(d).muro, u: d.porta.u, width: PORTA_LARGA, y0: 0, y1: PORTA_ALTA }));
}

/** Controlli semplici: avvisano (nel log) se una stanza e' messa male, invece di rompere tutto. */
function controlla(): StanzaDef[] {
  const ok: StanzaDef[] = [];
  const usati: { lato: Lato; a: number; b: number; id: string }[] = [];
  for (const d of STANZE) {
    const a = d.porta.u - d.forma.larghezza / 2;
    const b = d.porta.u + d.forma.larghezza / 2;
    const urto = usati.find((s) => s.lato === d.porta.lato && a < s.b && b > s.a);
    if (urto) {
      console.warn(`[stanze] "${d.id}" si sovrappone a "${urto.id}" sul lato ${d.porta.lato}: saltata`);
      continue;
    }
    usati.push({ lato: d.porta.lato, a, b, id: d.id });
    ok.push(d);
  }
  return ok;
}

/** Il posto che le stanze occupano nel mondo (con `margine` attorno): serve a non mettere alberi e cose dentro. */
export function dentroUnaStanza(x: number, z: number, margine = 1.5): boolean {
  return controlla().some((d) => {
    const f = inquadra(d);
    const lungo = d.forma.profondita + margine;
    const largo = d.forma.larghezza / 2 + margine;
    // Nel sistema della stanza: x in avanti dal muro, z di lato (stessa rotazione di costruisci).
    const dx = x - f.x;
    const dz = z - f.z;
    const lx = dx * Math.cos(f.rot) - dz * Math.sin(f.rot);
    const lz = dx * Math.sin(f.rot) + dz * Math.cos(f.rot);
    return lx > -margine && lx < lungo && Math.abs(lz) < largo;
  });
}

/** Una scritta su fondo trasparente, per le insegne. */
export function scritta(testo: string, colore = '#f4f2ec'): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 200;
  const g = c.getContext('2d')!;
  g.fillStyle = colore;
  g.font = '700 120px Archivo, system-ui, sans-serif';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(testo.split('').join(' '), 512, 105);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function costruisci(d: StanzaDef, colliders: Collider[]): StanzaVista {
  const f = inquadra(d);
  const W = d.forma.larghezza;
  const D = d.forma.profondita;
  const H = d.forma.altezza ?? 4.4;
  const col = { muri: '#0e0e10', pavimento: '#d9d6cf', linea: '#1f3bff', ...d.colori };
  const group = new THREE.Group();
  group.name = `stanza-${d.id}`;
  group.position.set(f.x, 0, f.z);
  group.rotation.y = f.rot;

  const muriMat = toon(col.muri);
  const lineaMat = new THREE.MeshBasicMaterial({ color: col.linea, toneMapped: false });
  const add = (w: number, h: number, dd: number, x: number, y: number, z: number, mat: THREE.Material, shadow = false) => group.add(mesh(box(w, h, dd), mat, x, y, z, shadow));

  // Pavimento: una lastra sotto, come il balcone, e il piano chiaro sopra.
  add(D, SLAB - 0.01, W, D / 2, -SLAB / 2 - 0.005, 0, toon('#3a3a3c'));
  const pav = new THREE.Mesh(new THREE.PlaneGeometry(D, W), new THREE.MeshBasicMaterial({ color: col.pavimento, toneMapped: false }));
  pav.rotation.x = -Math.PI / 2;
  pav.position.set(D / 2, 0.002, 0);
  group.add(pav);
  // Soffitto scuro con due strisce di luce blu.
  add(D, 0.2, W, D / 2, H + 0.1, 0, muriMat);
  for (const z of [-W / 3, W / 3]) add(D - 0.6, 0.03, 0.06, D / 2, H - 0.005, z, lineaMat);

  // Muri: fondo, sinistra, destra. Il muro d'ingresso e' quello dell'ufficio, con la porta.
  const T = 0.2;
  add(T, H, W + 2 * T, D + T / 2, H / 2, 0, muriMat); // fondo
  add(D, H, T, D / 2, H / 2, -W / 2 - T / 2, muriMat); // sinistra
  add(D, H, T, D / 2, H / 2, W / 2 + T / 2, muriMat); // destra
  // Battiscopa luminoso, sottile.
  add(0.03, 0.04, W, D - 0.02, 0.03, 0, lineaMat);
  for (const s of [-1, 1]) add(D, 0.04, 0.03, D / 2, 0.03, s * (W / 2 - 0.02), lineaMat);
  // Parete d'ingresso: pannelli scuri ai due lati della porta e sopra.
  const lato = (W - PORTA_LARGA) / 2;
  for (const s of [-1, 1]) add(0.05, H, lato, 0.03, H / 2, s * (PORTA_LARGA / 2 + lato / 2), muriMat);
  add(0.05, H - PORTA_ALTA, PORTA_LARGA, 0.03, PORTA_ALTA + (H - PORTA_ALTA) / 2, 0, muriMat);
  add(0.06, 0.04, PORTA_LARGA, 0.04, PORTA_ALTA, 0, lineaMat);

  // Schermi. Ogni muro ne ha `quanti`, in fila, a un metro e tre quarti da terra (il centro).
  const schermi: Schermo[] = [];
  const muri: [MuroStanza, number, number, number][] = [
    // muro, lunghezza, rotazione dello schermo, dove sta il piano del muro
    ['sinistra', D, 0, -W / 2],
    ['fondo', W, -Math.PI / 2, D],
    ['destra', D, Math.PI, W / 2],
  ];
  for (const [nome, lung, rotY, piano] of muri) {
    const conf = d.muri?.[nome];
    if (conf?.tipo !== 'video') continue;
    const n = Math.max(1, Math.min(4, conf.quanti ?? 1));
    const w = Math.min(3.4, lung / n - 0.9);
    const h = (w * 9) / 16;
    for (let i = 0; i < n; i++) {
      const u = (i + 0.5) * (lung / n) - lung / 2;
      const g = new THREE.Group();
      // Sinistra e destra corrono lungo x (da 0 a D), il fondo lungo z (da -W/2 a W/2).
      if (nome === 'fondo') g.position.set(piano - 0.03, 1.75, u);
      else g.position.set(D / 2 + u, 1.75, piano + (nome === 'sinistra' ? 0.03 : -0.03));
      g.rotation.y = rotY;
      g.add(mesh(box(w + 0.12, h + 0.12, 0.03), lineaMat, 0, 0, -0.012, false));
      const s = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: '#16161a', toneMapped: false }));
      s.position.z = 0.006;
      g.add(s);
      group.add(g);
      schermi.push({ mesh: s, muro: nome, w, h });
    }
  }

  // Oggetti.
  for (const o of d.oggetti ?? []) {
    if (o.tipo === 'panca') {
      const lung = o.lunga ?? 2.4;
      add(0.5, 0.08, lung, o.x, 0.42, o.z, toon('#f4f2ec'), true);
      for (const s of [-1, 1]) add(0.4, 0.4, 0.06, o.x, 0.2, o.z + s * (lung / 2 - 0.2), toon('#0b0b0c'), true);
    } else if (o.tipo === 'cubo') {
      add(0.7, 0.7, 0.7, o.x, 0.35, o.z, toon('#f4f2ec'), true);
      add(0.72, 0.03, 0.72, o.x, 0.7, o.z, lineaMat);
    }
  }

  // Insegna col nome, sul muro d'ingresso, dentro la stanza.
  const nome = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 0.35), new THREE.MeshBasicMaterial({ map: scritta(d.nome.toUpperCase()), transparent: true, toneMapped: false }));
  nome.position.set(0.07, PORTA_ALTA + 0.55, 0);
  nome.rotation.y = Math.PI / 2;
  group.add(nome);

  // Collider nel mondo: ruoto i rettangoli locali (x avanti, z di lato) con la stessa rotazione del gruppo.
  const rect = (x0: number, x1: number, z0: number, z1: number, top: number, bottom?: number): Collider => {
    const c = Math.cos(f.rot);
    const s = Math.sin(f.rot);
    const pts = [[x0, z0], [x0, z1], [x1, z0], [x1, z1]].map(([x, z]) => ({ x: f.x + x * c + z * s, z: f.z - x * s + z * c }));
    const xs = pts.map((p) => p.x);
    const zs = pts.map((p) => p.z);
    return { minX: Math.min(...xs), maxX: Math.max(...xs), minZ: Math.min(...zs), maxZ: Math.max(...zs), top, bottom };
  };
  colliders.push(rect(0, D, -W / 2, W / 2, 0, -SLAB)); // il pavimento
  colliders.push(rect(D, D + T, -W / 2 - T, W / 2 + T, 99));
  colliders.push(rect(0, D, -W / 2 - T, -W / 2, 99));
  colliders.push(rect(0, D, W / 2, W / 2 + T, 99));
  colliders.push(rect(0, D, -W / 2, W / 2, H + 0.2, H)); // il soffitto: la camera non lo passa
  for (const o of d.oggetti ?? []) {
    if (o.tipo === 'cubo') colliders.push(rect(o.x - 0.35, o.x + 0.35, o.z - 0.35, o.z + 0.35, 0.7));
    else colliders.push(rect(o.x - 0.25, o.x + 0.25, o.z - (o.lunga ?? 2.4) / 2, o.z + (o.lunga ?? 2.4) / 2, 0.45));
  }

  const centro = new THREE.Vector3(D / 2, 1, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), f.rot).add(new THREE.Vector3(f.x, 0, f.z));
  return { def: d, group, centro, schermi };
}

/** Le stanze di why/stanze.json, attaccate ai muri dell'ufficio. */
export const stanze: Fixture<'stanze'> = (site) => {
  const colliders: Collider[] = [];
  const viste = controlla().map((d) => costruisci(d, colliders));
  const group = new THREE.Group();
  for (const v of viste) group.add(v.group);
  // Nel muro dell'ufficio, dove c'e' la porta, niente quadri.
  for (const v of viste) site.wall(inquadra(v.def).muro, v.def.porta.u, PORTA_ALTA / 2, PORTA_LARGA + 0.2, PORTA_ALTA);
  return { handle: { stanze: viste }, group, colliders };
};
