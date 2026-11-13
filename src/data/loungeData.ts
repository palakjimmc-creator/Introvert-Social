import {CallerPersona, ExcuseCategory, ExcuseSlip, SoundPreset} from '../types/lounge';

export const BATTERY_STATUS_COPY = (level: number): {title: string; note: string; low: boolean} => {
  if (level >= 75) {
    return {
      title: 'Quietly Thriving',
      note: 'You still have conversational bandwidth for one or two mild anecdotes.',
      low: false,
    };
  }
  if (level >= 45) {
    return {
      title: 'Holding Steady',
      note: 'Small talk is tolerable, provided there is a bookshelf or snack table nearby.',
      low: false,
    };
  }
  if (level >= 25) {
    return {
      title: 'Fraying at the Edges',
      note: 'Consider stepping toward the porch, pouring tea, or checking an excuse slip.',
      low: true,
    };
  }
  return {
    title: 'Running on Fumes',
    note: 'Every additional icebreaker now costs double. An Irish exit is entirely honorable.',
    low: true,
  };
};

export const QUICK_BATTERY_EVENTS = [
  {id: 'small-talk', label: 'Small Talk', delta: -10},
  {id: 'icebreaker', label: 'Group Icebreaker', delta: -20},
  {id: 'corner-tea', label: 'Corner Booth Tea', delta: 15},
  {id: 'pet-corner', label: 'Found the Host’s Cat', delta: 20},
] as const;

export const EXCUSE_CATEGORIES: {id: ExcuseCategory; label: string}[] = [
  {id: 'all', label: 'All Slips'},
  {id: 'polite-departure', label: 'Polite Departure'},
  {id: 'sudden-errand', label: 'Sudden Errand'},
  {id: 'pet-alibi', label: 'Pet Alibi'},
  {id: 'low-key-honest', label: 'Low-Key Honest'},
];

export const CURATED_EXCUSES: ExcuseSlip[] = [
  {
    id: 'ex-1',
    category: 'polite-departure',
    headline: 'The Early Train Courtesy',
    body: 'I’m going to slip out before the evening rush turns into a logistical saga—thank you so much for putting this together.',
    toneNote: 'Warm, decisive, invites zero follow-up.',
  },
  {
    id: 'ex-2',
    category: 'polite-departure',
    headline: 'The Tomorrow Morning Commitment',
    body: 'I promised an early-morning version of myself that I’d be asleep before midnight. It was genuinely lovely catching up.',
    toneNote: 'Best delivered with coat already over one arm.',
  },
  {
    id: 'ex-3',
    category: 'sudden-errand',
    headline: 'The Neighbor’s Spare Key',
    body: 'My neighbor just texted—they locked themselves out on the porch and I’m the custodian of the spare key. I’d better rescue them.',
    toneNote: 'Believably civic and impossible to argue against.',
  },
  {
    id: 'ex-4',
    category: 'sudden-errand',
    headline: 'The Unattended Delivery',
    body: 'A package that definitely shouldn’t sit in the rain just got dropped by my front door. Heading home before it turns to papier-mâché.',
    toneNote: 'Works even when skies are clear; say it briskly.',
  },
  {
    id: 'ex-5',
    category: 'pet-alibi',
    headline: 'The Dramatic Housecat',
    body: 'My cat has a strict nine-o’clock dinner window and becomes an investigative journalist if I’m late. Time for me to clock in.',
    toneNote: 'Pairs naturally with checking your watch once.',
  },
  {
    id: 'ex-6',
    category: 'pet-alibi',
    headline: 'The Sourdough & Senior Dog',
    body: 'I have an elderly dog who expects his evening stroll and a loaf of bread that refuses to wait for anyone. Goodnight all.',
    toneNote: 'Cozy, domestic, gently unassailable.',
  },
  {
    id: 'ex-7',
    category: 'low-key-honest',
    headline: 'The Social Cinderella',
    body: 'My social battery just blinked into reserve power, so I’m going to head home while I’m still charming. See you next week.',
    toneNote: 'Disarmingly candid; people almost always respect it.',
  },
  {
    id: 'ex-8',
    category: 'low-key-honest',
    headline: 'The Quiet Hour',
    body: 'Had such a nice time, and now I need an hour of horizontal silence before tomorrow starts. Safe travels home, everyone.',
    toneNote: 'Calm, grounded, and refreshingly direct.',
  },
];

export const CALLER_PERSONAS: CallerPersona[] = [
  {
    id: 'roommate',
    name: 'Clara (Next Door)',
    relationship: 'Neighbor · Mobile',
    phoneLabel: 'Incoming Call',
    alibiTitle: 'Locked Out on the Landing',
    scriptLines: [
      'Hey—wait, you’re standing outside right now?',
      'No, totally fine, I still have your spare key on my ring.',
      'Give me ten minutes, I’m wrapping up here and heading straight back.',
      'Stay near the awning, I’ll call you when I turn onto the street.',
    ],
  },
  {
    id: 'super',
    name: 'Building Maintenance',
    relationship: 'Property Desk · Verified',
    phoneLabel: 'Incoming Call',
    alibiTitle: 'Radiator Valve Check',
    scriptLines: [
      'Hi, yes—this is apartment 4B. Is everything okay upstairs?',
      'Got it, I can be back in fifteen minutes to unlock the hallway closet.',
      'Thanks for catching that before tonight, see you shortly.',
    ],
  },
  {
    id: 'sister',
    name: 'Maya',
    relationship: 'Sister · Mobile',
    phoneLabel: 'Incoming Call',
    alibiTitle: 'Late Ride from the Station',
    scriptLines: [
      'Hey! Wait, did your train get bumped up to the earlier platform?',
      'Of course, don’t wait out there by yourself. I’m grabbing my coat right now.',
      'Text me which exit door you’re by—I’m on my way.',
    ],
  },
  {
    id: 'courier',
    name: 'Local Courier Desk',
    relationship: 'Dispatch · Local',
    phoneLabel: 'Incoming Call',
    alibiTitle: 'Signature Required Drop-Off',
    scriptLines: [
      'Hello—yes, I’m just ten minutes away from the building.',
      'If the driver can wait at the front vestibule, I’ll head over immediately.',
      'Appreciate it, thank you.',
    ],
  },
];

export const SOUND_PRESETS: SoundPreset[] = [
  {
    id: 'rainy-bookshop',
    name: 'Rainy Bookshop',
    subtitle: 'Soft window rain over warm paper hush and distant espresso steam.',
    channels: {rain: 0.65, cafe: 0.35, vinyl: 0.28, chords: 0.3},
  },
  {
    id: 'late-night-study',
    name: 'Late-Night Study',
    subtitle: 'Faint vinyl dust and unhurried Rhodes chords in an empty room.',
    channels: {rain: 0.25, cafe: 0.08, vinyl: 0.45, chords: 0.58},
  },
  {
    id: 'quiet-tea-room',
    name: 'Quiet Tea Room',
    subtitle: 'Gentle room warmth with light afternoon drizzle outside.',
    channels: {rain: 0.4, cafe: 0.55, vinyl: 0.15, chords: 0.18},
  },
];

export const DECOY_ARTICLE = {
  publication: 'Journal of Quiet Civic Architecture',
  issue: 'Vol. XIV · Autumn Monograph',
  readTime: '7 min read',
  title: 'The Quiet Geometry of Timber Reading Rooms',
  dek: 'How early twentieth-century municipal architects used cedar coffered ceilings, deep window reveals, and felt-lined oak desks to dampen urban clatter without mechanical soundproofing.',
  author: 'By Arthur Pendelton',
  date: 'October 2026',
  caption: 'Fig. 1 — Upper Reading Hall, showing north-facing arched glazing and acoustic timber trusses.',
  paragraphs: [
    'Before perforated mineral tiles and synthetic acoustic baffles entered public construction, the stillness of a well-mannered reading room was achieved almost entirely through proportion and surface grain. Timber joists broken into shallow coffers scattered high-frequency echoes long before they could pool near the center of the floor, while heavy wool runners absorbed the scrape of oak chairs.',
    'Equally decisive was the placement of daylight. Architects favored tall, deeply recessed north windows that offered steady, shadowless illumination across a broad paper page without the glare that forces a reader to squint. Seated at the perimeter, a visitor remained visually anchored to shifting sky and street foliage while sheltered from the pace outside.',
    'In smaller neighborhood branches, the corner alcove served as an informal barometer of civic comfort. Designers angled reading tables slightly away from the central aisle so patrons did not feel monitored from behind, recognizing that genuine concentration requires a modest sense of enclosure.',
  ],
  pullQuote:
    'A room becomes hospitable to thought not when it is strictly silent, but when every sharp edge of sound has somewhere soft to land.',
  closingParagraph:
    'Contemporary library renovations have begun returning to these passive lessons—trading clinical drywall boxes for oiled ash paneling, recessed brass task lamps, and unhurried sightlines. In an era of constant notification, architectural restraint remains one of the quietest public luxuries.',
  footnotes: [
    '1. Municipal Guild of Librarians, "Notes on Daylight & Timber Attenuation," 1928 archival proceedings.',
    '2. Measured reverberation times in pre-war oak reading halls average 0.65 seconds, comparable to modern studio booths.',
  ],
};
