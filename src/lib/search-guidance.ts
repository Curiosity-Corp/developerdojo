/** Related searches are starting points, not claims that a particular course exists. */
const TOPICS: readonly { triggers: RegExp; searches: readonly string[] }[] = [
  { triggers: /\b(audio|voice|speech|podcast|elevenlabs)\b/i, searches: ['audio', 'voice', 'media'] },
  { triggers: /\b(video|film|animation|youtube)\b/i, searches: ['video', 'media', 'storytelling'] },
  { triggers: /\b(3d|bim|autocad|architecture|construction|building)\b/i, searches: ['3D', 'BIM', 'construction'] },
  { triggers: /\b(design|ux|figma|canva|prototype|wireframe)\b/i, searches: ['UX', 'prototype', 'design'] },
  { triggers: /\b(finance|accounting|bookkeeping|intuit|quickbooks)\b/i, searches: ['finance', 'accounting', 'automation'] },
  { triggers: /\b(salesforce|sales|customer|crm)\b/i, searches: ['customer', 'sales', 'automation'] },
  { triggers: /\b(azure|aws|oracle|gcp|cloudflare|cloud)\b/i, searches: ['cloud', 'cloud workshops', 'automation'] },
  { triggers: /\b(ai|agent|agents|harness|cli|mcp|orchestration)\b/i, searches: ['agent orchestration', 'harness', 'MCP'] },
  { triggers: /\b(data|spreadsheet|excel|csv|analysis)\b/i, searches: ['data', 'data rescue', 'analysis'] },
  { triggers: /\b(robotics|robot|manufacturing|factory)\b/i, searches: ['robotics', 'manufacturing', 'automation'] },
  { triggers: /\b(health|healthcare|medical|medicine)\b/i, searches: ['healthcare', 'verification', 'research'] },
];

export function relatedSearches(query: string): string[] {
  const normalized = query.trim().toLowerCase();
  const matches: string[] = [];
  for (const topic of TOPICS) {
    if (!topic.triggers.test(normalized)) continue;
    for (const search of topic.searches) {
      if (search.toLowerCase() !== normalized && !matches.includes(search)) matches.push(search);
      if (matches.length === 5) return matches;
    }
  }
  return matches;
}

/** One insertion, deletion, substitution or adjacent transposition, with no guessed content. */
export function isOneEditAway(a: string, b: string): boolean {
  if (a === b || Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  if (a.length === b.length) {
    if (a.slice(i + 1) === b.slice(i + 1)) return true;
    return i + 1 < a.length && a[i] === b[i + 1] && a[i + 1] === b[i] && a.slice(i + 2) === b.slice(i + 2);
  }
  return a.length > b.length ? a.slice(i + 1) === b.slice(i) : a.slice(i) === b.slice(i + 1);
}

/** Suggest a correction only from words actually in public page/resource titles. */
export function correctSearch(query: string, vocabulary: readonly string[]): string | null {
  const known = new Set(vocabulary);
  let changed = false;
  const suggestion = query.replace(/[A-Za-z][A-Za-z0-9]*/g, (token) => {
    const word = token.toLowerCase();
    // Avoid changing acronyms, short words, and numeric terms such as 3D or GPT-4.
    if (word.length < 5 || word.length > 24 || /\d/.test(word) || known.has(word)) return token;
    const candidate = vocabulary.find((entry) => Math.abs(entry.length - word.length) <= 1 && isOneEditAway(word, entry));
    if (!candidate) return token;
    changed = true;
    return candidate;
  });
  return changed ? suggestion : null;
}
