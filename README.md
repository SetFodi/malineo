# Meet your Mac

A scroll-through guide to a new MacBook Neo for someone coming from Windows.
One pink laptop stays on screen the whole way: it opens as you scroll, then
plays each lesson on its own display, keyboard and trackpad, and closes at the end.

## Run it

```sh
pnpm install
pnpm dev        # http://localhost:5173
```

## Give it to her

```sh
pnpm build
```

This writes a single `dist/index.html` with everything inside it (fonts
included). It opens with a double-click and works offline, so it can sit on
her Desktop or in the Dock.

## Make it yours

- `src/content.ts` holds the personal bits in Georgian and English: her name,
  the hero line, your note under it, the greeting on the laptop's screen and
  the closing note. The closing note is a placeholder; write your own.
- `src/story.ts` holds every lesson (English words and the beats of its demo);
  `src/story.ka.ts` holds the Georgian words for the same lessons.
- `src/mac/scenes.tsx` draws what the laptop's display shows for each lesson.
- Colours and fonts are tokens at the top of `src/styles/tokens.css`.

## The intro

On a first visit the page starts with a logo that fills like a Mac booting,
then a small envelope with a heart seal. Opening it shows your letter
(`heroNote` in `src/content.ts`); closing the letter reveals the guide. It
plays once per browser. The "letter" button at the top of the hero reopens it.

## Languages

The hero opens with a ქართული / English switch (Georgian by default). The
choice is remembered, and a small switch stays in the top bar.

## What it listens for

- Any key she presses lights up on the drawn keyboard.
- On "Copy, then paste" and "Undo" the page confirms when she presses the
  real shortcut.
- On "Pinch to zoom" a real pinch zooms the photo on the drawn screen.

Shortcuts that macOS keeps for itself (Spotlight, the app switcher,
screenshots, Mission Control) can't be heard by a web page, so those lessons
just invite her to try them for real.
