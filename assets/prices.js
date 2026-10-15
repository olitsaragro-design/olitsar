/* Ціни закупівлі з CRM (найкраща ціна на базисі мінус маржа рахується в CRM).
   Використання: <div id="crop-prices" data-match="Пшениця"></div> */
(function () {
  // Ціни з CRM (вкладка «Ціни»): найкраща ціна партнера на базисі мінус наша маржа — рахує CRM
  const API = 'https://grainflow-crm-eoeu.vercel.app/api/public/site-prices';
  const BASES = [['dun', 'Дунай (Ізмаїл, Рені)'], ['ode', 'Одеса'], ['myk', 'Миколаїв']];

  const fmt = v => (v && v > 0) ? Number(v).toLocaleString('uk-UA') : null;
  const esc = t => String(t || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const cell = (c, k) => c && fmt(c[k]) ? `<td class="v">${fmt(c[k])}</td>` : '<td class="na">—</td>';

  async function run() {
    const box = document.getElementById('crop-prices');
    if (!box) return;
    const match = box.dataset.match;
    const upd = document.getElementById('prices-upd');
    try {
      const res = await fetch(API, { cache: 'no-store' });
      if (!res.ok) throw new Error('fetch');
      const j = await res.json();
      const list = (j.crops || []).filter(c => c.name.toLowerCase().includes(match.toLowerCase()));
      if (!list.length) throw new Error('none'); // лишаємо статичний текст
      // показуємо лише ті базиси, де є хоч одна ціна
      const bases = BASES.filter(([k]) => list.some(c => c[k]));
      let html = '<div class="tbl-wrap"><table class="pt"><thead>';
      if (bases.length) {
        html += '<tr><th rowspan="2">Культура</th>' + bases.map(([, l]) => `<th colspan="2">${l}</th>`).join('') + '</tr><tr>' +
                bases.map(() => '<th>Ф1 з ПДВ</th><th>Ф3 без ПДВ</th>').join('') + '</tr></thead><tbody>';
        list.forEach(c => { html += `<tr><td>${esc(c.name)}</td>${bases.map(([k]) => cell(c[k], 'f1') + cell(c[k], 'f3')).join('')}</tr>`; });
      } else {
        html += '<tr><th>Культура</th><th>Ф1 з ПДВ</th><th>Ф3 без ПДВ</th><th>Базис</th></tr></thead><tbody>';
        list.forEach(c => { html += `<tr><td>${esc(c.name)}</td>${cell(c.best, 'f1')}${cell(c.best, 'f3')}<td>${esc(c.best && c.best.where)}</td></tr>`; });
      }
      html += '</tbody></table></div>';
      box.innerHTML = html;
      if (upd) upd.textContent = new Date(j.updatedAt || Date.now()).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' });
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
    // спершу CRM, потім пошта (резерв) — у листі видно, що відповіла CRM
    let crm = 'не дійшло';
    try {
      const r = await fetch('https://grainflow-crm-eoeu.vercel.app/api/lead/site', { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
        body: JSON.stringify({ name, phone, crop: f.dataset.crop, volume: data.Обсяг, message: data.Коментар, form: 'Сторінка сайту', page: location.pathname, website: (f.querySelector('[name=website]') || {}).value || '' }) });
      crm = r.ok ? 'ok' : 'помилка ' + r.status + ' ' + (await r.text().catch(() => '')).slice(0, 120);
    } catch (e) { crm = 'не дійшло: ' + String((e && e.message) || e).slice(0, 120); }
    const m = await fetch('https://formspree.io/f/xqeopoaw', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ ...data, CRM: crm, 'Версія сайту': 'v7' }) }).then(r => r.ok).catch(() => false);
    if (m || crm === 'ok') { btn.textContent = '✓ Заявку надіслано!'; f.reset(); }
    else btn.textContent = 'Помилка — зателефонуйте нам';
    setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 4000);
    return false;
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
