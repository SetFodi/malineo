import { memo, useRef, type CSSProperties } from 'react';
import type { Finger } from '../story';

const W = 400;
const H = 246;
const SLOTS = [0, 1, 2, 3];

type Props = { fingers?: Finger[]; move?: number };

/* Up to four fingertips. A finger that lifts fades out where it was;
   one that lands appears where the beat puts it. */
export const Trackpad = memo(function Trackpad({ fingers, move = 600 }: Props) {
  const last = useRef<Finger[]>([]);
  const pressed = fingers?.some((f) => f.press);

  return (
    <div className="tp" data-press={pressed ? '' : undefined} style={{ '--move': `${move}ms` } as CSSProperties}>
      {SLOTS.map((i) => {
        const now = fingers?.[i];
        if (now) last.current[i] = now;
        const p = now ?? last.current[i] ?? { x: 50, y: 50 };
        return (
          <span
            key={i}
            className={p.thumb ? 'finger is-thumb' : 'finger'}
            data-down={now ? '' : undefined}
            data-press={now?.press ? '' : undefined}
            style={{ transform: `translate3d(${(p.x / 100) * W}px, ${(p.y / 100) * H}px, 0)` }}
          >
            <i />
          </span>
        );
      })}
    </div>
  );
});
