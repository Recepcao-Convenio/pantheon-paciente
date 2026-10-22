// Guarda a casca do app para abrir rápido; o app e os dados sempre vêm da internet quando há conexão.
const CACHE = 'pantheon-paciente-v6';
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./', 'manifest.json', 'icon-192.png', 'icon-180.png']))); self.skipWaiting() });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())) });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return; // API nunca vai para o cache
  // Ignora o cache do navegador e do GitHub: busca sempre a versão mais nova; sem internet, usa a cópia guardada.
  e.respondWith(fetch(e.request, { cache: 'no-store' }).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return r }).catch(() => caches.match(e.request, { ignoreSearch: true })));
});
