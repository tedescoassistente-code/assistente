const CACHE = 'assistente-shell-v2'; // ← versão trocada de propósito: força o navegador
                                       //    a jogar fora o index.html antigo em cache e
                                       //    buscar os arquivos atuais de novo.
const FILES = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // só cuida da casca (este domínio); o conteúdo do Apps Script (outro domínio,
  // dentro do iframe) sempre busca direto da rede, nunca do cache.
  if (new URL(e.request.url).origin !== self.location.origin) return;
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
