const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');

function setup() {
  const nodes = new Map(), listeners = {}, requests = [], submitted = [];
  class Element {
    constructor(tag = 'div') {
      this.tagName = tag.toUpperCase(); this.children = []; this.dataset = {};
      this.style = { setProperty() {} }; this.attrs = {}; this.events = {};
      this.value = ''; this.textContent = ''; this._html = ''; this._classes = new Set();
      this.classList = {
        add: (...x) => x.forEach(v => this._classes.add(v)),
        remove: (...x) => x.forEach(v => this._classes.delete(v)),
        contains: x => this._classes.has(x),
        toggle: (x, force) => force ? this._classes.add(x) : this._classes.delete(x)
      };
    }
    set className(v) { this._classes = new Set(v.split(/\s+/)); }
    get className() { return [...this._classes].join(' '); }
    set innerHTML(v) { this._html = v; this.children = []; }
    get innerHTML() { return this._html; }
    setAttribute(k, v) { this.attrs[k] = v; }
    getAttribute(k) { return this.attrs[k] || null; }
    removeAttribute(k) { delete this.attrs[k]; }
    appendChild(e) { this.children.push(e); return e; }
    addEventListener(k, fn) { this.events[k] = fn; }
    focus() {} select() {} reset() {} remove() {}
    querySelector(s) {
      if (s === 'button[type="submit"]') return this.button;
      if (s === '.budget-form-status') return this.status;
      return null;
    }
    querySelectorAll() { return []; }
    submit() { submitted.push(this); }
    animate() {}
  }
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  for (const match of html.matchAll(/<([a-z][a-z0-9]*)\b([^>]*\bid="([^"]+)"[^>]*)>/g)) {
    const e = new Element(match[1]); e.id = match[3];
    e.className = match[2].match(/class="([^"]+)"/)?.[1] || '';
    nodes.set(e.id, e);
  }
  const nav = [...html.matchAll(/<button[^>]*class="nav-tab[^"]*"[^>]*onclick="([^"]+)"[^>]*>/g)]
    .map(m => { const e = new Element('button'); e.setAttribute('onclick', m[1]); return e; });
  const document = {
    body: new Element('body'),
    getElementById: id => nodes.get(id) || null,
    createElement: t => new Element(t),
    querySelector: () => null,
    querySelectorAll: s => s === '.view' ? [...nodes.values()].filter(e => e.classList.contains('view')) : s === '.nav-tab' ? nav : [],
    addEventListener: (k, fn) => { (listeners[k] ||= []).push(fn); },
    dispatchEvent: e => (listeners[e.type] || []).forEach(fn => fn(e))
  };
  const store = new Map();
  const c = {
    document, console, URLSearchParams,
    sessionStorage: { getItem: k => store.get(k) || null, setItem: (k, v) => store.set(k, v) },
    CustomEvent: class { constructor(type, options) { this.type = type; this.detail = options.detail; } },
    setTimeout: () => 1, clearTimeout() {},
    FormData: class { constructor(form) { this.form = form; } entries() { return Object.entries(this.form.values); } },
    fetch: async (url, options) => { requests.push({ url, options }); return { ok: true, json: async () => ({ answer: 'Test answer', dashboard: {}, purchaseRequests: [], spendingLog: [] }) }; }
  };
  c.window = c; c.matchMedia = () => ({ matches: true }); c.scrollTo = () => {};
  vm.createContext(c);
  for (const file of ['data.js', 'events-2027.js', 'app.js'])
    vm.runInContext(fs.readFileSync(path.join(root, 'assets/js', file), 'utf8'), c);
  return { c, nodes, nav, requests, submitted, Element, store };
}

test('archived roster renders and filters without event-only variables', () => {
  const { c, nodes, Element } = setup();
  c.renderRoster();
  const total = nodes.get('roster-grid').children.length;
  assert(total > 15);
  c.setRosterTeam('A', new Element());
  const a = nodes.get('roster-grid').children.length;
  c.setRosterTeam('B', new Element());
  const b = nodes.get('roster-grid').children.length;
  assert(a > 0 && b > 0); assert.equal(a + b, total);
  assert(nodes.get('roster-grid').children.every(e => e.innerHTML.includes('Team B')));
});

test('every view swaps and dispatches the feature lifecycle, even without animation libraries', async () => {
  const { c, nodes, nav } = setup();
  const seen = [];
  c.document.addEventListener('site:viewchange', e => seen.push(e.detail.name));
  for (const name of ['home','newcomer','events','regional','roster','resources','studyhub','ai','request','leaders','contact']) {
    await c.showView(name, nav.find(t => t.getAttribute('onclick').includes("'" + name + "'")));
    assert(nodes.get('view-' + name).classList.contains('active'));
  }
  assert.equal(seen.length, 11);
  assert(!nodes.get('leaders-gate').classList.contains('hidden'));
  assert(nodes.get('leaders-dashboard').classList.contains('hidden'));
});

test('View Transition callback completes before navigation follow-up actions', async () => {
  const { c, nodes } = setup();
  c.matchMedia = () => ({ matches: false });
  c.document.startViewTransition = fn => {
    const done = Promise.resolve().then(fn);
    return { updateCallbackDone: done, finished: done, skipTransition() {} };
  };
  await c.showView('roster');
  assert(nodes.get('view-roster').classList.contains('active'));
  assert(nodes.get('roster-grid').children.length > 15);
});

test('Leaders rejects wrong passwords and renders the original roster after unlock', async () => {
  const { c, nodes, requests, store } = setup();
  nodes.get('leaders-password').value = 'incorrect-test-value';
  c.unlockLeaders({ preventDefault() {} });
  assert.equal(nodes.get('leaders-error').textContent, 'Incorrect password.');
  assert.equal(requests.length, 0);
  vm.runInContext("document.getElementById('leaders-password').value = LEADERS_PASSWORD", c);
  c.unlockLeaders({ preventDefault() {} });
  assert.equal(store.get('leadersAccessGranted'), 'true');
  assert(nodes.get('leaders-roster-grid').children.length > 15);
  await Promise.resolve(); await Promise.resolve();
  assert(requests.some(r => new URL(r.url).searchParams.get('action') === 'budget'));
  c.openLeaderStudentModal('Florian');
  assert(!nodes.get('leader-student-modal-overlay').classList.contains('hidden'));
  c.closeLeaderStudentModal();
});

test('all current event modals and historical results still render', () => {
  const { c, nodes } = setup();
  vm.runInContext('CURRENT_EVENTS.forEach(openModal); EVENTS.forEach(openModal);', c);
  c.closeModal();
  c.renderResults();
  assert(nodes.get('results-grid').children.length > 0);
  assert(nodes.get('modal-overlay').classList.contains('hidden'));
});

test('AI and both purchase forms keep their request contracts, with network mocked', async () => {
  const { c, nodes, requests, submitted, Element } = setup();
  nodes.get('ai-query').value = 'Explain a circuit';
  await c.askSciOlyAI({ preventDefault() {} });
  assert.deepEqual(JSON.parse(requests[0].options.body), { query: 'Explain a circuit' });
  assert.equal(nodes.get('ai-response-text').textContent, 'Test answer');
  for (const kind of ['public', 'leaders']) {
    const form = new Element('form'); form.button = new Element('button'); form.status = new Element();
    form.values = { requester: 'Test', category: 'Build Events', estimatedCost: '5.00', qty: '1', description: kind };
    c.submitBudgetRequest({ preventDefault() {}, currentTarget: form });
  }
  assert.equal(submitted.length, 2);
  for (const payloadForm of submitted) {
    assert.equal(payloadForm.method, 'POST');
    assert(payloadForm.children.some(e => e.name === 'action' && e.value === 'createPurchaseRequest'));
  }
});

test('result browser wraps in both directions and comparison hides only the selected team panel', () => {
  const { c, nodes, Element } = setup();
  const events = vm.runInContext('REGIONAL_EVENTS', c);
  c.stepResultDetail(events.length - 1, 1);
  assert.equal(nodes.get('result-modal-title').textContent, events[0]);
  c.stepResultDetail(0, -1);
  assert.equal(nodes.get('result-modal-title').textContent, events.at(-1));
  const panels = ['A', 'B'].map(team => { const panel = new Element(); panel.dataset.resultTeam = team; return panel; });
  const buttons = Array.from({ length: 3 }, () => new Element('button'));
  nodes.get('result-modal').querySelectorAll = selector => selector === '[data-result-team]' ? panels : buttons;
  c.setResultDetailTeam('B', buttons[2]);
  assert.deepEqual(panels.map(p => p.hidden), [true, false]);
  assert.equal(buttons[2].getAttribute('aria-pressed'), 'true');
  c.setResultDetailTeam('all', buttons[0]);
  assert.deepEqual(panels.map(p => p.hidden), [false, false]);
});

test('rapid view changes ignore stale transition callbacks', async () => {
  const { c, nodes } = setup();
  const callbacks = [];
  c.matchMedia = () => ({ matches: false });
  c.document.startViewTransition = callback => {
    callbacks.push(callback);
    return { skipTransition() {}, finished: Promise.resolve(), updateCallbackDone: Promise.resolve() };
  };
  await c.showView('events');
  await c.showView('roster');
  callbacks[1]();
  callbacks[0]();
  assert(nodes.get('view-roster').classList.contains('active'));
  assert(!nodes.get('view-events').classList.contains('active'));
  assert(nodes.get('roster-grid').children.length > 15);
});
