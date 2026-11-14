import { useCallback, useEffect, useMemo } from 'react';
import { useMotionValue, useMotionValueEvent, useReducedMotion, useSpring, type MotionValue } from 'motion/react';
import { Laptop } from './Laptop';
import { LiveContext } from '../mac/parts';
import { SCENES, SceneHello } from '../mac/scenes';
import type { Beat, ChapterId, Field, Step } from '../story';
import type { Zone } from '../hooks';

/* A pose is where the laptop sits and how the camera sees it.
   Positions and sizes are fractions of the window, so it fits any size:
   the laptop is centred on its own silhouette, then nudged by x and y. */
type Pose = {
  /** Offset of the laptop's centre, as a fraction of window width / height. */
  x: number;
  y: number;
  /** The most window height and width the laptop may take up. */
  fitH: number;
  fitW: number;
  elev: number;
  yaw: number;
  lid: number;
  on: number;
  glow: number;
  write: number;
};

const P = (p: Partial<Pose>): Pose => ({ x: 0, y: 0, fitH: 0.8, fitW: 0.6, elev: 20, yaw: 0, lid: 100, on: 1, glow: 0, write: 1, ...p });

const POSE = {
  heroClosed: P({ y: 0.175, fitH: 0.52, fitW: 0.6, elev: 56, yaw: -24, lid: 0, on: 0, write: 0 }),
  heroOpen: P({ y: 0.03, fitH: 0.82, fitW: 0.7, elev: 15, yaw: 0, lid: 101 }),
  screen: P({ x: 0.2, y: 0.03, fitH: 0.8, fitW: 0.53, elev: 15, yaw: -9, lid: 101 }),
  keyboard: P({ x: 0.2, y: 0.02, fitH: 0.9, fitW: 0.53, elev: 47, yaw: -6, lid: 114 }),
  trackpad: P({ x: 0.2, y: 0.02, fitH: 0.9, fitW: 0.53, elev: 42, yaw: 7, lid: 110 }),
  finaleOpen: P({ y: 0.03, fitH: 0.82, fitW: 0.7, elev: 16, lid: 101 }),
  finaleClosed: P({ y: -0.2, fitH: 0.36, fitW: 0.5, elev: 57, yaw: 22, lid: 0, on: 0, glow: 1 }),
} satisfies Record<string, Pose>;

const KEYS = Object.keys(POSE.screen) as (keyof Pose)[];
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => t * t * (3 - 2 * t);
const span = (v: number, from: number, to: number) => clamp01((v - from) / (to - from));
const mix = (a: Pose, b: Pose, t: number): Pose => {
  const out = { ...a };
  for (const k of KEYS) out[k] = a[k] + (b[k] - a[k]) * t;
  return out;
};

/* The laptop's silhouette for a given camera and lid angle, in laptop units,
   measured from the centre of the deck. Good enough to frame it. */
const DECK_W = 1000;
const DECK_D = 694;
const LID_L = 686;
const THICK = 36;
const rad = (deg: number) => (deg * Math.PI) / 180;

function silhouette(pose: Pose) {
  const se = Math.sin(rad(pose.elev));
  const ce = Math.cos(rad(pose.elev));
  const sy = Math.abs(Math.sin(rad(pose.yaw)));
  const back = -(DECK_D / 2) * se;
  const front = (DECK_D / 2) * se + THICK * ce;
  const tip = (-DECK_D / 2 + 8 + LID_L * Math.cos(rad(pose.lid))) * se - LID_L * Math.sin(rad(pose.lid)) * ce;
  const turn = (DECK_W / 2) * sy * se;
  const top = Math.min(back, tip) - turn;
  const bottom = Math.max(front, tip) + turn;
  return {
    height: bottom - top,
    width: DECK_W * Math.cos(rad(pose.yaw)) + DECK_D * sy,
    mid: (top + bottom) / 2,
  };
}

function heroPose(p: number): Pose {
  const opened = mix(POSE.heroClosed, POSE.heroOpen, ease(span(p, 0.03, 0.56)));
  const pose = mix(opened, POSE.screen, ease(span(p, 0.78, 1)));
  pose.on = span(p, 0.3, 0.46);
  pose.write = span(p, 0.47, 0.7);
  return pose;
}

function finalePose(f: number): Pose {
  const pose = mix(POSE.finaleOpen, POSE.finaleClosed, ease(span(f, 0.06, 0.66)));
  pose.on = 1 - span(f, 0.22, 0.42);
  pose.glow = span(f, 0.62, 0.9);
  return pose;
}

type Props = {
  zone: Zone;
  chapter: ChapterId | null;
  field: Field;
  step: Step | undefined;
  beat: Beat | undefined;
  beatIndex: number;
  heroP: MotionValue<number>;
  finaleP: MotionValue<number>;
  liveKeys: ReadonlySet<string>;
  liveZoom: number | null;
  viewport: { w: number; h: number };
};

const SPRING = { stiffness: 80, damping: 21, mass: 1 };
const NONE: ReadonlySet<string> = new Set();

export function Stage({ zone, chapter, field, step, beat, beatIndex, heroP, finaleP, liveKeys, liveZoom, viewport }: Props) {
  const reduce = useReducedMotion();

  const raw = {
    x: useMotionValue(0),
    y: useMotionValue(0),
    s: useMotionValue(0.5),
    elev: useMotionValue(POSE.heroClosed.elev),
    yaw: useMotionValue(POSE.heroClosed.yaw),
    lid: useMotionValue(0),
    on: useMotionValue(0),
    glow: useMotionValue(0),
    write: useMotionValue(0),
  };

  const place = useCallback(() => {
    const pose =
      zone === 'hero'
        ? heroPose(heroP.get())
        : zone === 'finale'
          ? finalePose(finaleP.get())
          : zone === 'cheat'
            ? POSE.finaleOpen
            : POSE[chapter ?? 'screen'];

    const { w, h } = viewport;
    const narrow = w < 900;
    const touring = zone === 'tour';
    const shape = silhouette(pose);
    const fitH = narrow && touring ? 0.4 : pose.fitH;
    const fitW = narrow ? 0.92 : pose.fitW;
    const scale = Math.min((fitH * h) / shape.height, (fitW * w) / shape.width);
    raw.x.set(narrow ? 0 : pose.x * w);
    raw.y.set((narrow && touring ? -0.24 : pose.y) * h - shape.mid * scale);
    raw.s.set(scale);
    raw.elev.set(pose.elev);
    raw.yaw.set(narrow ? pose.yaw * 0.4 : pose.yaw);
    raw.lid.set(pose.lid);
    raw.on.set(pose.on);
    raw.glow.set(pose.glow);
    raw.write.set(pose.write);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zone, chapter, viewport, heroP, finaleP]);

  useEffect(place, [place]);
  useMotionValueEvent(heroP, 'change', () => zone === 'hero' && place());
  useMotionValueEvent(finaleP, 'change', () => zone === 'finale' && place());

  const cfg = reduce ? { stiffness: 1000, damping: 100 } : SPRING;
  const pose = {
    x: useSpring(raw.x, cfg),
    y: useSpring(raw.y, cfg),
    scale: useSpring(raw.s, cfg),
    elev: useSpring(raw.elev, cfg),
    yaw: useSpring(raw.yaw, cfg),
    lid: useSpring(raw.lid, cfg),
    screenOn: raw.on,
    glow: raw.glow,
    write: raw.write,
  };

  const keysOn = useMemo(() => (beat?.keys ? new Set(beat.keys) : NONE), [beat]);
  const live = useMemo(() => ({ zoom: liveZoom }), [liveZoom]);

  const Scene = zone === 'tour' && step ? SCENES[step.scene] : null;
  const screen = (
    <LiveContext.Provider value={live}>
      <div className="scene-fade" key={Scene ? step!.id : 'hello'}>
        {Scene ? <Scene beat={beatIndex} /> : <SceneHello />}
      </div>
    </LiveContext.Provider>
  );

  return (
    <div className={`stage field-${field}`} data-field={field} data-centre={zone === 'tour' ? undefined : ''} aria-hidden="true">
      <div className="stage-light" />
      <Laptop
        pose={pose}
        screen={screen}
        keysOn={keysOn}
        keysLive={liveKeys}
        fingers={zone === 'tour' ? beat?.fingers : undefined}
        fingerMove={beat?.move}
      />
    </div>
  );
}
