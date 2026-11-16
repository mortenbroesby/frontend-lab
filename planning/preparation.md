# Preparation

Status: initial planning checklist, 16 November 2026. No runnable exercises exist yet. Exact runtime versions, package manager and commands will be published only after the bootstrap is implemented and verified.

## Participants: before Friday

- Bring a laptop, charger, preferred editor and a modern browser with developer tools.
- Check that Git is installed. If already using Node.js, note your installed Node.js and package-manager versions; wait for the agreed baseline before changing your environment.
- Sign in to GitHub and check access to [the private repository](https://github.com/mortenbroesby/frontend-chapter-day). Report an access failure to the organiser; being able to see this document elsewhere does not prove repository access.
- Once invited, confirm that you can edit the Confluence whiteboard: **[WHITEBOARD_URL — pending creation]**.
- Read the proposed tracks and bring one question you would enjoy exploring. No specialist knowledge or finished idea is expected.
- After organisers publish a tested setup guide, follow its exact steps and report blockers before Friday. There is nothing to install from this repository yet.

Optional inventory commands for existing tools only:

```sh
git --version
node --version
npm --version
```

A missing Node.js/npm command is a setup item to resolve once the baseline is agreed, not evidence that a workshop exercise is broken. Do not install global CLIs, WebAssembly toolchains or cloud tooling speculatively.

## Organiser readiness plan — suggested deadlines

| Target | Action | Evidence of readiness |
| --- | --- | --- |
| Mon 16 Nov | Review concept, propose tracks and review announcement | Open decisions are explicit; draft ready for organiser review |
| Tue 17 Nov | Confirm E, A–D, logistics, attendance and facilitator roles | Decisions recorded in AGENTS.md and relevant docs |
| Tue 17 Nov | Agree participant repository access and Confluence destination | Named owner for access; invitation approach agreed |
| Wed 18 Nov | Implement only the agreed minimal bootstrap; create the editable board | Tested starter instructions and editable board available |
| Thu 19 Nov | Verify setup from a clean checkout and with a participant | Runtime versions, lockfile, exact commands and access confirmed |
| Thu 19 Nov | Publish final preparation details and logistics | Announcement links resolve for a participant account |
| Fri 20 Nov | Open room/board and run a brief setup check | Help route, fallback materials and demo flow ready |

Owner assignments are pending. Dates above are proposals, not completed work.

## Verification and fallback

For each implemented exercise, record the verified runtime and package manager, a clean installation, start command, expected initial behaviour and any build/test checks that actually exist. Browser support and optional tools should be verified against the selected challenge.

Test access using a participant account, not only the repository owner's account. Confirm whether participants need read-only or contribution access and how changes/findings will be shared. Do not issue invitations without organiser authorisation.

Keep assets and test data local and synthetic where possible. If setup fails on the day, pair with a prepared participant or use a facilitator's demonstration and saved traces; capture the blocker. Avoid making cloud accounts or production credentials a prerequisite.

## Logistics still to confirm

Start/end time and time zone; venue or meeting link; remote participation; attendee count; facilitators and help contact; lunch/break arrangements; contribution workflow; final board URL and edit permissions.
