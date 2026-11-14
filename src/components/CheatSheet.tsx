import { type RefObject } from 'react';
import { useLang, type Lang } from '../i18n';
import { Combo, rich } from './Caps';

type Pair = [en: string, ka: string];
const pick = (p: Pair, lang: Lang) => (lang === 'ka' ? p[1] : p[0]);

const TEXT = {
  title: ['Everything, on one page.', 'ყველაფერი ერთ გვერდზე.'],
  lede: [
    'For the days you forget. Come back here any time, or press [[⌘ P]] to print just this part.',
    'იმ დღეებისთვის, როცა დაგავიწყდება. დაბრუნდი, როცა გინდა, ან დააჭირე [[⌘ P]] და მხოლოდ ეს ნაწილი დაიბეჭდება.',
  ],
  fromWindows: ['If you did this on Windows', 'თუ Windows-ზე ამას აკეთებდი'],
  shortcuts: ['Shortcuts', 'მალსახმობები'],
  trackpad: ['Trackpad', 'თრექფედი'],
} satisfies Record<string, Pair>;

const FROM_WINDOWS: [Pair, Pair][] = [
  [['Ctrl', 'Ctrl'], ['⌘ Command', '⌘ Command']],
  [['Alt', 'Alt'], ['⌥ Option', '⌥ Option']],
  [['Start menu search', 'Start მენიუს ძებნა'], ['Spotlight: ⌘ Space', 'Spotlight: ⌘ Space']],
  [['Alt + Tab', 'Alt + Tab'], ['⌘ Tab', '⌘ Tab']],
  [['Alt + F4', 'Alt + F4'], ['⌘ Q', '⌘ Q']],
  [['Ctrl + Alt + Delete', 'Ctrl + Alt + Delete'], ['⌥ ⌘ Esc', '⌥ ⌘ Esc']],
  [['Print Screen', 'Print Screen'], ['⇧ ⌘ 3, or ⇧ ⌘ 4 for one area', '⇧ ⌘ 3, ან ⇧ ⌘ 4 ერთი ნაწილისთვის']],
  [['Backspace', 'Backspace'], ['delete', 'delete']],
  [['Delete', 'Delete'], ['fn + delete', 'fn + delete']],
  [['Right-click', 'მარჯვენა კლიკი'], ['Click with two fingers', 'დააჭირე ორი თითით']],
  [['File Explorer', 'File Explorer'], ['Finder', 'Finder']],
  [['Settings', 'Settings'], ['System Settings, in the Apple menu', 'System Settings, Apple-ის მენიუში']],
  [['Task Manager', 'Task Manager'], ['Activity Monitor', 'Activity Monitor']],
  [['Taskbar', 'Taskbar'], ['The Dock', 'Dock']],
  [['Recycle Bin', 'Recycle Bin'], ['Trash, at the end of the Dock', 'Trash, Dock-ის ბოლოში']],
  [['Windows + L', 'Windows + L'], ['Lock the screen: ⌃ ⌘ Q', 'ეკრანის დაბლოკვა: ⌃ ⌘ Q']],
  [['F2 to rename', 'F2 სახელის შესაცვლელად'], ['Select the file, press Return', 'მონიშნე ფაილი და დააჭირე Return-ს']],
  [['Installing an app', 'აპის დაყენება'], ['App Store, or drag the app into Applications', 'App Store, ან გადაათრიე აპი Applications-ში']],
  [['Uninstalling', 'აპის წაშლა'], ['Drag the app to the Trash', 'გადაათრიე აპი Trash-ში']],
];

const SHORTCUTS: { group: Pair; rows: [string[], Pair][] }[] = [
  {
    group: ['Every day', 'ყოველდღე'],
    rows: [
      [['cmd', 'C'], ['Copy', 'კოპირება']],
      [['cmd', 'V'], ['Paste', 'ჩასმა']],
      [['cmd', 'X'], ['Cut', 'ამოჭრა']],
      [['cmd', 'Z'], ['Undo', 'დაბრუნება']],
      [['shift', 'cmd', 'Z'], ['Redo', 'გამეორება']],
      [['cmd', 'A'], ['Select all', 'ყველაფრის მონიშვნა']],
      [['cmd', 'S'], ['Save', 'შენახვა']],
      [['cmd', 'F'], ['Find', 'ძებნა']],
    ],
  },
  {
    group: ['Apps and windows', 'აპები და ფანჯრები'],
    rows: [
      [['cmd', 'space'], ['Spotlight', 'Spotlight']],
      [['cmd', 'tab'], ['Switch apps', 'აპებს შორის გადართვა']],
      [['cmd', 'W'], ['Close the window', 'ფანჯრის დახურვა']],
      [['cmd', 'Q'], ['Quit the app', 'აპის გათიშვა']],
      [['cmd', 'M'], ['Tuck into the Dock', 'Dock-ში ჩაკეცვა']],
      [['cmd', 'T'], ['New tab', 'ახალი ტაბი']],
      [['cmd', ','], ['This app’s settings', 'ამ აპის პარამეტრები']],
    ],
  },
  {
    group: ['Screenshots', 'სქრინშოტები'],
    rows: [
      [['shift', 'cmd', '3'], ['The whole screen', 'მთელი ეკრანი']],
      [['shift', 'cmd', '4'], ['Just one area', 'მხოლოდ ერთი ნაწილი']],
      [['shift', 'cmd', '5'], ['Every option, and video', 'ყველა ვარიანტი და ვიდეო']],
    ],
  },
  {
    group: ['When something is stuck', 'როცა რამე გაიჭედება'],
    rows: [
      [['opt', 'cmd', 'esc'], ['Force an app to quit', 'აპის ძალით გათიშვა']],
      [['ctrl', 'cmd', 'Q'], ['Lock the screen', 'ეკრანის დაბლოკვა']],
    ],
  },
];

type Dot = [number, number];
const GESTURES: { name: Pair; how: Pair; dots: Dot[]; arrow?: string }[] = [
  { name: ['Click', 'კლიკი'], how: ['Press anywhere', 'დააჭირე ნებისმიერ ადგილას'], dots: [[22, 16]] },
  { name: ['Right-click', 'მარჯვენა კლიკი'], how: ['Press with two fingers', 'დააჭირე ორი თითით'], dots: [[17, 17], [27, 15]] },
  { name: ['Scroll', 'სქროლი'], how: ['Slide two fingers', 'აცურე ორი თითი'], dots: [[13, 19], [22, 17]], arrow: 'M34 22V9m-4 4 4-4 4 4' },
  { name: ['Zoom', 'გადიდება'], how: ['Pinch two fingers, or spread them', 'გაშალე ან შეატყუპე ორი თითი'], dots: [[14, 21], [30, 10]], arrow: 'M19 17.5 25 13.5' },
  { name: ['Zoom to fit', 'ზუსტი გადიდება'], how: ['Tap twice with two fingers', 'ორჯერ შეეხე ორი თითით'], dots: [[17, 17], [27, 15]] },
  { name: ['Back and forward', 'უკან და წინ'], how: ['Swipe two fingers sideways', 'ორი თითი გვერდით გადაუსვი'], dots: [[12, 12], [14, 21]], arrow: 'M22 16h13m-4-4 4 4-4 4' },
  { name: ['See every window', 'ყველა ფანჯარა'], how: ['Swipe up with three fingers', 'სამი თითი ზემოთ აუსვი'], dots: [[10, 20], [18, 18], [26, 20]], arrow: 'M35 22V9m-4 4 4-4 4 4' },
  { name: ['Change screens', 'ეკრანის შეცვლა'], how: ['Swipe three fingers sideways', 'სამი თითი გვერდით გადაუსვი'], dots: [[10, 9], [13, 16], [10, 23]], arrow: 'M21 16h14m-4-4 4 4-4 4' },
  { name: ['Show the Desktop', 'Desktop-ის ჩვენება'], how: ['Spread your thumb and three fingers', 'გაშალე ცერი და სამი თითი'], dots: [[9, 24], [15, 8], [25, 6], [35, 10]] },
  { name: ['Notifications', 'შეტყობინებები'], how: ['Two fingers, in from the right edge', 'ორი თითი მარჯვენა კიდიდან'], dots: [[38, 12], [39, 21]], arrow: 'M31 16H16m4-4-4 4 4 4' },
];

function GestureGlyph({ dots, arrow }: { dots: Dot[]; arrow?: string }) {
  return (
    <svg width="55" height="40" viewBox="0 0 44 32" aria-hidden="true">
      <rect x="1" y="1" width="42" height="30" rx="6" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.300" />
      {dots.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3.200" fill="currentColor" />
      ))}
      {arrow && <path d={arrow} fill="none" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.600" strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
  );
}

export function CheatSheet({ sectionRef }: { sectionRef: RefObject<HTMLElement | null> }) {
  const lang = useLang();
  return (
    <section className="cheat field-paper" id="cheatsheet" ref={sectionRef} aria-labelledby="cheat-title">
      <div className="cheat-in">
        <h2 id="cheat-title">{pick(TEXT.title, lang)}</h2>
        <p className="cheat-lede">{rich(pick(TEXT.lede, lang))}</p>

        <div className="cheat-cols">
          <section>
            <h3>{pick(TEXT.fromWindows, lang)}</h3>
            <dl className="xlist">
              {FROM_WINDOWS.map(([win, mac], i) => (
                <div key={i}>
                  <dt>{pick(win, lang)}</dt>
                  <dd>{pick(mac, lang)}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section>
            <h3>{pick(TEXT.shortcuts, lang)}</h3>
            {SHORTCUTS.map((g) => (
              <div key={g.group[0]}>
                <h4>{pick(g.group, lang)}</h4>
                <ul className="klist">
                  {g.rows.map(([keys, label]) => (
                    <li key={label[0]}>
                      <span>{pick(label, lang)}</span>
                      <Combo keys={keys} small />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          <section>
            <h3>{pick(TEXT.trackpad, lang)}</h3>
            <ul className="glist">
              {GESTURES.map((g) => (
                <li key={g.name[0]}>
                  <GestureGlyph dots={g.dots} arrow={g.arrow} />
                  <div>
                    <b>{pick(g.name, lang)}</b>
                    <span>{pick(g.how, lang)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </section>
  );
}
