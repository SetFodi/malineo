/* ---------------------------------------------------------------
   The lessons. Each step has its words and a looping demo.

   A demo is a list of beats. During a beat the laptop holds some keys
   down, rests some fingers on the trackpad, and the scene on its
   display shows the matching state (scenes read the beat number).

   Inside `body`, wrap a shortcut in [[double brackets]] to set it as keys.
---------------------------------------------------------------- */

export type ChapterId = 'screen' | 'keyboard' | 'trackpad';
export type Field = 'blush' | 'berry' | 'petal';

/** A fingertip on the trackpad, in percent of its width and height. */
export type Finger = { x: number; y: number; press?: boolean; thumb?: boolean };

export type Beat = {
  ms: number;
  keys?: string[];
  fingers?: Finger[];
  /** How long the fingers take to travel to this beat's positions. */
  move?: number;
  /** Which combo / list item in the text this beat is about. */
  focus?: number;
};

export type TryKey = { code: string; meta?: boolean; shift?: boolean };

export type Step = {
  id: string;
  title: string;
  body: string;
  combos?: string[][];
  list?: { keys: string[]; label: string }[];
  /** What this was called on Windows. */
  was?: string;
  /** A handwritten aside. */
  aside?: string;
  /** A shortcut the page can hear, so it can confirm she did it. */
  tryIt?: { prompt: string; done: string; seq: TryKey[] };
  scene: string;
  beats: Beat[];
};

export type Chapter = {
  id: ChapterId;
  nav: string;
  field: Field;
  /** The first step is the chapter opening and is set larger. */
  steps: Step[];
};

const f = (x: number, y: number, extra?: Partial<Finger>): Finger => ({ x, y, ...extra });
const M = 'MetaLeft';

export const chapters: Chapter[] = [
  /* ============================ SCREEN ============================ */
  {
    id: 'screen',
    nav: 'Screen',
    field: 'berry',
    steps: [
      {
        id: 'screen-intro',
        title: 'First, the screen.',
        body: 'A Mac keeps things in three places: a bar across the top, a shelf along the bottom, and your windows in between.',
        scene: 'desk',
        beats: [{ ms: 1500 }, { ms: 1500, focus: 0 }, { ms: 1500, focus: 1 }, { ms: 1500, focus: 2 }],
      },
      {
        id: 'menubar',
        title: 'One menu bar for everything.',
        body: 'On Windows, every window carries its own menus. Here there is a single bar at the top, and it changes to match whichever app is in front. The bold name on the left tells you which app that is.',
        scene: 'menubar',
        beats: [{ ms: 1900 }, { ms: 1900 }, { ms: 1900 }],
      },
      {
        id: 'applemenu',
        title: 'The Apple menu never moves.',
        body: 'The apple in the top-left corner is there in every app. It holds what belongs to the Mac itself: System Settings, Sleep, Restart and Shut Down.',
        was: 'Start, then Power',
        scene: 'applemenu',
        beats: [{ ms: 1300 }, { ms: 3200 }, { ms: 700 }],
      },
      {
        id: 'dock',
        title: 'The Dock is your shelf.',
        body: 'Your favorite apps sit along the bottom. Click one to open it. A small dot underneath means that app is open right now.',
        was: 'the taskbar',
        scene: 'dock',
        beats: [{ ms: 1300 }, { ms: 800 }, { ms: 2800 }, { ms: 500 }],
      },
      {
        id: 'lights',
        title: 'Three buttons, on the left.',
        body: 'Red closes the window. Yellow tucks it away into the Dock. Green makes it fill the whole screen.',
        was: 'the three buttons on the top right',
        scene: 'lights',
        beats: [{ ms: 2400 }, { ms: 1700 }, { ms: 1300 }, { ms: 1900 }, { ms: 1100 }],
      },
      {
        id: 'finder',
        title: 'Finder is where files live.',
        body: 'It’s the smiling face at the start of the Dock, and it does what File Explorer did. Documents, Downloads and Desktop are listed down the left side.',
        was: 'File Explorer',
        scene: 'finder',
        beats: [{ ms: 1500 }, { ms: 1600 }, { ms: 1600 }, { ms: 1600 }],
      },
      {
        id: 'control',
        title: 'Quick settings, top right.',
        body: 'Wi-Fi, sound, brightness and Bluetooth are behind the two little switches beside the clock. The battery sits right next to them.',
        was: 'the tray in the bottom-right corner',
        scene: 'control',
        beats: [{ ms: 1300 }, { ms: 3300 }, { ms: 700 }],
      },
    ],
  },

  /* =========================== KEYBOARD =========================== */
  {
    id: 'keyboard',
    nav: 'Keyboard',
    field: 'blush',
    steps: [
      {
        id: 'keyboard-intro',
        title: 'Now the keyboard.',
        body: 'One key changes everything. Wherever you used to press Ctrl, press Command instead. It’s the key marked ⌘, on either side of the space bar.',
        combos: [['cmd']],
        was: 'Ctrl',
        scene: 'cmd',
        beats: [{ ms: 1400 }, { ms: 2200, keys: ['MetaLeft', 'MetaRight'] }],
      },
      {
        id: 'symbols',
        title: 'Four keys, four symbols.',
        body: 'Menus show their shortcuts as symbols. Learn these four and you can read every one of them.',
        list: [
          { keys: ['cmd'], label: 'Command. Your new Ctrl.' },
          { keys: ['opt'], label: 'Option. Windows calls it Alt.' },
          { keys: ['ctrl'], label: 'Control. Rarely needed.' },
          { keys: ['shift'], label: 'Shift. Same as ever.' },
        ],
        scene: 'symbols',
        beats: [
          { ms: 1700, keys: ['MetaLeft', 'MetaRight'], focus: 0 },
          { ms: 1700, keys: ['AltLeft', 'AltRight'], focus: 1 },
          { ms: 1700, keys: ['ControlLeft'], focus: 2 },
          { ms: 1700, keys: ['ShiftLeft', 'ShiftRight'], focus: 3 },
        ],
      },
      {
        id: 'copy',
        title: 'Copy, then paste.',
        body: 'Select something and press [[⌘ C]] to copy it. Then press [[⌘ V]] to drop it wherever you like.',
        combos: [
          ['cmd', 'C'],
          ['cmd', 'V'],
        ],
        was: 'Ctrl + C and Ctrl + V',
        tryIt: {
          prompt: 'Try it: press ⌘ C, then ⌘ V. I’m watching the keys.',
          done: 'Exactly like that.',
          seq: [
            { code: 'KeyC', meta: true },
            { code: 'KeyV', meta: true },
          ],
        },
        scene: 'copy',
        beats: [
          { ms: 1000 },
          { ms: 1000 },
          { ms: 900, keys: [M, 'KeyC'], focus: 0 },
          { ms: 900 },
          { ms: 1000, keys: [M, 'KeyV'], focus: 1 },
          { ms: 1700 },
        ],
      },
      {
        id: 'undo',
        title: 'Changed your mind? Undo.',
        body: '[[⌘ Z]] takes back the last thing you did. Press it again to go back further. Add Shift to redo.',
        combos: [['cmd', 'Z']],
        was: 'Ctrl + Z',
        tryIt: {
          prompt: 'Try it: press ⌘ Z.',
          done: 'And it’s as if nothing happened.',
          seq: [{ code: 'KeyZ', meta: true }],
        },
        scene: 'undo',
        beats: [{ ms: 1300 }, { ms: 1300 }, { ms: 1000, keys: [M, 'KeyZ'] }, { ms: 1600 }],
      },
      {
        id: 'family',
        title: 'The letters stayed the same.',
        body: 'Nearly every shortcut you already know still works. Keep the letter, swap Ctrl for ⌘.',
        list: [
          { keys: ['cmd', 'X'], label: 'Cut' },
          { keys: ['cmd', 'A'], label: 'Select all' },
          { keys: ['cmd', 'S'], label: 'Save' },
          { keys: ['cmd', 'F'], label: 'Find' },
          { keys: ['cmd', 'T'], label: 'New tab' },
          { keys: ['cmd', 'P'], label: 'Print' },
        ],
        scene: 'family',
        beats: ['KeyX', 'KeyA', 'KeyS', 'KeyF', 'KeyT', 'KeyP'].flatMap((k, i): Beat[] => [
          { ms: 1100, keys: [M, k], focus: i },
          { ms: 350, focus: i },
        ]),
      },
      {
        id: 'spotlight',
        title: 'Find anything with Spotlight.',
        body: 'Press [[⌘ space]], type the first letters of an app or a file, then press Return. It’s the quickest way to open anything on your Mac.',
        combos: [['cmd', 'space']],
        was: 'the Windows key, then typing',
        aside: 'Try it for real. It opens on top of this page; press esc to come back.',
        scene: 'spotlight',
        beats: [
          { ms: 900 },
          { ms: 900, keys: [M, 'Space'] },
          { ms: 1500 },
          { ms: 900, keys: ['Enter'] },
          { ms: 2000 },
        ],
      },
      {
        id: 'switcher',
        title: 'Hop between apps.',
        body: 'Hold ⌘ and tap Tab to step through your open apps. Let go when you reach the one you want.',
        combos: [['cmd', 'tab']],
        was: 'Alt + Tab',
        aside: 'This one is safe to try too.',
        scene: 'switcher',
        beats: [
          { ms: 1000 },
          { ms: 700, keys: [M, 'Tab'] },
          { ms: 600, keys: [M] },
          { ms: 700, keys: [M, 'Tab'] },
          { ms: 700, keys: [M] },
          { ms: 1800 },
        ],
      },
      {
        id: 'quit',
        title: 'Closing isn’t quitting.',
        body: '[[⌘ W]] closes the window, but the app stays open in the Dock. [[⌘ Q]] quits the app completely.',
        combos: [
          ['cmd', 'W'],
          ['cmd', 'Q'],
        ],
        was: 'Alt + F4, or the ✕',
        aside: 'Don’t try these two here. They would close this page.',
        scene: 'quit',
        beats: [
          { ms: 1300 },
          { ms: 900, keys: [M, 'KeyW'], focus: 0 },
          { ms: 1700, focus: 0 },
          { ms: 900, keys: [M, 'KeyQ'], focus: 1 },
          { ms: 1700, focus: 1 },
        ],
      },
      {
        id: 'screenshot',
        title: 'Take a picture of your screen.',
        body: '[[⇧ ⌘ 3]] captures the whole screen. [[⇧ ⌘ 4]] lets you drag around just the part you want. [[⇧ ⌘ 5]] opens every option, including video. Pictures land on your Desktop.',
        combos: [
          ['shift', 'cmd', '3'],
          ['shift', 'cmd', '4'],
          ['shift', 'cmd', '5'],
        ],
        was: 'Print Screen and the Snipping Tool',
        aside: '⇧ ⌘ 4 is safe to try. Press esc to cancel.',
        scene: 'screenshot',
        beats: [
          { ms: 900 },
          { ms: 900, keys: ['ShiftLeft', M, 'Digit4'], focus: 1 },
          { ms: 1400, focus: 1 },
          { ms: 800, focus: 1 },
          { ms: 2000, focus: 1 },
        ],
      },
      {
        id: 'delete',
        title: 'Delete works backwards.',
        body: 'The delete key erases to the left, like Backspace did. Hold fn and press delete to erase to the right.',
        combos: [['delete'], ['fn', 'delete']],
        was: 'Backspace, and Delete',
        scene: 'delete',
        beats: [
          { ms: 1200 },
          { ms: 900, keys: ['Backspace'], focus: 0 },
          { ms: 900, focus: 0 },
          { ms: 900, keys: ['Fn', 'Backspace'], focus: 1 },
          { ms: 1500, focus: 1 },
        ],
      },
      {
        id: 'forcequit',
        title: 'When an app freezes.',
        body: 'Hold Option and Command, then press esc. Pick the app that stopped answering and choose Force Quit. Nothing else is affected.',
        combos: [['opt', 'cmd', 'esc']],
        was: 'Ctrl + Alt + Delete',
        scene: 'forcequit',
        beats: [{ ms: 1700 }, { ms: 1100, keys: ['AltLeft', M, 'Escape'] }, { ms: 1400 }, { ms: 1700 }],
      },
    ],
  },

  /* =========================== TRACKPAD =========================== */
  {
    id: 'trackpad',
    nav: 'Trackpad',
    field: 'petal',
    steps: [
      {
        id: 'trackpad-intro',
        title: 'And the trackpad.',
        body: 'The whole surface is one big button. Press down anywhere to click, and you’ll feel it click back.',
        aside: 'Prefer a light tap? Turn on Tap to Click in System Settings, under Trackpad.',
        scene: 'click',
        beats: [
          { ms: 1200, fingers: [f(52, 56)], move: 0 },
          { ms: 500, fingers: [f(52, 56, { press: true })] },
          { ms: 2300, fingers: [f(52, 56)] },
          { ms: 500 },
        ],
      },
      {
        id: 'rightclick',
        title: 'Right-click with two fingers.',
        body: 'Rest two fingers on the trackpad and press. The menu you know from right-clicking appears.',
        was: 'the right mouse button',
        scene: 'rightclick',
        beats: [
          { ms: 1100, fingers: [f(45, 54), f(58, 50)], move: 0 },
          { ms: 550, fingers: [f(45, 54, { press: true }), f(58, 50, { press: true })] },
          { ms: 2500, fingers: [f(45, 54), f(58, 50)] },
          { ms: 600 },
        ],
      },
      {
        id: 'scroll',
        title: 'Slide two fingers to scroll.',
        body: 'You’ve been doing this the whole way down. The page moves with your fingers, as if you were pushing a sheet of paper.',
        was: 'the mouse wheel',
        aside: 'It can feel upside-down for a day. Then it feels like the only way.',
        scene: 'scroll',
        beats: [
          { ms: 600, fingers: [f(44, 72), f(57, 69)], move: 0 },
          { ms: 1300, fingers: [f(44, 28), f(57, 25)], move: 1150 },
          { ms: 600 },
          { ms: 600, fingers: [f(44, 28), f(57, 25)], move: 0 },
          { ms: 1300, fingers: [f(44, 72), f(57, 69)], move: 1150 },
          { ms: 600 },
        ],
      },
      {
        id: 'zoom',
        title: 'Pinch to zoom.',
        body: 'Spread two fingers apart to zoom in on a photo or a web page. Pinch them together to zoom back out.',
        aside: 'Try it now: pinch on your trackpad and watch the photo.',
        scene: 'zoom',
        beats: [
          { ms: 600, fingers: [f(45, 54), f(55, 45)], move: 0 },
          { ms: 1300, fingers: [f(28, 72), f(72, 27)], move: 1150 },
          { ms: 800 },
          { ms: 600, fingers: [f(28, 72), f(72, 27)], move: 0 },
          { ms: 1300, fingers: [f(45, 54), f(55, 45)], move: 1150 },
          { ms: 600 },
        ],
      },
      {
        id: 'back',
        title: 'Swipe sideways to go back.',
        body: 'In Safari, slide two fingers to the right to return to the page before. Slide left to go forward again.',
        was: 'the browser’s back arrow',
        scene: 'back',
        beats: [
          { ms: 600, fingers: [f(26, 46), f(30, 62)], move: 0 },
          { ms: 1200, fingers: [f(70, 46), f(74, 62)], move: 1050 },
          { ms: 900 },
          { ms: 600, fingers: [f(70, 46), f(74, 62)], move: 0 },
          { ms: 1200, fingers: [f(26, 46), f(30, 62)], move: 1050 },
          { ms: 600 },
        ],
      },
      {
        id: 'mission',
        title: 'Three fingers up: see everything.',
        body: 'Swipe up with three fingers and every open window spreads out, so you can pick the one you want. It’s called Mission Control.',
        was: 'Windows key + Tab',
        aside: 'Try it now. Swipe down with three fingers to come back.',
        scene: 'mission',
        beats: [
          { ms: 600, fingers: [f(36, 74), f(50, 70), f(64, 74)], move: 0 },
          { ms: 1300, fingers: [f(36, 30), f(50, 26), f(64, 30)], move: 1100 },
          { ms: 1700 },
          { ms: 600, fingers: [f(36, 30), f(50, 26), f(64, 30)], move: 0 },
          { ms: 1200, fingers: [f(36, 74), f(50, 70), f(64, 74)], move: 1050 },
          { ms: 600 },
        ],
      },
      {
        id: 'spaces',
        title: 'Three fingers sideways: change screens.',
        body: 'An app that fills the screen gets a space of its own. Swipe left or right with three fingers to slide between them.',
        scene: 'spaces',
        beats: [
          { ms: 600, fingers: [f(58, 40), f(64, 54), f(60, 68)], move: 0 },
          { ms: 1200, fingers: [f(24, 40), f(30, 54), f(26, 68)], move: 1050 },
          { ms: 1300 },
          { ms: 600, fingers: [f(24, 40), f(30, 54), f(26, 68)], move: 0 },
          { ms: 1200, fingers: [f(58, 40), f(64, 54), f(60, 68)], move: 1050 },
          { ms: 600 },
        ],
      },
      {
        id: 'showdesktop',
        title: 'Spread to clear the desk.',
        body: 'Place your thumb and three fingers together, then spread them apart. Every window steps aside to show the Desktop. Pinch to bring them back.',
        was: 'Windows key + D',
        scene: 'showdesktop',
        beats: [
          { ms: 700, fingers: [f(40, 64, { thumb: true }), f(48, 44), f(57, 41), f(65, 47)], move: 0 },
          { ms: 1300, fingers: [f(22, 80, { thumb: true }), f(40, 22), f(60, 17), f(79, 27)], move: 1100 },
          { ms: 1600 },
          { ms: 600, fingers: [f(22, 80, { thumb: true }), f(40, 22), f(60, 17), f(79, 27)], move: 0 },
          { ms: 1200, fingers: [f(40, 64, { thumb: true }), f(48, 44), f(57, 41), f(65, 47)], move: 1050 },
          { ms: 600 },
        ],
      },
      {
        id: 'notif',
        title: 'Notifications, from the right edge.',
        body: 'Start just off the right edge of the trackpad and slide two fingers left. Your notifications and widgets slide in.',
        scene: 'notif',
        beats: [
          { ms: 600, fingers: [f(97, 42), f(99, 58)], move: 0 },
          { ms: 1200, fingers: [f(58, 42), f(60, 58)], move: 1050 },
          { ms: 1900 },
          { ms: 600, fingers: [f(58, 42), f(60, 58)], move: 0 },
          { ms: 1100, fingers: [f(97, 42), f(99, 58)], move: 950 },
          { ms: 500 },
        ],
      },
    ],
  },
];

export const allSteps: Step[] = chapters.flatMap((ch) => ch.steps);
export const chapterOf = (stepId: string): Chapter | undefined =>
  chapters.find((ch) => ch.steps.some((s) => s.id === stepId));
