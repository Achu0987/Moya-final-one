// The comparison, in one place, so the hub and both comparison pages say the same thing.
// Qualitative only (PAGE_BRIEFS.md #6-8): no figures, no brand names. Anything not yet confirmed carries
// `pending`, which the table shows as "Being confirmed" (Claims tab).
export const OPTIONS = [
  { id: 'jugs', label: 'Jugs', long: '20-litre jugs' },
  { id: 'ro', label: 'RO filter', long: 'An RO filter' },
  { id: 'moya', label: 'Moya One', long: 'Moya One' },
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
