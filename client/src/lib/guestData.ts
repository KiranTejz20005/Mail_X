export interface GuestEmail {
  id: string;
  from: string;
  subject: string;
  content: string;
  category: 'urgent' | 'positive' | 'neutral' | 'calendar' | 'spam';
  demoSummary: string;
  demoResponse: string;
}

export const GUEST_EMAILS: GuestEmail[] = [
  {
    id: 'guest-1',
    from: 'Sarah Chen <sarah.chen@acmecorp.com>',
    subject: 'Urgent: Contract review needed by EOD',
    category: 'urgent',
    content:
      'Hi team,\n\nWe need the revised MSA signed before the board meeting tomorrow. Please review the attached redlines and confirm whether section 4.2 liability caps are acceptable.\n\nThanks,\nSarah',
    demoSummary:
      'Sarah needs the revised MSA reviewed and signed before tomorrow’s board meeting, with specific attention to section 4.2 liability caps.',
    demoResponse:
      'Hi Sarah,\n\nThank you for the note. I will review the redlines today and send confirmation on section 4.2 liability caps before end of day.\n\nBest regards',
  },
  {
    id: 'guest-2',
    from: 'People Ops <people@mailx.demo>',
    subject: 'Great work on the product launch!',
    category: 'positive',
    content:
      'Congratulations on shipping the MailX beta! The onboarding flow feedback has been overwhelmingly positive. Let’s celebrate Friday.',
    demoSummary:
      'People Ops congratulates the team on a successful MailX beta launch and suggests celebrating on Friday.',
    demoResponse:
      'Hi team,\n\nThank you for the kind words — we are glad onboarding landed well. Friday works for me; happy to help coordinate.\n\nCheers',
  },
  {
    id: 'guest-3',
    from: 'Calendar Bot <calendar@mailx.demo>',
    subject: 'Reminder: Sprint planning — Thu 10:00 AM',
    category: 'calendar',
    content:
      'This is a reminder for Sprint Planning on Thursday at 10:00 AM IST. Agenda: backlog grooming, capacity, and release checklist.',
    demoSummary:
      'Calendar reminder for Sprint Planning Thursday 10:00 AM IST covering backlog, capacity, and release checklist.',
    demoResponse:
      'Thanks for the reminder. I will join Thursday at 10:00 AM and come prepared with backlog updates.',
  },
  {
    id: 'guest-4',
    from: 'Newsletter <news@devtools.io>',
    subject: 'Your weekly digest',
    category: 'neutral',
    content:
      'Here are this week’s top articles on React performance, Supabase RLS, and AI-assisted code review. Unsubscribe anytime.',
    demoSummary:
      'Weekly newsletter digest covering React performance, Supabase RLS, and AI code review articles.',
    demoResponse:
      'Thanks for the digest — I will read the Supabase RLS piece first. Please keep me subscribed.',
  },
  {
    id: 'guest-5',
    from: 'Promo <winner-prize@spam.demo>',
    subject: 'You have won $1,000,000!!!',
    category: 'spam',
    content:
      'Click here immediately to claim your prize. Limited time offer. Send bank details now.',
    demoSummary:
      'Obvious spam claiming a cash prize and requesting bank details — should be filtered or ignored.',
    demoResponse:
      'This message has been identified as spam. No reply is recommended.',
  },
];

export const GUEST_LIMITATIONS = [
  'Demo inbox only — no real Gmail sync',
  'AI summaries and replies use sample outputs',
  'Cannot save responses to your account',
] as const;
