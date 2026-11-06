import { it, expect } from 'vitest'; import { parseRoutes, filterRoutes, csv } from './routes';
const text = JSON.stringify([{ method: 'GET|HEAD', uri: 'api/users', name: 'users.index', action: 'UserController@index', middleware: ['api', 'auth'] }, { method: 'POST', uri: 'users', action: 'Closure' }]);
it('membaca method, prefix, action, dan middleware asli', () => { const r = parseRoutes(text); expect(r[0].middleware).toEqual(['api', 'auth']); expect(r[0].prefix).toBe('api'); expect(filterRoutes(r, 'UserController', 'GET', 'api')).toHaveLength(1); });
it('menolak format yang bukan route:list', () => { expect(() => parseRoutes('{}')).toThrow(); expect(() => parseRoutes('[{"uri":"x"}]')).toThrow(); });
it('export CSV memisahkan controller dan action', () => { expect(csv(parseRoutes(text))).toContain('"UserController","index"'); });
