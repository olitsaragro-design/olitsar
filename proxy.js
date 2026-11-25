// Markdown for agents: якщо клієнт просить Accept: text/markdown,
// віддаємо Markdown-версію сторінки з /md/<шлях>.md (генерує seo/build_ai.py).
// Для звичайних відвідувачів нічого не змінюється — повертаємо undefined, і Vercel віддає HTML.
export default async function proxy(request) {
  const accept = request.headers.get('accept') || '';
  const probe = new URL(request.url).searchParams.get('__probe');
  if (probe) {
    const u = new URL(request.url);
    let st = 'n/a';
    try { const r = await fetch(new URL('/md/index.md', u.origin), { headers: { accept: 'text/plain' } }); st = r.status + ' ' + r.headers.get('content-type'); } catch (e) { st = 'ERR ' + e.message; }
    return new Response('proxy-alive\naccept=' + accept + '\nmdfetch=' + st + '\norigin=' + u.origin, { headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' } });
  }
  if (!/text\/markdown/i.test(accept)) return;

  const url = new URL(request.url);
  let path = url.pathname.replace(/\/+$/, '').replace(/\.html$/, '');
  const mdUrl = new URL(path === '' ? '/md/index.md' : `/md${path}.md`, url.origin);

  const res = await fetch(mdUrl, { headers: { accept: 'text/plain' } });
  if (!res.ok) return;

  return new Response(await res.text(), {
    status: 200,
    headers: {
      'content-type': 'text/markdown; charset=utf-8',
      'vary': 'Accept',
      'cache-control': 'public, max-age=0, s-maxage=3600',
      'x-robots-tag': 'noindex',
      'link': `<${url.origin}${url.pathname}>; rel="canonical"`,
    },
  });
}
