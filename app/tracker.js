// Progress state for the Leonida Legend tracker: the earned set lives in
// localStorage, and export/import moves it as a JSON file. Nothing here
// touches the network; the file the reader imports is read locally.
export const STORAGE_KEY = 'gta6-trophy-guide-earned-v1';
export const APP_ID = 'gta6-trophy-guide';

/** Read the earned trophy names out of localStorage. Always a Set. */
export function loadEarned() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return new Set(Array.isArray(parsed) ? parsed.filter((n) => typeof n === 'string') : []);
  } catch {
    return new Set();
  }
}

/** Write the earned trophy names to localStorage. */
export function saveEarned(earned) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...earned].sort()));
}

/** Build the JSON text an export file carries for an earned set. */
export function exportText(earned) {
  return JSON.stringify(
    { app: APP_ID, version: 1, exportedAt: new Date().toISOString(), earned: [...earned].sort() },
    null,
    2,
  );
}

/** Parse an imported file's text into an earned set, keeping only names the
    guide actually lists. Returns { earned, kept, dropped }. */
export function importText(text, knownNames) {
  const parsed = JSON.parse(text);
  const listed = Array.isArray(parsed) ? parsed : parsed.earned;
  if (!Array.isArray(listed)) throw new Error('not a progress file: no earned list');
  const known = new Set(knownNames);
  const earned = new Set();
  let dropped = 0;
  for (const name of listed) {
    if (typeof name === 'string' && known.has(name)) earned.add(name);
    else dropped += 1;
  }
  return { earned, kept: earned.size, dropped };
}

/** Grade totals for a trophy list, with earned counts beside them. */
export function gradeProgress(trophies, earned) {
  const grades = ['platinum', 'gold', 'silver', 'bronze'];
  return grades.map((grade) => {
    const total = trophies.filter((t) => t.grade === grade).length;
    const done = trophies.filter((t) => t.grade === grade && earned.has(t.name)).length;
    return { grade, done, total };
  });
}
