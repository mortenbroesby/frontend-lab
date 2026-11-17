import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Button } from '@lab/ui/button';
import { Input } from '@lab/ui/input';
import { Label } from '@lab/ui/label';
import { Slider } from '@lab/ui/slider';
import { galleryHref } from '@lab/demo-kit/gallery-link';
import { SaveSeal } from './SaveSeal';
import sealUrl from './save-seal.json?url';
import './styles.css';

const treatments = ['Still', 'Motion', 'Motion + Lottie'] as const;
type Treatment = (typeof treatments)[number];

export default function MotionWithPurpose() {
  const [treatment, setTreatment] = useState<Treatment>('Motion + Lottie');
  const [duration, setDuration] = useState(350);
  const [title, setTitle] = useState('A little room for an idea');
  const [editing, setEditing] = useState(false);
  const [revision, setRevision] = useState(0);
  const [replay, setReplay] = useState(0);
  const reduced = useReducedMotion();
  const animate = treatment !== 'Still' && !reduced;
  const transition = { duration: animate ? duration / 1000 : 0, ease: 'easeOut' as const };
  const canReplay = revision > 0 && !editing;
  const revisionLabel = revision ? `Revision ${revision}` : 'Draft collection';
  const guide = galleryHref('/track/experimental-projects/motion');

  function save(next: string) {
    setTitle(next);
    setEditing(false);
    setRevision((value) => value + 1);
    setReplay((value) => value + 1);
  }

  return (
    <div className="motion-lab">
      <div className="motion-intro">
        <p className="eyebrow">A change you can follow</p>
        <h2>Same action. Different feeling.</h2>
        <p>Edit the card, then save. Compare how motion connects your action to its result.</p>
      </div>
      <div className="motion-workbench">
        <section className="motion-stage" aria-label="Interactive card">
          <div className="motion-stage-caption">
            <span>01 / Your idea</span>
            <span>{treatment}</span>
          </div>
          <motion.article className="motion-card" layout={animate} transition={transition}>
            <div className="motion-card-art" aria-hidden="true">
              <svg viewBox="0 0 360 160" fill="none">
                <path
                  d="M0 120H360M0 80H360M0 40H360M60 0V160M120 0V160M180 0V160M240 0V160M300 0V160"
                  className="motion-grid-lines"
                />
                <circle cx="180" cy="80" r="51" className="motion-orbit" />
                <rect
                  x="151"
                  y="51"
                  width="58"
                  height="58"
                  rx="12"
                  transform="rotate(-12 180 80)"
                  className="motion-tile"
                />
                <path d="m168 81 9 9 18-20" className="motion-tile-mark" />
                <circle cx="231" cy="80" r="5" className="motion-dot" />
              </svg>
            </div>
            <div className="motion-card-body">
              <div className="motion-card-meta">
                <span>IDEA / 001</span>
                <span>{revisionLabel}</span>
              </div>
              <h3>{title}</h3>
              <p>A small thought, ready for its next version.</p>
              <CardEditor
                title={title}
                editing={editing}
                onEditingChange={setEditing}
                onSave={save}
              />
              {canReplay && (
                <SaveConfirmation
                  key={replay}
                  treatment={treatment}
                  animate={animate}
                  duration={duration}
                />
              )}
            </div>
          </motion.article>
          <p className="motion-stage-note" role="status">
            {saveStatus(editing, revision)}
          </p>
        </section>
        <MotionControls
          treatment={treatment}
          onTreatmentChange={setTreatment}
          duration={duration}
          onDurationChange={setDuration}
          animate={animate}
          reduced={Boolean(reduced)}
          canReplay={canReplay}
          onReplay={() => setReplay((value) => value + 1)}
        />
      </div>
      <div className="motion-notes">
        <section>
          <p className="eyebrow">Motion / Interface</p>
          <h3>Keep the connection.</h3>
          <p>
            React owns the saved value. Layout and entrance transitions help your eye follow what
            changed.
          </p>
          <a href="https://motion.dev/docs/react-layout-animations">Motion layout guide ↗</a>
        </section>
        <section>
          <p className="eyebrow">Lottie / Artwork</p>
          <h3>Play a designed moment.</h3>
          <p>
            An original JSON vector timeline becomes an SVG. It plays once; it never decides whether
            the save succeeded.
          </p>
          <a href={sealUrl} download="save-seal.json">
            Download the animation file ↓
          </a>
        </section>
      </div>
      {guide && (
        <p className="motion-guide">
          <a href={guide}>Add motion with purpose — follow the guide →</a>
        </p>
      )}
    </div>
  );
}

function MotionControls({
  treatment,
  onTreatmentChange,
  duration,
  onDurationChange,
  animate,
  reduced,
  canReplay,
  onReplay,
}: {
  treatment: Treatment;
  onTreatmentChange: (treatment: Treatment) => void;
  duration: number;
  onDurationChange: (duration: number) => void;
  animate: boolean;
  reduced: boolean;
  canReplay: boolean;
  onReplay: () => void;
}) {
  return (
    <aside className="motion-controls" aria-label="Motion controls">
      <div>
        <p className="eyebrow">02 / Compare the feedback</p>
        <h3>Give every movement a job.</h3>
      </div>
      <fieldset className="motion-treatments">
        <legend>Treatment</legend>
        {treatments.map((value, index) => (
          <Button
            key={value}
            variant={value === treatment ? 'default' : 'outline'}
            aria-pressed={value === treatment}
            onClick={() => onTreatmentChange(value)}
          >
            <span>0{index + 1}</span>
            {value}
          </Button>
        ))}
      </fieldset>
      <p className="motion-explanation">
        {treatment === 'Still'
          ? 'An instant baseline: the same content and actions, without movement.'
          : treatment === 'Motion'
            ? 'Motion connects the card’s changing height and the arrival of confirmation.'
            : 'Motion handles the interface. Lottie draws a small, finite vector seal after saving.'}
      </p>
      <div className="motion-timing">
        <Label htmlFor="motion-duration">
          Interface transition <span>{duration} ms</span>
        </Label>
        <Slider
          id="motion-duration"
          aria-label="Interface transition duration"
          min={150}
          max={750}
          step={50}
          value={[duration]}
          onValueChange={([value]) => onDurationChange(value)}
          disabled={!animate}
        />
      </div>
      <Button variant="outline" disabled={!canReplay} onClick={onReplay}>
        Replay confirmation
      </Button>
      <p className="small">
        Replay changes no data. The Lottie file has its own 1.5-second timeline.
      </p>
      {reduced && (
        <p className="motion-preference" role="status">
          Your device requests reduced motion. Transitions are instant and the seal shows its final
          frame.
        </p>
      )}
      <div className="motion-observe">
        <strong>Try this</strong>
        <p>
          Save once with Still. Switch to Motion + Lottie and replay. Then slow the interface
          transition: when does it start getting in your way?
        </p>
      </div>
    </aside>
  );
}

function saveStatus(editing: boolean, revision: number) {
  if (editing) return 'Editing a draft. Save applies your change.';
  if (revision) return `Revision ${revision} saved in this page. Refresh resets it.`;
  return 'Start with Edit card. Nothing is sent to a server.';
}

function SaveConfirmation({
  treatment,
  animate,
  duration,
}: {
  treatment: Treatment;
  animate: boolean;
  duration: number;
}) {
  return (
    <motion.div
      className="motion-confirmation"
      initial={animate ? { opacity: 0, y: 8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: animate ? duration / 1000 : 0, ease: 'easeOut' }}
    >
      {treatment === 'Motion + Lottie' ? (
        <SaveSeal animate={animate} />
      ) : (
        <span className="motion-static-seal" aria-hidden="true">
          ✓
        </span>
      )}
      <div>
        <strong>Saved for this visit</strong>
        <p>The card is updated. No waiting for the animation.</p>
      </div>
    </motion.div>
  );
}

function CardEditor({
  title,
  editing,
  onEditingChange,
  onSave,
}: {
  title: string;
  editing: boolean;
  onEditingChange: (editing: boolean) => void;
  onSave: (title: string) => void;
}) {
  const [draft, setDraft] = useState(title);
  const editButton = useRef<HTMLButtonElement>(null);
  const hasEdited = useRef(false);
  useEffect(() => {
    if (!editing && hasEdited.current) editButton.current?.focus();
  }, [editing]);
  if (!editing)
    return (
      <Button
        ref={editButton}
        variant="outline"
        onClick={() => {
          hasEdited.current = true;
          setDraft(title);
          onEditingChange(true);
        }}
      >
        Edit card
      </Button>
    );
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (draft.trim()) onSave(draft.trim());
      }}
    >
      <Label htmlFor="motion-title">Card title</Label>
      <Input
        id="motion-title"
        name="title"
        autoComplete="off"
        autoFocus
        value={draft}
        maxLength={70}
        onChange={(event) => setDraft(event.target.value)}
      />
      <div className="motion-actions">
        <Button type="submit" disabled={!draft.trim()}>
          Save card
        </Button>
        <Button variant="ghost" onClick={() => onEditingChange(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
