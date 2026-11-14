/* The MacBook's keyboard, US layout. Key ids are KeyboardEvent.code values,
   so a real key press maps straight onto its drawn key. */

export type KeyDef = {
  id: string;
  /** Width in key units. Every row adds up to 14.5. */
  u?: number;
  label?: string;
  /** Shifted character, printed above the main one. */
  top?: string;
  glyph?: string;
  kind: 'char' | 'word' | 'mod' | 'fkey' | 'space' | 'blank' | 'arrows';
  align?: 'l' | 'r';
};

const c = (id: string, label: string, top?: string): KeyDef => ({ id, label, top, kind: 'char' });
const letters = (s: string): KeyDef[] => s.split('').map((ch) => c(`Key${ch}`, ch));

export const ROWS: KeyDef[][] = [
  [
    { id: 'Escape', label: 'esc', u: 1.5, kind: 'word', align: 'l' },
    ...Array.from({ length: 12 }, (_, i): KeyDef => ({ id: `F${i + 1}`, label: `F${i + 1}`, kind: 'fkey' })),
    { id: 'Power', kind: 'blank' },
  ],
  [
    c('Backquote', '`', '~'),
    c('Digit1', '1', '!'),
    c('Digit2', '2', '@'),
    c('Digit3', '3', '#'),
    c('Digit4', '4', '$'),
    c('Digit5', '5', '%'),
    c('Digit6', '6', '^'),
    c('Digit7', '7', '&'),
    c('Digit8', '8', '*'),
    c('Digit9', '9', '('),
    c('Digit0', '0', ')'),
    c('Minus', '-', '_'),
    c('Equal', '=', '+'),
    { id: 'Backspace', label: 'delete', u: 1.5, kind: 'word', align: 'r' },
  ],
  [
    { id: 'Tab', label: 'tab', u: 1.5, kind: 'word', align: 'l' },
    ...letters('QWERTYUIOP'),
    c('BracketLeft', '[', '{'),
    c('BracketRight', ']', '}'),
    c('Backslash', '\\', '|'),
  ],
  [
    { id: 'CapsLock', label: 'caps lock', u: 1.75, kind: 'word', align: 'l' },
    ...letters('ASDFGHJKL'),
    c('Semicolon', ';', ':'),
    c('Quote', "'", '"'),
    { id: 'Enter', label: 'return', u: 1.75, kind: 'word', align: 'r' },
  ],
  [
    { id: 'ShiftLeft', label: 'shift', u: 2.25, kind: 'word', align: 'l' },
    ...letters('ZXCVBNM'),
    c('Comma', ',', '<'),
    c('Period', '.', '>'),
    c('Slash', '/', '?'),
    { id: 'ShiftRight', label: 'shift', u: 2.25, kind: 'word', align: 'r' },
  ],
  [
    { id: 'Fn', label: 'fn', glyph: 'globe', kind: 'mod', align: 'l' },
    { id: 'ControlLeft', label: 'control', glyph: '⌃', kind: 'mod', align: 'r' },
    { id: 'AltLeft', label: 'option', glyph: '⌥', kind: 'mod', align: 'r' },
    { id: 'MetaLeft', label: 'command', glyph: '⌘', u: 1.25, kind: 'mod', align: 'r' },
    { id: 'Space', u: 5, kind: 'space' },
    { id: 'MetaRight', label: 'command', glyph: '⌘', u: 1.25, kind: 'mod', align: 'l' },
    { id: 'AltRight', label: 'option', glyph: '⌥', kind: 'mod', align: 'l' },
    { id: 'Arrows', u: 3, kind: 'arrows' },
  ],
];

/* Tokens used when a shortcut is written out in the lesson text. */
export type CapToken = string;

export const CAPS: Record<string, { glyph?: string; word: string; codes: string[]; wide?: boolean }> = {
  cmd: { glyph: '⌘', word: 'command', codes: ['MetaLeft', 'MetaRight'] },
  opt: { glyph: '⌥', word: 'option', codes: ['AltLeft', 'AltRight'] },
  ctrl: { glyph: '⌃', word: 'control', codes: ['ControlLeft'] },
  shift: { glyph: '⇧', word: 'shift', codes: ['ShiftLeft', 'ShiftRight'] },
  fn: { word: 'fn', codes: ['Fn'] },
  esc: { word: 'esc', codes: ['Escape'] },
  tab: { word: 'tab', codes: ['Tab'] },
  space: { word: 'space', codes: ['Space'], wide: true },
  delete: { word: 'delete', codes: ['Backspace'] },
  return: { word: 'return', codes: ['Enter'] },
};
