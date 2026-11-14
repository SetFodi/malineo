import { useEffect, useState } from 'react';
import { personal, ui } from '../content';
import { useLang, type Lang } from '../i18n';
import { LangSwitch } from './Track';

/* The first thing she sees: the logo fills like a Mac starting up, then a
   small envelope with a heart seal. Opening it shows Luka's letter, and
   closing the letter reveals the guide. */

type Stage = 'boot' | 'envelope' | 'opening' | 'letter' | 'leaving';

type Props = {
  /** 'boot' on a first visit; 'envelope' when she asks to read the letter again. */
  start: 'boot' | 'envelope';
  onLang: (lang: Lang) => void;
  onDone: () => void;
};

const BOOT_MS = 2600;
const OPEN_MS = 1050;
const LEAVE_MS = 650;

function Seal() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path
        d="M50 90C22 68 7 50 7 31 7 17 17.5 7 30.5 7 39 7 46 11.5 50 18.5 54 11.5 61 7 69.5 7 82.5 7 93 17 93 31c0 19-15 37-43 59z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Intro({ start, onLang, onDone }: Props) {
  const lang = useLang();
  const [stage, setStage] = useState<Stage>(start);

  // The page underneath stays put while the intro is up.
  useEffect(() => {
    const root = document.documentElement;
    const before = root.style.overflow;
    root.style.overflow = 'hidden';
    return () => {
      root.style.overflow = before;
    };
  }, []);

  useEffect(() => {
    if (stage === 'boot') {
      let cancelled = false;
      const timer = new Promise((resolve) => window.setTimeout(resolve, BOOT_MS));
      // Wait for the fonts too, so nothing reflows once the guide appears.
      Promise.all([timer, document.fonts?.ready]).then(() => !cancelled && setStage('envelope'));
      return () => {
        cancelled = true;
      };
    }
    if (stage === 'opening') {
      const t = window.setTimeout(() => setStage('letter'), OPEN_MS);
      return () => window.clearTimeout(t);
    }
    if (stage === 'leaving') {
      const t = window.setTimeout(onDone, LEAVE_MS);
      return () => window.clearTimeout(t);
    }
  }, [stage, onDone]);

  // Return opens the envelope and then starts the guide, so no mouse is needed.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const onControl = (e.target as HTMLElement | null)?.closest?.('button');
      if (e.key === 'Enter' && !onControl) {
        if (stage === 'envelope') setStage('opening');
        else if (stage === 'letter') setStage('leaving');
      }
      if (e.key === 'Escape' && stage === 'letter') setStage('leaving');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [stage]);

  const sealed = stage === 'envelope';

  return (
    <div className="intro field-berry" data-stage={stage} role="dialog" aria-modal="true" aria-label={ui.letter[lang]}>
      <div className="boot" aria-hidden="true">
        <span className="boot-logo">
          <i>{''}</i>
          <i className="boot-fill">{''}</i>
        </span>
      </div>

      <div className="env-wrap" aria-hidden={sealed ? undefined : true}>
        <button className="env" type="button" tabIndex={sealed ? 0 : -1} onClick={() => sealed && setStage('opening')} aria-label={ui.openLetter[lang]}>
          <span className="env-back" />
          <span className="env-paper">
            <i />
            <i />
            <i />
          </span>
          <svg className="env-front" viewBox="0 0 280 184" aria-hidden="true">
            <path d="M0 0 140 104 280 0V184H0z" />
            <path className="env-fold" d="M0 184 112 84M280 184 168 84" />
          </svg>
          <span className="env-flap">
            <svg viewBox="0 0 280 116" aria-hidden="true">
              <path d="M0 0H280L150 110a16 16 0 0 1-20 0z" />
            </svg>
          </span>
          <span className="env-seal">
            <Seal />
          </span>
        </button>
        <p className="env-hint">{ui.envHint[lang]}</p>
        <LangSwitch onChange={onLang} />
      </div>

      <article className="letter field-paper" aria-hidden={stage === 'letter' ? undefined : true}>
        <div className="letter-top">
          <span className="letter-seal">
            <Seal />
          </span>
          <LangSwitch onChange={onLang} compact />
        </div>
        {personal.heroNote.map((p, i) => (
          <p key={i}>{p[lang]}</p>
        ))}
        <p className="letter-from">{personal.fromName[lang]}</p>
        <button className="letter-go" type="button" tabIndex={stage === 'letter' ? 0 : -1} onClick={() => setStage('leaving')}>
          {ui.begin[lang]}
        </button>
      </article>
    </div>
  );
}
