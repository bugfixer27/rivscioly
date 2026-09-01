/* =====================================================================
   RIVERDALE SCIENCE OLYMPIAD — EXPERIENCE LAYER (features.js)
   Loads AFTER data.js + app.js. Adds: preloader, theme engine, scroll
   chrome, command palette, toasts/confetti, home personalization,
   live countdowns, the Analytics dashboard, and the Study Hub.
   Everything is self-contained and reads the existing data globals.
   ===================================================================== */
(function () {
  'use strict';

  // Small helper — reuse app.js escapeHTML if present, else local copy.
  const esc = (window.escapeHTML) ? window.escapeHTML : function (v) {
    return String(v).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  const ord = (window.ordinal) ? window.ordinal : function (n) {
    const s = ['th', 'st', 'nd', 'rd'], v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (sel, root) => (root || document).querySelector(sel);

  // data.js declares its data with `const`, which does NOT attach to window.
  // Bridge the values we read onto window so the rest of this file can use them.
  function exposeGlobals() {
    try { window.EVENTS = window.EVENTS || EVENTS; } catch (e) {}
    try { window.REGIONAL_EVENTS = window.REGIONAL_EVENTS || REGIONAL_EVENTS; } catch (e) {}
    try { window.REGIONAL_TYPES = window.REGIONAL_TYPES || REGIONAL_TYPES; } catch (e) {}
    try { window.REGIONAL_ICONS = window.REGIONAL_ICONS || REGIONAL_ICONS; } catch (e) {}
    try { window.RIVERDALE_A_SCORES = window.RIVERDALE_A_SCORES || RIVERDALE_A_SCORES; } catch (e) {}
    try { window.RIVERDALE_B_SCORES = window.RIVERDALE_B_SCORES || RIVERDALE_B_SCORES; } catch (e) {}
    try { window.TEAM_A_ASSIGNMENTS = window.TEAM_A_ASSIGNMENTS || TEAM_A_ASSIGNMENTS; } catch (e) {}
    try { window.TEAM_B_ASSIGNMENTS = window.TEAM_B_ASSIGNMENTS || TEAM_B_ASSIGNMENTS; } catch (e) {}
    try { window.TEAM_LEADERS = window.TEAM_LEADERS || TEAM_LEADERS; } catch (e) {}
    try { window.COUNTDOWN_EVENTS = window.COUNTDOWN_EVENTS || COUNTDOWN_EVENTS; } catch (e) {}
    try { window.LEADERS_BUDGET_URL = window.LEADERS_BUDGET_URL || LEADERS_BUDGET_URL; } catch (e) {}
  }

  /* ===================================================================
     PRELOADER
     =================================================================== */
  function initPreloader() {
    const pre = document.getElementById('fx-preloader');
    if (!pre) return;
    const bar = pre.querySelector('.fx-pre-bar > span');
    let pct = 0;
    const tick = setInterval(() => {
      pct = Math.min(96, pct + Math.random() * 16 + 6);
      if (bar) bar.style.width = pct + '%';
    }, 130);

    let finished = false;
    function finish() {
      if (finished) return;
      finished = true;
      clearInterval(tick);
      if (bar) bar.style.width = '100%';
      setTimeout(() => pre.classList.add('fx-done'), 280);
      setTimeout(() => { pre.style.display = 'none'; }, 1100);
    }
    if (document.readyState === 'complete') setTimeout(finish, 500);
    else window.addEventListener('load', () => setTimeout(finish, 350));
    setTimeout(finish, 2200); // hard fallback so it never sticks
  }

  /* ===================================================================
     THEME ENGINE
     =================================================================== */
  function initTheme() {
    const stored = localStorage.getItem('fx_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = stored || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  }
  function toggleTheme() {
    const cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('fx_theme', next);
    toast(next === 'dark' ? '🌙 Dark mode on' : '☀️ Light mode on');
  }

  /* ===================================================================
     SCROLL CHROME — progress bar + back-to-top
     =================================================================== */
  function initScrollChrome() {
    const prog = document.getElementById('fx-progress');
    const top = document.getElementById('fx-top');
    function onScroll() {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? (h.scrollTop / max) * 100 : 0;
      if (prog) prog.style.width = p + '%';
      if (top) top.classList.toggle('visible', h.scrollTop > 400);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ===================================================================
     TOAST + CONFETTI
     =================================================================== */
  function toast(message, icon) {
    const host = document.getElementById('fx-toasts');
    if (!host) return;
    const el = document.createElement('div');
    el.className = 'fx-toast';
    el.innerHTML = (icon ? `<span class="fx-toast-ico">${esc(icon)}</span>` : '') +
      `<span>${esc(message)}</span>`;
    host.appendChild(el);
    setTimeout(() => {
      el.classList.add('fx-out');
      setTimeout(() => el.remove(), 420);
    }, 2600);
  }
  window.fxToast = toast;

  function confetti(originX, originY, count) {
    if (reduceMotion) return;
    const canvas = document.getElementById('fx-confetti');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const ox = originX == null ? window.innerWidth / 2 : originX;
    const oy = originY == null ? window.innerHeight / 3 : originY;
    const colors = ['#8B1A1A', '#C9A84C', '#E8C96A', '#ffffff', '#c0392b', '#f5de96'];
    const N = count || 130;
    const parts = [];
    for (let i = 0; i < N; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = Math.random() * 9 + 3;
      parts.push({
        x: ox, y: oy,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp - 6,
        size: Math.random() * 7 + 4,
        color: colors[(Math.random() * colors.length) | 0],
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.4,
        life: 1
      });
    }
    let frame = 0;
    function step() {
      frame++;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      let alive = false;
      parts.forEach(p => {
        if (p.life <= 0) return;
        alive = true;
        p.vy += 0.28;          // gravity
        p.vx *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        p.life -= 0.012;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      });
      if (alive && frame < 240) requestAnimationFrame(step);
      else ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
    requestAnimationFrame(step);
  }
  window.fxConfetti = confetti;

  /* ===================================================================
     COMMAND PALETTE
     =================================================================== */
  const PAGES = [
    { view: 'home', title: 'Home', sub: 'Season overview & your dashboard', icon: '🏠' },
    { view: 'newcomer', title: 'New Members', sub: 'How the club works', icon: '🌟' },
    { view: 'events', title: 'Events', sub: 'All 23 Division C events', icon: '📋' },
    { view: 'regional', title: 'Results', sub: '2026 NYC Regional placements', icon: '🏅' },
    { view: 'analytics', title: 'Analytics', sub: 'Charts & performance breakdown', icon: '📊' },
    { view: 'roster', title: 'Team', sub: 'Roster & event assignments', icon: '👥' },
    { view: 'resources', title: 'Resources', sub: 'Study links & tools', icon: '🌐' },
    { view: 'studyhub', title: 'Study Hub', sub: 'Flashcards, quiz, focus timer', icon: '🧠' },
    { view: 'ai', title: 'SciOly AI', sub: 'Ask the team AI a question', icon: '✨' },
    { view: 'schedule', title: 'Schedule', sub: 'Season calendar', icon: '🗓️' },
    { view: 'request', title: 'Request', sub: 'Submit a purchase request', icon: '🛒' },
    { view: 'leaders', title: 'Leaders', sub: 'Protected dashboard', icon: '🔒' },
    { view: 'contact', title: 'Contact', sub: 'Reach leaders & advisor', icon: '✉️' }
  ];

  let paletteItems = [];
  let paletteActive = 0;

  function buildPaletteIndex() {
    const items = [];
    PAGES.forEach(p => items.push({
      type: 'Page', title: p.title, sub: p.sub, icon: p.icon,
      run: () => navTo(p.view)
    }));
    items.push(
      { type: 'Action', title: 'Toggle dark / light theme', sub: 'Switch the whole site', icon: '🌓', run: toggleTheme },
      { type: 'Action', title: 'Start a focus session', sub: 'Open the Study Hub timer', icon: '⏱️', run: () => { navTo('studyhub'); setStudyTab('timer'); } },
      { type: 'Action', title: 'Open team budget sheet', sub: 'Google Sheets', icon: '💰', run: () => window.open((window.LEADERS_BUDGET_URL || '#'), '_blank') }
    );
    if (Array.isArray(window.EVENTS)) {
      window.EVENTS.forEach(ev => items.push({
        type: 'Event', title: ev.name, sub: ev.shortDesc, icon: ev.icon,
        run: () => { closePalette(); if (window.openModal) window.openModal(ev); }
      }));
    }
    try {
      if (window.getStudentRecords) {
        window.getStudentRecords().forEach(st => items.push({
          type: 'Teammate', title: st.name,
          sub: 'Team ' + st.teams.join(' / ') + ' · ' + st.events.length + ' events',
          icon: '👤', run: () => navTo('roster')
        }));
      }
    } catch (e) { /* ignore */ }
    const RES = [
      { title: 'soinc.org — Official Rules', url: 'https://www.soinc.org/events/div-c' },
      { title: 'scioly.org Wiki', url: 'https://scioly.org/wiki/index.php/Main_Page' },
      { title: 'scioly.org Test Exchange', url: 'https://scioly.org/tests/' },
      { title: 'scioly.org Forums', url: 'https://scioly.org/forums/' }
    ];
    RES.forEach(r => items.push({
      type: 'Resource', title: r.title, sub: r.url, icon: '🔗',
      run: () => window.open(r.url, '_blank')
    }));
    return items;
  }

  function navTo(view) {
    closePalette();
    const tab = document.querySelector(`.nav-tab[onclick*="'${view}'"]`);
    if (window.showView) window.showView(view, tab);
  }

  function fuzzy(query, text) {
    query = query.toLowerCase(); text = text.toLowerCase();
    if (!query) return 1;
    const idx = text.indexOf(query);
    if (idx === 0) return 1000;
    if (idx > 0) return 500 - idx;
    // subsequence
    let qi = 0, score = 0, last = -1;
    for (let i = 0; i < text.length && qi < query.length; i++) {
      if (text[i] === query[qi]) {
        score += (last === i - 1) ? 6 : 2;
        last = i; qi++;
      }
    }
    return qi === query.length ? score : -1;
  }

  function renderPalette(query) {
    const list = document.getElementById('fx-palette-results');
    const all = buildPaletteIndex();
    let scored;
    if (!query.trim()) {
      scored = all.filter(i => i.type === 'Page' || i.type === 'Action');
    } else {
      scored = all.map(i => {
        const s = Math.max(
          fuzzy(query, i.title),
          fuzzy(query, i.sub || '') - 80,
          fuzzy(query, i.type) - 200
        );
        return { i, s };
      }).filter(x => x.s > -1).sort((a, b) => b.s - a.s).slice(0, 24).map(x => x.i);
    }
    paletteItems = scored;
    paletteActive = 0;
    if (!scored.length) {
      list.innerHTML = '<div class="fx-palette-empty">No matches. Try “events”, a name, or “timer”.</div>';
      return;
    }
    let html = '';
    let lastType = null;
    scored.forEach((it, i) => {
      if (it.type !== lastType) {
        html += `<div class="fx-palette-group-label">${esc(it.type)}s</div>`;
        lastType = it.type;
      }
      html += `
        <div class="fx-palette-item${i === 0 ? ' fx-active' : ''}" data-i="${i}">
          <div class="fx-pi-ico">${esc(it.icon || '•')}</div>
          <div class="fx-pi-text">
            <div class="fx-pi-title">${esc(it.title)}</div>
            ${it.sub ? `<div class="fx-pi-sub">${esc(it.sub)}</div>` : ''}
          </div>
          <div class="fx-pi-go">↵ open</div>
        </div>`;
    });
    list.innerHTML = html;
    list.querySelectorAll('.fx-palette-item').forEach(el => {
      el.addEventListener('mousemove', () => setActive(+el.dataset.i));
      el.addEventListener('click', () => runActive(+el.dataset.i));
    });
  }

  function setActive(i) {
    paletteActive = i;
    document.querySelectorAll('.fx-palette-item').forEach(el => {
      el.classList.toggle('fx-active', +el.dataset.i === i);
    });
  }
  function runActive(i) {
    const it = paletteItems[i != null ? i : paletteActive];
    if (it && it.run) it.run();
  }

  function openPalette() {
    const p = document.getElementById('fx-palette');
    if (!p) return;
    p.classList.remove('hidden');
    const input = document.getElementById('fx-palette-input');
    input.value = '';
    renderPalette('');
    setTimeout(() => input.focus(), 30);
    document.body.style.overflow = 'hidden';
  }
  function closePalette() {
    const p = document.getElementById('fx-palette');
    if (!p) return;
    p.classList.add('hidden');
    if (!anyModalOpen()) document.body.style.overflow = '';
  }
  function anyModalOpen() {
    return ['modal-overlay', 'result-modal-overlay', 'leader-student-modal-overlay']
      .some(id => { const e = document.getElementById(id); return e && !e.classList.contains('hidden'); });
  }
  function paletteOpen() {
    const p = document.getElementById('fx-palette');
    return p && !p.classList.contains('hidden');
  }

  function initPalette() {
    const input = document.getElementById('fx-palette-input');
    const overlay = document.getElementById('fx-palette');
    if (!input || !overlay) return;
    input.addEventListener('input', () => renderPalette(input.value));
    overlay.addEventListener('click', e => { if (e.target === overlay) closePalette(); });
    document.addEventListener('keydown', e => {
      const key = e.key;
      const meta = e.metaKey || e.ctrlKey;
      if (meta && (key === 'k' || key === 'K')) { e.preventDefault(); paletteOpen() ? closePalette() : openPalette(); return; }
      if (key === '/' && !paletteOpen() && !isTyping(e.target) && !anyModalOpen()) { e.preventDefault(); openPalette(); return; }
      if (!paletteOpen()) return;
      if (key === 'Escape') { e.preventDefault(); closePalette(); }
      else if (key === 'ArrowDown') { e.preventDefault(); setActive(Math.min(paletteActive + 1, paletteItems.length - 1)); scrollActiveIntoView(); }
      else if (key === 'ArrowUp') { e.preventDefault(); setActive(Math.max(paletteActive - 1, 0)); scrollActiveIntoView(); }
      else if (key === 'Enter') { e.preventDefault(); runActive(); }
    });
  }
  function isTyping(el) {
    return el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable);
  }
  function scrollActiveIntoView() {
    const el = document.querySelector('.fx-palette-item.fx-active');
    if (el) el.scrollIntoView({ block: 'nearest' });
  }

  /* ===================================================================
     LIVE COUNTDOWNS + HOME PERSONALIZATION ("YOUR SEASON")
     =================================================================== */
  const FX_MILESTONES = [
    { id: 'rules', week: 'Weeks 1–2', title: 'Read your official event rules', desc: 'Read every assigned event cover to cover on soinc.org.' },
    { id: 'wiki', week: 'Weeks 1–2', title: 'Study the scioly.org wiki pages', desc: 'Skim the wiki for each event and bookmark the best guides.' },
    { id: 'binder', week: 'Weeks 3–6', title: 'Start your binder or prototype', desc: 'Begin resource binders or prototyping your build device.' },
    { id: 'tests', week: 'Weeks 3–6', title: 'Take 3 practice tests', desc: 'Work through past tests from the scioly.org exchange.' },
    { id: 'weak', week: 'Weeks 7–10', title: 'Target your weak areas', desc: 'Find low-scoring topics and drill them specifically.' },
    { id: 'buildtest', week: 'Weeks 7–10', title: 'Test build devices 5+ times', desc: 'Log calibration data for every device run.' },
    { id: 'timed', week: 'Final 2 weeks', title: 'Run full timed practice', desc: 'Simulate competition conditions end to end.' },
    { id: 'logistics', week: 'Final 2 weeks', title: 'Confirm logistics & pack', desc: 'Check materials, travel, and the schedule with leaders.' }
  ];
  function getDoneMilestones() {
    try { return new Set(JSON.parse(localStorage.getItem('fx_milestones') || '[]')); }
    catch (e) { return new Set(); }
  }
  function saveDoneMilestones(set) {
    localStorage.setItem('fx_milestones', JSON.stringify(Array.from(set)));
  }

  function rosterNames() {
    const set = new Set();
    ['TEAM_A_ASSIGNMENTS', 'TEAM_B_ASSIGNMENTS'].forEach(k => {
      const obj = window[k] || {};
      Object.values(obj).forEach(arr => (arr || []).forEach(n => { if (n && n !== 'NONE') set.add(n); }));
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }
  function memberEvents(name) {
    const out = [];
    [['A', 'TEAM_A_ASSIGNMENTS'], ['B', 'TEAM_B_ASSIGNMENTS']].forEach(([team, k]) => {
      const obj = window[k] || {};
      Object.entries(obj).forEach(([ev, arr]) => {
        if ((arr || []).includes(name)) out.push({ ev, team });
      });
    });
    return out.sort((a, b) => a.ev.localeCompare(b.ev));
  }

  function nextCountdownData() {
    const list = Array.isArray(window.COUNTDOWN_EVENTS) ? window.COUNTDOWN_EVENTS : [];
    const now = Date.now();
    return list
      .map(c => ({ label: c.label, date: new Date(c.date), t: new Date(c.date).getTime() }))
      .filter(c => !isNaN(c.t))
      .sort((a, b) => a.t - b.t)
      .map(c => ({ ...c, upcoming: c.t > now }));
  }

  function renderSeason() {
    const host = document.getElementById('season-personalizer');
    if (!host) return;
    const name = localStorage.getItem('fx_member') || '';
    const names = rosterNames();
    const leaders = window.TEAM_LEADERS || [];
    const isLeader = name && leaders.some(l => name.startsWith(l));

    const counts = nextCountdownData();
    const countdownHTML = counts.length ? `
      <div class="season-countdowns">
        ${counts.map((c, i) => {
          const days = Math.ceil((c.t - Date.now()) / 86400000);
          const val = c.upcoming ? `${days}` : 'Done';
          const unit = c.upcoming ? (days === 1 ? ' day' : ' days') : '';
          return `<div class="countdown-card${i === 0 && c.upcoming ? ' next' : ''}">
            <div class="countdown-label">${esc(c.label)}</div>
            <div class="countdown-value">${val}${unit}</div>
            <div class="countdown-date">${c.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
          </div>`;
        }).join('')}
      </div>` : '';

    if (!name) {
      host.innerHTML = `
        <div class="season-head">
          <div class="season-avatar">🦅</div>
          <div>
            <div class="season-greeting">Make this your season HQ</div>
            <div class="season-sub">Pick your name to see your events and track your prep — saved on this device.</div>
          </div>
          <div class="season-picker">
            <select id="season-select" aria-label="Select your name">
              <option value="">Select your name…</option>
              ${names.map(n => `<option value="${esc(n)}">${esc(n)}</option>`).join('')}
            </select>
            <button class="season-btn" type="button" id="season-save">Set</button>
          </div>
        </div>
        ${countdownHTML}`;
      const sel = document.getElementById('season-select');
      const save = document.getElementById('season-save');
      const commit = () => {
        if (sel.value) {
          localStorage.setItem('fx_member', sel.value);
          renderSeason();
          confetti(window.innerWidth / 2, 160, 90);
          toast('Welcome, ' + sel.value.split(' ')[0] + '! 🦅');
        }
      };
      if (save) save.addEventListener('click', commit);
      if (sel) sel.addEventListener('change', () => { if (sel.value) commit(); });
      return;
    }

    const evs = memberEvents(name);
    const done = getDoneMilestones();
    const pct = Math.round((done.size / FX_MILESTONES.length) * 100);
    const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

    host.innerHTML = `
      <div class="season-head">
        <div class="season-avatar">${esc(initials)}</div>
        <div>
          <div class="season-greeting">Welcome back, ${esc(name.split(' ')[0])}${isLeader ? ' ⭐' : ''}</div>
          <div class="season-sub">${isLeader ? 'Student Leader' : 'Team Member'} · ${evs.length} event${evs.length === 1 ? '' : 's'} this season</div>
        </div>
        <div class="season-picker">
          <button class="season-btn ghost" type="button" id="season-change">Switch member</button>
        </div>
      </div>
      <div class="season-body">
        <div class="season-label">Your events — tap to open</div>
        <div class="season-events">
          ${evs.length ? evs.map(e => {
            const ev = (window.EVENTS || []).find(x => x.name === e.ev);
            const icon = ev ? ev.icon : (window.REGIONAL_ICONS || {})[e.ev] || '📌';
            return `<button class="season-event-chip" data-ev="${esc(e.ev)}">
              <span>${icon}</span>${esc(e.ev)}<span class="se-team ${e.team === 'B' ? 'b' : ''}">${e.team}</span>
            </button>`;
          }).join('') : '<span class="season-sub">No events assigned yet — check with your leaders.</span>'}
        </div>
        <div class="season-progress-wrap">
          <div class="season-label">Season prep progress · ${done.size}/${FX_MILESTONES.length} milestones</div>
          <div class="season-progress-track"><div class="season-progress-fill" style="width:${pct}%"></div></div>
        </div>
      </div>
      ${countdownHTML}`;

    const change = document.getElementById('season-change');
    if (change) change.addEventListener('click', () => {
      localStorage.removeItem('fx_member');
      renderSeason();
    });
    host.querySelectorAll('.season-event-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const ev = (window.EVENTS || []).find(x => x.name === chip.dataset.ev);
        if (ev && window.openModal) window.openModal(ev);
      });
    });
  }

  /* ===================================================================
     ANALYTICS DASHBOARD
     =================================================================== */
  let analyticsTeam = 'both';
  let analyticsCelebrated = false;

  function teamStats(scores, assignments) {
    const REG = window.REGIONAL_EVENTS || [];
    const TYPES = window.REGIONAL_TYPES || {};
    const ICONS = window.REGIONAL_ICONS || {};
    let entered = 0, gold = 0, silver = 0, bronze = 0, top10 = 0, sum = 0, best = Infinity;
    const perEvent = [];
    REG.forEach((name, i) => {
      const place = scores[i];
      const members = (assignments[name] || []).filter(Boolean);
      const noEntry = place === 32 && members.length === 0;
      perEvent.push({ name, type: TYPES[name] || 'study', icon: ICONS[name] || '📌', place, members, noEntry });
      if (!noEntry) {
        entered++; sum += place; best = Math.min(best, place);
        if (place === 1) gold++; else if (place === 2) silver++; else if (place === 3) bronze++;
        if (place <= 10) top10++;
      }
    });
    return {
      entered, gold, silver, bronze, top10, medals: gold + silver + bronze,
      avg: entered ? sum / entered : 0, sum, best: best === Infinity ? null : best, perEvent
    };
  }

  function scopeStats() {
    const A = teamStats(window.RIVERDALE_A_SCORES || [], window.TEAM_A_ASSIGNMENTS || {});
    const B = teamStats(window.RIVERDALE_B_SCORES || [], window.TEAM_B_ASSIGNMENTS || {});
    if (analyticsTeam === 'A') return { stats: A, label: 'Team A', teams: [{ key: 'A', s: A }] };
    if (analyticsTeam === 'B') return { stats: B, label: 'Team B', teams: [{ key: 'B', s: B }] };
    const merged = {
      entered: A.entered + B.entered, gold: A.gold + B.gold, silver: A.silver + B.silver,
      bronze: A.bronze + B.bronze, top10: A.top10 + B.top10, medals: A.medals + B.medals,
      sum: A.sum + B.sum, avg: (A.entered + B.entered) ? (A.sum + B.sum) / (A.entered + B.entered) : 0,
      best: Math.min(A.best == null ? Infinity : A.best, B.best == null ? Infinity : B.best),
      perEvent: A.perEvent.concat(B.perEvent)
    };
    if (merged.best === Infinity) merged.best = null;
    return { stats: merged, label: 'Both Teams', teams: [{ key: 'A', s: A }, { key: 'B', s: B }] };
  }

  function tierClass(place) {
    if (place <= 3) return 'tier-gold';
    if (place <= 10) return 'tier-top10';
    if (place <= 20) return 'tier-mid';
    return 'tier-none';
  }

  function perfBars(s, teamKey) {
    const rows = s.perEvent
      .filter(e => !e.noEntry)
      .sort((a, b) => a.place - b.place);
    const skipped = s.perEvent.filter(e => e.noEntry);
    let html = rows.map(e => {
      const w = ((33 - e.place) / 32) * 100;
      return `<div class="perf-bar-row">
        <div class="perf-bar-label" title="${esc(e.name)}">${e.icon} ${esc(e.name)}</div>
        <div class="perf-bar-track">
          <div class="perf-bar-fill ${tierClass(e.place)}" data-w="${w.toFixed(1)}"></div>
          <div class="perf-bar-num">${ord(e.place)}</div>
        </div>
      </div>`;
    }).join('');
    if (skipped.length) {
      html += `<div class="perf-bar-row">
        <div class="perf-bar-label" style="opacity:.7">Not entered</div>
        <div class="perf-bar-track"><div class="perf-bar-empty">${skipped.length} event${skipped.length === 1 ? '' : 's'} not staffed</div></div>
      </div>`;
    }
    return html;
  }

  function categoryStats(s) {
    const cats = { study: [], build: [], lab: [] };
    s.perEvent.forEach(e => { if (!e.noEntry && cats[e.type]) cats[e.type].push(e.place); });
    const out = {};
    Object.keys(cats).forEach(k => {
      const arr = cats[k];
      out[k] = arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null;
    });
    return out;
  }

  function distribution(s) {
    const tiers = [
      { label: 'Top 3 (medal)', color: '#d9af3e', n: 0 },
      { label: '4th–10th', color: '#8B1A1A', n: 0 },
      { label: '11th–20th', color: '#a9696b', n: 0 },
      { label: '21st–32nd', color: '#c2b3b3', n: 0 }
    ];
    s.perEvent.forEach(e => {
      if (e.noEntry) return;
      if (e.place <= 3) tiers[0].n++;
      else if (e.place <= 10) tiers[1].n++;
      else if (e.place <= 20) tiers[2].n++;
      else tiers[3].n++;
    });
    return tiers;
  }

  function donutSVG(tiers, total) {
    const R = 64, C = 2 * Math.PI * R;
    let offset = 0;
    const segs = tiers.filter(t => t.n > 0).map(t => {
      const frac = total ? t.n / total : 0;
      const len = frac * C;
      const seg = `<circle cx="84" cy="84" r="${R}" fill="none" stroke="${t.color}" stroke-width="22"
        stroke-dasharray="0 ${C}" data-len="${len.toFixed(2)}" data-gap="${(C - len).toFixed(2)}"
        stroke-dashoffset="${(-offset).toFixed(2)}" transform="rotate(-90 84 84)"></circle>`;
      offset += len;
      return seg;
    }).join('');
    return `<svg class="donut-svg" viewBox="0 0 168 168">
      <circle cx="84" cy="84" r="${R}" fill="none" stroke="var(--fx-track)" stroke-width="22"></circle>
      ${segs}
      <text class="donut-center-num" x="84" y="82" text-anchor="middle">${total}</text>
      <text class="donut-center-lbl" x="84" y="100" text-anchor="middle">Events Entered</text>
    </svg>`;
  }

  function renderAnalytics() {
    const view = document.getElementById('view-analytics');
    if (!view) return;
    const { stats, label, teams } = scopeStats();
    const cats = categoryStats(stats);
    const tiers = distribution(stats);

    const catRow = (key, name, val) => {
      const w = val == null ? 0 : ((33 - val) / 32) * 100;
      return `<div class="cat-bar">
        <div class="cat-bar-head"><span>${name}</span><span class="cat-avg">${val == null ? '—' : ord(Math.round(val)) + ' avg'}</span></div>
        <div class="cat-bar-track"><div class="cat-bar-fill cat-${key}" data-w="${w.toFixed(1)}"></div></div>
      </div>`;
    };

    // Leaderboard — best finishes across scope
    const lb = stats.perEvent.filter(e => !e.noEntry).sort((a, b) => a.place - b.place).slice(0, 6);
    const lbHTML = lb.map((e, i) => `
      <div class="lb-item medal-${e.place <= 3 ? e.place : 0}">
        <div class="lb-rank">${i + 1}</div>
        <div class="lb-ico">${e.icon}</div>
        <div class="lb-name">${esc(e.name)}</div>
        <div><span class="lb-place">${ord(e.place)}</span> <span class="lb-team">/ 32</span></div>
      </div>`).join('');

    const perfHTML = teams.length === 1
      ? perfBars(teams[0].s, teams[0].key)
      : teams.map(t => `<div class="perf-team-divider">Team ${t.key}</div>${perfBars(t.s, t.key)}`).join('');

    view.innerHTML = `
      <div class="section-title reveal">2026 Regional Analytics</div>
      <div class="section-subtitle reveal">A data view of Riverdale's NYC North Regional — medals, placements, and category strength. ${label} shown.</div>

      <div class="analytics-toggle-row reveal">
        <div class="team-toggle">
          <button class="team-toggle-btn${analyticsTeam === 'A' ? ' active' : ''}" data-team="A">Team A</button>
          <button class="team-toggle-btn${analyticsTeam === 'B' ? ' active' : ''}" data-team="B">Team B</button>
          <button class="team-toggle-btn${analyticsTeam === 'both' ? ' active' : ''}" data-team="both">Both</button>
        </div>
      </div>

      <div class="kpi-row reveal">
        <div class="kpi-card gold"><div class="kpi-ico">🥇</div><div class="kpi-value" data-count="${stats.medals}">0</div><div class="kpi-label">Top-3 Medals</div></div>
        <div class="kpi-card"><div class="kpi-ico">🏅</div><div class="kpi-value" data-count="${stats.top10}">0</div><div class="kpi-label">Top-10 Finishes</div></div>
        <div class="kpi-card"><div class="kpi-ico">🎯</div><div class="kpi-value">${stats.best == null ? '—' : ord(stats.best)}</div><div class="kpi-label">Best Finish</div></div>
        <div class="kpi-card"><div class="kpi-ico">📊</div><div class="kpi-value">${stats.avg ? stats.avg.toFixed(1) : '—'}</div><div class="kpi-label">Avg Placement</div></div>
        <div class="kpi-card"><div class="kpi-ico">✅</div><div class="kpi-value" data-count="${stats.entered}">0</div><div class="kpi-label">Events Entered</div></div>
      </div>

      <div class="analytics-grid">
        <div class="analytics-panel wide reveal">
          <h3>Placement by Event</h3>
          <div class="panel-sub">Longer bars are better finishes (1st = full bar). Out of 32 teams.</div>
          ${perfHTML}
          <div class="perf-legend">
            <span><i style="background:#d9af3e"></i> Medal (Top 3)</span>
            <span><i style="background:#8B1A1A"></i> Top 10</span>
            <span><i style="background:#a9696b"></i> 11–20</span>
            <span><i style="background:#c2b3b3"></i> 21–32</span>
          </div>
        </div>

        <div class="analytics-panel reveal">
          <h3>Strength by Category</h3>
          <div class="panel-sub">Average placement in each event type.</div>
          ${catRow('study', '📖 Study', cats.study)}
          ${catRow('build', '🔧 Build', cats.build)}
          ${catRow('lab', '🧪 Lab / Hybrid', cats.lab)}
          <div class="analytics-note">Lower average placement = stronger. Bars scaled so longer is better.</div>
        </div>

        <div class="analytics-panel reveal">
          <h3>Finish Distribution</h3>
          <div class="panel-sub">Where ${label.toLowerCase()} landed across all entered events.</div>
          <div class="donut-wrap">
            ${donutSVG(tiers, stats.entered)}
            <div class="donut-legend">
              ${tiers.map(t => `<div class="donut-legend-item"><i style="background:${t.color}"></i>${t.label}<b>${t.n}</b></div>`).join('')}
            </div>
          </div>
        </div>

        <div class="analytics-panel wide reveal">
          <h3>🏆 Best Results</h3>
          <div class="panel-sub">Top finishes for ${label.toLowerCase()} at the 2026 Regional.</div>
          ${lbHTML || '<div class="analytics-note">No entered events in this scope.</div>'}
        </div>
      </div>`;

    // wire toggle
    view.querySelectorAll('.team-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => { analyticsTeam = btn.dataset.team; renderAnalytics(); });
    });

    if (window.initScrollAnimations) window.initScrollAnimations();
    animateAnalytics(view);

    // First-visit celebration for the Hovercraft gold
    if (!analyticsCelebrated && stats.medals > 0) {
      analyticsCelebrated = true;
      setTimeout(() => { confetti(window.innerWidth / 2, window.innerHeight / 3, 120); toast('🥇 Hovercraft — 1st place at Regionals!'); }, 600);
    }
  }

  function animateAnalytics(view) {
    requestAnimationFrame(() => setTimeout(() => {
      view.querySelectorAll('.perf-bar-fill').forEach(f => { f.style.width = (f.dataset.w || 0) + '%'; });
      view.querySelectorAll('.cat-bar-fill').forEach(f => { f.style.width = (f.dataset.w || 0) + '%'; });
      view.querySelectorAll('.donut-svg circle[data-len]').forEach(c => {
        c.setAttribute('stroke-dasharray', `${c.dataset.len} ${c.dataset.gap}`);
      });
      view.querySelectorAll('.kpi-value[data-count]').forEach(el => countUp(el, +el.dataset.count));
    }, 120));
  }
  function countUp(el, target) {
    if (reduceMotion || !target) { el.textContent = target; return; }
    const dur = 900, start = performance.now();
    function frame(t) {
      const p = Math.min(1, (t - start) / dur);
      el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target);
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ===================================================================
     STUDY HUB
     =================================================================== */
  let studyTab = 'flashcards';
  let flashList = [], flashIndex = 0, flashFlipped = false, flashMode = 'study';
  let quizState = null;
  // Timer state (module-level so it survives view switches)
  let timer = { total: 25 * 60, left: 25 * 60, running: false, phase: 'Focus', preset: 25, interval: null };

  function setStudyTab(tab) {
    studyTab = tab;
    document.querySelectorAll('.studyhub-subnav button').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
    document.querySelectorAll('.studyhub-section').forEach(s => s.classList.toggle('active', s.dataset.tab === tab));
    if (tab === 'flashcards') renderFlashcards();
    if (tab === 'quiz') startQuiz();
    if (tab === 'timer') renderTimer();
    if (tab === 'milestones') renderMilestones();
  }
  window.setStudyTab = setStudyTab;

  function initStudyHub() {
    const view = document.getElementById('view-studyhub');
    if (!view || view.dataset.built === '1') { setStudyTab(studyTab); return; }
    view.dataset.built = '1';
    view.innerHTML = `
      <div class="section-title reveal">Study Hub</div>
      <div class="section-subtitle reveal">Active prep tools — flip flashcards, quiz yourself, run a focus session, and check off season milestones. Progress saves on this device.</div>
      <div class="studyhub-subnav reveal">
        <button data-tab="flashcards" class="active">🃏 Flashcards</button>
        <button data-tab="quiz">❓ Quiz</button>
        <button data-tab="timer">⏱️ Focus Timer</button>
        <button data-tab="milestones">✅ Milestones</button>
      </div>
      <div class="studyhub-section active" data-tab="flashcards"></div>
      <div class="studyhub-section" data-tab="quiz"></div>
      <div class="studyhub-section" data-tab="timer"></div>
      <div class="studyhub-section" data-tab="milestones"></div>`;
    view.querySelectorAll('.studyhub-subnav button').forEach(b => {
      b.addEventListener('click', () => setStudyTab(b.dataset.tab));
    });
    if (window.initScrollAnimations) window.initScrollAnimations();
    setStudyTab(studyTab);
  }

  // ---- Flashcards ----
  function stripHTML(s) { const d = document.createElement('div'); d.innerHTML = s || ''; return d.textContent || ''; }
  function buildFlashList(type) {
    const all = window.EVENTS || [];
    flashList = (type && type !== 'all') ? all.filter(e => e.type === type) : all.slice();
    flashIndex = 0; flashFlipped = false;
  }
  function renderFlashcards() {
    const host = document.querySelector('.studyhub-section[data-tab="flashcards"]');
    if (!host) return;
    if (!flashList.length) buildFlashList('all');
    if (host.dataset.built !== '1') {
      host.dataset.built = '1';
      host.innerHTML = `
        <div class="flash-controls">
          <select id="flash-filter" aria-label="Filter events">
            <option value="all">All events</option>
            <option value="study">📖 Study</option>
            <option value="build">🔧 Build</option>
            <option value="lab">🧪 Lab / Hybrid</option>
          </select>
          <button class="flash-nav-btn" id="flash-shuffle">🔀 Shuffle</button>
          <div class="flash-mode-toggle">
            <button data-mode="study" class="active">Study</button>
            <button data-mode="reveal">Quick facts</button>
          </div>
        </div>
        <div class="flashcard-stage"><div class="flashcard" id="flashcard"></div></div>
        <div class="flash-nav">
          <button class="flash-nav-btn" id="flash-prev">← Prev</button>
          <span class="flash-counter" id="flash-counter"></span>
          <button class="flash-nav-btn" id="flash-next">Next →</button>
        </div>`;
      host.querySelector('#flash-filter').addEventListener('change', e => { buildFlashList(e.target.value); paintFlashcard(); });
      host.querySelector('#flash-shuffle').addEventListener('click', () => {
        for (let i = flashList.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0;[flashList[i], flashList[j]] = [flashList[j], flashList[i]]; }
        flashIndex = 0; flashFlipped = false; paintFlashcard(); toast('🔀 Shuffled');
      });
      host.querySelector('#flash-prev').addEventListener('click', () => { flashIndex = (flashIndex - 1 + flashList.length) % flashList.length; flashFlipped = false; paintFlashcard(); });
      host.querySelector('#flash-next').addEventListener('click', () => { flashIndex = (flashIndex + 1) % flashList.length; flashFlipped = false; paintFlashcard(); });
      host.querySelectorAll('.flash-mode-toggle button').forEach(b => b.addEventListener('click', () => {
        flashMode = b.dataset.mode;
        host.querySelectorAll('.flash-mode-toggle button').forEach(x => x.classList.toggle('active', x === b));
        flashFlipped = false; paintFlashcard();
      }));
    }
    paintFlashcard();
  }
  function typeMeta(t) {
    if (t === 'build') return { label: 'Build', bg: '#eaf7ed', col: '#1f6b35' };
    if (t === 'lab') return { label: 'Lab / Hybrid', bg: '#edf4fa', col: '#255a8a' };
    return { label: 'Study', bg: '#fff0ee', col: '#8b1a1a' };
  }
  function paintFlashcard() {
    const card = document.getElementById('flashcard');
    const counter = document.getElementById('flash-counter');
    if (!card || !flashList.length) return;
    const ev = flashList[flashIndex];
    const tm = typeMeta(ev.type);
    const backTitle = flashMode === 'reveal' ? 'Quick facts' : 'Overview';
    const backBody = flashMode === 'reveal'
      ? `<p>${esc(ev.shortDesc)}</p><div class="flash-tip">${ev.tips ? ev.tips : ''}</div>`
      : `<p>${esc(ev.overview)}</p><div class="flash-tip">${ev.tips ? ev.tips : ''}</div>`;
    card.innerHTML = `
      <div class="flash-face flash-front">
        <div class="flash-ico">${ev.icon}</div>
        <div class="flash-name">${esc(ev.name)}</div>
        <div class="flash-type" style="background:${tm.bg};color:${tm.col}">${tm.label}</div>
        <div class="flash-hint">Tap to flip · ${flashMode === 'reveal' ? 'quick facts' : 'overview & tips'}</div>
      </div>
      <div class="flash-face flash-back">
        <h4>${backTitle} — ${esc(ev.name)}</h4>
        ${backBody}
      </div>`;
    card.classList.toggle('flipped', flashFlipped);
    card.onclick = () => { flashFlipped = !flashFlipped; card.classList.toggle('flipped', flashFlipped); };
    if (counter) counter.textContent = `${flashIndex + 1} / ${flashList.length}`;
  }

  // ---- Quiz ----
  function startQuiz() {
    const host = document.querySelector('.studyhub-section[data-tab="quiz"]');
    if (!host) return;
    const events = (window.EVENTS || []).slice();
    if (events.length < 4) { host.innerHTML = '<div class="quiz-card">Not enough event data to build a quiz.</div>'; return; }
    const pool = events.slice();
    for (let i = pool.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0;[pool[i], pool[j]] = [pool[j], pool[i]]; }
    const picks = pool.slice(0, 8);
    const questions = picks.map((ev, i) => {
      if (i % 2 === 0) {
        // identify event from description
        const distractors = shuffle(events.filter(e => e.name !== ev.name)).slice(0, 3).map(e => e.name);
        return {
          q: 'Which event is this?',
          sub: '“' + stripHTML(ev.shortDesc) + '”',
          options: shuffle([ev.name, ...distractors]),
          answer: ev.name
        };
      }
      // type of event
      const labels = { study: 'Study (written test)', build: 'Build (construct a device)', lab: 'Lab / Hybrid (hands-on)' };
      return {
        q: `What type of event is ${ev.name}?`,
        sub: 'Pick the category it belongs to.',
        options: shuffle([labels.study, labels.build, labels.lab]),
        answer: labels[ev.type]
      };
    });
    quizState = { questions, idx: 0, score: 0, answered: false };
    paintQuiz();
  }
  function shuffle(arr) { arr = arr.slice(); for (let i = arr.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0;[arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; }
  function paintQuiz() {
    const host = document.querySelector('.studyhub-section[data-tab="quiz"]');
    if (!host || !quizState) return;
    const { questions, idx, score } = quizState;
    if (idx >= questions.length) {
      const pctScore = Math.round((score / questions.length) * 100);
      const emoji = pctScore >= 80 ? '🏆' : pctScore >= 50 ? '💪' : '📚';
      const msg = pctScore >= 80 ? 'Outstanding — you know your events!' : pctScore >= 50 ? 'Solid. A little more review and you’re golden.' : 'Keep studying — flip through the flashcards!';
      host.innerHTML = `
        <div class="quiz-card">
          <div class="quiz-result">
            <div class="qr-emoji">${emoji}</div>
            <div class="qr-score">${score} / ${questions.length}</div>
            <div class="qr-msg">${msg}</div>
            <button class="quiz-next" id="quiz-restart">Play again</button>
          </div>
        </div>`;
      host.querySelector('#quiz-restart').addEventListener('click', startQuiz);
      if (pctScore >= 80) { confetti(window.innerWidth / 2, window.innerHeight / 3, 110); }
      return;
    }
    const Q = questions[idx];
    const pct = Math.round((idx / questions.length) * 100);
    host.innerHTML = `
      <div class="quiz-card">
        <div class="quiz-progress"><span>Question ${idx + 1} of ${questions.length}</span><span class="quiz-score">Score ${score}</span></div>
        <div class="quiz-progress-track"><div class="quiz-progress-fill" style="width:${pct}%"></div></div>
        <div class="quiz-q">${esc(Q.q)}</div>
        <div class="quiz-q-sub">${esc(Q.sub)}</div>
        <div class="quiz-options">
          ${Q.options.map(o => `<button class="quiz-option" data-opt="${esc(o)}">${esc(o)}</button>`).join('')}
        </div>
      </div>`;
    host.querySelectorAll('.quiz-option').forEach(btn => {
      btn.addEventListener('click', () => answerQuiz(btn, Q));
    });
  }
  function answerQuiz(btn, Q) {
    if (quizState.answered) return;
    quizState.answered = true;
    const chosen = btn.dataset.opt;
    const host = document.querySelector('.studyhub-section[data-tab="quiz"]');
    host.querySelectorAll('.quiz-option').forEach(b => {
      b.disabled = true;
      if (b.dataset.opt === Q.answer) b.classList.add('correct');
      else if (b === btn) b.classList.add('wrong');
    });
    if (chosen === Q.answer) quizState.score++;
    const card = host.querySelector('.quiz-card');
    const next = document.createElement('button');
    next.className = 'quiz-next';
    next.textContent = quizState.idx + 1 >= quizState.questions.length ? 'See results' : 'Next question';
    next.addEventListener('click', () => { quizState.idx++; quizState.answered = false; paintQuiz(); });
    card.appendChild(next);
  }

  // ---- Focus Timer ----
  function fmtTime(s) { const m = Math.floor(s / 60), ss = s % 60; return `${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}`; }
  function timerStats() {
    return {
      sessions: +(localStorage.getItem('fx_focus_sessions') || 0),
      minutes: +(localStorage.getItem('fx_focus_minutes') || 0)
    };
  }
  function renderTimer() {
    const host = document.querySelector('.studyhub-section[data-tab="timer"]');
    if (!host) return;
    const st = timerStats();
    const R = 104, C = 2 * Math.PI * R;
    host.innerHTML = `
      <div class="analytics-panel" style="max-width:760px">
        <div class="timer-wrap">
          <div class="timer-ring-box">
            <svg viewBox="0 0 240 240">
              <defs>
                <linearGradient id="timerGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="#8B1A1A"/>
                  <stop offset="100%" stop-color="#E8C96A"/>
                </linearGradient>
              </defs>
              <circle class="timer-ring-bg" cx="120" cy="120" r="${R}"></circle>
              <circle class="timer-ring-fg" id="timer-ring" cx="120" cy="120" r="${R}"
                stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="0"></circle>
            </svg>
            <div class="timer-readout">
              <div class="timer-time" id="timer-time">${fmtTime(timer.left)}</div>
              <div class="timer-phase" id="timer-phase">${timer.phase}</div>
            </div>
          </div>
          <div class="timer-side">
            <div class="timer-presets">
              <button class="timer-preset${timer.preset === 25 ? ' active' : ''}" data-min="25" data-phase="Focus">Focus · 25</button>
              <button class="timer-preset${timer.preset === 50 ? ' active' : ''}" data-min="50" data-phase="Focus">Deep · 50</button>
              <button class="timer-preset${timer.preset === 5 ? ' active' : ''}" data-min="5" data-phase="Break">Break · 5</button>
              <button class="timer-preset${timer.preset === 15 ? ' active' : ''}" data-min="15" data-phase="Break">Break · 15</button>
            </div>
            <div class="timer-actions">
              <button class="timer-btn primary" id="timer-toggle">${timer.running ? '⏸ Pause' : '▶ Start'}</button>
              <button class="timer-btn ghost" id="timer-reset">↺ Reset</button>
            </div>
            <div class="timer-stats">
              <div class="timer-stat"><div class="ts-num" id="ts-sessions">${st.sessions}</div><div class="ts-lbl">Sessions done</div></div>
              <div class="timer-stat"><div class="ts-num" id="ts-minutes">${st.minutes}</div><div class="ts-lbl">Minutes focused</div></div>
            </div>
          </div>
        </div>
      </div>`;
    host.querySelectorAll('.timer-preset').forEach(b => b.addEventListener('click', () => {
      stopTimerInterval();
      timer.preset = +b.dataset.min;
      timer.total = timer.left = timer.preset * 60;
      timer.phase = b.dataset.phase;
      timer.running = false;
      renderTimer();
    }));
    host.querySelector('#timer-toggle').addEventListener('click', toggleTimer);
    host.querySelector('#timer-reset').addEventListener('click', () => { stopTimerInterval(); timer.left = timer.total; timer.running = false; updateTimerUI(); });
    updateTimerUI();
  }
  function updateTimerUI() {
    const timeEl = document.getElementById('timer-time');
    const ring = document.getElementById('timer-ring');
    const phaseEl = document.getElementById('timer-phase');
    const toggle = document.getElementById('timer-toggle');
    if (timeEl) timeEl.textContent = fmtTime(timer.left);
    if (phaseEl) phaseEl.textContent = timer.phase;
    if (toggle) toggle.textContent = timer.running ? '⏸ Pause' : '▶ Start';
    if (ring) {
      const R = 104, C = 2 * Math.PI * R;
      const frac = timer.total ? (timer.total - timer.left) / timer.total : 0;
      ring.setAttribute('stroke-dasharray', C.toFixed(1));
      ring.setAttribute('stroke-dashoffset', (C * (1 - frac)).toFixed(1));
    }
  }
  function toggleTimer() {
    timer.running ? stopTimerInterval() : startTimerInterval();
  }
  function startTimerInterval() {
    if (timer.interval) return;
    timer.running = true;
    updateTimerUI();
    timer.interval = setInterval(() => {
      timer.left--;
      if (timer.left <= 0) {
        const wasFocus = timer.phase === 'Focus';
        stopTimerInterval();
        timer.left = 0; updateTimerUI();
        if (wasFocus) {
          const s = timerStats();
          localStorage.setItem('fx_focus_sessions', s.sessions + 1);
          localStorage.setItem('fx_focus_minutes', s.minutes + timer.preset);
          confetti(window.innerWidth / 2, window.innerHeight / 3, 120);
          toast('🎉 Focus session complete — nice work!');
          timer.phase = 'Break'; timer.preset = 5; timer.total = timer.left = 5 * 60;
        } else {
          toast('☕ Break over — back to it!');
          timer.phase = 'Focus'; timer.preset = 25; timer.total = timer.left = 25 * 60;
        }
        if (studyTab === 'timer') renderTimer();
        return;
      }
      updateTimerUI();
    }, 1000);
  }
  function stopTimerInterval() {
    if (timer.interval) { clearInterval(timer.interval); timer.interval = null; }
    timer.running = false;
    updateTimerUI();
  }

  // ---- Milestones ----
  function renderMilestones() {
    const host = document.querySelector('.studyhub-section[data-tab="milestones"]');
    if (!host) return;
    const done = getDoneMilestones();
    const pct = Math.round((done.size / FX_MILESTONES.length) * 100);
    host.innerHTML = `
      <div class="milestone-head">
        <div>
          <div class="section-subtitle" style="margin:0">Tap each milestone as you complete it — your progress saves automatically.</div>
        </div>
        <div class="milestone-progress-num">${done.size}/${FX_MILESTONES.length} · ${pct}%</div>
      </div>
      <div class="season-progress-track" style="max-width:720px;margin-bottom:20px"><div class="season-progress-fill" style="width:${pct}%"></div></div>
      <div class="milestone-list">
        ${FX_MILESTONES.map(m => `
          <div class="milestone-item${done.has(m.id) ? ' done' : ''}" data-id="${m.id}">
            <div class="milestone-check">${done.has(m.id) ? '✓' : ''}</div>
            <div>
              <div class="ms-week">${esc(m.week)}</div>
              <div class="ms-title">${esc(m.title)}</div>
              <div class="ms-desc">${esc(m.desc)}</div>
            </div>
          </div>`).join('')}
      </div>`;
    host.querySelectorAll('.milestone-item').forEach(item => {
      item.addEventListener('click', () => {
        const id = item.dataset.id;
        const set = getDoneMilestones();
        set.has(id) ? set.delete(id) : set.add(id);
        saveDoneMilestones(set);
        const allDone = set.size === FX_MILESTONES.length;
        renderMilestones();
        if (allDone) { confetti(window.innerWidth / 2, window.innerHeight / 3, 150); toast('🏆 All season milestones complete!'); }
      });
    });
  }

  /* ===================================================================
     HOOK INTO EXISTING NAVIGATION
     =================================================================== */
  function wrapShowView() {
    const orig = window.showView;
    if (typeof orig !== 'function') return;
    window.showView = function (name, tabEl) {
      orig(name, tabEl);
      if (name === 'analytics') renderAnalytics();
      if (name === 'studyhub') initStudyHub();
      if (name === 'home') renderSeason();
    };
  }

  /* ===================================================================
     INIT
     =================================================================== */
  function init() {
    exposeGlobals();
    initTheme();
    initPreloader();
    initScrollChrome();
    initPalette();
    wrapShowView();
    renderSeason();

    const themeBtn = document.getElementById('fx-theme');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
    const paletteBtn = document.getElementById('fx-cmd');
    if (paletteBtn) paletteBtn.addEventListener('click', openPalette);
    const topBtn = document.getElementById('fx-top');
    if (topBtn) topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // Refresh countdowns each minute
    setInterval(() => { if (document.getElementById('view-home').classList.contains('active')) renderSeason(); }, 60000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
