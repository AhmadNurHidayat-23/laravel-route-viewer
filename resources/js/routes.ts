export interface RouteRow { method: string; uri: string; name: string; action: string; middleware: string[]; domain: string; prefix: string }
export function parseRoutes(text: string): RouteRow[] {
  const data = JSON.parse(text); if (!Array.isArray(data) || data.length > 20000) throw new Error('Data harus berupa array route, maksimal 20.000 item.');
  return data.map((r, i) => {
    if (!r || typeof r.method !== 'string' || !/^[A-Z]+(?:[|,][A-Z]+)*$/.test(r.method) || typeof r.uri !== 'string' || (r.action != null && typeof r.action !== 'string') || (r.name != null && typeof r.name !== 'string')) throw new Error('Route ke-' + (i + 1) + ' tidak valid.');
    const middleware = typeof r.middleware === 'string' ? [r.middleware] : (r.middleware ?? []);
    if (!Array.isArray(middleware) || middleware.some(m => typeof m !== 'string')) throw new Error('Middleware harus berupa string atau array string.');
    return { method: r.method, uri: r.uri, name: r.name || '', action: r.action || 'Closure', middleware, domain: String(r.domain || ''), prefix: r.uri.replace(/^\//, '').split('/')[0] || '/' };
  });
}
export function filterRoutes(rows: RouteRow[], search: string, method: string, prefix: string) {
  return rows.filter(r => (!method || r.method.split(/[|,]/).includes(method)) && (!prefix || r.prefix === prefix) && [r.uri, r.name, r.action, r.domain, ...r.middleware].join(' ').toLowerCase().includes(search.toLowerCase()));
}
export function csv(rows: RouteRow[]) {
  const cell = (s: string) => '"' + (/^[=+@-]/.test(s) ? "'" : '') + s.replaceAll('"', '""') + '"';
  return ['Method,URI,Nama,Controller,Action,Middleware,Domain', ...rows.map(r => { const [controller, action = '__invoke / Closure'] = r.action.split('@'); return [r.method, r.uri, r.name, controller, action, r.middleware.join(' | '), r.domain].map(cell).join(','); })].join('\r\n');
}
