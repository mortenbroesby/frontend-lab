import { tr } from './language.ts';
import { useEffect, useState, type CSSProperties } from 'react';
import { PaperDialog } from './inspection';
import { swapCups, cupAt } from './mini-games';
import nisse from './art/nisse.svg';
import './mini-games.css';
type Phase = 'ready' | 'show' | 'shuffle' | 'guess' | 'miss' | 'roundwon' | 'won';
export function CupTrick({
  won,
  onClose,
  onWin,
  onSound,
}: {
  won: boolean;
  onClose: () => void;
  onWin: () => void;
  onSound: () => void;
}) {
  const [phase, setPhase] = useState<Phase>(won ? 'won' : 'ready');
  const [round, setRound] = useState(0);
  const [order, setOrder] = useState([0, 1, 2]);
  const [target, setTarget] = useState(1);
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState(-1);
  useEffect(() => {
    const hidden = () => {
      if (document.hidden) {
        setPhase((p) => (p === 'show' || p === 'shuffle' ? 'ready' : p));
      }
    };
    document.addEventListener('visibilitychange', hidden);
    return () => document.removeEventListener('visibilitychange', hidden);
  }, []);
  useEffect(() => {
    if (phase !== 'show' && phase !== 'shuffle') return;
    const timer = setTimeout(
      () => {
        if (phase === 'show') {
          setPhase('shuffle');
          return;
        }
        if (step === 3) {
          setPhase('guess');
          return;
        }
        const a = Math.floor(Math.random() * 3);
        const b = (a + 1 + Math.floor(Math.random() * 2)) % 3;
        setOrder((v) => swapCups(v, a, b));
        setStep((v) => v + 1);
      },
      phase === 'show' ? 1500 : 950,
    );
    return () => clearTimeout(timer);
  }, [phase, step]);
  function start() {
    setOrder([0, 1, 2]);
    setTarget(Math.floor(Math.random() * 3));
    setPicked(-1);
    setStep(0);
    setPhase('show');
    onSound();
  }
  function choose(slot: number) {
    if (phase !== 'guess') return;
    const selected = cupAt(order, slot)!;
    setPicked(selected);
    onSound();
    if (selected !== target) {
      setPhase('miss');
      return;
    }
    if (round === 0) {
      setRound(1);
      setPhase('roundwon');
      return;
    }
    setPhase('won');
    onWin();
  }
  const resting = ['ready', 'miss', 'roundwon'].includes(phase);
  return (
    <PaperDialog
      title={tr('Nissens koptrick', 'The elf’s cup trick')}
      className="nisse-game"
      onClose={onClose}
    >
      <p className="mini-intro">
        {tr('En lille leg, hvis du har lyst.', 'A little game, if you fancy it.')}
      </p>
      <div className="cup-host">
        <img src={nisse} alt="" />
        <span aria-hidden="true">✦</span>
      </div>
      <div className="cup-table">
        {[0, 1, 2].map((cup) => {
          const slot = order.indexOf(cup);
          const raised =
            (phase === 'show' && cup === target) ||
            (['miss', 'roundwon', 'won'].includes(phase) && (cup === target || cup === picked));
          return (
            <button
              key={cup}
              className={`trick-cup ${raised ? 'cup-raised' : ''}`}
              style={{ '--cup-slot': slot } as CSSProperties}
              aria-label={`${tr('Kop', 'Cup')} ${slot + 1}`}
              disabled={phase !== 'guess'}
              onClick={() => choose(slot)}
            >
              {cup === target && (
                <span className="hidden-button" aria-hidden="true">
                  ✦
                </span>
              )}
              <svg viewBox="0 0 100 100" aria-hidden="true">
                <path d="M 17 72 Q 22 37 30 22 Q 50 15 70 22 Q 78 37 83 72 Z" />
                <ellipse cx="50" cy="73" rx="37" ry="8" />
                <path className="cup-flower" d="M 50 38 v 23 m -10 -16 20 9 m 0 -9 -20 9" />
              </svg>
            </button>
          );
        })}
      </div>
      <p className="mini-status" role="status">
        {cupMessage(phase, round)}
      </p>
      <div className="mini-actions">
        {resting && (
          <button className="ink-button" onClick={start}>
            {phase === 'roundwon'
              ? tr('Et trick mere', 'One more trick')
              : phase === 'miss'
                ? tr('Prøv igen', 'Try again')
                : tr('Se nissens trick', 'Watch the elf’s trick')}
          </button>
        )}
        <button className="text-button" onClick={onClose}>
          {phase === 'won'
            ? tr('Gem den lille skat', 'Keep the little treasure')
            : tr('Tilbage til eventyret', 'Back to the adventure')}
        </button>
      </div>
    </PaperDialog>
  );
}
function cupMessage(phase: Phase, round: number) {
  const messages: Record<Phase, string> = {
    ready: tr('Følg koppen med messingknappen.', 'Follow the cup with the brass button.'),
    show: tr('Der ligger den. Hold øje med koppen…', 'There it is. Keep your eye on that cup…'),
    shuffle: tr('Nissen bytter forsigtigt rundt…', 'The elf gently shuffles the cups…'),
    guess: tr(
      `Hvor er knappen? Runde ${round + 1} af 2.`,
      `Where is the button? Round ${round + 1} of 2.`,
    ),
    miss: tr(
      'Næsten! Nissen viser dig knappen. Prøv roligt igen.',
      'Almost! The elf shows you the button. Take your time and try again.',
    ),
    roundwon: tr('Du fandt den! Ét lille trick mere.', 'You found it! One more little trick.'),
    won: tr(
      'Messingknappen er din. Og en lille melodi til vejen.',
      'The brass button is yours, and a little tune to take with you.',
    ),
  };
  return messages[phase];
}
