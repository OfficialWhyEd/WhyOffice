// La stanza Vetrina: i video veri della galleria di Whyed (porta 4181), passati dall'ufficio stesso
// cosi' il 3D li puo' usare come texture (la galleria non manda gli header CORS).
import http from 'node:http';
import { send } from '../util.js';
import type { Route } from '../router.js';

const GALLERIA = (process.env.WHY_GALLERIA ?? 'http://127.0.0.1:4181').replace(/\/$/, '');

interface Voce {
  id: string;
  num?: string;
  titolo: string;
  peso: number;
  data: string;
  pronto: boolean;
  info?: { w: number; h: number };
  varianti?: { ruolo: string; src: string; peso: number }[];
}

/** Un video per numero (il piu' leggero), i piu' nuovi per primi, senza i confronti affiancati. */
async function lista() {
  const r = await fetch(`${GALLERIA}/api/video`);
  const j = (await r.json()) as { video: Voce[] };
  const perNum = new Map<string, Voce>();
  for (const v of j.video) {
    if (!v.pronto || /confronto/i.test(v.titolo) || !v.info) continue;
    const k = v.num ?? v.id;
    const c = perNum.get(k);
    if (!c || v.peso < c.peso) perNum.set(k, v);
  }
  return [...perNum.values()]
    .sort((a, b) => b.data.localeCompare(a.data))
    .map((v) => ({ id: v.id, num: v.num ?? '', titolo: v.titolo.split(' · ')[0], w: v.info!.w, h: v.info!.h, src: `/api/vetrina/v/${v.id}` }));
}

/** Passa il video com'e' (con gli intervalli di byte, perche' il browser possa saltare avanti). */
function passa(req: http.IncomingMessage, res: http.ServerResponse, id: string) {
  if (!/^[a-f0-9]{6,40}$/.test(id)) return send(res, 404, { error: 'no' });
  const headers: http.OutgoingHttpHeaders = {};
  if (req.headers.range) headers.range = req.headers.range;
  const up = http.get(`${GALLERIA}/video/m/${id}`, { headers }, (r) => {
    const out: http.OutgoingHttpHeaders = { 'cache-control': 'no-cache' };
    for (const h of ['content-type', 'content-length', 'content-range', 'accept-ranges']) if (r.headers[h]) out[h] = r.headers[h];
    res.writeHead(r.statusCode ?? 200, out);
    r.pipe(res);
  });
  up.on('error', () => (res.headersSent ? res.destroy() : send(res, 502, { error: 'galleria spenta' })));
  res.on('close', () => up.destroy());
}

export const vetrinaRoutes = {
  lista: { method: 'GET', path: '/api/vetrina/lista', auth: 'session', handle: async (_ctx, { res }) => send(res, 200, await lista().catch(() => [])) },
  video: { method: 'GET', prefix: '/api/vetrina/v/', auth: 'session', handle: (_ctx, { req, res, path }) => passa(req, res, path.slice('/api/vetrina/v/'.length)) },
} satisfies Record<string, Route>;
