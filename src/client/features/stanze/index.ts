/**
 * Le stanze (why/stanze.json): i video veri della galleria di Whyed sui muri della Vetrina. Il 3D degli
 * schermi e' in world/office/stanze.ts; qui ci sono i video, che partono solo quando ti avvicini.
 */
import * as THREE from 'three';
import type { Ctx } from '../../core/context';
import type { Schermo, StanzaVista } from '../../world/office/stanze';

interface VideoGalleria {
  id: string;
  num: string;
  titolo: string;
  w: number;
  h: number;
  src: string;
}

/** Entro questa distanza (metri) dal centro della stanza i video girano; piu' lontano sono fermi. */
const VICINO = 24;

function etichetta(testo: string, larghezza: number): THREE.Mesh {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 96;
  const g = c.getContext('2d')!;
  g.fillStyle = '#f4f2ec';
  g.font = '600 52px Archivo, system-ui, sans-serif';
  g.textBaseline = 'middle';
  g.fillText(testo.slice(0, 34), 8, 50);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(larghezza, (larghezza * 96) / 1024), new THREE.MeshBasicMaterial({ map: t, transparent: true, toneMapped: false }));
  return m;
}

export function installStanze(ctx: Ctx) {
  const viste: readonly StanzaVista[] = ctx.office.stanze;
  const attive = new Map<string, { video: HTMLVideoElement; schermo: Schermo }[]>();
  let lista: Promise<VideoGalleria[]> | null = null;
  const prendiLista = () => (lista ??= fetch('/api/vetrina/lista').then((r) => (r.ok ? (r.json() as Promise<VideoGalleria[]>) : [])).catch(() => []));

  async function accendi(v: StanzaVista) {
    if (attive.has(v.def.id)) return;
    const mette: { video: HTMLVideoElement; schermo: Schermo }[] = [];
    attive.set(v.def.id, mette);
    const video = await prendiLista();
    const scelti = v.def.video?.ordine === 'numero' ? [...video].sort((a, b) => Number(a.num) - Number(b.num)) : video;
    v.schermi.forEach((s, i) => {
      const g = scelti[i];
      if (!g) return;
      const el = document.createElement('video');
      el.muted = true;
      el.loop = true;
      el.playsInline = true;
      el.crossOrigin = 'anonymous';
      el.preload = 'auto';
      el.src = g.src;
      const tex = new THREE.VideoTexture(el);
      tex.colorSpace = THREE.SRGBColorSpace;
      s.mesh.material.map = tex;
      s.mesh.material.color.set('#ffffff');
      s.mesh.material.needsUpdate = true;
      // Il video sta nello schermo senza deformarsi.
      el.addEventListener('loadedmetadata', () => {
        const ratio = el.videoWidth / el.videoHeight;
        const R = s.w / s.h;
        s.mesh.scale.set(ratio >= R ? 1 : ratio / R, ratio >= R ? R / ratio : 1, 1);
      });
      const tag = etichetta(`${g.num ? g.num + '  ' : ''}${g.titolo}`, s.w);
      tag.position.set(0, -s.h / 2 - 0.2, 0.01);
      s.mesh.parent!.add(tag);
      mette.push({ video: el, schermo: s });
    });
  }

  let t = 0;
  ctx.ticks.add('world', ({ dt }) => {
    t += dt;
    if (t < 0.5) return;
    t = 0;
    const p = ctx.player.pos;
    for (const v of viste) {
      const vicino = Math.hypot(p.x - v.centro.x, p.z - v.centro.z) < VICINO;
      if (vicino) void accendi(v);
      for (const { video } of attive.get(v.def.id) ?? []) {
        if (vicino && video.paused) void video.play().catch(() => {});
        else if (!vicino && !video.paused) video.pause();
      }
    }
  });

  return { viste };
}
