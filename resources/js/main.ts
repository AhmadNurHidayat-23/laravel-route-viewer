import './style.css'; import './theme';
import { parseRoutes, filterRoutes, csv, type RouteRow } from './routes';
import { download, readFile, message } from './io';
const el = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const source = el<HTMLTextAreaElement>('source'), search = el<HTMLInputElement>('search'), method = el<HTMLSelectElement>('method'), prefix = el<HTMLSelectElement>('prefix');
let routes: RouteRow[] = [], shown: RouteRow[] = [];
function status(text: string) { el('status').hidden = false; el('status').textContent = text; }
function render() {
  shown = filterRoutes(routes, search.value, method.value, prefix.value);
  el('count').textContent = shown.length + ' / ' + routes.length + ' ROUTE';
  const container = el('result'); container.replaceChildren();
  if (!shown.length) { const p = document.createElement('p'); p.className = 'empty'; p.textContent = 'Tidak ada route yang cocok.'; container.append(p); }
  const groups = [...new Set(shown.map(r => r.prefix))].sort();
  for (const group of groups) {
    const h = document.createElement('h3'); h.className = 'panel-body'; h.textContent = '/' + (group === '/' ? '' : group); container.append(h);
    const table = document.createElement('table'), head = document.createElement('thead'), row = document.createElement('tr');
    ['Method', 'URI / Nama', 'Controller / Action', 'Middleware'].forEach(text => { const th = document.createElement('th'); th.textContent = text; row.append(th); }); head.append(row); table.append(head);
    const body = document.createElement('tbody');
    for (const r of shown.filter(r => r.prefix === group)) { const tr = document.createElement('tr'); [r.method, r.uri + (r.name ? '\n' + r.name : '') + (r.domain ? '\n' + r.domain : ''), r.action.replace('@', '\n→ '), r.middleware.join('\n') || '—'].forEach(text => { const td = document.createElement('td'); td.textContent = text; td.className = 'whitespace-pre-wrap'; tr.append(td); }); body.append(tr); }
    table.append(body); container.append(table);
  }
  el<HTMLButtonElement>('json').disabled = !shown.length; el<HTMLButtonElement>('csv').disabled = !shown.length;
}
function load(text: string) { const parsed = parseRoutes(text); routes = parsed; source.value = text; prefix.replaceChildren(new Option('Semua prefix', ''), ...[...new Set(routes.map(r => r.prefix))].sort().map(p => new Option('/' + p, p))); render(); status(routes.length + ' route berhasil dibaca.'); }
el('import').addEventListener('click', () => { try { load(source.value); } catch (e) { status(message(e)); } });
el<HTMLInputElement>('file').addEventListener('change', async e => { try { load(await readFile((e.target as HTMLInputElement).files?.[0])); } catch (err) { status(message(err)); } });
el('local').addEventListener('click', async () => { try { const res = await fetch('/local-routes'); if (!res.ok) throw new Error('Route lokal tidak dapat dibaca.'); load(await res.text()); } catch (e) { status(message(e)); } });
[search, method, prefix].forEach(node => node.addEventListener('input', render));
el('json').addEventListener('click', () => download('routes.json', JSON.stringify(shown.map(({ prefix: _, ...r }) => r), null, 2), 'application/json'));
el('csv').addEventListener('click', () => download('routes.csv', csv(shown), 'text/csv'));
