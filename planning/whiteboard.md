# Confluence whiteboard specification

## Purpose and status

Build an editable collaboration space for **The Front-End Lab**, Friday, 20 November 2026. It should guide participants from choosing an experiment to sharing evidence and reflecting together. This file is a handoff specification; no Confluence board has been created.

The previous chapter-day screenshots were unavailable during setup. The layout below is a new proposal based on the supplied requirements, not a reconstruction of those screenshots. The working title, five tracks and agenda are provisional. Track E must remain visibly undecided until confirmed.

## Inputs for the implementing agent

Use [the agenda](agenda.md), [track definitions](tracks.md) and [preparation checklist](preparation.md) as canonical content. The [Mermaid overview](../whiteboard/structure.mmd) expresses navigation, not an import format or a substitute for an editable board.

Before publishing, obtain the Confluence space/destination, board title approval, access audience and permission to create the board. Confirm participant edit access and the final logistics. Do not infer a destination or invite people from this specification.

If board creation is unavailable, report the missing capability and preserve this handoff. Do not claim a board exists or assume Mermaid automatically becomes editable Confluence objects.

## Layout and visual conventions

Create six numbered zones with clear reading order:

1. Welcome and agenda across the top.
2. Common preparation and setup below it.
3. Track selection before the branching work areas.
4. Five independent track areas A–E, arranged as three on one row and two on the next with generous space for notes.
5. Shared findings and demonstrations below the tracks.
6. Retrospective and takeaways at the end.

Use native editable text, shapes, sticky notes and connectors supported by the host. Group each zone using available grouping/container features. Keep instructions separate from empty participant canvases; do not flatten the board into an image. Use track letters and descriptive titles as well as colour, readable contrast and concise text. Label every provisional item with “Proposed” or “To Be Decided”; colour alone is insufficient.

Provide a small legend: instruction cards, participant notes, evidence links and help requests. Each participant note should contain a name/group label. Leave at least three blank notes per collaborative prompt and room to add more; blank note prompts must look different from actual findings. Add a compact navigation index with zone names and links if supported.

## 1 · Welcome and agenda

Place the working title, tagline and date prominently. Include this welcome copy:

> Choose something you are curious about. Work with people from another squad. Try a small experiment, capture what happens and share one discovery. A useful failed attempt counts.

Add the provisional agenda from `agenda.md`, visibly labelled as proposed until confirmed. Include placeholders for **[VENUE_OR_MEETING_LINK]**, **[TIME_ZONE]**, **[FACILITATOR_CONTACT]** and **[CONFIRMED_HOURS]**. Working agreements: ask for help early, share the keyboard, respect different starting points and favour learning over polish.

Collaborative space: “What would make today worthwhile for you?” with name and one sentence per note.

## 2 · Common preparation and setup

Include repository link: https://github.com/mortenbroesby/frontend-chapter-day and a link to its preparation document. Show laptop/editor/browser/Git/access checks. State that exercise setup commands are pending until implemented and verified; replace this statement with links to real tested exercise guides later.

Provide three columns:

- **Ready:** name/group, chosen environment and successful setup evidence.
- **Blocked:** name/group, step attempted, symptom and help needed; no secrets in notes.
- **Can help:** name, topic and how to reach them during the day.

Add a fallback card: pair with a prepared participant or work from a facilitator's saved demo/trace while recording the blocker. Do not make a specialist toolchain a universal prerequisite.

## 3 · Track selection

Create five editable track cards with letter, title, one-sentence objective and “Proposed” status. A–D use the objectives in `tracks.md`. E reads “To Be Decided: Architecture Under Pressure or Resilient Interfaces”.

Under each card provide participant/group name, squad (optional), curiosity/question and help they can offer. Encourage cross-squad pairs or small groups without fixing sizes or capacity. Include a separate E discussion space with “Which candidate interests you, and why?” Notes are input to the organiser, not an automatic vote that finalises the choice.

Allow participants to move their names as interests change. Link or visibly connect each selection card to its independent track area.

## 4 · Five independent track areas

Every area must be usable without reading another track. Use the same lightweight template:

1. **Start here:** short introduction, objective and preparation/start link. Until implemented, mark the start link **[EXERCISE_GUIDE_PENDING]**.
2. **Choose a challenge:** three suggestion cards; explicitly say “Pick one, adapt it or bring your own question.”
3. **Experiment canvas:** question/hypothesis; approach; baseline; change tried; result/evidence; interpretation/limitations; next experiment. Leave editable notes under each prompt.
4. **Discoveries and help:** separate spaces for surprises, useful references and blockers.
5. **Optional stretch:** one or two ideas, never prerequisites.
6. **Show-and-tell:** group, question, demo/evidence link, one finding, one limitation and next step.

Add the following track-specific content, keeping full detail in `tracks.md`:

| Area | Introduction and challenge cards | Preparation and first move | Stretch and demonstration prompt |
| --- | --- | --- | --- |
| A · Creative Browser — proposed | What can the browser make possible? Try interactive Canvas/SVG, a tiny game/animation, or a View Transition with fallback | Browser/editor/DevTools; start with one visible object and one interaction; check API support | Keyboard access, reduced motion or Canvas/SVG comparison. Show the interaction and a surprising capability or constraint |
| B · Push the Browser — proposed | Keep the UI responsive under load. Compare main thread vs Worker, chunk a long task, or investigate an optional bounded WebAssembly computation | Synthetic workload and local server once ready; capture interaction behaviour before changing execution | Cancellation, progress or transfer costs. Show the comparison with measurement conditions and limitations |
| C · Performance Detective — proposed | Find the cause before optimising. Profile React rendering, inspect a network waterfall, or investigate bundle/operation cost | Reproducible synthetic slow sample to be prepared; record baseline and device/browser conditions | Repeat under throttling or check regressions. Show before/after evidence and explain the cause |
| D · Developer Experience & Tooling — proposed | Remove one everyday annoyance. Try a fixture-checking CLI, a build feedback improvement, or a small developer utility | One pain point and input/output example; local fixture and agreed runtime; no production integration needed | Helpful errors, a meaningful test or time comparison. Demonstrate the workflow and trade-offs |
| E · To Be Decided | Display both candidate cards below; no chosen challenge or required setup yet | Record interests and requirements; organiser must select direction before exercise preparation | Leave a common findings/demo canvas ready for whichever candidate is selected |

### Track E candidate cards

**Architecture Under Pressure — candidate:** Start with a tiny UI, then apply a new requirement such as an alternative data source, a new feature or changed state ownership. Record the original design, the change, coupling exposed and trade-offs. Preparation requires an agreed sample and requirement cards. Stretch: compare a second design. Show a working change and explain what it cost.

**Resilient Interfaces — candidate:** Explore slow responses, errors or out-of-order results using deterministic local fault simulation. Record the failure, what the user sees, recovery behaviour and evidence. Preparation requires an agreed UI and fault controls. Stretch: cancellation or accessible status feedback. Show failure and recovery.

Keep a conspicuous “Decision pending” banner over E. After confirmation, retain a brief decision note and use the standard track template for the chosen direction; do not present both candidates as committed tracks.

## 5 · Shared findings and demonstrations

Provide a demo queue with group, track, presenter, title, evidence/demo link and time slot. Use the agenda's 40-minute window: propose five-minute demos plus questions for five groups; revise the format if attendance produces more groups.

Below it create a gallery with these editable prompts:

- We wanted to find out…
- We tried…
- The evidence was…
- What surprised us / what did not work…
- What another squad could reuse…
- What remains uncertain…

Keep references to code, traces or screenshots next to findings. Screenshots can be supporting evidence but must not replace editable text. Do not enter invented example outcomes as if participants had produced them.

## 6 · Retrospective and takeaways

Create columns “Learned”, “Enjoyed”, “Would change” and “Want to explore next”. Invite each participant to add one takeaway. Add a follow-up table: idea, optional owner, next step and link. Ownership is voluntary; a sticky note is not a delivery commitment.

## Construction and acceptance checklist

- [ ] All six zones exist, follow the flow and can be located easily.
- [ ] All five independent track areas have instructions, challenge suggestions, preparation status, findings space and show-and-tell prompts.
- [ ] E shows both candidates and an explicit pending decision; A–D and timing retain their provisional status unless subsequently confirmed.
- [ ] Instruction cards, sticky notes and connectors remain individually editable; the board is not a single exported picture.
- [ ] A participant can add and edit a note, move a selection note and paste an evidence link with the intended permissions.
- [ ] Repository and implemented exercise links resolve for the intended participants; missing links remain clearly marked rather than guessed.
- [ ] Text is readable, status is not conveyed only by colour and each area has room to grow.
- [ ] Agenda and track wording match their canonical documents; no fictional findings or unsupported commands have been added.
- [ ] Record the real board URL, permission check and any unsupported host features in this document, then update README and announcement links.

Deliver the board URL and a brief completion report describing editable elements, access verification and any remaining placeholders. Publishing, participant access and content completion are separate checks.
