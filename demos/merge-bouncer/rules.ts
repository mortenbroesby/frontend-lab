type Verdict = 'clean' | 'bad';
export type Action =
  'forward' | 'backward' | 'left' | 'right' | 'merge' | 'test' | 'bounce' | 'extend' | 'scout';

export type ImpactKind = 'merge' | 'block' | 'reject' | 'miss' | 'test' | 'scout' | 'regression';

type PullRequest = {
  at: number;
  lane: number;
  title: string;
  lines: number;
  green: boolean;
  runner?: boolean;
  truth: Verdict;
};

// The two closely spaced pairs ask the reviewer to choose which lane to cover.
const release: PullRequest[] = [
  { at: 0, lane: 1, title: 'Fix button label', lines: 4, green: true, truth: 'clean' },
  { at: 3.24, lane: 0, runner: true, title: 'Fix typo', lines: 912, green: true, truth: 'bad' },
  {
    at: 7.2,
    lane: 2,
    runner: true,
    title: 'Add focus ring',
    lines: 8,
    green: true,
    truth: 'clean',
  },
  { at: 10.8, lane: 1, title: 'Skip auth check', lines: 2, green: false, truth: 'bad' },
  { at: 10.8864, lane: 2, title: 'Label search box', lines: 3, green: true, truth: 'clean' },
  { at: 15.12, lane: 1, title: 'Trim empty input', lines: 11, green: true, truth: 'clean' },
  { at: 18, lane: 2, title: 'Refactor cache', lines: 154, green: true, truth: 'bad' },
  {
    at: 21.24,
    lane: 0,
    runner: true,
    title: 'Restore tab order',
    lines: 7,
    green: true,
    truth: 'clean',
  },
  { at: 24.48, lane: 1, title: 'Remove bounds check', lines: 5, green: false, truth: 'bad' },
  { at: 24.5664, lane: 2, title: 'Fix icon padding', lines: 6, green: true, truth: 'clean' },
  { at: 28.8, lane: 0, title: 'Refresh snapshots', lines: 237, green: true, truth: 'clean' },
  {
    at: 32.04,
    lane: 2,
    runner: true,
    title: 'Link help page',
    lines: 4,
    green: true,
    truth: 'clean',
  },
  {
    at: 35.28,
    lane: 1,
    runner: true,
    title: 'Ignore save errors',
    lines: 9,
    green: false,
    truth: 'bad',
  },
  { at: 38.52, lane: 0, title: 'Fix menu contrast', lines: 8, green: true, truth: 'clean' },
  { at: 42.12, lane: 2, title: 'Label close button', lines: 3, green: true, truth: 'clean' },
  {
    at: 45.36,
    lane: 1,
    runner: true,
    title: 'Fix date format',
    lines: 12,
    green: true,
    truth: 'clean',
  },
];

const troll: PullRequest = {
  at: 0,
  lane: 1,
  title: 'The Merge Troll',
  lines: 9999,
  green: true,
  truth: 'bad',
};
export const trollId = release.length + 1;
function requestFor(id: number) {
  return id === trollId ? troll : release[id - 1];
}

export const upgrades = [
  { id: 'gate', name: 'Fold-out gate', detail: 'Review a ticket about half a second earlier.' },
  { id: 'stamp', name: 'Spring-loaded stamp', detail: 'Halve the wait between reviews.' },
] as const;
export type Upgrade = (typeof upgrades)[number]['id'];
export const upgradeCost = 2;

export function reviewStart(r: Round) {
  return r.installed.gate ? 0.62 : 0.75;
}

export function purchase(r: Round, id: Upgrade) {
  if (r.status !== 'playing' || r.installed[id] || r.storyPoints < upgradeCost) return;
  r.storyPoints -= upgradeCost;
  r.installed[id] = true;
  if (id === 'stamp') r.readyAt -= reviewCooldown / 2;
}
function travelTime(id: number) {
  if (id === trollId) return 6;
  return requestFor(id).runner ? 3.6 : 4.32;
}
const reviewCooldown = 1.3;
const testDelay = 2.16;

export type Card = {
  id: number;
  lane: number;
  title: string;
  lines: number;
  green: boolean;
  travel: number;
  runner: boolean;
  started: number;
  progress: number;
  verdict?: Verdict;
};

export type Round = {
  elapsed: number;
  remaining: number;
  deadline: number;
  storyPoints: number;
  installed: Record<Upgrade, boolean>;
  advance: number;
  score: number;
  chain: number;
  impact?: { kind: ImpactKind; lane: number; points: number; at: number };
  merges: number;
  regressions: number;
  duckReady: boolean;
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
  const { lane, title, lines, green, truth, runner } = requestFor(id);
  return {
    id,
    lane,
    title,
    lines,
    green,
    travel: travelTime(id),
    runner: Boolean(runner),
    started,
    progress: 0,
    verdict: tested ? truth : undefined,
  };
}

export function initialRound(): Round {
  return {
    elapsed: 0,
    remaining: 45,
    deadline: 45,
    advance: 0,
    score: 0,
    storyPoints: 0,
    installed: { gate: false, stamp: false },
    chain: 0,
    merges: 0,
    regressions: 0,
    duckReady: false,
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

function returnTime(r: Round, card: Card) {
  if (card.id === trollId) return r.elapsed + testDelay;
  const scheduled = [
    ...release.map((pr, i) => ({ lane: pr.lane, at: pr.at, duration: travelTime(i + 1) })),
    ...r.pending.map((p) => ({ lane: p.lane, at: p.due, duration: travelTime(p.id) })),
    ...r.cards.map((c) => ({ lane: c.lane, at: c.started, duration: c.travel })),
  ]
    .filter((pr) => pr.lane === card.lane)
    .sort((a, b) => a.at - b.at);
  let due = r.elapsed + testDelay;
  for (const { at, duration } of scheduled) {
    if (due < at + duration && due + card.travel > at) due = at + duration;
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

function missedReview(r: Round, c: Card) {
  if (c.id === trollId) return 'The Merge Troll slipped past the gate.';
  const bad = requestFor(c.id).truth === 'bad';
  recordImpact(r, c.lane, bad ? 'regression' : 'miss', c.started + c.travel);
  if (bad) r.regressions++;
  return bad ? `${c.title} slipped through · regression` : `Missed ${c.title} · no point`;
}

export function step(r: Round, seconds: number) {
  if (r.status !== 'playing' || !Number.isFinite(seconds) || seconds <= 0) return;
  const deadline = r.deadline;
  let time = Math.min(deadline, r.elapsed + seconds);
  arrivals(r, time);
  const missed = r.cards
    .filter((c) => c.started + c.travel <= time)
    .sort((a, b) => a.started + a.travel - (b.started + b.travel));
  const messages: string[] = [];
  for (const c of missed) {
    messages.push(missedReview(r, c));
    if (r.regressions === 3 || c.id === trollId) {
      // Only the final missed review belongs on the loss screen.
      messages.splice(0, messages.length - 1);
      time = c.started + c.travel;
      r.status = 'lost';
      break;
    }
  }
  r.elapsed = time;
  r.remaining = deadline - time;
  r.cards = r.cards.filter((c) => c.started <= time && c.started + c.travel > time);
  for (const c of r.cards) c.progress = (time - c.started) / c.travel;
  if (messages.length) r.feedback = messages.join(' / ');
  if (r.remaining === 0) {
    r.status = 'lost';
    r.feedback = 'Release window closed.';
  }
}

export function act(r: Round, action: Action) {
  if (r.status !== 'playing') return;
  if (action === 'forward' || action === 'backward') {
    r.advance = Math.max(0, Math.min(3, r.advance + (action === 'forward' ? 1 : -1)));
    return;
  }
  if (action === 'left' || action === 'right') {
    r.lane = Math.max(0, Math.min(2, r.lane + (action === 'left' ? -1 : 1)));
    return;
  }
  if (action === 'extend') {
    if (!r.extended) {
      r.extended = true;
      r.remaining += 10;
      r.deadline += 10;
      r.feedback = 'Deadline extended · +10 seconds';
    }
    return;
  }
  if (action === 'scout') scout(r);
  else review(r, action);
}

function scout(r: Round) {
  if (!r.duckReady) return;
  if (r.merges === 5) {
    r.feedback = 'Too much paperwork for one duck. Test the troll at the gate.';
    return;
  }
  const target = r.cards
    .filter((card) => card.lane !== r.lane && !card.verdict && card.progress < reviewStart(r))
    .sort((a, b) => b.progress - a.progress)[0];
  if (!target) {
    r.feedback = 'Duck on standby. Wait for an approaching PR in another lane.';
    return;
  }
  recordImpact(r, target.lane, 'scout');
  target.verdict = release[target.id - 1].truth;
  r.duckReady = false;
  r.feedback = `Duck report · lane ${target.lane + 1} · ${target.title} is ${target.verdict}`;
}

function review(r: Round, action: 'merge' | 'bounce' | 'test') {
  if (r.elapsed < r.readyAt) {
    r.feedback = 'Review gate is rearming.';
    return;
  }
  const c = r.cards
    .filter((c) => c.lane === r.lane && c.progress >= reviewStart(r))
    .sort((a, b) => b.progress - a.progress)[0];
  if (!c) {
    r.feedback = 'Wait for a PR in your review zone.';
    return;
  }
  if (action === 'test' && c.verdict) {
    r.feedback = 'Verdict known. Merge or bounce this PR.';
    return;
  }
  if (c.id === trollId && action === 'bounce' && !c.verdict) {
    r.feedback = 'Boss shield · test first, then bounce the returning troll.';
    return;
  }
  resolveReview(r, c, action);
}

function resolveReview(r: Round, c: Card, action: 'merge' | 'bounce' | 'test') {
  r.cards = r.cards.filter((other) => other !== c);
  r.readyAt = r.elapsed + reviewCooldown / (r.installed.stamp ? 2 : 1);
  if (action === 'test') {
    recordImpact(r, c.lane, 'test');
    const due = returnTime(r, c);
    r.pending.push({ id: c.id, lane: c.lane, due });
    r.feedback = `Testing ${c.title} · returns to lane ${c.lane + 1} in ${Math.ceil(due - r.elapsed)}s`;
  } else if (c.id === trollId) {
    const blocked = action === 'bounce';
    recordImpact(r, c.lane, blocked ? 'block' : 'regression');
    r.status = blocked ? 'won' : 'lost';
    r.feedback = blocked
      ? 'Merge Troll bounced. Release shipped!'
      : 'The Merge Troll made it into main.';
  } else if (action === 'bounce') {
    bounce(r, c);
  } else {
    merge(r, c);
  }
}

function bounce(r: Round, c: Card) {
  const caught = release[c.id - 1].truth === 'bad';
  recordImpact(r, c.lane, caught ? 'block' : 'reject');
  if (caught) r.duckReady = true;
  r.feedback = caught ? `Caught ${c.title} · duck scout ready!` : `Bounced clean PR · ${c.title}`;
}

function merge(r: Round, c: Card) {
  if (release[c.id - 1].truth === 'clean') {
    recordImpact(r, c.lane, 'merge');
    r.merges++;
    r.feedback = `Merged ${c.title} · +1 clean merge`;
    if (r.merges === 5) beginBoss(r);
  } else {
    recordImpact(r, c.lane, 'regression');
    r.regressions++;
    r.feedback = `Merged ${c.title} · regression`;
    if (r.regressions === 3) r.status = 'lost';
  }
}

function beginBoss(r: Round) {
  r.cards = [cardFor(trollId, r.elapsed, false)];
  r.nextArrival = release.length;
  r.pending = [];
  r.remaining = 18;
  r.deadline = r.elapsed + r.remaining;
  r.feedback = 'Boss in lane 2! Test the Merge Troll, then bounce it on return.';
}

function recordImpact(r: Round, lane: number, kind: ImpactKind, at = r.elapsed) {
  let points = 0;
  if (kind === 'merge' || kind === 'block') {
    r.storyPoints++;
    r.chain++;
    points = 100 * Math.min(r.chain, 5);
    r.score += points;
  } else if (['miss', 'regression', 'reject'].includes(kind)) {
    r.chain = 0;
  }
  r.impact = { kind, lane, points, at };
}
