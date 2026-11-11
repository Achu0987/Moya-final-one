// The comparison, in one place, so the hub and both comparison pages say the same thing.
// Qualitative only (PAGE_BRIEFS.md #6-8): no figures, no brand names. Anything not yet confirmed carries
// `pending`, which the table shows as "Being confirmed" (Claims tab).
// Each option shows a real picture in a circle above its column (client review: after drinkprime.in, real photos).
// The client asked for a real jug photo, which overrides CLAUDE.md's "no raster bottle images" on this page; Rayansh
// and Vinayak to confirm. PLACEHOLDER: the MoyaOne picture is a found photo of a kitchen tap, standing in for the real
// MoyaOne tap (client asked for a simple tap image); swap in a photo of the real tap when the client sends one. Credits are printed under the table (components/compare).
export const OPTIONS = [
  { id: 'jugs', label: 'Jugs', long: '20-litre jugs', img: '/compare/jug.webp', alt: 'A 20-litre water jug on its stand in a home kitchen.' },
  { id: 'ro', label: 'RO filter', long: 'An RO filter', img: '/compare/ro-filter.webp', alt: 'An RO water purifier mounted on a kitchen wall.' },
  { id: 'moya', label: 'MoyaOne', long: 'MoyaOne', img: '/compare/moya-tap.webp', alt: 'Water flowing from a curved chrome kitchen tap.' },
];

export const PHOTO_CREDITS = [
  { id: 'jugs', title: 'Water bottle in my room', by: 'Murshid Elamaram', lic: 'CC0', url: 'https://commons.wikimedia.org/wiki/File:Water_bottle_in_my_room.jpg' },
  { id: 'ro', title: 'Home water filters, water purifiers, and bottled water in India', by: 'FacetsOfNonStickPans', lic: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Home_water_filters,_water_purifiers,_and_bottled_water_in_India.jpg', note: ' (cropped)' },
  { id: 'moya', title: 'Water flowing from modern kitchen faucet into silver sink during daytime kitchen activity', by: 'Shixart1985', lic: 'CC BY 2.0', url: 'https://commons.wikimedia.org/w/index.php?curid=196043605' },
];

export const ROWS = [
  {
    id: 'source',
    q: 'Where the water comes from',
    jugs: 'Delivered to your door by a supplier',
    ro: 'Your tap, filtered in your kitchen',
    moya: 'Its own line, built into your tower',
  },
  {
    id: 'carry',
    q: 'What you carry',
    jugs: '20-litre jugs, in and out, week after week',
    ro: 'Nothing',
    moya: 'Nothing',
  },
  {
    id: 'kitchen',
    q: 'What sits in your kitchen',
    jugs: 'A stack of jugs, full and empty',
    ro: 'A filter unit under the sink',
    moya: 'A Moya1™ control unit and one extra tap',
  },
  {
    id: 'care',
    q: 'What needs looking after',
    jugs: 'Orders, and being home on delivery day',
    ro: 'Filter changes and service visits',
    // PLACEHOLDER: "nothing to service in the flat" follows CLIENT_CONTEXT.md; Claims tab "To confirm".
    moya: 'Nothing inside your flat',
  },
  {
    id: 'drain',
    q: 'Water sent to the drain',
    jugs: 'None in your home',
    // PLACEHOLDER: the RO wastage ratio is not published until the client confirms it in writing (Claims tab).
    ro: 'Some, every time it filters',
    roPending: true,
    // PLACEHOLDER: zero wastage is Claims tab "To confirm" (tracker C3).
    moya: 'To be published once confirmed',
    moyaPending: true,
  },
  {
    id: 'track',
    q: 'How you keep track',
    jugs: 'Counting jugs and deliveries',
    ro: 'No running count; you follow the service schedule',
    moya: 'Litres in the app, recharged like a mobile plan',
  },
  {
    id: 'where',
    q: 'Where you can have it',
    jugs: 'Any home',
    ro: 'Any home with space under the sink',
    moya: 'Towers that build it in',
  },
];
