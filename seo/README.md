# SEO-журнал olitsar.com

Ця папка не публікується на сайті (див. `.vercelignore`).
Щотижнева задача записує сюди знімок пошукових запитів із Google Search Console
і перелік змін, щоб наступного тижня порівнювати результати.

- `log.md` — журнал змін по тижнях (дата, що змінено, на який запит, позиція/кліки «до»).
- `gsc-YYYY-MM-DD.csv` — експорт запитів за 28 днів (query, page, clicks, impressions, ctr, position).

## Файли для AI-агентів
- `python3 seo/build_ai.py` (потрібні `html2text`, `beautifulsoup4`) — перегенеровує `llms.txt` і Markdown-версії сторінок у `md/`.
  Запускати після кожної зміни або додавання сторінок, перед комітом.
- `middleware.js` віддає `md/<шлях>.md`, коли запит має `Accept: text/markdown`; заголовки — у `vercel.json`.
