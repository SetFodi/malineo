/* Building blocks for the little macOS that runs on the laptop's display.
   The display is 952 x 612 units; every position below is in those units. */

import { createContext, type CSSProperties, type ReactNode } from 'react';

export const SCREEN_W = 952;
export const SCREEN_H = 612;

/** Live input the scenes can react to (a real pinch on the real trackpad). */
export const LiveContext = createContext<{ zoom: number | null }>({ zoom: null });

/* ------------------------------ icons ------------------------------ */

export type App = 'finder' | 'safari' | 'messages' | 'mail' | 'photos' | 'notes' | 'settings' | 'trash';

const PETALS = ['#ff9f43', '#ffd166', '#9ad26a', '#4fc3a1', '#4aa8f0', '#7c83f0', '#c76fe0', '#ff6b8b'];

const ART: Record<App, ReactNode> = {
  finder: (
    <>
      <rect width="48" height="48" rx="11" fill="#2f8fe6" />
      <path d="M0 11A11 11 0 0 1 11 0h15c-3.500 8-5.500 16-5.500 24h6c0 9 1 17 3.500 24H11A11 11 0 0 1 0 37z" fill="#c6e8fc" />
      <path d="M14.500 15.500v5.500M33.500 15.500v5.500" stroke="#143352" strokeWidth="2.600" strokeLinecap="round" />
      <path d="M11.500 31c7.500 6.500 17.500 6.500 25 0" stroke="#143352" strokeWidth="2.400" fill="none" strokeLinecap="round" />
    </>
  ),
  safari: (
    <>
      <rect width="48" height="48" rx="11" fill="#f5f7fa" />
      <circle cx="24" cy="24" r="17.500" fill="#2a9bf2" />
      <circle cx="24" cy="24" r="14.500" fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="1" strokeDasharray="1 3.550" />
      <path d="M33 15 26.800 26.800 21.200 21.200z" fill="#ff5a52" />
      <path d="M15 33l6.200-11.800 5.600 5.600z" fill="#fff" />
    </>
  ),
  messages: (
    <>
      <rect width="48" height="48" rx="11" fill="#35d15c" />
      <path d="M24 11c-8.300 0-15 5.400-15 12 0 3.700 2.100 7 5.400 9.200-.3 1.800-1.200 3.500-2.600 4.800 2.900-.1 5.500-1 7.600-2.600 1.500.4 3 .6 4.600.6 8.300 0 15-5.400 15-12s-6.700-12-15-12z" fill="#fff" />
    </>
  ),
  mail: (
    <>
      <rect width="48" height="48" rx="11" fill="#2b8ef0" />
      <rect x="8" y="13" width="32" height="22" rx="4" fill="#fff" />
      <path d="M9.500 15.500 24 26l14.500-10.500" stroke="#2b8ef0" strokeWidth="2.200" fill="none" strokeLinecap="round" />
    </>
  ),
  photos: (
    <>
      <rect width="48" height="48" rx="11" fill="#fff" />
      {PETALS.map((fill, i) => (
        <ellipse key={i} cx="24" cy="13.500" rx="5.200" ry="8.500" fill={fill} fillOpacity="0.86" transform={`rotate(${i * 45} 24 24)`} />
      ))}
    </>
  ),
  notes: (
    <>
      <rect width="48" height="48" rx="11" fill="#fffdf6" />
      <path d="M0 11A11 11 0 0 1 11 0h26a11 11 0 0 1 11 11v4H0z" fill="#ffd24a" />
      <path d="M10 24h28M10 31h28M10 38h18" stroke="#d9cfc0" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  settings: (
    <>
      <rect width="48" height="48" rx="11" fill="#8b8d94" />
      <circle cx="24" cy="24" r="12.500" fill="none" stroke="#e9eaee" strokeWidth="5" strokeDasharray="4.900 4.900" />
      <circle cx="24" cy="24" r="9.500" fill="none" stroke="#e9eaee" strokeWidth="3" />
      <circle cx="24" cy="24" r="3" fill="#e9eaee" />
    </>
  ),
  trash: (
    <>
      <rect width="48" height="48" rx="11" fill="#fff" fillOpacity="0.5" />
      <path d="M15 17h18l-1.800 20a3 3 0 0 1-3 2.700h-8.400a3 3 0 0 1-3-2.700z" fill="#fff" fillOpacity="0.85" stroke="#8a6f7b" strokeWidth="1.600" />
      <path d="M12.500 16.500h23M20 12.500h8" stroke="#8a6f7b" strokeWidth="2" strokeLinecap="round" />
      <path d="M20.500 22v12M27.500 22v12" stroke="#8a6f7b" strokeWidth="1.500" strokeLinecap="round" />
    </>
  ),
};

export const APP_NAME: Record<App, string> = {
  finder: 'Finder',
  safari: 'Safari',
  messages: 'Messages',
  mail: 'Mail',
  photos: 'Photos',
  notes: 'Notes',
  settings: 'System Settings',
  trash: 'Trash',
};

export function Icon({ app, size = 50, className }: { app: App; size?: number; className?: string }) {
  return (
    <svg className={className ? `ico ${className}` : 'ico'} width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      {ART[app]}
    </svg>
  );
}

/* ------------------------------ wallpaper ------------------------------ */

export function Wall({ dim }: { dim?: boolean }) {
  return (
    <div className="mac-wall" data-dim={dim ? '' : undefined}>
      <svg viewBox="0 0 952 612" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 330C150 250 300 300 470 360S800 420 952 300V612H0z" fill="oklch(0.72 0.15 8)" fillOpacity="0.5" />
        <path d="M0 430C180 350 330 440 520 450S820 380 952 430V612H0z" fill="oklch(0.6 0.19 4)" fillOpacity="0.55" />
        <path d="M0 520C200 470 380 560 560 540S840 500 952 540V612H0z" fill="oklch(0.42 0.16 356)" fillOpacity="0.6" />
      </svg>
    </div>
  );
}

/* ------------------------------ menu bar ------------------------------ */

const MENUS: Record<string, string[]> = {
  Finder: ['File', 'Edit', 'View', 'Go', 'Window', 'Help'],
  Safari: ['File', 'Edit', 'View', 'History', 'Bookmarks', 'Window', 'Help'],
  Notes: ['File', 'Edit', 'Format', 'View', 'Window', 'Help'],
  Photos: ['File', 'Edit', 'Image', 'View', 'Window', 'Help'],
};

type BarProps = {
  app?: string;
  /** Draw attention to one part of the bar. */
  mark?: 'apple' | 'app' | 'cc' | 'bar';
  /** Name of a menu to show as open (highlighted). */
  open?: string;
  hidden?: boolean;
};

export function MenuBar({ app = 'Finder', mark, open, hidden }: BarProps) {
  return (
    <div className="mac-bar" data-hidden={hidden ? '' : undefined} data-mark={mark}>
      <span className="mac-apple" data-open={open === 'apple' ? '' : undefined}>
        {''}
      </span>
      <span className="mac-app" key={app}>
        {app}
      </span>
      {(MENUS[app] ?? MENUS.Finder).map((m) => (
        <span className="mac-menu" key={m} data-open={open === m ? '' : undefined}>
          {m}
        </span>
      ))}
      <span className="mac-status">
        <svg width="27" height="13" viewBox="0 0 27 13" aria-hidden="true">
          <rect x="0.5" y="0.5" width="22" height="12" rx="3.500" fill="none" stroke="currentColor" opacity="0.45" />
          <rect x="2" y="2" width="19" height="9" rx="2" fill="currentColor" />
          <path d="M24.500 4.500v4c.9-.3 1.500-1.100 1.500-2s-.6-1.700-1.500-2z" fill="currentColor" opacity="0.45" />
        </svg>
        <svg width="18" height="13" viewBox="0 0 18 13" fill="none" stroke="currentColor" strokeWidth="1.800" strokeLinecap="round" aria-hidden="true">
          <path d="M1.500 4.600a11 11 0 0 1 15 0M4.300 7.500a7 7 0 0 1 9.400 0" />
          <circle cx="9" cy="10.900" r="1.300" fill="currentColor" stroke="none" />
        </svg>
        <span className="mac-cc" data-open={open === 'cc' ? '' : undefined}>
          <svg width="17" height="15" viewBox="0 0 17 15" fill="none" stroke="currentColor" strokeWidth="1.500" aria-hidden="true">
            <rect x="0.75" y="0.75" width="15.500" height="5.500" rx="2.750" />
            <rect x="0.75" y="8.750" width="15.500" height="5.500" rx="2.750" />
            <circle cx="4" cy="3.500" r="1.400" fill="currentColor" stroke="none" />
            <circle cx="13" cy="11.500" r="1.400" fill="currentColor" stroke="none" />
          </svg>
        </span>
        <span className="mac-clock">9:41</span>
      </span>
    </div>
  );
}

/* ------------------------------ dock ------------------------------ */

const DOCK_APPS: App[] = ['finder', 'safari', 'messages', 'mail', 'photos', 'notes', 'settings'];
const DOCK_W = 501;
const DOCK_LEFT = (SCREEN_W - DOCK_W) / 2;

/** Centre of an app's Dock icon, for aiming the pointer. */
export const dockSpot = (app: App): { x: number; y: number } => {
  const i = DOCK_APPS.indexOf(app);
  const x = app === 'trash' ? DOCK_LEFT + DOCK_W - 35 : DOCK_LEFT + 35 + i * 60;
  return { x, y: 571 };
};

type DockProps = {
  running?: App[];
  bounce?: App;
  mark?: boolean;
  hidden?: boolean;
  /** A minimised window, parked beside the Trash. */
  parked?: boolean;
};

export function Dock({ running = ['finder'], bounce, mark, hidden, parked }: DockProps) {
  return (
    <div className="mac-dock" data-mark={mark ? '' : undefined} data-hidden={hidden ? '' : undefined}>
      {DOCK_APPS.map((app) => (
        <span className="dock-item" key={app} data-bounce={bounce === app ? '' : undefined}>
          <Icon app={app} />
          <i className="dock-dot" data-on={running.includes(app) ? '' : undefined} />
        </span>
      ))}
      <i className="dock-sep" />
      <span className="dock-parked" data-on={parked ? '' : undefined} />
      <span className="dock-item">
        <Icon app="trash" />
      </span>
    </div>
  );
}

/* ------------------------------ windows ------------------------------ */

type WinProps = {
  x: number;
  y: number;
  w: number;
  h: number;
  title?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  /** Draw attention to the three window buttons. */
  markLights?: boolean;
};

export function Win({ x, y, w, h, title, className, style, children, markLights }: WinProps) {
  return (
    <div className={className ? `win ${className}` : 'win'} style={{ left: x, top: y, width: w, height: h, ...style }}>
      <div className="win-bar">
        <span className="lights" data-mark={markLights ? '' : undefined}>
          <i />
          <i />
          <i />
        </span>
        {title && <span className="win-title">{title}</span>}
      </div>
      <div className="win-body">{children}</div>
    </div>
  );
}

/* ------------------------------ pointer ------------------------------ */

export function Cursor({ x, y, kind = 'arrow', press }: { x: number; y: number; kind?: 'arrow' | 'cross' | 'wait'; press?: boolean }) {
  return (
    <div className="cur" data-kind={kind} data-press={press ? '' : undefined} style={{ transform: `translate3d(${x}px, ${y}px, 0)` }}>
      {kind === 'arrow' && (
        <svg width="26" height="30" viewBox="0 0 26 30" aria-hidden="true">
          <path d="M3 2v21.500l5.800-5.300 3.700 8.800 3.700-1.600-3.700-8.600H20z" fill="#1d0f16" stroke="#fff" strokeWidth="1.800" strokeLinejoin="round" />
        </svg>
      )}
      {kind === 'cross' && (
        <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true" style={{ margin: '-17px 0 0 -17px' }}>
          <path d="M17 2v30M2 17h30" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
          <path d="M17 2v30M2 17h30" stroke="#1d0f16" strokeWidth="1.600" strokeLinecap="round" />
        </svg>
      )}
      {kind === 'wait' && <span className="beachball" />}
    </div>
  );
}

/* ------------------------------ little things ------------------------------ */

/** A pulsing outline that points at part of the screen. */
export function Ring({ x, y, w, h, on = true, round }: { x: number; y: number; w: number; h: number; on?: boolean; round?: boolean }) {
  return (
    <span
      className="ring"
      data-on={on ? '' : undefined}
      style={{ left: x, top: y, width: w, height: h, borderRadius: round ? 999 : undefined }}
    />
  );
}

/** A small label that names something on the screen. */
export function Tag({ x, y, on = true, children, tail }: { x: number; y: number; on?: boolean; children: ReactNode; tail?: 'up' | 'down' }) {
  return (
    <span className="tag" data-on={on ? '' : undefined} data-tail={tail} style={{ left: x, top: y }}>
      {children}
    </span>
  );
}

/** The picture used wherever a photo is needed. */
export function Picture({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="pic-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd9c2" />
          <stop offset="0.55" stopColor="#ff9fb0" />
          <stop offset="1" stopColor="#d9628f" />
        </linearGradient>
      </defs>
      <rect width="400" height="260" fill="url(#pic-sky)" />
      <circle cx="262" cy="118" r="38" fill="#fff3d6" />
      <path d="M0 170C60 130 120 150 170 168S290 150 400 176V260H0z" fill="#b8457a" />
      <path d="M0 205C80 170 150 196 220 208S330 190 400 204V260H0z" fill="#8a2c63" />
      <path d="M0 236C90 214 190 240 280 236S360 226 400 232V260H0z" fill="#5c1a49" />
    </svg>
  );
}

/** Grey bars standing in for a paragraph of text. */
export function Lines({ n = 3, w = [100, 92, 64] }: { n?: number; w?: number[] }) {
  return (
    <div className="lines">
      {Array.from({ length: n }, (_, i) => (
        <i key={i} style={{ width: `${w[i % w.length]}%` }} />
      ))}
    </div>
  );
}

/** Keys written out inside the display, in the Mac's own style. */
export function Keys({ children }: { children: string }) {
  return <span className="mkeys">{children}</span>;
}
