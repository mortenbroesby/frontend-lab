type Verdict = 'clean' | 'bad';
export type Action = 'left' | 'right' | 'merge' | 'test' | 'bounce' | 'extend';

type PullRequest = {
  at: number;
  lane: number;
  title: string;
  lines: number;
  green: boolean;
  truth: Verdict;
};

// The two closely spaced pairs ask the reviewer to choose which lane to cover.
const release: PullRequest[] = [
  { at: 0, lane: 1, title: 'Fix button label', lines: 4, green: true, truth: 'clean' },
  { at: 4.5, lane: 0, title: 'Fix typo', lines: 912, green: true, truth: 'bad' },
  { at: 10, lane: 2, title: 'Add focus ring', lines: 8, green: true, truth: 'clean' },
  { at: 15, lane: 1, title: 'Skip auth check', lines: 2, green: false, truth: 'bad' },
  { at: 15.12, lane: 2, title: 'Label search box', lines: 3, green: true, truth: 'clean' },
  { at: 21, lane: 1, title: 'Trim empty input', lines: 11, green: true, truth: 'clean' },
  { at: 25, lane: 2, title: 'Refactor cache', lines: 154, green: true, truth: 'bad' },
  { at: 29.5, lane: 0, title: 'Restore tab order', lines: 7, green: true, truth: 'clean' },
  { at: 34, lane: 1, title: 'Remove bounds check', lines: 5, green: false, truth: 'bad' },
  { at: 34.12, lane: 2, title: 'Fix icon padding', lines: 6, green: true, truth: 'clean' },
  { at: 40, lane: 0, title: 'Refresh snapshots', lines: 237, green: true, truth: 'clean' },
  { at: 44.5, lane: 2, title: 'Link help page', lines: 4, green: true, truth: 'clean' },
  { at: 49, lane: 1, title: 'Ignore save errors', lines: 9, green: false, truth: 'bad' },
  { at: 53.5, lane: 0, title: 'Fix menu contrast', lines: 8, green: true, truth: 'clean' },
  { at: 58.5, lane: 2, title: 'Label close button', lines: 3, green: true, truth: 'clean' },
  { at: 63, lane: 1, title: 'Fix date format', lines: 12, green: true, truth: 'clean' },
];

export const reviewStart = 0.75;
const travel = 6;
const reviewCooldown = 1.8;
const testDelay = 3;

export type Card = {
  id: number;
  lane: number;
  title: string;
  lines: number;
  green: boolean;
  started: number;
  progress: number;
  verdict?: Verdict;
};

export type Round = {
  elapsed: number;
  remaining: number;
  merges: number;
  regressions: number;
  extended: boolean;
  lane: number;
  status: 'playing' | 'won' | 'lost';
  feedback: string;
  cards: Card[];
  pending: { id: number; lane: number; due: number }[];
  nextArrival: number;
  readyAt: number;
};

function cardFor(id: number, started: number, tested: boolean): Card {
  const { lane, title, lines, green, truth } = release[id - 1];
  return {
    id,
    lane,
    title,
    lines,
    green,
    started,
    progress: 0,
    verdict: tested ? truth : undefined,
  };
}

export function initialRound(): Round {
  return {
    elapsed: 0,
    remaining: 60,
    merges: 0,
    regressions: 0,
    extended: false,
    lane: 1,
    status: 'playing',
    feedback: 'Move under a PR and review it inside the gate.',
    cards: [cardFor(1, 0, false)],
    pending: [],
    nextArrival: 1,
    readyAt: 0,
  };
}

function returnTime(r: Round, lane: number) {
  const scheduled = [
    ...release.filter((pr) => pr.lane === lane).map((pr) => pr.at),
    ...r.pending.filter((pr) => pr.lane === lane).map((pr) => pr.due),
    ...r.cards.filter((pr) => pr.lane === lane).map((pr) => pr.started),
  ].sort((a, b) => a - b);
  let due = r.elapsed + testDelay;
  for (const at of scheduled) {
    if (Math.abs(at - due) < travel) due = at + travel;
  }
  return due;
}

function arrivals(r: Round, time: number) {
  while (r.nextArrival < release.length && release[r.nextArrival].at <= time) {
    const i = r.nextArrival++;
    r.cards.push(cardFor(i + 1, release[i].at, false));
  }
  for (const p of r.pending) {
    if (p.due <= time) {
      const result = cardFor(p.id, p.due, true);
      r.cards.push(result);
      r.feedback = `Lane ${p.lane + 1} · ${result.title} tested ${result.verdict}`;
    }
  }
  r.pending = r.pending.filter((p) => p.due > time);
}

export function step(r: Round, seconds: number) {
  if (r.status !== 'playing' || !Number.isFinite(seconds) || seconds <= 0) return;
  const deadline = r.extended ? 70 : 60;
  let time = Math.min(deadline, r.elapsed + seconds);
  arrivals(r, time);
  const missed = r.cards
    .filter((c) => c.started + travel <= time)
    .sort((a, b) => a.started - b.started);
  const messages: string[] = [];
  for (const c of missed) {
    const bad = release[c.id - 1].truth === 'bad';
    if (bad) r.regressions++;
    messages.push(bad ? `${c.title} slipped through · regression` : `Missed ${c.title} · no point`);
    if (r.regressions === 3) {
      time = c.started + travel;
      r.status = 'lost';
      break;
    }
  }
  r.elapsed = time;
  r.remaining = deadline - time;
  r.cards = r.cards.filter((c) => c.started <= time && c.started + travel > time);
  for (const c of r.cards) c.progress = (time - c.started) / travel;
  if (messages.length) r.feedback = messages.join(' / ');
  if (r.remaining === 0) {
    r.status = 'lost';
    r.feedback = 'Release window closed.';
  }
}

export function act(r: Round, action: Action) {
  if (r.status !== 'playing') return;
  if (action === 'left' || action === 'right') {
    r.lane = Math.max(0, Math.min(2, r.lane + (action === 'left' ? -1 : 1)));
    return;
  }
  if (action === 'extend') {
    if (!r.extended) {
      r.extended = true;
      r.remaining += 10;
      r.feedback = 'Deadline extended · +10 seconds';
    }
    return;
  }
  review(r, action);
}

function review(r: Round, action: 'merge' | 'bounce' | 'test') {
  if (r.elapsed < r.readyAt) {
    r.feedback = 'Review gate is rearming.';
    return;
  }
  const c = r.cards
    .filter((c) => c.lane === r.lane && c.progress >= reviewStart)
    .sort((a, b) => b.progress - a.progress)[0];
  if (!c) {
    r.feedback = 'Wait for a PR in your review zone.';
    return;
  }
  if (action === 'test' && c.verdict) {
    r.feedback = 'Test complete. Merge or bounce this PR.';
    return;
  }
  r.cards = r.cards.filter((other) => other !== c);
  r.readyAt = r.elapsed + reviewCooldown;
  if (action === 'test') {
    const due = returnTime(r, c.lane);
    r.pending.push({ id: c.id, lane: c.lane, due });
    r.feedback = `Testing ${c.title} · returns to lane ${c.lane + 1} in ${Math.ceil(due - r.elapsed)}s`;
  } else if (action === 'bounce') {
    r.feedback = `Bounced ${c.title}`;
  } else {
    merge(r, c);
  }
}

function merge(r: Round, c: Card) {
  if (release[c.id - 1].truth === 'clean') {
    r.merges++;
    r.feedback = `Merged ${c.title} · +1 clean merge`;
    if (r.merges === 5) r.status = 'won';
  } else {
    r.regressions++;
    r.feedback = `Merged ${c.title} · regression`;
    if (r.regressions === 3) r.status = 'lost';
  }
}
