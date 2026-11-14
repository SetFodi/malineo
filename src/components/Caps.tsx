import { Fragment, type ReactNode } from 'react';
import { CAPS } from '../keyboard';

/** One key, drawn like the keys on the laptop. */
export function Cap({ t, small }: { t: string; small?: boolean }) {
  const def = CAPS[t];
  const size = small ? 'cap cap-small' : 'cap';
  if (!def) return <kbd className={size}>{t}</kbd>;
  if (def.glyph)
    return (
      <kbd className={size} title={def.word}>
        <span className="cap-glyph">{def.glyph}</span>
        {!small && <span className="cap-name">{def.word}</span>}
      </kbd>
    );
  return (
    <kbd className={`${size} cap-word`} data-wide={def.wide ? '' : undefined}>
      {def.word}
    </kbd>
  );
}

/** Keys pressed together. */
export function Combo({ keys, hot, small }: { keys: string[]; hot?: boolean; small?: boolean }) {
  return (
    <span className="combo" data-hot={hot ? '' : undefined}>
      {keys.map((k, i) => (
        <Fragment key={i}>
          {i > 0 && (
            <span className="plus" aria-hidden="true">
              +
            </span>
          )}
          <Cap t={k} small={small} />
        </Fragment>
      ))}
    </span>
  );
}

/** Turns [[⌘ C]] inside a sentence into inline keys. */
export function rich(text: string): ReactNode[] {
  return text.split(/\[\[(.+?)\]\]/g).map((part, i) => (i % 2 ? <kbd className="inline-keys" key={i}>{part}</kbd> : part));
}
