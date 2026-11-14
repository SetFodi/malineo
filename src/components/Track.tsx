import { memo, type RefObject } from 'react';
import { motion, useTransform, type MotionValue } from 'motion/react';
import { personal, ui } from '../content';
import { useLang, type Lang } from '../i18n';
import { chapters, type Step } from '../story';
import { chapterNavKa, localize } from '../story.ka';
import { Combo, rich } from './Caps';

type StepProps = {
  step: Step;
  intro: boolean;
  active: boolean;
  /** Which combo or list row the demo is showing right now. */
  focus: number | undefined;
  done: boolean;
  wasLabel: string;
};

function Check() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m3.5 9.5 3.7 3.7L14.5 5" />
    </svg>
  );
}

const StepBlock = memo(function StepBlock({ step, intro, active, focus, done, wasLabel }: StepProps) {
  const Heading = intro ? 'h2' : 'h3';
  return (
    <article className="step" data-step={step.id} data-active={active ? '' : undefined} data-intro={intro ? '' : undefined}>
      <Heading>{step.title}</Heading>

      {step.combos && (
        <div className="combos">
          {step.combos.map((keys, i) => (
            <Combo key={i} keys={keys} hot={active && focus === i} />
          ))}
        </div>
      )}

      <p className="step-body">{rich(step.body)}</p>

      {step.list && (
        <ul className="keylist" data-cols={step.list.length > 4 ? '2' : undefined}>
          {step.list.map((item, i) => (
            <li key={i} data-hot={active && focus === i ? '' : undefined}>
              <Combo keys={item.keys} small hot={active && focus === i} />
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      )}

      {step.was && (
        <p className="was">
          {wasLabel} <span>{step.was}</span>
        </p>
      )}

      {step.aside && <p className="aside">{step.aside}</p>}

      {step.tryIt && (
        <p className="aside try" data-done={done ? '' : undefined} aria-live="polite">
          {done ? (
            <>
              <Check /> {step.tryIt.done}
            </>
          ) : (
            step.tryIt.prompt
          )}
        </p>
      )}
    </article>
  );
});

function TwoFingerHint() {
  return (
    <svg className="hint-pad" width="34" height="26" viewBox="0 0 34 26" aria-hidden="true">
      <rect x="1" y="1" width="32" height="24" rx="6" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <g className="hint-fingers" fill="currentColor">
        <circle cx="13" cy="17" r="3" />
        <circle cx="21" cy="16" r="3" />
      </g>
    </svg>
  );
}

/** The two-way language switch. */
export function LangSwitch({ onChange, compact }: { onChange: (lang: Lang) => void; compact?: boolean }) {
  const lang = useLang();
  return (
    <div className={compact ? 'lang lang-compact' : 'lang'} role="group" aria-label={ui.languageLabel[lang]}>
      <button type="button" lang="ka" aria-pressed={lang === 'ka'} onClick={() => onChange('ka')}>
        {compact ? 'ქარ' : 'ქართული'}
      </button>
      <button type="button" lang="en" aria-pressed={lang === 'en'} onClick={() => onChange('en')}>
        {compact ? 'Eng' : 'English'}
      </button>
    </div>
  );
}

type HeroProps = {
  heroRef: RefObject<HTMLElement | null>;
  progress: MotionValue<number>;
  onLang: (lang: Lang) => void;
  onLetter: () => void;
};

function EnvelopeIcon() {
  return (
    <svg width="18" height="14" viewBox="0 0 18 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="1" y="1" width="16" height="12" rx="2.5" />
      <path d="m1.5 2.5 7.5 6 7.5-6" />
    </svg>
  );
}

export function Hero({ heroRef, progress, onLang, onLetter }: HeroProps) {
  const lang = useLang();
  // The words step back as the lid starts to lift.
  const copyOpacity = useTransform(progress, [0.02, 0.2], [1, 0]);
  const hintOpacity = useTransform(progress, [0, 0.07], [1, 0]);
  return (
    <header className="hero field-blush" ref={heroRef}>
      <motion.div className="hero-copy" style={{ opacity: copyOpacity }}>
        <div className="hero-top">
          <LangSwitch onChange={onLang} />
          <button className="letter-again" type="button" onClick={onLetter}>
            <EnvelopeIcon />
            {ui.letter[lang]}
          </button>
        </div>
        <h1>{personal.heroTitle[lang]}</h1>
        <p className="lede">{personal.heroLede[lang]}</p>
      </motion.div>
      <motion.p className="hero-hint" style={{ opacity: hintOpacity }}>
        <TwoFingerHint />
        {personal.heroHint[lang]}
      </motion.p>
    </header>
  );
}

type ChaptersProps = {
  activeStep: string | null;
  focus: number | undefined;
  done: ReadonlySet<string>;
};

export function Chapters({ activeStep, focus, done }: ChaptersProps) {
  const lang = useLang();
  return (
    <>
      {chapters.map((ch) => (
        <section className={`chapter field-${ch.field}`} id={ch.id} key={ch.id} aria-label={lang === 'ka' ? chapterNavKa[ch.id] : ch.nav}>
          {ch.steps.map((step, i) => (
            <StepBlock
              key={step.id}
              step={localize(step, lang)}
              intro={i === 0}
              active={activeStep === step.id}
              focus={activeStep === step.id ? focus : undefined}
              done={done.has(step.id)}
              wasLabel={ui.wasOnWindows[lang]}
            />
          ))}
        </section>
      ))}
    </>
  );
}
