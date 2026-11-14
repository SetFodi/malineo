/* One scene per lesson. A scene is a pure function of the beat number:
   it draws the state the display is in during that beat, and CSS
   transitions carry it from one state to the next. */

import { useContext, type CSSProperties, type ReactElement, type ReactNode } from 'react';
import { personal } from '../content';
import { useLang, useT } from '../i18n';
import {
  Cursor,
  Dock,
  Icon,
  Keys,
  Lines,
  LiveContext,
  MenuBar,
  Picture,
  Tag,
  Wall,
  Win,
  dockSpot,
  type App,
} from './parts';

type SceneProps = { beat: number };

type DeskProps = {
  app?: string;
  bar?: Parameters<typeof MenuBar>[0];
  dock?: Parameters<typeof Dock>[0];
  dim?: boolean;
  children?: ReactNode;
};

function Desk({ app = 'Finder', bar, dock, dim, children }: DeskProps) {
  return (
    <div className="mac">
      <Wall dim={dim} />
      {children}
      <MenuBar app={app} {...bar} />
      <Dock {...dock} />
    </div>
  );
}

/* ------------------------------ window contents ------------------------------ */

function Note({ title = 'Saturday', children }: { title?: string; children?: ReactNode }) {
  return (
    <div className="note">
      <p className="note-title">{title}</p>
      {children ?? <Lines n={4} w={[86, 94, 70, 48]} />}
    </div>
  );
}

function Chevron({ flip }: { flip?: boolean }) {
  return (
    <svg width="10" height="16" viewBox="0 0 10 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={flip ? { transform: 'scaleX(-1)' } : undefined} aria-hidden="true">
      <path d="M8 2 2 8l6 6" />
    </svg>
  );
}

function SafariBar({ url, canBack }: { url: string; canBack?: boolean }) {
  return (
    <div className="saf-bar">
      <span className="saf-nav" data-on={canBack ? '' : undefined}>
        <Chevron />
      </span>
      <span className="saf-nav">
        <Chevron flip />
      </span>
      <span className="saf-url">{url}</span>
    </div>
  );
}

function Article() {
  return (
    <div className="page">
      <Picture className="page-hero" />
      <p className="page-h">Lemon cake, the easy way</p>
      <Lines n={4} w={[100, 96, 90, 62]} />
      <div className="page-tiles">
        <Picture style={{ filter: 'hue-rotate(-28deg)' }} />
        <Picture style={{ filter: 'hue-rotate(34deg)' }} />
        <Picture style={{ filter: 'hue-rotate(-64deg)' }} />
      </div>
      <Lines n={5} w={[100, 92, 97, 88, 40]} />
    </div>
  );
}

function RecipeList() {
  return (
    <div className="page page-list">
      <p className="page-h">Recipes</p>
      <div className="page-grid">
        {[0, 40, -40, 80, -80, 20].map((h) => (
          <span key={h}>
            <Picture style={{ filter: `hue-rotate(${h}deg)` }} />
            <Lines n={1} w={[70]} />
          </span>
        ))}
      </div>
    </div>
  );
}

function PhotoGrid() {
  return (
    <div className="photo-grid">
      {[0, -30, 40, 70, -60, 20].map((h) => (
        <Picture key={h} style={{ filter: `hue-rotate(${h}deg)` }} />
      ))}
    </div>
  );
}

function FileIcon({ x, y, name, selected, kind = 'pic' }: { x: number; y: number; name: string; selected?: boolean; kind?: 'pic' | 'doc' | 'folder' }) {
  return (
    <span className="file" data-sel={selected ? '' : undefined} style={{ left: x, top: y }}>
      <Thumb kind={kind} />
      <b>{name}</b>
    </span>
  );
}

function Thumb({ kind }: { kind: 'pic' | 'doc' | 'folder' }) {
  if (kind === 'pic') return <Picture className="thumb thumb-pic" />;
  if (kind === 'folder')
    return (
      <svg className="thumb" viewBox="0 0 64 52" aria-hidden="true">
        <path d="M4 10a6 6 0 0 1 6-6h14l6 7h24a6 6 0 0 1 6 6v25a6 6 0 0 1-6 6H10a6 6 0 0 1-6-6z" fill="#4aa9f2" />
        <path d="M4 20a5 5 0 0 1 5-5h46a5 5 0 0 1 5 5v22a6 6 0 0 1-6 6H10a6 6 0 0 1-6-6z" fill="#7cc6fb" />
      </svg>
    );
  return (
    <svg className="thumb" viewBox="0 0 64 52" aria-hidden="true">
      <path d="M17 3h22l9 9v34a3 3 0 0 1-3 3H17a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3z" fill="#fff" stroke="#d9c7ce" strokeWidth="1.5" />
      <path d="M21 20h20M21 27h20M21 34h13" stroke="#d9c7ce" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

/* ============================== THE SCREEN ============================== */

function SceneDesk({ beat }: SceneProps) {
  const t = useT();
  const mark = beat - 1;
  return (
    <Desk app="Notes" bar={{ mark: mark === 0 ? 'bar' : undefined }} dock={{ running: ['finder', 'notes'], mark: mark === 1 }}>
      <Win x={236} y={112} w={480} h={310} title="Notes" className={mark === 2 ? 'is-marked' : undefined}>
        <Note />
      </Win>
      <Tag x={476} y={52} on={mark === 0} tail="up">
        {t('the menu bar', 'მენიუს ზოლი')}
      </Tag>
      <Tag x={476} y={484} on={mark === 1} tail="down">
        {t('the Dock', 'Dock')}
      </Tag>
      <Tag x={476} y={448} on={mark === 2} tail="up">
        {t('your windows', 'შენი ფანჯრები')}
      </Tag>
    </Desk>
  );
}

function SceneMenubar({ beat }: SceneProps) {
  const t = useT();
  const front = ['Finder', 'Safari', 'Notes'][beat % 3];
  const cls = (name: string) => (front === name ? 'is-front' : 'is-back');
  const aim = { Finder: [250, 96], Safari: [560, 148], Notes: [690, 100] }[front] as [number, number];
  return (
    <Desk app={front} bar={{ mark: 'app' }} dock={{ running: ['finder', 'safari', 'notes'] }}>
      <Win x={70} y={76} w={400} h={280} title="Documents" className={cls('Finder')}>
        <FinderBody selected="Documents" compact />
      </Win>
      <Win x={300} y={128} w={480} h={320} className={cls('Safari')}>
        <SafariBar url="cookbook.example" />
        <Article />
      </Win>
      <Win x={520} y={80} w={370} h={250} title="Notes" className={cls('Notes')}>
        <Note />
      </Win>
      <Tag x={106} y={50} tail="up">
        {t('the app in front', 'ახლანდელი აპი')}
      </Tag>
      <Cursor x={aim[0]} y={aim[1]} />
    </Desk>
  );
}

function MenuRow({ label, keys, hot, hotGlyph }: { label: string; keys?: string[]; hot?: boolean; hotGlyph?: string }) {
  return (
    <span className="menu-row" data-hot={hot ? '' : undefined}>
      {label}
      {keys && (
        <span className="menu-keys">
          {keys.map((k, i) => (
            <i key={i} data-hot={hotGlyph === k ? '' : undefined}>
              {k}
            </i>
          ))}
        </span>
      )}
    </span>
  );
}

function SceneAppleMenu({ beat }: SceneProps) {
  const open = beat === 1;
  return (
    <Desk app="Notes" bar={{ open: open ? 'apple' : undefined, mark: 'apple' }} dock={{ running: ['finder', 'notes'] }}>
      <Win x={300} y={120} w={470} h={300} title="Notes">
        <Note />
      </Win>
      <div className="menu" data-on={open ? '' : undefined} style={{ left: 8, top: 36, width: 268 }}>
        <MenuRow label="About This Mac" />
        <hr />
        <MenuRow label="System Settings…" hot />
        <MenuRow label="App Store…" />
        <hr />
        <MenuRow label="Sleep" />
        <MenuRow label="Restart…" />
        <MenuRow label="Shut Down…" />
        <hr />
        <MenuRow label="Lock Screen" keys={['⌃', '⌘', 'Q']} />
      </div>
      <Cursor x={beat === 2 ? 400 : 22} y={beat === 2 ? 260 : 12} press={open} />
    </Desk>
  );
}

function SceneDock({ beat }: SceneProps) {
  const t = useT();
  const spot = dockSpot('photos');
  const open = beat >= 2;
  return (
    <Desk app={open ? 'Photos' : 'Finder'} dock={{ running: open ? ['finder', 'photos'] : ['finder'], bounce: beat === 1 ? 'photos' : undefined }}>
      <Win
        x={216}
        y={66}
        w={520}
        h={376}
        title="Photos"
        className={open ? undefined : 'is-away'}
        style={{ transformOrigin: `${spot.x - 216}px ${spot.y - 66}px` }}
      >
        <PhotoGrid />
      </Win>
      <Tag x={spot.x} y={476} on={open} tail="down">
        {t('the dot: it’s open', 'წერტილი: ღიაა')}
      </Tag>
      <Cursor x={spot.x} y={spot.y - 6} press={beat === 1} />
    </Desk>
  );
}

function SceneLights({ beat }: SceneProps) {
  const t = useT();
  const min = beat === 1;
  const full = beat === 3;
  const active = beat === 0 ? -1 : beat <= 2 ? 1 : 2;
  const parked = { x: 721, y: 571 };
  const geo = full ? { x: 0, y: 0, w: 952, h: 612 } : { x: 226, y: 170, w: 500, h: 290 };
  const cur = beat === 0 ? [262, 196] : beat === 1 ? [267, 190] : beat === 2 ? [661, parked.y - 6] : full ? [62, 20] : [288, 190];
  return (
    <Desk app="Notes" bar={{ hidden: full }} dock={{ running: ['finder', 'notes'], hidden: full, parked: min }}>
      <Win
        {...geo}
        title="Notes"
        className={['can-resize', min ? 'is-away' : '', full ? 'is-full' : ''].join(' ')}
        style={{ transformOrigin: `${661 - 226}px ${parked.y - 170}px` }}
        markLights={beat === 0}
      >
        <Note />
      </Win>
      <div className="lights-key" data-active={active}>
        <span>
          <i />
          {t('close', 'დახურვა')}
        </span>
        <span>
          <i />
          {t('tuck away', 'ჩაკეცვა')}
        </span>
        <span>
          <i />
          {t('fill the screen', 'მთელ ეკრანზე')}
        </span>
      </div>
      <Cursor x={cur[0]} y={cur[1]} press={min || full} />
    </Desk>
  );
}

const FINDER_SIDE = ['Recents', 'Applications', 'Desktop', 'Documents', 'Downloads'];
const FINDER_FILES: Record<string, { name: string; kind: 'pic' | 'doc' | 'folder' | App }[]> = {
  Recents: [
    { name: 'Holiday', kind: 'pic' },
    { name: 'Budget', kind: 'doc' },
    { name: 'Recipes', kind: 'folder' },
    { name: 'Letter', kind: 'doc' },
  ],
  Documents: [
    { name: 'Recipes', kind: 'folder' },
    { name: 'Work', kind: 'folder' },
    { name: 'Budget', kind: 'doc' },
    { name: 'Letter', kind: 'doc' },
    { name: 'Notes', kind: 'doc' },
  ],
  Downloads: [
    { name: 'Ticket', kind: 'doc' },
    { name: 'Holiday', kind: 'pic' },
    { name: 'Sunset', kind: 'pic' },
  ],
  Applications: [
    { name: 'Safari', kind: 'safari' },
    { name: 'Mail', kind: 'mail' },
    { name: 'Photos', kind: 'photos' },
    { name: 'Notes', kind: 'notes' },
    { name: 'Messages', kind: 'messages' },
    { name: 'Settings', kind: 'settings' },
  ],
};

function FinderBody({ selected, compact }: { selected: string; compact?: boolean }) {
  const files = FINDER_FILES[selected] ?? FINDER_FILES.Recents;
  return (
    <div className="finder" data-compact={compact ? '' : undefined}>
      <div className="finder-side">
        <small>Favorites</small>
        {FINDER_SIDE.map((s) => (
          <span key={s} data-sel={s === selected ? '' : undefined}>
            {s}
          </span>
        ))}
      </div>
      <div className="finder-main" key={selected}>
        {files.map((f) => (
          <span className="finder-file" key={f.name}>
            {f.kind === 'pic' || f.kind === 'doc' || f.kind === 'folder' ? <Thumb kind={f.kind} /> : <Icon app={f.kind} size={46} />}
            <b>{f.name}</b>
          </span>
        ))}
      </div>
    </div>
  );
}

function SceneFinder({ beat }: SceneProps) {
  const selected = ['Recents', 'Documents', 'Downloads', 'Applications'][beat % 4];
  const row = FINDER_SIDE.indexOf(selected);
  return (
    <Desk app="Finder" dock={{ running: ['finder'] }}>
      <Win x={126} y={60} w={700} h={436} title={selected}>
        <FinderBody selected={selected} />
      </Win>
      <Cursor x={250} y={152 + row * 32} />
    </Desk>
  );
}

function SceneControl({ beat }: SceneProps) {
  const open = beat === 1;
  return (
    <Desk app="Finder" bar={{ open: open ? 'cc' : undefined, mark: 'cc' }}>
      <Win x={150} y={130} w={440} h={290} title="Notes">
        <Note />
      </Win>
      <div className="cc" data-on={open ? '' : undefined}>
        <div className="cc-tile cc-on">
          <b>Wi-Fi</b>
          <small>Home</small>
        </div>
        <div className="cc-tile cc-on">
          <b>Bluetooth</b>
          <small>On</small>
        </div>
        <div className="cc-tile">
          <b>AirDrop</b>
          <small>Contacts Only</small>
        </div>
        <div className="cc-tile">
          <b>Focus</b>
          <small>Off</small>
        </div>
        <div className="cc-slider">
          <b>Display</b>
          <i style={{ '--v': '72%' } as CSSProperties} />
        </div>
        <div className="cc-slider">
          <b>Sound</b>
          <i style={{ '--v': '44%' } as CSSProperties} />
        </div>
      </div>
      <Cursor x={beat === 2 ? 600 : 880} y={beat === 2 ? 300 : 12} press={open} />
    </Desk>
  );
}

/* ============================== THE KEYBOARD ============================== */

function SceneCmd({ beat }: SceneProps) {
  const t = useT();
  return (
    <Desk app="Finder" dim>
      <div className="xlate" data-mac={beat === 1 ? '' : undefined}>
        <figure>
          <span className="xkey xkey-win">Ctrl</span>
          <figcaption>{t('on Windows', 'Windows-ზე')}</figcaption>
        </figure>
        <svg width="74" height="30" viewBox="0 0 74 30" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 15h66M57 4l12 11-12 11" />
        </svg>
        <figure>
          <span className="xkey xkey-mac">
            <b>⌘</b>
            <small>command</small>
          </span>
          <figcaption>{t('on your Mac', 'შენს Mac-ზე')}</figcaption>
        </figure>
      </div>
    </Desk>
  );
}

const SYMBOLS = [
  { g: '⌘', name: 'Command', note: ['your new Ctrl', 'შენი ახალი Ctrl'] },
  { g: '⌥', name: 'Option', note: ['Alt, on Windows', 'Windows-ზე Alt'] },
  { g: '⌃', name: 'Control', note: ['rarely needed', 'იშვიათად გჭირდება'] },
  { g: '⇧', name: 'Shift', note: ['same as ever', 'იგივეა, რაც იყო'] },
];

function SceneSymbols({ beat }: SceneProps) {
  const t = useT();
  const s = SYMBOLS[beat % 4];
  return (
    <Desk app="Notes" bar={{ open: 'Edit' }} dock={{ running: ['finder', 'notes'] }}>
      <div className="menu" data-on="" style={{ left: 152, top: 36, width: 318 }}>
        <MenuRow label="Undo" keys={['⌘', 'Z']} hotGlyph={s.g} />
        <MenuRow label="Redo" keys={['⇧', '⌘', 'Z']} hotGlyph={s.g} />
        <hr />
        <MenuRow label="Cut" keys={['⌘', 'X']} hotGlyph={s.g} />
        <MenuRow label="Copy" keys={['⌘', 'C']} hotGlyph={s.g} />
        <MenuRow label="Paste" keys={['⌘', 'V']} hotGlyph={s.g} />
        <MenuRow label="Paste and Match Style" keys={['⌥', '⇧', '⌘', 'V']} hotGlyph={s.g} />
        <MenuRow label="Select All" keys={['⌘', 'A']} hotGlyph={s.g} />
        <hr />
        <MenuRow label="Emoji & Symbols" keys={['⌃', '⌘', 'Space']} hotGlyph={s.g} />
      </div>
      <div className="symcard" key={s.g}>
        <b>{s.g}</b>
        <strong>{s.name}</strong>
        <small>{t(s.note[0], s.note[1])}</small>
      </div>
    </Desk>
  );
}

function SceneCopy({ beat }: SceneProps) {
  const t = useT();
  const line = t('მერისი ხოხნას ჯობია.', 'Merisi is better than Xoxna.');
  const cur = beat === 0 ? [222, 198] : beat <= 2 ? [520, 198] : [222, 252];
  return (
    <Desk app="Notes" dock={{ running: ['finder', 'notes'] }}>
      <Win x={176} y={84} w={600} h={370} title="Notes">
        <div className="doc">
          <p>
            <span className="sel" data-on={beat >= 1 && beat < 3 ? '' : undefined}>
              {line}
            </span>
            {beat < 3 && <i className="caret" />}
          </p>
          <p>
            {beat >= 4 && <span className="pop">{line}</span>}
            {beat >= 3 && <i className="caret" />}
          </p>
        </div>
      </Win>
      <div className="toast" data-on={beat === 2 ? '' : undefined}>
        <Keys>⌘ C</Keys> {t('Copied', 'დაკოპირდა')}
      </div>
      <div className="toast" data-on={beat >= 4 ? '' : undefined}>
        <Keys>⌘ V</Keys> {t('Pasted', 'ჩაისვა')}
      </div>
      <Cursor x={cur[0]} y={cur[1]} />
    </Desk>
  );
}

function SceneUndo({ beat }: SceneProps) {
  const t = useT();
  return (
    <Desk app="Notes" dock={{ running: ['finder', 'notes'] }}>
      <Win x={176} y={84} w={600} h={370} title="Notes">
        <div className="doc doc-long">
          <p>
            {t('Quiet before I will order', 'ჩუმად თორე შენი ბარათით')}
            <span className="word" data-gone={beat === 1 ? '' : undefined} data-back={beat >= 2 ? '' : undefined}>
              {' '}
              {t('With YOUR card', 'გამოვიწერ')}
            </span>
            <i className="caret" />
          </p>
        </div>
      </Win>
      <Tag x={476} y={276} on={beat === 1}>
        {t('oops, deleted', 'უი, წაიშალა')}
      </Tag>
      <div className="toast" data-on={beat >= 2 ? '' : undefined}>
        <Keys>⌘ Z</Keys> {t('Back again', 'დაბრუნდა')}
      </div>
    </Desk>
  );
}

const FAMILY = [
  ['X', 'Cut'],
  ['A', 'Select All'],
  ['S', 'Save'],
  ['F', 'Find'],
  ['T', 'New Tab'],
  ['P', 'Print'],
];

function SceneFamily({ beat }: SceneProps) {
  const [letter, label] = FAMILY[Math.floor(beat / 2) % FAMILY.length];
  return (
    <Desk app="Notes" dock={{ running: ['finder', 'notes'] }} dim>
      <Win x={176} y={84} w={600} h={370} title="Notes" className="is-back">
        <Note />
      </Win>
      <div className="bezel" key={letter}>
        <span className="bezel-keys">
          <b>⌘</b>
          <b>{letter}</b>
        </span>
        <strong>{label}</strong>
      </div>
    </Desk>
  );
}

function SceneSpotlight({ beat }: SceneProps) {
  const open = beat >= 1 && beat <= 3;
  const launched = beat >= 4;
  return (
    <Desk app={launched ? 'Photos' : 'Notes'} dock={{ running: launched ? ['finder', 'notes', 'photos'] : ['finder', 'notes'] }} dim={open}>
      <Win x={120} y={150} w={420} h={280} title="Notes" className={launched ? 'is-back' : undefined}>
        <Note />
      </Win>
      <Win x={250} y={76} w={520} h={376} title="Photos" className={launched ? undefined : 'is-away is-center'}>
        <PhotoGrid />
      </Win>
      <div className="spot" data-on={open ? '' : undefined}>
        <div className="spot-field">
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7.5" />
            <path d="m17 17 6.500 6.500" />
          </svg>
          {beat >= 2 ? (
            <span className="spot-typed" key="typed">
              {'photos'.split('').map((ch, i) => (
                <i key={i} style={{ '--i': i } as CSSProperties}>
                  {ch}
                </i>
              ))}
              <i className="caret" />
            </span>
          ) : (
            <span className="spot-hint">Spotlight Search</span>
          )}
        </div>
        <div className="spot-results" data-on={beat >= 2 ? '' : undefined}>
          <span data-hot="" data-press={beat === 3 ? '' : undefined}>
            <Icon app="photos" size={34} />
            Photos
            <small>Application</small>
          </span>
          <span>
            <Thumb kind="pic" />
            Holiday photo
            <small>Image</small>
          </span>
          <span>
            <Thumb kind="folder" />
            Photos from the trip
            <small>Folder</small>
          </span>
        </div>
      </div>
    </Desk>
  );
}

function SceneSwitcher({ beat }: SceneProps) {
  const open = beat >= 1 && beat <= 4;
  const sel = beat >= 3 ? 2 : 1;
  const front = beat >= 5 ? 'Photos' : 'Safari';
  const apps: App[] = ['safari', 'notes', 'photos', 'finder'];
  return (
    <Desk app={front} dock={{ running: ['finder', 'safari', 'notes', 'photos'] }}>
      <Win x={380} y={120} w={420} h={290} title="Notes" className="is-back">
        <Note />
      </Win>
      <Win x={240} y={150} w={500} h={320} title="Photos" className={front === 'Photos' ? 'is-front' : 'is-back'}>
        <PhotoGrid />
      </Win>
      <Win x={110} y={70} w={540} h={370} className={front === 'Safari' ? 'is-front' : 'is-back'}>
        <SafariBar url="cookbook.example" />
        <Article />
      </Win>
      <div className="switch" data-on={open ? '' : undefined}>
        {apps.map((a, i) => (
          <span key={a} data-sel={open && i === sel ? '' : undefined}>
            <Icon app={a} size={84} />
          </span>
        ))}
      </div>
    </Desk>
  );
}

function SceneQuit({ beat }: SceneProps) {
  const t = useT();
  const closed = beat >= 1;
  const quit = beat >= 3;
  const spot = dockSpot('notes');
  return (
    <Desk app={quit ? 'Finder' : 'Notes'} dock={{ running: quit ? ['finder'] : ['finder', 'notes'] }}>
      <Win x={236} y={96} w={480} h={310} title="Notes" className={closed ? 'is-away is-center' : undefined}>
        <Note />
      </Win>
      <div className="toast is-mid" data-on={beat === 1 || beat === 2 ? '' : undefined}>
        <Keys>⌘ W</Keys> {t('Window closed', 'ფანჯარა დაიხურა')}
      </div>
      <div className="toast is-mid" data-on={quit ? '' : undefined}>
        <Keys>⌘ Q</Keys> {t('App quit', 'აპი გაითიშა')}
      </div>
      <Tag x={spot.x} y={476} on={beat === 1 || beat === 2} tail="down">
        {t('still open', 'ჯერ ღიაა')}
      </Tag>
      <Tag x={spot.x} y={476} on={quit} tail="down">
        {t('no dot: it’s closed', 'წერტილი არაა: გათიშულია')}
      </Tag>
    </Desk>
  );
}

function SceneScreenshot({ beat }: SceneProps) {
  const dragging = beat === 1 || beat === 2;
  const size = beat === 2 ? { width: 330, height: 210 } : { width: 0, height: 0 };
  const shot = beat === 3 ? 'corner' : beat >= 4 ? 'desk' : undefined;
  return (
    <Desk app="Photos" dock={{ running: ['finder', 'photos'] }}>
      <Win x={150} y={66} w={600} h={410} title="Photos">
        <Picture className="photo-full" />
      </Win>
      <span className="marquee" data-on={dragging ? '' : undefined} style={{ left: 280, top: 170, ...size }} />
      <span className="flash" data-on={beat === 3 ? '' : undefined} />
      <span className="shot" data-at={shot}>
        <Picture />
        <b>Screenshot</b>
      </span>
      {dragging && <Cursor kind="cross" x={beat === 2 ? 610 : 280} y={beat === 2 ? 380 : 170} />}
    </Desk>
  );
}

function SceneDelete({ beat }: SceneProps) {
  return (
    <Desk app="Notes" dock={{ running: ['finder', 'notes'] }}>
      <Win x={176} y={84} w={600} h={370} title="Notes">
        <div className="bigword">
          <span>M</span>
          <span>o</span>
          <span data-gone={beat >= 1 ? '' : undefined}>n</span>
          <i className="caret" />
          <span data-gone={beat >= 3 ? '' : undefined}>d</span>
          <span>a</span>
          <span>y</span>
        </div>
        <div className="erase" data-dir={beat === 1 || beat === 2 ? 'left' : beat >= 3 ? 'right' : undefined}>
          <span className="erase-left">
            <Chevron /> delete
          </span>
          <span className="erase-right">
            fn + delete <Chevron flip />
          </span>
        </div>
      </Win>
    </Desk>
  );
}

function SceneForceQuit({ beat }: SceneProps) {
  const t = useT();
  const dialog = beat === 1 || beat === 2;
  const gone = beat >= 3;
  return (
    <Desk app={gone ? 'Finder' : 'Photos'} dock={{ running: gone ? ['finder', 'notes'] : ['finder', 'notes', 'photos'] }}>
      <Win x={150} y={76} w={560} h={380} title="Photos" className={gone ? 'is-away is-center' : 'is-frozen'}>
        <Picture className="photo-full" />
        <span className="beachball" />
      </Win>
      <Tag x={430} y={134} on={beat === 0}>
        {t('not responding', 'აღარ პასუხობს')}
      </Tag>
      <div className="fq" data-on={dialog ? '' : undefined}>
        <p>Force Quit Applications</p>
        <div className="fq-list">
          <span>
            <Icon app="notes" size={30} /> Notes
          </span>
          <span data-sel="">
            <Icon app="photos" size={30} /> Photos <small>not responding</small>
          </span>
          <span>
            <Icon app="finder" size={30} /> Finder
          </span>
        </div>
        <span className="fq-btn" data-press={beat === 2 ? '' : undefined}>
          Force Quit
        </span>
      </div>
      {dialog && <Cursor x={beat === 2 ? 600 : 520} y={beat === 2 ? 384 : 330} press={beat === 2} />}
    </Desk>
  );
}

/* ============================== THE TRACKPAD ============================== */

function SceneClick({ beat }: SceneProps) {
  const spot = dockSpot('notes');
  const open = beat >= 2;
  return (
    <Desk app={open ? 'Notes' : 'Finder'} dock={{ running: open ? ['finder', 'notes'] : ['finder'], bounce: beat === 1 ? 'notes' : undefined }}>
      <Win x={236} y={90} w={480} h={320} title="Notes" className={open ? undefined : 'is-away'} style={{ transformOrigin: `${spot.x - 236}px ${spot.y - 90}px` }}>
        <Note />
      </Win>
      <Cursor x={spot.x} y={spot.y - 6} press={beat === 1} />
    </Desk>
  );
}

function SceneRightClick({ beat }: SceneProps) {
  const open = beat === 1 || beat === 2;
  return (
    <Desk app="Finder">
      <Win x={90} y={110} w={420} h={290} title="Notes" className="is-back">
        <Note />
      </Win>
      <FileIcon x={774} y={70} name="Holiday" selected={open} />
      <FileIcon x={774} y={186} name="Letter" kind="doc" />
      <div className="menu" data-on={open ? '' : undefined} style={{ left: 600, top: 112, width: 214 }}>
        <MenuRow label="Open" hot />
        <MenuRow label="Open With" />
        <hr />
        <MenuRow label="Rename" />
        <MenuRow label="Duplicate" />
        <MenuRow label="Quick Look" />
        <hr />
        <MenuRow label="Move to Trash" />
      </div>
      <Cursor x={818} y={108} press={beat === 1} />
    </Desk>
  );
}

function SceneScroll({ beat }: SceneProps) {
  const down = beat >= 1 && beat <= 3;
  return (
    <Desk app="Safari" dock={{ running: ['finder', 'safari'] }}>
      <Win x={126} y={56} w={700} h={446}>
        <SafariBar url="cookbook.example" />
        <div className="scroller">
          <div className="scroller-in" data-down={down ? '' : undefined}>
            <Article />
          </div>
          <i className="scroller-thumb" data-down={down ? '' : undefined} />
        </div>
      </Win>
    </Desk>
  );
}

function SceneZoom({ beat }: SceneProps) {
  const t = useT();
  const { zoom } = useContext(LiveContext);
  const demo = beat >= 1 && beat <= 3 ? 2.3 : 1;
  const z = zoom ?? demo;
  return (
    <Desk app="Photos" dock={{ running: ['finder', 'photos'] }}>
      <Win x={176} y={66} w={600} h={420} title="Photos">
        <div className="zoomer">
          <Picture className="photo-full" style={{ transform: `scale(${z})`, transitionDuration: zoom === null ? undefined : '0.08s' }} />
        </div>
      </Win>
      <Tag x={476} y={446} on={zoom !== null}>
        {t('that’s you', 'ეს შენ ხარ')}
      </Tag>
    </Desk>
  );
}

function SceneBack({ beat }: SceneProps) {
  const back = beat >= 1 && beat <= 3;
  return (
    <Desk app="Safari" dock={{ running: ['finder', 'safari'] }}>
      <Win x={126} y={56} w={700} h={446}>
        <SafariBar url={back ? 'cookbook.example' : 'cookbook.example/lemon-cake'} canBack={!back} />
        <div className="pager">
          <RecipeList />
          <div className="pager-top" data-away={back ? '' : undefined}>
            <Article />
          </div>
        </div>
      </Win>
    </Desk>
  );
}

function ThreeWindows({ mode }: { mode?: 'mission' | 'spread' }) {
  const t: Record<string, CSSProperties | undefined> =
    mode === 'mission'
      ? {
          safari: { transform: 'translate(-126px, 96px) scale(0.5)' },
          notes: { transform: 'translate(-140px, 76px) scale(0.56)' },
          photos: { transform: 'translate(292px, -24px) scale(0.52)' },
        }
      : mode === 'spread'
        ? {
            safari: { transform: 'translate(-520px, -40px)' },
            notes: { transform: 'translate(520px, -70px)' },
            photos: { transform: 'translate(60px, 430px)' },
          }
        : {};
  return (
    <>
      <Win x={70} y={64} w={480} h={320} style={t.safari} className="is-slow">
        <SafariBar url="cookbook.example" />
        <Article />
      </Win>
      <Win x={420} y={100} w={400} h={280} title="Notes" style={t.notes} className="is-slow">
        <Note />
      </Win>
      <Win x={250} y={214} w={440} h={280} title="Photos" style={t.photos} className="is-slow">
        <PhotoGrid />
      </Win>
    </>
  );
}

function SceneMission({ beat }: SceneProps) {
  const on = beat >= 1 && beat <= 3;
  return (
    <Desk app="Photos" dock={{ running: ['finder', 'safari', 'notes', 'photos'] }} dim={on}>
      <div className="mc-strip" data-on={on ? '' : undefined}>
        <span data-sel="">Desktop 1</span>
        <span>Desktop 2</span>
      </div>
      <ThreeWindows mode={on ? 'mission' : undefined} />
    </Desk>
  );
}

function SceneSpaces({ beat }: SceneProps) {
  const next = beat >= 1 && beat <= 3;
  return (
    <div className="mac">
      <div className="spaces" data-next={next ? '' : undefined}>
        <div className="space">
          <Wall />
          <Win x={120} y={100} w={420} h={290} title="Notes">
            <Note />
          </Win>
          <Win x={430} y={150} w={420} h={300} title="Photos">
            <PhotoGrid />
          </Win>
          <MenuBar app="Photos" />
          <Dock running={['finder', 'safari', 'notes', 'photos']} />
        </div>
        <div className="space space-full">
          <SafariBar url="cookbook.example/lemon-cake" canBack />
          <Article />
        </div>
      </div>
      <div className="space-dots" data-next={next ? '' : undefined}>
        <i />
        <i />
      </div>
    </div>
  );
}

function SceneShowDesktop({ beat }: SceneProps) {
  const on = beat >= 1 && beat <= 3;
  return (
    <Desk app="Photos" dock={{ running: ['finder', 'safari', 'notes', 'photos'] }}>
      <FileIcon x={790} y={64} name="Holiday" />
      <FileIcon x={790} y={176} name="Letter" kind="doc" />
      <FileIcon x={790} y={288} name="Recipes" kind="folder" />
      <ThreeWindows mode={on ? 'spread' : undefined} />
      <Tag x={420} y={290} on={on}>
        Desktop
      </Tag>
    </Desk>
  );
}

function SceneNotif({ beat }: SceneProps) {
  const t = useT();
  const lang = useLang();
  const on = beat >= 1 && beat <= 3;
  return (
    <Desk app="Safari" dock={{ running: ['finder', 'safari'] }}>
      <Win x={90} y={70} w={560} h={400}>
        <SafariBar url="cookbook.example" />
        <Article />
      </Win>
      <div className="nc" data-on={on ? '' : undefined}>
        <div className="nc-card">
          <Icon app="messages" size={38} />
          <span>
            <b>{personal.fromName[lang]}</b>
            {t('Happy birthday ♡', 'გილოცავ ♡')}
          </span>
        </div>
        <div className="nc-widget">
          <small>{t('Today', 'დღეს')}</small>
          <b>{t('Your birthday', 'შენი დაბადების დღე')}</b>
          <span>{t('Nothing else planned', 'სხვა გეგმა არ არის')}</span>
        </div>
        <div className="nc-widget nc-battery">
          <small>{t('Battery', 'ბატარეა')}</small>
          <b>100%</b>
          <i />
        </div>
      </div>
    </Desk>
  );
}

/* ============================== hello ============================== */

/** What the display shows the first time the lid opens. */
export function SceneHello() {
  const lang = useLang();
  return (
    <div className="mac mac-hello">
      <Wall />
      <p className="hello">{personal.screenHello[lang]}</p>
    </div>
  );
}

export const SCENES: Record<string, (p: SceneProps) => ReactElement> = {
  desk: SceneDesk,
  menubar: SceneMenubar,
  applemenu: SceneAppleMenu,
  dock: SceneDock,
  lights: SceneLights,
  finder: SceneFinder,
  control: SceneControl,
  cmd: SceneCmd,
  symbols: SceneSymbols,
  copy: SceneCopy,
  undo: SceneUndo,
  family: SceneFamily,
  spotlight: SceneSpotlight,
  switcher: SceneSwitcher,
  quit: SceneQuit,
  screenshot: SceneScreenshot,
  delete: SceneDelete,
  forcequit: SceneForceQuit,
  click: SceneClick,
  rightclick: SceneRightClick,
  scroll: SceneScroll,
  zoom: SceneZoom,
  back: SceneBack,
  mission: SceneMission,
  spaces: SceneSpaces,
  showdesktop: SceneShowDesktop,
  notif: SceneNotif,
};
