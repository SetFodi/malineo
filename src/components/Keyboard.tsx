import { memo, type CSSProperties } from 'react';
import { ROWS, type KeyDef } from '../keyboard';

type Props = {
  /** Keys the current demo is holding down. */
  on: ReadonlySet<string>;
  /** Keys she is physically holding right now. */
  live: ReadonlySet<string>;
};

const ARROWS: { id: string; glyph: string }[] = [
  { id: 'ArrowUp', glyph: '▲' },
  { id: 'ArrowLeft', glyph: '◀' },
  { id: 'ArrowDown', glyph: '▼' },
  { id: 'ArrowRight', glyph: '▶' },
];

function Globe() {
  return (
    <svg className="k-globe" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.1">
      <circle cx="7" cy="7" r="5.6" />
      <ellipse cx="7" cy="7" rx="2.4" ry="5.6" />
      <path d="M1.6 7h10.8" />
    </svg>
  );
}

/* The little pictures printed on the function keys. */
const rays = (r1: number, r2: number) =>
  Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4;
    const p = (r: number) => `${(8 + Math.cos(a) * r).toFixed(2)} ${(8 + Math.sin(a) * r).toFixed(2)}`;
    return `M${p(r1)}L${p(r2)}`;
  }).join('');
const SPEAKER = 'M2.500 6.300h2.200L7.800 3.600v8.800L4.700 9.700H2.500z';
const F_ICONS: Record<string, { d: string; fill?: boolean }[]> = {
  F1: [{ d: 'M8 6.200a1.800 1.800 0 1 0 0 3.600 1.800 1.800 0 0 0 0-3.600z' }, { d: rays(3.400, 4.600) }],
  F2: [{ d: 'M8 5.500a2.500 2.500 0 1 0 0 5 2.500 2.500 0 0 0 0-5z' }, { d: rays(4.200, 6.200) }],
  F3: [{ d: 'M2.500 3.500h11v5h-11zM2.500 10.500h3v2h-3zM6.500 10.500h3v2h-3zM10.500 10.500h3v2h-3z' }],
  F4: [{ d: 'M7 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM10 10l3.500 3.500' }],
  F5: [{ d: 'M8 2.500a1.800 1.800 0 0 0-1.800 1.800v3.200a1.800 1.800 0 0 0 3.600 0V4.300A1.800 1.800 0 0 0 8 2.500zM4.500 7.500a3.500 3.500 0 0 0 7 0M8 11v2.500' }],
  F6: [{ d: 'M12.500 9.800A5 5 0 0 1 6.200 3.500a5 5 0 1 0 6.300 6.300z' }],
  F7: [{ d: 'M8 4.500v7L3 8zM13.500 4.500v7L8.500 8z', fill: true }],
  F8: [{ d: 'M3 4.500v7l5-3.500zM10 4.500v7M12.800 4.500v7' }],
  F9: [{ d: 'M2.500 4.500v7L7.500 8zM8 4.500v7l5-3.500z', fill: true }],
  F10: [{ d: SPEAKER, fill: true }],
  F11: [{ d: SPEAKER, fill: true }, { d: 'M10 6.200a2.500 2.500 0 0 1 0 3.600' }],
  F12: [{ d: SPEAKER, fill: true }, { d: 'M10 6.200a2.500 2.500 0 0 1 0 3.600M11.800 4.400a5 5 0 0 1 0 7.200' }],
};

function FIcon({ id }: { id: string }) {
  const parts = F_ICONS[id];
  if (!parts) return null;
  return (
    <svg className="k-ficon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      {parts.map((p, i) => (
        <path key={i} d={p.d} fill={p.fill ? 'currentColor' : 'none'} />
      ))}
    </svg>
  );
}

function state(id: string, on: ReadonlySet<string>, live: ReadonlySet<string>) {
  return on.has(id) ? 'demo' : live.has(id) ? 'live' : undefined;
}

function Key({ k, on, live }: { k: KeyDef } & Props) {
  const cls = ['key', k.top ? 'has-top' : '', k.kind === 'fkey' ? 'is-fkey' : ''].filter(Boolean).join(' ');
  return (
    <div
      className={cls}
      data-id={k.id}
      data-align={k.align}
      data-on={state(k.id, on, live)}
      style={{ '--u': k.u ?? 1 } as CSSProperties}
    >
      {k.kind === 'char' && (
        <>
          {k.top && <span className="k-top">{k.top}</span>}
          <span className="k-main">{k.label}</span>
        </>
      )}
      {k.kind === 'fkey' && <FIcon id={k.id} />}
      {(k.kind === 'word' || k.kind === 'fkey') && <span className="k-word">{k.label}</span>}
      {k.kind === 'mod' && (
        <>
          <span className="k-glyph">{k.glyph === 'globe' ? <Globe /> : k.glyph}</span>
          <span className="k-word">{k.label}</span>
        </>
      )}
    </div>
  );
}

export const Keyboard = memo(function Keyboard({ on, live }: Props) {
  return (
    <div className="kb" aria-hidden="true">
      {ROWS.map((row, r) => (
        <div className="kb-row" key={r}>
          {row.map((k) =>
            k.kind === 'arrows' ? (
              <div className="kb-arrows" key={k.id}>
                {ARROWS.map((a) => (
                  <div className="key" key={a.id} data-id={a.id} data-on={state(a.id, on, live)}>
                    {a.glyph}
                  </div>
                ))}
              </div>
            ) : (
              <Key key={k.id} k={k} on={on} live={live} />
            ),
          )}
        </div>
      ))}
    </div>
  );
});
