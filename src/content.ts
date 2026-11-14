/* ---------------------------------------------------------------
   The personal bits, in both languages.
   Edit these and nothing else needs to change.
---------------------------------------------------------------- */

import type { L } from './i18n';

export const personal = {
  /** Her name, as it appears in the nav. */
  herName: { en: 'Mali', ka: 'მალი' } as L,
  /** Who the guide is from. Shown under the closing note and in the demo notification. */
  fromName: { en: 'Your Favorite "Meriseli"', ka: 'შენი ფავორიტი მერისელი' } as L,

  heroTitle: { en: 'Mali, meet your Mac.', ka: 'მალი, გაიცანი შენი Mac.' } as L,
  heroLede: {
    en: 'A small guide to your new MacBook Neo: everything that works differently from Windows, shown one step at a time.',
    ka: 'პატარა გზამკვლევი შენი ახალი MacBook Neo-სთვის: ყველაფერი, რაც Windows-ისგან განსხვავებულად მუშაობს, ნაბიჯ-ნაბიჯ ნაჩვენები.',
  } as L,

  /** Luka's letter, shown inside the envelope when the page first opens. One entry per paragraph. */
  heroNote: [
    {
      en: 'Since this is your first MacBook and your first macOS, I thought I’d build a website whose main goal is to explain, as simply as possible, the biggest MUSTs you should know.',
      ka: 'რადგანაც ეს შენი პირველი MacBook-ია, პირველი macOS სისტემა, ვიფიქრე, რომ ამეწყო ვებსაიტი, რომლის მთავარი მიზანია მაქსიმალურად მარტივად აგიხსნა ყველაზე MUST-ები, რაც უნდა იცოდე.',
    },
    {
      en: 'P.S. Apart from the specific tutorials, absolutely everything is written by my own hand, especially the MacBook design you will see. I could have done it with AI, but I wanted it to have more meaning, so on 12 November I’m doing this at 9 in the morning, after work.',
      ka: 'პ.ს. კონკრეტული ტუტორიალების გარდა ყველაფერი აბსოლუტურად ჩემი ხელით არის დაწერილი, განსაკუთრებით კი მაკბუკის დიზაინი, რომელსაც შემდეგ დაინახავ. მიუხედავად იმისა, რომ შემეძლო AI-თ, მინდოდა უფრო მეტი meaning ჰქონოდა, ამიტომაც 12 ნოემბერს მე ამას დილის 9-ზე ვაკეთებ სამსახურის მერე.',
    },
    {
      en: 'I love you very much. I hope I managed to make everything very simple, Congratulations Again My Favorite one. Press on Begin, Then Scroll down for the journey.',
      ka: 'ძალიან მიყვარხარ. იმედი მაქვს, ძალიან მარტივად გამომივიდა ყველაფერი, გილოცავ კიდევ ერთხელ ჩემო ფავორიტო. დააჭირე დავიწყოთს, შემდეგ ჩასქროლე ქვემოთ journey-სთვის.',
    },
  ] as L[],

  heroHint: {
    en: 'Slide two fingers up the trackpad to open it',
    ka: 'გასახსნელად ორი თითი ზემოთ აუსვი თრექფედზე',
  } as L,

  /** What the screen says when the lid first opens. */
  screenHello: { en: 'hello, Mali', ka: 'გამარჯობა, მალი' } as L,

  closingTitle: { en: 'Happy birthday, Mali.', ka: 'დაბადების დღეს გილოცავ, მალი.' } as L,
  /** PLACEHOLDER: replace with your own words. One entry per paragraph. */
  closingNote: [
    {
      en: 'That’s everything you need. The rest you’ll pick up just by using it.',
      ka: 'სულ ესაა, რაც გჭირდება. დანარჩენს თვითონ მიხვდები, როცა გამოიყენებ.',
    },
    {
      en: 'I hope it makes every day a little easier, and a lot prettier, my pretty.',
      ka: 'იმედი მაქვს, ყოველ დღეს ცოტა უფრო მარტივს და ბევრად უფრო ლამაზს გაგიხდის ჩემო ულამაზესო.',
    },
  ] as L[],
};

/** Small interface words. */
export const ui = {
  navHome: { en: 'Mali’s Mac', ka: 'მალის Mac' } as L,
  navHomeLabel: { en: 'Back to the start', ka: 'დასაწყისში დაბრუნება' } as L,
  navLabel: { en: 'Sections', ka: 'სექციები' } as L,
  cheatNav: { en: 'Cheat sheet', ka: 'შპარგალკა' } as L,
  languageLabel: { en: 'Language', ka: 'ენა' } as L,
  wasOnWindows: { en: 'On Windows this was', ka: 'Windows-ზე ეს იყო' } as L,
  again: { en: 'Open it again', ka: 'თავიდან გახსნა' } as L,
  letter: { en: 'The letter', ka: 'წერილი' } as L,
  openLetter: { en: 'Open the letter', ka: 'გახსენი წერილი' } as L,
  envHint: { en: 'For you', ka: 'შენთვის' } as L,
  begin: { en: 'Begin', ka: 'დავიწყოთ' } as L,
};
