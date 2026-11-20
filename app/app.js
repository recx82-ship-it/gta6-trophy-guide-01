// Leonida Legend — the GTA VI trophy guide and tracker. Loads the 55
// official trophies from data/trophies.json, renders the checklist, the
// roadmap and the filters, and keeps progress in the browser. No network
// requests are made beyond the app's own files.
import { loadEarned, saveEarned, exportText, importText, gradeProgress } from './tracker.js';
import { ROADMAP, stageProgress } from './roadmap.js';

const KIND_LABELS = {
  story: 'Story',
  side: 'Side quests',
  activities: 'Activities',
  collectibles: 'Collectibles',
  completion: '100% completion',
  platinum: 'Platinum',
};
const KIND_FILTERS = ['all', 'story', 'side', 'activities', 'collectibles', 'missable', 'hidden', 'earned', 'not-earned'];
const KIND_FILTER_LABELS = {
  all: 'All',
  story: 'Story',
  side: 'Side quests',
  activities: 'Activities',
  collectibles: 'Collectibles',
  missable: 'Missable',
  hidden: 'Hidden',
  earned: 'Earned',
  'not-earned': 'Not earned',
};

const params = new URLSearchParams(location.search);
const listEl = document.getElementById('trophy-list');
const metaEl = document.getElementById('list-meta');
const emptyEl = document.getElementById('empty');
const searchEl = document.getElementById('search');
const gradeEl = document.getElementById('grade');
const spoilersEl = document.getElementById('spoilers');
const chipsEl = document.getElementById('kind-chips');

let doc;
let earned = loadEarned();
let kindFilter = 'all';
if (params.get('spoilers') === 'off') spoilersEl.checked = false;

function kindOf(trophy) {
  return KIND_LABELS[trophy.kind] ?? trophy.kind;
}

function countLabel(trophy) {
  if (trophy.count == null) return null;
  const total = trophy.countTotal ? ` of ${trophy.countTotal}` : '';
  const unit = trophy.count >= 1000 ? `$${trophy.count.toLocaleString('en-US')}` : String(trophy.count);
  return `Target: ${unit}${total}`;
}

function spoilerHidden(trophy) {
  return spoilersEl.checked && trophy.kind === 'story' && !earned.has(trophy.name);
}

function trophyCard(trophy) {
  const card = document.createElement('article');
  card.className = 'trophy' + (earned.has(trophy.name) ? ' earned' : '');
  card.id = `trophy-${trophy.id}`;
  if (params.get('focus') === String(trophy.id)) card.classList.add('focused');

  const head = document.createElement('div');
  head.className = 'trophy-head';
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = earned.has(trophy.name);
  box.setAttribute('aria-label', `Mark ${trophy.name} as earned`);
  box.addEventListener('change', () => {
    if (box.checked) earned.add(trophy.name);
    else earned.delete(trophy.name);
    saveEarned(earned);
    render();
  });
  const name = document.createElement('h3');
  name.className = 'trophy-name';
  name.textContent = spoilerHidden(trophy) ? 'Hidden story trophy' : trophy.name;
  const badge = document.createElement('span');
  badge.className = `grade-badge grade-${trophy.grade}`;
  badge.textContent = trophy.grade;
  head.append(box, name, badge);
  card.append(head);

  const official = document.createElement('p');
  official.className = 'official';
  if (spoilerHidden(trophy)) {
    official.innerHTML = '<b>Official</b> Hidden until earned — turn spoilers off, or earn it, to reveal the name and description.';
  } else {
    official.innerHTML = '<b>Official</b> ';
    official.append(document.createTextNode(`“${trophy.description}”`));
  }
  card.append(official);

  const tags = document.createElement('div');
  tags.className = 'tags';
  const kindTag = document.createElement('span');
  kindTag.className = 'tag';
  kindTag.textContent = kindOf(trophy);
  tags.append(kindTag);
  if (trophy.hidden) {
    const hiddenTag = document.createElement('span');
    hiddenTag.className = 'tag hidden-tag';
    hiddenTag.textContent = 'Hidden on PlayStation';
    tags.append(hiddenTag);
  }
  if (trophy.missable) {
    const missTag = document.createElement('span');
    missTag.className = 'tag missable';
    missTag.textContent = '⚠ Missable';
    tags.append(missTag);
  }
  const count = countLabel(trophy);
  if (count) {
    const countTag = document.createElement('span');
    countTag.className = 'tag count';
    countTag.textContent = count;
    tags.append(countTag);
  }
  card.append(tags);

  const guide = document.createElement('p');
  guide.className = 'guide';
  if (spoilerHidden(trophy)) {
    guide.innerHTML = '<b>Guide</b> <span class="spoiler-hidden">Hidden to avoid spoilers.</span>';
  } else {
    guide.innerHTML = '<b>Guide</b> ';
    guide.append(document.createTextNode(trophy.guide));
  }
  card.append(guide);

  if (!spoilerHidden(trophy)) {
    const source = document.createElement('p');
    source.className = 'source';
    source.textContent = `Source: ${trophy.source} — `;
    const link = document.createElement('a');
    link.href = trophy.sourceUrl;
    link.textContent = 'read the guide';
    link.rel = 'noopener';
    source.append(link);
    card.append(source);
  }
  return card;
}

function matches(trophy) {
  const q = searchEl.value.trim().toLowerCase();
  if (q) {
    const hay = `${trophy.name} ${trophy.description} ${trophy.guide}`.toLowerCase();
    if (!hay.includes(q)) return false;
  }
  if (gradeEl.value !== 'all' && trophy.grade !== gradeEl.value) return false;
  if (kindFilter === 'missable' && !trophy.missable) return false;
  if (kindFilter === 'hidden' && !trophy.hidden) return false;
  if (kindFilter === 'earned' && !earned.has(trophy.name)) return false;
  if (kindFilter === 'not-earned' && earned.has(trophy.name)) return false;
  if (['story', 'side', 'activities', 'collectibles'].includes(kindFilter) && trophy.kind !== kindFilter) return false;
  return true;
}

function renderProgress() {
  const total = doc.trophies.length;
  const done = doc.trophies.filter((t) => earned.has(t.name)).length;
  const pct = Math.round((done / total) * 100);
  document.getElementById('progress-count').textContent = `${done} / ${total} earned`;
  document.getElementById('progress-pct').textContent = `${pct}% to platinum`;
  document.getElementById('progress-fill').style.width = `${pct}%`;
  const chips = document.getElementById('grade-chips');
  chips.replaceChildren();
  for (const { grade, done: d, total: t } of gradeProgress(doc.trophies, earned)) {
    const span = document.createElement('span');
    span.innerHTML = `<b>${grade}</b> ${d}/${t}`;
    chips.append(span);
  }
}

function renderRoadmap() {
  const stagesEl = document.getElementById('stages');
  stagesEl.replaceChildren();
  const byId = new Map(doc.trophies.map((t) => [t.id, t]));
  for (const stage of ROADMAP) {
    const { done, total } = stageProgress(stage, earned, byId);
    const card = document.createElement('div');
    card.className = 'stage';
    const h = document.createElement('h3');
    h.textContent = `Stage ${stage.stage} — ${stage.title}`;
    const meta = document.createElement('p');
    meta.className = 'stage-meta';
    meta.innerHTML = `${stage.hours} · <span class="stage-count">${done}/${total} earned</span>`;
    const blurb = document.createElement('p');
    blurb.textContent = stage.blurb;
    const list = document.createElement('p');
    list.className = 'stage-trophies';
    list.innerHTML = '<b>Trophies:</b> ';
    stage.trophyIds.forEach((id, i) => {
      const t = byId.get(id);
      if (i) list.append(document.createTextNode(', '));
      const link = document.createElement('a');
      link.href = `#trophy-${id}`;
      link.textContent = earned.has(t.name) ? `✓ ${t.name}` : t.name;
      list.append(link);
    });
    card.append(h, meta, blurb, list);
    stagesEl.append(card);
  }
}

function renderList() {
  const shown = doc.trophies.filter(matches);
  listEl.replaceChildren();
  for (const trophy of shown) listEl.append(trophyCard(trophy));
  metaEl.textContent = `Showing ${shown.length} of ${doc.trophies.length} trophies` +
    (kindFilter !== 'all' ? ` · filter: ${KIND_FILTER_LABELS[kindFilter]}` : '') +
    (gradeEl.value !== 'all' ? ` · grade: ${gradeEl.value}` : '');
  emptyEl.hidden = shown.length > 0;
}

function renderChips() {
  chipsEl.replaceChildren();
  for (const kind of KIND_FILTERS) {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'chip';
    chip.textContent = KIND_FILTER_LABELS[kind];
    chip.setAttribute('aria-pressed', String(kindFilter === kind));
    chip.addEventListener('click', () => {
      kindFilter = kind;
      render();
    });
    chipsEl.append(chip);
  }
}

let didFocusScroll = false;

function render() {
  renderProgress();
  renderRoadmap();
  renderChips();
  renderList();
  const focusId = params.get('focus');
  if (focusId && !didFocusScroll) {
    didFocusScroll = true;
    const el = document.getElementById(`trophy-${focusId}`);
    if (el) el.scrollIntoView({ block: 'center' });
  }
  if (params.get('view') === 'roadmap') {
    document.getElementById('roadmap').scrollIntoView();
  }
}

searchEl.addEventListener('input', renderList);
gradeEl.addEventListener('change', renderList);
spoilersEl.addEventListener('change', render);

document.getElementById('export').addEventListener('click', () => {
  const blob = new Blob([exportText(earned)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
});

document.getElementById('import').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const result = importText(await file.text(), doc.trophies.map((t) => t.name));
    earned = result.earned;
    saveEarned(earned);
    render();
    metaEl.textContent = `Imported ${result.kept} earned trophies` +
      (result.dropped ? ` (${result.dropped} names not in this guide were skipped)` : '') + '.';
  } catch (err) {
    metaEl.textContent = `Import failed: ${err.message}. That file is not a progress export from this guide.`;
  }
  event.target.value = '';
});

document.getElementById('reset').addEventListener('click', () => {
  if (window.confirm('Clear all earned trophies in this browser?')) {
    earned = new Set();
    saveEarned(earned);
    render();
  }
});

doc = await (await fetch('data/trophies.json')).json();
render();
