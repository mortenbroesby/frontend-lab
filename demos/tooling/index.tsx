import { useState, type CSSProperties } from 'react';
import { Button } from '@lab/ui/button';
import { Slider } from '@lab/ui/slider';
import { Switch } from '@lab/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@lab/ui/select';
import { Walkthroughs } from './Walkthroughs';
import {
  planWorkflow,
  scenarios,
  strategies,
  taskState,
  type Scenario,
  type Strategy,
  type Task,
} from './workflow';
import './styles.css';

function Workflow({
  strategy,
  scenario,
  warm,
  step,
  max,
}: {
  strategy: Strategy;
  scenario: Scenario;
  warm: boolean;
  step: number;
  max: number;
}) {
  const tasks = planWorkflow(strategy, scenario, warm);
  const [inspected, setInspected] = useState('build');
  const detail = tasks.find((task) => task.id === inspected)!;
  return (
    <section className="loop-panel" aria-label={strategies[strategy].title}>
      <header>
        <p className="eyebrow">{strategy === 'full' ? 'Baseline' : 'Compare with'}</p>
        <h3>{strategies[strategy].title}</h3>
        <p className="loop-strategy-note">{strategies[strategy].note}</p>
      </header>
      <div className="loop-axis">
        <span>Code change</span>
        <span>Feedback →</span>
      </div>
      <div className="loop-lanes">
        {tasks.map((task) => (
          <TaskLane
            key={task.id}
            task={task}
            step={step}
            max={max}
            inspected={inspected === task.id}
            inspect={() => setInspected(task.id)}
          />
        ))}
      </div>
      <WorkflowResult tasks={tasks} step={step} strategy={strategy} />
      <TaskDetail detail={detail} tasks={tasks} />
    </section>
  );
}

function WorkflowResult({
  tasks,
  step,
  strategy,
}: {
  tasks: Task[];
  step: number;
  strategy: Strategy;
}) {
  const selected = tasks.filter((task) => task.selected);
  const finish = Math.max(0, ...selected.map((task) => task.end));
  if (!selected.length)
    return (
      <div className="loop-result" role="status">
        <strong>No feedback from this change</strong>
        <span>The watcher is idle. None of its imported files changed; no checks ran.</span>
      </div>
    );
  return (
    <div className="loop-result" aria-live="polite">
      <strong>{step < finish ? 'Checks in progress' : 'Selected work complete'}</strong>
      <span>
        {selected.filter((task) => !task.cached).length} run ·{' '}
        {selected.filter((task) => task.cached).length} cached · {tasks.length - selected.length}{' '}
        skipped
      </span>
      <span>Test feedback at model step {tasks.find((task) => task.id === 'tests')!.end}.</span>
      <span>
        Complete at model step {finish}.{' '}
        {strategy === 'watch'
          ? 'No type or build assurance.'
          : 'A completed lane is not a real test pass.'}
      </span>
    </div>
  );
}

function TaskDetail({ detail, tasks }: { detail: Task; tasks: Task[] }) {
  return (
    <div className="loop-detail">
      <strong>{detail.label}</strong>
      <p>{detail.reason}</p>
      <p>
        {detail.selected
          ? `Waits for: ${detail.dependencies.map((id) => tasks.find((task) => task.id === id)!.label).join(', ') || 'nothing'}.`
          : 'Outside this strategy’s scope; skipped does not mean passed.'}
      </p>
    </div>
  );
}

function TaskLane({
  task,
  step,
  max,
  inspected,
  inspect,
}: {
  task: Task;
  step: number;
  max: number;
  inspected: boolean;
  inspect: () => void;
}) {
  const state = taskState(task, step);
  const style = {
    '--start': `${(task.start / max) * 100}%`,
    '--length': `${(Math.max(task.end - task.start, 0.25) / max) * 100}%`,
    '--cursor': `${(step / max) * 100}%`,
  } as CSSProperties;
  return (
    <Button
      variant="ghost"
      className="loop-lane"
      data-state={state}
      aria-pressed={inspected}
      onClick={inspect}
      aria-label={`${task.label}: ${state}. Show dependencies`}
    >
      <span className="loop-task-name">
        {task.label}
        <small>{state}</small>
      </span>
      <span className="loop-track" style={style} aria-hidden="true">
        <span className="loop-bar" />
        <span className="loop-cursor" />
      </span>
    </Button>
  );
}

export default function Tooling() {
  const [scenario, setScenario] = useState<Scenario>('tooling');
  const [strategy, setStrategy] = useState<Strategy>('targeted');
  const [warm, setWarm] = useState(true);
  const [step, setStep] = useState(0);
  const current = scenarios.find((item) => item.id === scenario)!;
  const max = Math.max(
    1,
    ...planWorkflow('full', scenario, warm).map((task) => task.end),
    ...planWorkflow(strategy, scenario, warm).map((task) => task.end),
  );
  const reset = () => setStep(0);
  return (
    <div className="feedback-loop">
      <header className="loop-intro">
        <p className="eyebrow">Change → Test → Type check → Build → Learn</p>
        <span className="loop-disclaimer">
          SIMULATION · Illustrative steps, not seconds or measured performance
        </span>
      </header>
      <div className="loop-controls">
        <label>
          1. Make a change
          <Select
            value={scenario}
            onValueChange={(value) => {
              setScenario(value as Scenario);
              reset();
            }}
          >
            <SelectTrigger aria-label="Change scenario">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {scenarios.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
        <label>
          2. Compare a strategy
          <Select
            value={strategy}
            onValueChange={(value) => {
              setStrategy(value as Strategy);
              reset();
            }}
          >
            <SelectTrigger aria-label="Comparison strategy">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="targeted">Targeted checks</SelectItem>
              <SelectItem value="watch">Watch mode</SelectItem>
            </SelectContent>
          </Select>
        </label>
        <label className="loop-cache">
          <Switch
            checked={warm}
            onCheckedChange={(value) => {
              setWarm(value);
              reset();
            }}
          />
          Previous results cached
        </label>
      </div>
      <div className="loop-change">
        <code>{current.file}</code>
        <p>{current.lesson}</p>
      </div>
      <div className="loop-playback">
        <div className="button-row">
          <Button onClick={() => setStep(Math.min(max, step + 1))} disabled={step >= max}>
            Step forward →
          </Button>
          <Button variant="outline" onClick={() => setStep(max)} disabled={step >= max}>
            Show outcome
          </Button>
          <Button variant="ghost" onClick={reset}>
            Reset
          </Button>
          <span className="loop-step-label">
            Model step {Math.min(step, max)} / {max}
          </span>
        </div>
        <Slider
          aria-label="Workflow model step"
          min={0}
          max={max}
          step={1}
          value={[Math.min(step, max)]}
          onValueChange={([value]) => setStep(value)}
        />
      </div>
      <p className="loop-key">
        Same scale on both sides. Overlapping bars run in parallel. Select a lane to inspect
        dependencies.
      </p>
      <div className="loop-comparison">
        <Workflow strategy="full" scenario={scenario} warm={warm} step={step} max={max} />
        <Workflow strategy={strategy} scenario={scenario} warm={warm} step={step} max={max} />
      </div>
      <details className="loop-assumptions">
        <summary>What does this model leave out?</summary>
        <p>
          All selected tasks are assumed to succeed. Durations are invented work units; cached tasks
          take zero units for clarity. Real cache lookup, process startup and hardware have costs.
          This is not a speed prediction.
        </p>
        <p>
          Based on this repository’s Turbo dependencies and root check ordering. Shared checks and
          other workspace tasks are grouped; formatting, linting, generator tests and individual
          gallery type checks are omitted. Targeted means a fixed tooling filter, not Git-based
          affected selection. Watch means the comparator test was already started and is waiting for
          a save.
        </p>
        <p>
          Try: edit the shared kit with watch mode selected. A quiet watcher is not evidence that
          the repository is healthy. Then choose “Run again unchanged” and switch the cache off.
        </p>
      </details>
      <Walkthroughs />
    </div>
  );
}
