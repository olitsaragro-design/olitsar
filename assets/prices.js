/* Ціни закупівлі з опублікованої Google-таблиці (та сама, що на головній).
   Використання: <div id="crop-prices" data-match="Пшениця" data-mode="ports|single"></div> */
(function () {
  const CSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRsOPYWYLqn5HnxBB4Dn8xYxg169UAMlATnJ6SFfINuN09gnBLbbJyfCjmVlf_XRfd28CGf-xU3V-0a/pub?output=csv&gid=0';

  function parseCSV(text) {
    return text.split('\n').map(row => {
      const cols = []; let cur = '', inQ = false;
      for (const ch of row) {
        if (ch === '"') inQ = !inQ;
        else if (ch === ',' && !inQ) { cols.push(cur.trim()); cur = ''; }
        else cur += ch;
      }
      cols.push(cur.trim());
      return cols;
    });
  }

  // Та сама логіка розбору, що й на головній сторінці
  function toPrices(rows) {
    let hRow = -1;
    rows.forEach((r, i) => { if (r.join('').includes('КУЛЬТУРА')) hRow = i; });
    if (hRow < 0) throw new Error('no header');
    const data = {}; let mode = 'grain';
    rows.slice(hRow + 1).forEach(r => {
      const name = (r[1] || '').trim();
      if (!name) return;
      const low = name.toLowerCase();
      if (low.includes('соя')) { mode = 'soy'; return; }
      if (low.includes('соняшник')) { mode = 'sunf'; return; }
      if (low.includes('ріпак')) { mode = 'rape'; return; }
      if (mode === 'grain') {
        const v = [2, 3, 4, 5, 6, 7].map(i => parseInt(r[i]) || 0);
        if (v.some(Boolean)) data[name] = { f1: { piv: v[0], ode: v[2], chn: v[4] }, f3: { piv: v[1], ode: v[3], chn: v[5] } };
      }
      if (mode === 'soy') {
        const p1 = parseInt(r[2]) || 0, p2 = parseInt(r[4]) || 0, price = p1 || p2;
        if (price && !data['Соя']) {
          data['Соя'] = !p1 && p2
            ? { f1: { piv: 0 }, f3: { piv: price } }
            : { f1: { piv: price }, f3: { piv: 0 } };
        }
      }
      if (mode === 'sunf') {
        const p1 = parseInt(r[2]) || 0, p2 = parseInt(r[3]) || 0;
        if (p1 && !data['Соняшник 48%']) data['Соняшник 48%'] = { f1: { piv: p1 }, f3: { piv: p2 } };
      }
    });
    return data;
  }

  const fmt = v => (v && v > 0) ? Number(v).toLocaleString('uk-UA') : null;
  const cell = v => fmt(v) ? `<td class="v">${fmt(v)}</td>` : '<td class="na">—</td>';

  async function run() {
    const box = document.getElementById('crop-prices');
    if (!box) return;
    const match = box.dataset.match, mode = box.dataset.mode || 'ports';
    const upd = document.getElementById('prices-upd');
    try {
      const res = await fetch(CSV);
      if (!res.ok) throw new Error('fetch');
      const data = toPrices(parseCSV(await res.text()));
      const names = Object.keys(data).filter(n => n.toLowerCase().includes(match.toLowerCase()));
      if (!names.length) return; // лишаємо статичний текст
      let html = '<div class="tbl-wrap"><table class="pt"><thead>';
      if (mode === 'ports') {
        html += '<tr><th rowspan="2">Культура</th><th colspan="2">Південний</th><th colspan="2">Одеса</th><th colspan="2">Чорноморськ</th></tr>' +
                '<tr><th>Ф1 з ПДВ</th><th>Ф3 без ПДВ</th><th>Ф1 з ПДВ</th><th>Ф3 без ПДВ</th><th>Ф1 з ПДВ</th><th>Ф3 без ПДВ</th></tr></thead><tbody>';
        names.forEach(n => {
          const p = data[n];
          html += `<tr><td>${n}</td>${cell(p.f1.piv)}${cell(p.f3.piv)}${cell(p.f1.ode)}${cell(p.f3.ode)}${cell(p.f1.chn)}${cell(p.f3.chn)}</tr>`;
        });
      } else {
        html += '<tr><th>Культура</th><th>Ф1 з ПДВ</th><th>Ф3 без ПДВ</th></tr></thead><tbody>';
        names.forEach(n => { const p = data[n]; html += `<tr><td>${n}</td>${cell(p.f1.piv)}${cell(p.f3.piv)}</tr>`; });
      }
      html += '</tbody></table></div>';
      box.innerHTML = html;
      if (upd) upd.textContent = new Date().toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch (e) {
      if (upd) upd.textContent = 'уточнюйте за телефоном';
    }
  }

  // Форма заявки (той самий Formspree, що й на головній)
  window.sendLead = async function (btn) {
    const f = btn.closest('form');
    const name = f.querySelector('[name=name]').value.trim();
    const phone = f.querySelector('[name=phone]').value.trim();
    if (!name || !phone) { alert("Вкажіть ім'я та телефон"); return false; }
    const dg = phone.replace(/\D/g, '');
    if (!((dg.length === 10 && dg[0] === '0') || (dg.length === 12 && dg.startsWith('380')) || (dg.length === 9 && dg[0] !== '0') || (dg.length >= 11 && dg.length <= 13 && dg[0] !== '0'))) {
      alert('Перевірте номер телефону — наприклад, 067 123 45 67'); return false; }
    const data = {
      _subject: '🌾 Заявка з сайту: ' + f.dataset.crop,
      Форма: 'Сторінка ' + location.pathname,
      Культура: f.dataset.crop, Імя: name, Телефон: phone,
      Обсяг: f.querySelector('[name=volume]').value.trim(),
      Коментар: f.querySelector('[name=msg]').value.trim()
    };
    const orig = btn.textContent; btn.disabled = true; btn.textContent = 'Надсилаємо...';
    // заявка йде і в CRM, і на пошту (резерв)
    const mail = fetch('https://formspree.io/f/xqeopoaw', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) })
      .then(r => r.ok).catch(() => false);
    const crm = fetch('https://grainflow-crm-eoeu.vercel.app/api/lead/site', { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      body: JSON.stringify({ name, phone, crop: f.dataset.crop, volume: data.Обсяг, message: data.Коментар, form: 'Сторінка сайту', page: location.pathname, website: (f.querySelector('[name=website]') || {}).value || '' }) })
      .then(r => r.ok).catch(() => false);
    const [m, c] = await Promise.all([mail, crm]);
    if (m || c) { btn.textContent = '✓ Заявку надіслано!'; f.reset(); }
    else btn.textContent = 'Помилка — зателефонуйте нам';
    setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 4000);
    return false;
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
