// Markdown for agents: якщо клієнт просить Accept: text/markdown,
// внутрішньо перенаправляємо (rewrite) на /md/<шлях>.md (генерує seo/build_ai.py).
// Для звичайних відвідувачів нічого не змінюється — повертаємо undefined, і Vercel віддає HTML.
// Підключено у vercel.json → "proxy". Заголовки для /md/* — у vercel.json → "headers".
export default function proxy(request) {
  const accept = request.headers.get('accept') || '';
  if (!/text\/markdown/i.test(accept)) return;

  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, '').replace(/\.html$/, '');
  const dest = new URL(path === '' ? '/md/index.md' : `/md${path}.md`, url.origin);

  return new Response(null, {
    headers: {
      'x-middleware-rewrite': dest.toString(),
      'content-type': 'text/markdown; charset=utf-8',
      'vary': 'Accept',
      'x-robots-tag': 'noindex',
    },
  });
}
