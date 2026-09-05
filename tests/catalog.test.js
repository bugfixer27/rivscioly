const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const context = vm.createContext({});
vm.runInContext(
  fs.readFileSync(path.join(root, 'assets/js/data.js'), 'utf8') + '\n' +
  fs.readFileSync(path.join(root, 'assets/js/events-2027.js'), 'utf8') +
  '\nglobalThis.catalog = CURRENT_EVENTS; globalThis.archive = EVENTS; globalThis.results = REGIONAL_EVENTS;',
  context
);
const expected = [
  'Anatomy & Physiology','Astronomy','Boomilever','Botany','Chemistry Lab',
  'Circuit Lab','Codebusters','Designer Genes','Disease Detectives','Dynamic Planet',
  'Electric Vehicle','Engineering CAD','Experimental Design','Forensics','Hovercraft',
  'Mission Possible','Ping-Pong Parachute','Protein Modeling','Remote Sensing',
  'Rocks and Minerals','Thermodynamics','Water Quality','Wright Stuff','Code Craze'
];
test('new catalog contains the exact 24 requested events with unique IDs', () => {
  assert.deepEqual(Array.from(context.catalog, e => e.name), expected);
  assert.equal(new Set(context.catalog.map(e => e.id)).size, 24);
});
test('internal event documents are not exposed and Code Craze keeps its public trial link', () => {
  assert(context.catalog.filter(e => e.name !== 'Code Craze').every(e => !e.referenceUrl));
  const page = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  assert(!/href=["'][^"']*(?:drive\.google\.com|\.md(?:[?#"']))/i.test(page));
  const trial = context.catalog.find(e => e.name === 'Code Craze');
  assert.equal(trial.status, 'Featured trial');
  assert.equal(new URL(trial.referenceUrl).hostname, 'www.soinc.org');
});
test('historical catalog and results stay separate from new season IDs', () => {
  assert.equal(context.archive.length, 23);
  assert.equal(context.results.length, 23);
  assert(context.archive.some(e => e.name === 'Helicopter'));
  assert(!context.catalog.some(e => e.name === 'Helicopter'));
  assert(context.archive.every(e => !e.id.startsWith('2027-')));
});
