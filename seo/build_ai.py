# -*- coding: utf-8 -*-
"""Генерує файли для AI-агентів olitsar.com:
  - md/<шлях>.md  — Markdown-версії всіх HTML-сторінок (віддаються middleware.js при Accept: text/markdown)
  - llms.txt      — карта сайту для LLM (https://llmstxt.org/)
Запуск з кореня репозиторію:  pip install html2text && python3 seo/build_ai.py
Перезапускати після кожної зміни сторінок (щотижнева SEO-задача робить це автоматично).
"""
import glob, html, os, re
import html2text

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://olitsar.com"
SKIP = {"privacy.html"}


def url_for(rel):
    rel = rel.replace(os.sep, "/")
    if rel == "index.html":
        return "/"
    if rel.endswith("/index.html"):
        return "/" + rel[: -len("/index.html")]
    return "/" + rel[: -len(".html")]


def md_path_for(url):
    return "md/index.md" if url == "/" else "md" + url + ".md"


def meta(s, name, attr="name"):
    m = re.search(r'<meta %s="%s" content="([^"]*)"' % (attr, re.escape(name)), s)
    return html.unescape(m.group(1)) if m else ""


def title(s):
    m = re.search(r"<title>(.*?)</title>", s, re.S)
    t = html.unescape(m.group(1)).strip() if m else ""
    return re.sub(r"\s*\|\s*(Олітсар|ОЛІТСАР.*)$", "", t)


def to_markdown(s, url):
    from bs4 import BeautifulSoup
    soup = BeautifulSoup(s, "html.parser")
    root = soup.find("main") or soup.body or soup
    for el in root.find_all(["script", "style", "noscript", "svg", "form", "template", "header", "footer", "nav", "button", "select", "input", "textarea"]):
        el.decompose()
    sel = ('[class*="ticker"], [class*="nav-"], .mobile-nav, [class*="mob-bar"], [class*="sticky"], '
           '[class*="modal"], [class*="toast"], [class*="skeleton"], [aria-hidden="true"], .hp, .crumbs')
    for el in root.select(sel):
        el.decompose()
    body = str(root)
    h = html2text.HTML2Text()
    h.body_width = 0
    h.ignore_images = True
    h.baseurl = SITE + url
    h.unicode_snob = True
    md = h.handle(body)
    md = re.sub(r"\]\((/[^)]*)\)", lambda m: "](" + SITE + m.group(1) + ")", md)
    md = re.sub(r"\n{3,}", "\n\n", md).strip()
    t, d = title(s), meta(s, "description")
    head = f"# {t}\n\n> {d}\n\nДжерело: {SITE}{url}\n\n" if d else f"# {t}\n\nДжерело: {SITE}{url}\n\n"
    contact = ("\n\n---\nТОВ «ОЛІТСАР АГРО ГРУП», ЄДРПОУ 46097237 · 19723, Черкаська обл., Золотоніський р-н, "
               "с. Піщане, вул. Міхновського Юрія, 35а · +38 (099) 745-73-26 · olitsaragro@gmail.com\n")
    return head + md + contact


def main():
    os.chdir(ROOT)
    pages = sorted(glob.glob("*.html") + glob.glob("statti/*.html"))
    info = {}
    for rel in pages:
        if os.path.basename(rel) in SKIP:
            continue
        s = open(rel, encoding="utf-8").read()
        if re.search(r'<meta name="robots" content="[^"]*noindex', s):
            continue
        url = url_for(rel)
        out = md_path_for(url)
        os.makedirs(os.path.dirname(out), exist_ok=True)
        open(out, "w", encoding="utf-8").write(to_markdown(s, url))
        info[url] = (title(s), meta(s, "description"), s)

    def item(url):
        t, d, _ = info[url]
        d = re.split(r"(?<=[.!?])\s", d)[0] if d else ""
        return f"- [{t}]({SITE}{url})" + (f": {d}" if d else "")

    crops = ["/pshenytsia", "/kukurudza", "/yachmin", "/soniashnyk", "/soia", "/ripak"]
    groats_articles = [u for u in info if u.startswith("/statti/") and re.search(r"krup|artek|poltavsk|boroshn|vysiv|kutia", u)]
    grain_articles = [u for u in info if u.startswith("/statti/") and u not in groats_articles]

    lines = [
        "# ОЛІТСАР АГРО ГРУП (olitsar.com)",
        "",
        "> ТОВ «ОЛІТСАР АГРО ГРУП» (ЄДРПОУ 46097237, с. Піщане, Черкаська обл., Україна) — виробник пшеничної крупи "
        "«Полтавська» №3, №4 і «Артек» (опт від 1 тонни і роздріб, мішки 25–50 кг, біг-беги, навал; також борошно і висівки) "
        "та зернотрейдер, що закуповує пшеницю, кукурудзу, ячмінь, соняшник, сою і ріпак у виробників з ПДВ і без ПДВ.",
        "",
        "Мова сайту — українська. Ціни на сторінках актуальні на вказану на них дату; остаточну ціну під партію підтверджує менеджер: "
        "+38 (099) 745-73-26, olitsaragro@gmail.com. Markdown-версію будь-якої сторінки можна отримати із заголовком `Accept: text/markdown`.",
        "",
        "## Пшенична крупа від виробника",
    ]
    lines += [item(u) for u in ["/krupy"] if u in info]
    lines += [item(u) for u in groats_articles]
    lines += ["", "## Закупівля зерна і олійних"]
    lines += [item(u) for u in ["/"] + crops if u in info]
    lines += ["", "## Статті для фермерів"]
    lines += [item(u) for u in ["/statti"] if u in info] + [item(u) for u in grain_articles]
    lines += ["", "## Компанія"]
    lines += [item(u) for u in ["/finance", "/chesna-zemlya"] if u in info]
    lines += ["", "## Optional", f"- [Sitemap]({SITE}/sitemap.xml): усі сторінки сайту", f"- [Політика конфіденційності]({SITE}/privacy)", ""]
    open("llms.txt", "w", encoding="utf-8").write("\n".join(lines))
    print(f"md: {len(info)} сторінок, llms.txt: {len(lines)} рядків")


if __name__ == "__main__":
    main()
