// Markdown for agents: якщо клієнт просить Accept: text/markdown,
// віддаємо Markdown-версію сторінки з /md/<шлях>.md (генерує seo/build_ai.py).
// Для звичайних відвідувачів нічого не змінюється — повертаємо undefined, і Vercel віддає HTML.
export const config = {
  matcher: ['/((?!assets/|md/|.*\\.(?:png|jpg|jpeg|svg|ico|css|js|xml|txt|md|webp|json)$).*)'],
};

export default async function middleware(request) {
  const accept = request.headers.get('accept') || '';
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
