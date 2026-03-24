// lib/events.ts
// ─────────────────────────────────────────────────────────────────────────────
// Static events data store.
// To add a new event, append an object to the EVENTS array.
// The slug must be unique — it becomes the URL: /events/[slug]
// ─────────────────────────────────────────────────────────────────────────────

export interface Organiser {
  name: string
  subtitle?: string
  type: 'ministry' | 'institute' | 'ngo' | 'other'
}

export interface EventPaper {
  title: string
  description?: string
}

export interface Event {
  slug: string
  title: string
  subtitle?: string
  dateLabel: string           // Human-readable: "17th & 18th March, 2026"
  dateISO: string             // For sorting / meta: "2026-03-17"
  venue: string
  city: string
  heroImage: string           // path under /public
  galleryImages?: string[]    // additional images
  organisers: Organiser[]
  paperPresented?: EventPaper
  tags: string[]
  status: 'upcoming' | 'past'
  description?: string
}

export const EVENTS: Event[] = [
  {
    slug: 'national-conference-gender-equity-urban-india-2026',
    title: 'National Conference on Gender Equity in Urban India',
    subtitle: 'Bridging Gaps through Policy Planning & Public Finance',
    dateLabel: '17th & 18th March, 2026',
    dateISO: '2026-03-17',
    venue: 'Osmania University',
    city: 'Hyderabad',
    heroImage: '/event1.jpeg',
    galleryImages: ['/event1.jpeg', '/event12.jpeg'],
    organisers: [
      {
        name: 'Regional Centre for Urban and Environmental Studies (RCUES)',
        subtitle: 'Ministry of Housing and Urban Affairs, Government of India',
        type: 'ministry',
      },
      {
        name: 'Gender Responsive Budgeting (GRB) Cell',
        subtitle: 'Arun Jaitley National Institute of Financial Management',
        type: 'institute',
      },
      {
        name: 'SANGRAHA — Centre of Excellence in Urban Planning and Design',
        subtitle:
          'Established by Ministry of Housing and Urban Affairs, National Institute of Technology, Calicut',
        type: 'institute',
      },
    ],
    paperPresented: {
      title:
        'Environmental Sustainability and Accessibility: Bridging the Gap in Urban Climate Resilience',
      description:
        'This paper explores the intersection of environmental sustainability and urban accessibility — examining how policy gaps affect climate resilience across Indian cities.',
    },
    tags: ['Gender Equity', 'Urban Policy', 'Public Finance', 'Climate Resilience'],
    status: 'past',
    description:
      'A two-day national conference examining the intersection of gender equity, urban development, and public finance in India. The event brought together policymakers, researchers, and urban planners to bridge critical gaps in evidence-based policy design.',
  },

  // ── Add future events below ──────────────────────────────────────────────
  // {
  //   slug: 'your-event-slug',
  //   title: 'Event Title',
  //   ...
  // },
]

/** Returns all events sorted by date descending (newest first) */
export function getAllEvents(): Event[] {
  return [...EVENTS].sort(
    (a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime()
  )
}

/** Returns a single event by slug, or undefined if not found */
export function getEventBySlug(slug: string): Event | undefined {
  return EVENTS.find((e) => e.slug === slug)
}

/** Returns all slugs (used for generateStaticParams) */
export function getAllEventSlugs(): string[] {
  return EVENTS.map((e) => e.slug)
}
