import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { useScroll } from 'motion/react';
import { personal, ui } from './content';
import { LangContext, letterSeen, loadLang, markLetterSeen, saveLang, useLang, type Lang } from './i18n';
import { chapterNavKa } from './story.ka';
import { allSteps, chapterOf, chapters, type Field } from './story';
import { useActive, useBeats, useLiveKeys, useLivePinch, useTryIt, useViewport, type Zone } from './hooks';
import { Stage } from './components/Stage';
import { Chapters, Hero, LangSwitch } from './components/Track';
import { CheatSheet } from './components/CheatSheet';
import { Intro } from './components/Intro';

function HeartMark({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="currentColor" aria-hidden="true">
      <path d="M50 90C22 68 7 50 7 31 7 17 17.500 7 30.500 7 39 7 46 11.500 50 18.500 54 11.500 61 7 69.500 7 82.500 7 93 17 93 31c0 19-15 37-43 59z" />
    </svg>
  );
}

function Nav({ zone, field, chapter, onLang }: { zone: Zone; field: string; chapter: string | null; onLang: (lang: Lang) => void }) {
  const lang = useLang();
  return (
    <nav className={`nav field-${field}`} data-show={zone !== 'hero' ? '' : undefined} aria-label={ui.navLabel[lang]}>
      <a className="nav-home" href="#top" aria-label={ui.navHomeLabel[lang]}>
        <HeartMark />
        {ui.navHome[lang]}
      </a>
      <ol>
        {chapters.map((ch) => (
          <li key={ch.id}>
            <a href={`#${ch.id}`} data-on={zone === 'tour' && chapter === ch.id ? '' : undefined}>
              {lang === 'ka' ? chapterNavKa[ch.id] : ch.nav}
            </a>
          </li>
        ))}
        <li>
          <a href="#cheatsheet" data-on={zone === 'cheat' ? '' : undefined}>
            {ui.cheatNav[lang]}
          </a>
        </li>
      </ol>
      <LangSwitch onChange={onLang} compact />
    </nav>
  );
}

function Finale({ sectionRef }: { sectionRef: RefObject<HTMLElement | null> }) {
  const lang = useLang();
  return (
    <footer className="finale field-berry" ref={sectionRef}>
      <div className="finale-copy">
        <h2>{personal.closingTitle[lang]}</h2>
        {personal.closingNote.map((p, i) => (
          <p className="finale-note" key={i}>
            {p[lang]}
          </p>
        ))}
        <p className="finale-from">{personal.fromName[lang]}</p>
        <button className="again" type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          {ui.again[lang]}
        </button>
      </div>
    </footer>
  );
}

function usePageVisible() {
  const [visible, setVisible] = useState(!document.hidden);
  useEffect(() => {
    const on = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', on);
    return () => document.removeEventListener('visibilitychange', on);
  }, []);
  return visible;
}

export function App() {
  const [lang, setLang] = useState<Lang>(loadLang);
  useEffect(() => {
    document.documentElement.lang = lang;
    saveLang(lang);
  }, [lang]);

  // The intro plays in full on a first visit; later she can reopen just the letter.
  const [intro, setIntro] = useState<'boot' | 'envelope' | null>(() => (letterSeen() ? null : 'boot'));
  const closeIntro = useCallback(() => {
    markLetterSeen();
    setIntro(null);
  }, []);

  const heroRef = useRef<HTMLElement>(null);
  const cheatRef = useRef<HTMLElement>(null);
  const finaleRef = useRef<HTMLElement>(null);

  const active = useActive({ hero: heroRef, cheat: cheatRef, finale: finaleRef });
  const viewport = useViewport();
  const visible = usePageVisible();

  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ['start start', 'end center'] });
  const { scrollYProgress: finaleP } = useScroll({ target: finaleRef, offset: ['start center', 'end end'] });

  const step = active.zone === 'tour' ? allSteps.find((s) => s.id === active.stepId) : undefined;
  const chapter = step ? chapterOf(step.id) : undefined;

  const beatIndex = useBeats(step?.beats, active.zone === 'tour' && visible && !intro, step?.id ?? '');
  const beat = step?.beats[beatIndex];

  const liveKeys = useLiveKeys();
  const done = useTryIt(step);
  const liveZoom = useLivePinch(step?.id === 'zoom');

  const stageField: Field = active.zone === 'hero' ? 'blush' : active.zone === 'tour' ? (chapter?.field ?? 'blush') : 'berry';
  const navField = active.zone === 'cheat' ? 'paper' : stageField;

  return (
    <LangContext.Provider value={lang}>
    <div className="experience" id="top">
      <Nav zone={active.zone} field={navField} chapter={chapter?.id ?? null} onLang={setLang} />
      <Stage
        zone={active.zone}
        chapter={chapter?.id ?? null}
        field={stageField}
        step={step}
        beat={beat}
        beatIndex={beatIndex}
        heroP={heroP}
        finaleP={finaleP}
        liveKeys={liveKeys}
        liveZoom={liveZoom}
        viewport={viewport}
      />
      <main className="track">
        <Hero heroRef={heroRef} progress={heroP} onLang={setLang} onLetter={() => setIntro('envelope')} />
        <Chapters activeStep={active.stepId} focus={beat?.focus} done={done} />
        <CheatSheet sectionRef={cheatRef} />
        <Finale sectionRef={finaleRef} />
      </main>
      {intro && <Intro key={intro} start={intro} onLang={setLang} onDone={closeIntro} />}
    </div>
    </LangContext.Provider>
  );
}
