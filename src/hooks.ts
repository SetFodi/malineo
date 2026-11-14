import { useEffect, useRef, useState } from 'react';
import type { Beat, Step } from './story';

const EMPTY: ReadonlySet<string> = new Set();

/** Steps through a demo's beats on a loop while `playing`. Restarts when `key` changes. */
export function useBeats(beats: Beat[] | undefined, playing: boolean, key: string): number {
  const [state, setState] = useState({ key, i: 0 });
  const i = state.key === key ? state.i : 0;

  useEffect(() => {
    if (!beats || !playing) return;
    const ms = beats[i % beats.length].ms;
    const t = window.setTimeout(() => setState({ key, i: (i + 1) % beats.length }), ms);
    return () => window.clearTimeout(t);
  }, [beats, playing, key, i]);

  return beats ? i % beats.length : 0;
}

/** The physical keys held down right now, as KeyboardEvent.code values. */
export function useLiveKeys(): ReadonlySet<string> {
  const [keys, setKeys] = useState<ReadonlySet<string>>(EMPTY);

  useEffect(() => {
    const held = new Set<string>();
    const timers = new Map<string, number>();
    const flush = () => setKeys(held.size ? new Set(held) : EMPTY);

    const down = (e: KeyboardEvent) => {
      if (!e.code) return;
      held.add(e.code);
      // While ⌘ is down, macOS never reports the other key coming back up,
      // so let go of it ourselves after a moment.
      if (e.metaKey && !e.code.startsWith('Meta')) {
        window.clearTimeout(timers.get(e.code));
        timers.set(
          e.code,
          window.setTimeout(() => {
            held.delete(e.code);
            flush();
          }, 420),
        );
      }
      flush();
    };
    const up = (e: KeyboardEvent) => {
      held.delete(e.code);
      if (e.code.startsWith('Meta')) held.clear();
      flush();
    };
    const clear = () => {
      held.clear();
      flush();
    };

    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('blur', clear);
    document.addEventListener('visibilitychange', clear);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('blur', clear);
      document.removeEventListener('visibilitychange', clear);
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  return keys;
}

/** Listens for the active step's shortcut and remembers which steps she has done. */
export function useTryIt(step: Step | undefined): ReadonlySet<string> {
  const [done, setDone] = useState<ReadonlySet<string>>(EMPTY);

  useEffect(() => {
    const seq = step?.tryIt?.seq;
    if (!step || !seq) return;
    let i = 0;
    const onKey = (e: KeyboardEvent) => {
      const want = seq[i];
      if (e.code !== want.code || !!want.meta !== e.metaKey || !!want.shift !== e.shiftKey) return;
      i += 1;
      if (i === seq.length) {
        i = 0;
        setDone((prev) => new Set(prev).add(step.id));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step]);

  return done;
}

/** A real pinch on the real trackpad, as a zoom factor. Null when she isn't pinching. */
export function useLivePinch(enabled: boolean): number | null {
  const [zoom, setZoom] = useState<number | null>(null);
  const value = useRef(1);

  useEffect(() => {
    if (!enabled) {
      setZoom(null);
      value.current = 1;
      return;
    }
    let idle = 0;
    const clamp = (v: number) => Math.min(3.2, Math.max(1, v));
    const touch = (v: number) => {
      value.current = clamp(v);
      setZoom(value.current);
      window.clearTimeout(idle);
      idle = window.setTimeout(() => {
        value.current = 1;
        setZoom(null);
      }, 2600);
    };

    // Chrome and Firefox report a pinch as a wheel event with ctrlKey set.
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      touch(value.current * Math.exp(-e.deltaY * 0.012));
    };
    // Safari has its own gesture events.
    let start = 1;
    const onGestureStart = (e: Event) => {
      e.preventDefault();
      start = value.current;
    };
    const onGestureChange = (e: Event) => {
      e.preventDefault();
      touch(start * ((e as Event & { scale: number }).scale ?? 1));
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('gesturestart', onGestureStart);
    window.addEventListener('gesturechange', onGestureChange);
    return () => {
      window.clearTimeout(idle);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('gesturestart', onGestureStart);
      window.removeEventListener('gesturechange', onGestureChange);
    };
  }, [enabled]);

  return zoom;
}

export type Zone = 'hero' | 'tour' | 'cheat' | 'finale';
export type Active = { zone: Zone; stepId: string | null };

/** Which part of the page sits at the middle of the window. */
export function useActive(refs: {
  hero: React.RefObject<HTMLElement | null>;
  cheat: React.RefObject<HTMLElement | null>;
  finale: React.RefObject<HTMLElement | null>;
}): Active {
  const [active, setActive] = useState<Active>({ zone: 'hero', stepId: null });

  useEffect(() => {
    const steps = Array.from(document.querySelectorAll<HTMLElement>('[data-step]'));
    let frame = 0;

    const measure = () => {
      frame = 0;
      const mid = window.innerHeight / 2;
      const holds = (el: HTMLElement | null) => {
        if (!el) return false;
        const r = el.getBoundingClientRect();
        return r.top <= mid && r.bottom > mid;
      };

      let next: Active;
      if (holds(refs.hero.current)) next = { zone: 'hero', stepId: null };
      else if (holds(refs.finale.current)) next = { zone: 'finale', stepId: null };
      else if (holds(refs.cheat.current)) next = { zone: 'cheat', stepId: null };
      else {
        let best: string | null = null;
        let bestDist = Infinity;
        for (const el of steps) {
          const r = el.getBoundingClientRect();
          const d = Math.abs((r.top + r.bottom) / 2 - mid);
          if (d < bestDist) {
            bestDist = d;
            best = el.dataset.step ?? null;
          }
        }
        next = { zone: 'tour', stepId: best };
      }
      setActive((prev) => (prev.zone === next.zone && prev.stepId === next.stepId ? prev : next));
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [refs.hero, refs.cheat, refs.finale]);

  return active;
}

export function useViewport(): { w: number; h: number } {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  useEffect(() => {
    const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return size;
}
